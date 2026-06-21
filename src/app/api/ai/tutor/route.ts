// Seguridad: el frontend envía sessionId + historial de mensajes del usuario.
// El system prompt se construye en servidor con datos de la sesión.
// La OPENAI_API_KEY nunca se expone al cliente.

import { createServerClient } from "@/lib/supabase/server";
import { tutorSystemPrompt } from "@/lib/ai/prompts";
import { AI_ACTIONS, getUsageLimit } from "@/lib/ai/limits";
import { getUserPlan } from "@/lib/ai/usage";
import OpenAI from "openai";

const ACTION = AI_ACTIONS.TUTOR_MESSAGE;
const MAX_MESSAGE_LENGTH = 800;
const MAX_MESSAGES = 40;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function errResponse(message: string, status: number) {
  return new Response(JSON.stringify({ error: { message } }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  // 1. Validar body
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return errResponse("Cuerpo de la solicitud inválido.", 400);
  }

  // Rechazar campo prompt libre (protección anti-injection)
  if ("prompt" in body) {
    return errResponse("Campo no permitido.", 400);
  }

  const { sessionId, messages } = body;

  if (!sessionId || typeof sessionId !== "string" || !UUID_REGEX.test(sessionId)) {
    return errResponse("sessionId inválido.", 400);
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return errResponse("messages debe ser un array no vacío.", 400);
  }

  if (messages.length > MAX_MESSAGES) {
    return errResponse(`Máximo ${MAX_MESSAGES} mensajes por sesión.`, 400);
  }

  for (const msg of messages) {
    if (!msg || typeof msg !== "object") return errResponse("Mensaje inválido.", 400);
    const { role, content } = msg as Record<string, unknown>;
    if (role !== "user" && role !== "assistant") return errResponse("Rol de mensaje inválido.", 400);
    if (typeof content !== "string" || content.trim().length === 0) return errResponse("Contenido de mensaje vacío.", 400);
    if (content.length > MAX_MESSAGE_LENGTH) return errResponse(`Mensaje demasiado largo (máx. ${MAX_MESSAGE_LENGTH} chars).`, 400);
  }

  const lastMsg = messages[messages.length - 1] as { role: string; content: string };
  if (lastMsg.role !== "user") {
    return errResponse("El último mensaje debe ser del usuario.", 400);
  }

  // 2. Autenticar usuario
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return errResponse("No autenticado.", 401);

  // 3. Obtener sesión y validar propiedad
  const { data: session, error: sessionError } = await supabase
    .from("study_sessions")
    .select("id, title, subject, summary, user_id, source, document_id")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    return errResponse("Sesión no encontrada.", 404);
  }

  if (session.user_id !== user.id) {
    return errResponse("Sesión no encontrada.", 404);
  }

  // 4. Si es PDF, obtener texto del documento
  let documentText: string | null = null;
  if (session.source === "pdf" && session.document_id) {
    const { data: doc } = await supabase
      .from("documents")
      .select("content_text")
      .eq("id", session.document_id)
      .eq("user_id", user.id)
      .single();
    documentText = doc?.content_text ?? null;
  }

  // 5. Verificar cuota atómicamente
  const plan = await getUserPlan(user.id);
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
    console.error("[tutor] quota error", quotaError);
    return errResponse("Error al verificar cuota. Intenta de nuevo.", 500);
  }

  const quota = quotaResult as { allowed: boolean; used: number; limit: number; event_id?: string };

  if (!quota.allowed) {
    return errResponse(
      `Has alcanzado tu límite diario de ${quota.limit} mensajes al tutor. Inténtalo mañana.`,
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
    return errResponse("El servicio de IA no está disponible.", 503);
  }

  // 7. Streaming con OpenAI
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 600,
      stream: true,
      stream_options: { include_usage: true },
      messages: [
        {
          role: "system",
          content: tutorSystemPrompt(
            { title: session.title, subject: session.subject, summary: session.summary },
            documentText
          ),
        },
        ...(messages as Array<{ role: "user" | "assistant"; content: string }>),
      ],
    });

    const readable = new ReadableStream({
      async start(controller) {
        let usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number } | null = null;
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content ?? "";
            if (delta) {
              controller.enqueue(new TextEncoder().encode(delta));
            }
            if (chunk.usage) {
              usage = chunk.usage;
            }
          }
          // Actualizar evento con tokens antes de cerrar
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
        } catch (streamError) {
          console.error("[tutor] stream error", streamError);
          if (eventId) {
            await supabase
              .from("ai_usage_events")
              .update({ status: "failed", model: "gpt-4o-mini", error_message: "Error durante el streaming." })
              .eq("id", eventId);
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("[tutor]", error);
    if (eventId) {
      await supabase
        .from("ai_usage_events")
        .update({ status: "failed", model: "gpt-4o-mini", error_message: "Error interno al llamar OpenAI." })
        .eq("id", eventId);
    }
    return errResponse("Error interno del servidor.", 500);
  }
}
