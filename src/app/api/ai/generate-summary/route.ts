// Seguridad: el frontend solo envía sessionId. El prompt se construye en servidor.
// La OPENAI_API_KEY nunca se expone al cliente.
// La cuota se verifica atómicamente con pg_advisory_xact_lock para evitar race conditions.

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createServerClient } from "@/lib/supabase/server";
import { buildSummaryPrompt } from "@/lib/ai/prompts";
import { AI_ACTIONS, getUsageLimit } from "@/lib/ai/limits";
import { validateRequestBody, validateSessionData } from "@/lib/ai/validators";
import { getUserPlan, updateAiEvent } from "@/lib/ai/usage";

const ACTION = AI_ACTIONS.GENERATE_SUMMARY;

function err(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(request: Request) {
  // 1. Validar body — rechaza prompts libres, valida sessionId
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
    .select("id, title, study_topic, subject, goal, level, user_id, progress, source, document_id")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    return err("session_not_found", "Sesión no encontrada.", 404);
  }

  if (session.user_id !== user.id) {
    return err("session_not_found", "Sesión no encontrada.", 404);
  }

  // 4. Validar datos de sesión antes de construir el prompt
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

  // 6. Verificar cuota atómicamente (evita race conditions)
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
    console.error("[generate-summary] quota error", quotaError);
    return err("internal_error", "Error al verificar cuota. Intenta de nuevo.", 500);
  }

  const quota = quotaResult as { allowed: boolean; used: number; limit: number; event_id?: string };

  if (!quota.allowed) {
    return err(
      "daily_limit_reached",
      `Has alcanzado tu límite diario de ${quota.limit} resúmenes. Inténtalo mañana.`,
      429
    );
  }

  const eventId = quota.event_id;

  // 7. Verificar que OpenAI está configurado
  if (!process.env.OPENAI_API_KEY) {
    if (eventId) await updateAiEvent(eventId, { status: "failed", errorMessage: "OPENAI_API_KEY no configurada." });
    return err("internal_error", "El servicio de IA no está disponible.", 503);
  }

  // 8. Llamar a OpenAI (el prompt se construye en servidor, nunca viene del cliente)
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      max_tokens: 1800,
      messages: [
        {
          role: "system",
          content:
            "Eres un tutor académico experto que genera resúmenes de estudio claros, estructurados y útiles en español.",
        },
        {
          role: "user",
          content: buildSummaryPrompt(session, documentText),
        },
      ],
    });

    const summary = completion.choices[0]?.message?.content?.trim();
    if (!summary) {
      if (eventId) await updateAiEvent(eventId, { status: "failed", model: "gpt-4o-mini", errorMessage: "Respuesta vacía de OpenAI." });
      return err("internal_error", "No se pudo generar el resumen. Intenta de nuevo.", 500);
    }

    const usage = completion.usage;

    // 8. Guardar resumen en DB y actualizar progreso
    const newProgress = Math.max(session.progress ?? 0, 33);
    await supabase
      .from("study_sessions")
      .update({ summary, status: "generated", progress: newProgress })
      .eq("id", sessionId)
      .eq("user_id", user.id);

    // 9. Actualizar evento a éxito con métricas de tokens
    if (eventId) {
      await updateAiEvent(eventId, {
        status: "success",
        model: "gpt-4o-mini",
        promptTokens: usage?.prompt_tokens ?? 0,
        completionTokens: usage?.completion_tokens ?? 0,
        totalTokens: usage?.total_tokens ?? 0,
      });
    }

    return NextResponse.json({ summary, progress: newProgress });
  } catch (error) {
    console.error("[generate-summary]", error);
    if (eventId) await updateAiEvent(eventId, { status: "failed", model: "gpt-4o-mini", errorMessage: "Error interno al llamar OpenAI." });
    return err("internal_error", "Error interno del servidor.", 500);
  }
}
