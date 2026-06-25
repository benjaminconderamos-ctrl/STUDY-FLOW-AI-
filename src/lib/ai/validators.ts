import { z } from "zod";
import { isAIAction, VALID_GOALS, VALID_LEVELS, type AIAction } from "@/lib/ai/limits";

// ─── Zod schemas para validar respuestas de OpenAI ───────────────────────────

export const FlashcardSchema = z.object({
  question: z.string().min(1).max(500),
  answer: z.string().min(1).max(1000),
});
export const FlashcardsArraySchema = z.array(FlashcardSchema).min(1).max(20);

export const QuizQuestionSchema = z.object({
  question: z.string().min(1).max(500),
  options: z.array(z.string()).length(4),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string().min(1).max(1000).optional(),
});
export const QuizArraySchema = z.array(QuizQuestionSchema).min(1).max(10);

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type ValidationResult =
  | { ok: true }
  | { ok: false; code: string; message: string };

/** Rechaza prompts libres, valida sessionId y action. */
export function validateRequestBody(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, code: "invalid_body", message: "Cuerpo de la solicitud inválido." };
  }

  const record = body as Record<string, unknown>;

  // Nunca se aceptan prompts libres desde el frontend
  if ("prompt" in record) {
    return {
      ok: false,
      code: "custom_prompt_not_allowed",
      message: "No se permiten prompts personalizados en esta API.",
    };
  }

  const { sessionId, action } = record;

  if (!sessionId || typeof sessionId !== "string" || !UUID_RE.test(sessionId)) {
    return { ok: false, code: "invalid_body", message: "sessionId debe ser un UUID válido." };
  }

  if (action !== undefined && !isAIAction(action)) {
    return { ok: false, code: "invalid_action", message: "Acción no permitida." };
  }

  return { ok: true };
}

/** Valida que los datos de sesión sean seguros antes de construir el prompt. */
export function validateSessionData(session: {
  title: string;
  study_topic?: string | null;
  subject: string | null;
  goal: string;
  level: string;
}): ValidationResult {
  if (!session.title || session.title.trim().length === 0) {
    return { ok: false, code: "invalid_body", message: "La sesión no tiene título." };
  }

  if (session.title.length > 300) {
    return { ok: false, code: "invalid_body", message: "El título de la sesión excede el límite permitido." };
  }

  if (session.study_topic && session.study_topic.length > 2000) {
    return { ok: false, code: "invalid_body", message: "El tema de estudio excede el límite permitido." };
  }

  if (session.subject && session.subject.length > 100) {
    return { ok: false, code: "invalid_body", message: "La materia excede el límite permitido." };
  }

  if (!VALID_GOALS.includes(session.goal as (typeof VALID_GOALS)[number])) {
    return { ok: false, code: "invalid_body", message: "Objetivo de sesión no válido." };
  }

  if (!VALID_LEVELS.includes(session.level as (typeof VALID_LEVELS)[number])) {
    return { ok: false, code: "invalid_body", message: "Nivel de sesión no válido." };
  }

  return { ok: true };
}

export function resolveAction(body: Record<string, unknown>, fallback: AIAction): AIAction {
  if (isAIAction(body.action)) return body.action;
  return fallback;
}
