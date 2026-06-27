// Seguridad: el frontend solo envía sessionId. El prompt se construye en servidor.
// La OPENAI_API_KEY nunca se expone al cliente.

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createServerClient } from "@/lib/supabase/server";
import { buildFlashcardsPrompt } from "@/lib/ai/prompts";
import { AI_ACTIONS, getUsageLimit } from "@/lib/ai/limits";
import { validateRequestBody, validateSessionData, FlashcardsArraySchema } from "@/lib/ai/validators";
import { getUserPlan, updateAiEvent } from "@/lib/ai/usage";

const ACTION = AI_ACTIONS.GENERATE_FLASHCARDS;

const FLASHCARDS_RESPONSE_FORMAT = {
  type: "json_schema" as const,
  json_schema: {
    name: "flashcards_response",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flashcards: {
          type: "array",
          minItems: 1,
          maxItems: 20,
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              question: { type: "string" },
              answer: { type: "string" },
            },
            required: ["question", "answer"],
          },
        },
      },
      required: ["flashcards"],
    },
  },
};

function err(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(request: Request) {
  // 1. Validar body
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return err("invalid_body", "Cuerpo de la solicitud inválido.", 400);
  }

  const bodyValidation = validateRequestBody(body);
  if (!bodyValidation.ok) {
    return err(bodyValidation.code, bodyValidation.message, 400);
  }

  const sessionId = body.sessionId as string;

  // 2. Autenticar usuario
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err("unauthorized", "No autenticado.", 401);

  // 3. Obtener sesión y validar propiedad
  const { data: session, error: sessionError } = await supabase
    .from("study_sessions")
    .select("id, title, study_topic, subject, goal, level, user_id, progress, summary, source, document_id")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    return err("session_not_found", "Sesión no encontrada.", 404);
  }

  if (session.user_id !== user.id) {
    return err("session_not_found", "Sesión no encontrada.", 404);
  }

  // 4. Validar datos de sesión
  const dataValidation = validateSessionData(session);
  if (!dataValidation.ok) {
    return err(dataValidation.code, dataValidation.message, 400);
  }

  // 5. Obtener en paralelo el plan y, cuando aplique, el documento.
  const [plan, documentResult] = await Promise.all([
    getUserPlan(user.id, supabase),
    session.source === "pdf" && session.document_id
      ? supabase
          .from("documents")
          .select("content_text")
          .eq("id", session.document_id)
          .eq("user_id", user.id)
          .single()
      : Promise.resolve({ data: null }),
  ]);
  const documentText = documentResult.data?.content_text ?? null;

  // 6. Verificar cuota atómicamente
  const limit = getUsageLimit(plan, ACTION);

  const { data: quotaResult, error: quotaError } = await supabase.rpc(
    "try_consume_ai_quota",
    {
      p_user_id: user.id,
      p_session_id: sessionId,
      p_action: ACTION,
      p_limit: limit,
    }
  );

  if (quotaError) {
    console.error("[generate-flashcards] quota error", quotaError);
    return err("internal_error", "Error al verificar cuota. Intenta de nuevo.", 500);
  }

  const quota = quotaResult as { allowed: boolean; used: number; limit: number; event_id?: string };

  if (!quota.allowed) {
    return err(
      "daily_limit_reached",
      `Has alcanzado tu límite diario de ${quota.limit} generaciones de tarjetas. Inténtalo mañana.`,
      429
    );
  }

  const eventId = quota.event_id;

  // 6. Verificar OpenAI configurado
  if (!process.env.OPENAI_API_KEY) {
    if (eventId) await updateAiEvent(eventId, { status: "failed", errorMessage: "OPENAI_API_KEY no configurada." });
    return err("internal_error", "El servicio de IA no está disponible.", 503);
  }

  // 7. Llamar a OpenAI
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 1200,
      response_format: FLASHCARDS_RESPONSE_FORMAT,
      messages: [
        {
          role: "system",
          content:
            "Eres un tutor académico que crea flashcards de estudio en español. Devuelve únicamente el JSON pedido, sin texto extra ni markdown.",
        },
        {
          role: "user",
          content: buildFlashcardsPrompt(session, documentText),
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) {
      if (eventId) await updateAiEvent(eventId, { status: "failed", model: "gpt-4o-mini", errorMessage: "Respuesta vacía de OpenAI." });
      return err("internal_error", "No se pudieron generar las tarjetas. Intenta de nuevo.", 500);
    }

    // Limpiar posibles markdown code fences y validar con Zod
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    let cards: Array<{ question: string; answer: string }>;
    try {
      const parsed = JSON.parse(cleaned);
      const candidate = Array.isArray(parsed) ? parsed : parsed?.flashcards;
      const result = FlashcardsArraySchema.safeParse(candidate);
      if (!result.success) {
        console.error("[generate-flashcards] invalid OpenAI JSON", result.error.flatten());
        throw new Error("Schema inválido");
      }
      cards = result.data;
    } catch {
      if (eventId) await updateAiEvent(eventId, { status: "failed", model: "gpt-4o-mini", errorMessage: "JSON inválido de OpenAI." });
      return err("internal_error", "No se pudieron procesar las tarjetas. Intenta de nuevo.", 500);
    }

    const usage = completion.usage;

    // 8. Insertar nuevas flashcards y luego borrar las antiguas (orden seguro: evita pérdida si el insert falla)
    const newProgress = Math.max(session.progress ?? 0, 66);

    const { data: insertedCards, error: insertError } = await supabase
      .from("flashcards")
      .insert(
        cards.map((c, i) => ({
          session_id: sessionId,
          question: c.question,
          answer: c.answer,
          order: i,
        }))
      )
      .select("id, session_id, question, answer, order");

    if (insertError) {
      console.error("[generate-flashcards] insert error", insertError);
      if (eventId) await updateAiEvent(eventId, { status: "failed", model: "gpt-4o-mini", errorMessage: "Error al guardar tarjetas." });
      return err("internal_error", "Error al guardar las tarjetas.", 500);
    }

    const newIds = insertedCards!.map((c) => c.id);
    await supabase
      .from("flashcards")
      .delete()
      .eq("session_id", sessionId)
      .not("id", "in", `(${newIds.join(",")})`);

    await supabase
      .from("study_sessions")
      .update({ status: "generated", progress: newProgress })
      .eq("id", sessionId)
      .eq("user_id", user.id);

    // 9. Actualizar evento a éxito
    if (eventId) {
      await updateAiEvent(eventId, {
        status: "success",
        model: "gpt-4o-mini",
        promptTokens: usage?.prompt_tokens ?? 0,
        completionTokens: usage?.completion_tokens ?? 0,
        totalTokens: usage?.total_tokens ?? 0,
      });
    }

    return NextResponse.json({ flashcards: insertedCards, progress: newProgress });
  } catch (error) {
    console.error("[generate-flashcards]", error);
    if (eventId) await updateAiEvent(eventId, { status: "failed", model: "gpt-4o-mini", errorMessage: "Error interno al llamar OpenAI." });
    return err("internal_error", "Error interno del servidor.", 500);
  }
}
