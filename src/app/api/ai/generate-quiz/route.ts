// Seguridad: el frontend solo envía sessionId. El prompt se construye en servidor.
// La OPENAI_API_KEY nunca se expone al cliente.

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createServerClient } from "@/lib/supabase/server";
import { buildQuizPrompt } from "@/lib/ai/prompts";
import { AI_ACTIONS, getUsageLimit } from "@/lib/ai/limits";
import { validateRequestBody, validateSessionData, QuizArraySchema } from "@/lib/ai/validators";
import { getUserPlan } from "@/lib/ai/usage";

const ACTION = AI_ACTIONS.GENERATE_QUIZ;

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
    console.error("[generate-quiz] quota error", quotaError);
    return err("internal_error", "Error al verificar cuota. Intenta de nuevo.", 500);
  }

  const quota = quotaResult as { allowed: boolean; used: number; limit: number; event_id?: string };

  if (!quota.allowed) {
    return err(
      "daily_limit_reached",
      `Has alcanzado tu límite diario de ${quota.limit} quizzes. Inténtalo mañana.`,
      429
    );
  }

  const eventId = quota.event_id;

  // 6. Verificar OpenAI configurado
  if (!process.env.OPENAI_API_KEY) {
    if (eventId) {
      await supabase
        .from("ai_usage_events")
        .update({ status: "failed", error_message: "OPENAI_API_KEY no configurada." })
        .eq("id", eventId);
    }
    return err("internal_error", "El servicio de IA no está disponible.", 503);
  }

  // 7. Llamar a OpenAI
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 1200,
      messages: [
        {
          role: "system",
          content:
            "Eres un tutor académico que crea preguntas de opción múltiple en español. Devuelve únicamente el JSON pedido, sin texto extra ni markdown.",
        },
        {
          role: "user",
          content: buildQuizPrompt(session, documentText),
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) {
      if (eventId) {
        await supabase
          .from("ai_usage_events")
          .update({ status: "failed", model: "gpt-4o-mini", error_message: "Respuesta vacía de OpenAI." })
          .eq("id", eventId);
      }
      return err("internal_error", "No se pudo generar el quiz. Intenta de nuevo.", 500);
    }

    // Limpiar posibles markdown code fences y validar con Zod
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    let questions: Array<{ question: string; options: string[]; correctIndex: number; explanation?: string }>;
    try {
      const parsed = JSON.parse(cleaned);
      const result = QuizArraySchema.safeParse(parsed);
      if (!result.success) throw new Error("Schema inválido");
      questions = result.data;
    } catch {
      if (eventId) {
        await supabase
          .from("ai_usage_events")
          .update({ status: "failed", model: "gpt-4o-mini", error_message: "JSON inválido de OpenAI." })
          .eq("id", eventId);
      }
      return err("internal_error", "No se pudieron procesar las preguntas. Intenta de nuevo.", 500);
    }

    const usage = completion.usage;

    // 8. Borrar preguntas existentes e insertar nuevas
    const newProgress = Math.max(session.progress ?? 0, 100);
    await supabase.from("quiz_questions").delete().eq("session_id", sessionId);

    const { data: insertedQuestions, error: insertError } = await supabase
      .from("quiz_questions")
      .insert(
        questions.map((q, i) => ({
          session_id: sessionId,
          question: q.question,
          options: q.options,
          correct_index: q.correctIndex,
          explanation: q.explanation ?? null,
          order: i,
        }))
      )
      .select("id, session_id, question, options, correct_index, explanation, order");

    if (insertError) {
      if (eventId) {
        await supabase
          .from("ai_usage_events")
          .update({ status: "failed", model: "gpt-4o-mini", error_message: "Error al guardar preguntas." })
          .eq("id", eventId);
      }
      return err("internal_error", "Error al guardar las preguntas.", 500);
    }

    await supabase
      .from("study_sessions")
      .update({ status: "generated", progress: newProgress })
      .eq("id", sessionId)
      .eq("user_id", user.id);

    // 9. Actualizar evento a éxito
    if (eventId) {
      await supabase
        .from("ai_usage_events")
        .update({
          status: "success",
          model: "gpt-4o-mini",
          prompt_tokens: usage?.prompt_tokens ?? 0,
          completion_tokens: usage?.completion_tokens ?? 0,
          total_tokens: usage?.total_tokens ?? 0,
        })
        .eq("id", eventId);
    }

    return NextResponse.json({ questions: insertedQuestions, progress: newProgress });
  } catch (error) {
    console.error("[generate-quiz]", error);
    if (eventId) {
      await supabase
        .from("ai_usage_events")
        .update({ status: "failed", model: "gpt-4o-mini", error_message: "Error interno al llamar OpenAI." })
        .eq("id", eventId);
    }
    return err("internal_error", "Error interno del servidor.", 500);
  }
}
