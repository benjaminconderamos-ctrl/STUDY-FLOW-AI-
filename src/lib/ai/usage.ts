// Funciones server-side para control de uso de IA.
// Solo llamar desde Route Handlers o Server Actions, nunca desde Client Components.

import { createServerClient } from "@/lib/supabase/server";
import { getUsageLimit, type AIAction } from "@/lib/ai/limits";

export type AssertResult =
  | { allowed: true; used: number; limit: number; plan: string }
  | { allowed: false; code: string; message: string; used: number; limit: number; plan: string };

export async function getUserPlan(userId: string): Promise<string> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .single();
  return data?.plan ?? "free";
}

export async function getTodayUsageCount(
  userId: string,
  action: AIAction
): Promise<number> {
  const supabase = await createServerClient();
  const dayStart = new Date();
  dayStart.setUTCHours(0, 0, 0, 0);
  const dayEnd = new Date();
  dayEnd.setUTCHours(23, 59, 59, 999);

  const { count } = await supabase
    .from("ai_usage_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("action", action)
    .eq("status", "success")
    .gte("created_at", dayStart.toISOString())
    .lte("created_at", dayEnd.toISOString());

  return count ?? 0;
}

export async function assertCanUseAI(
  userId: string,
  action: AIAction
): Promise<AssertResult> {
  const plan = await getUserPlan(userId);
  const limit = getUsageLimit(plan, action);
  const used = await getTodayUsageCount(userId, action);

  if (used >= limit) {
    return {
      allowed: false,
      code: "daily_limit_reached",
      message: `Has alcanzado tu límite diario de ${limit} ${actionLabel(action)}. Inténtalo mañana.`,
      used,
      limit,
      plan,
    };
  }

  return { allowed: true, used, limit, plan };
}

export interface RecordEventInput {
  userId: string;
  sessionId: string;
  action: AIAction;
  status: "success" | "failed" | "blocked_limit" | "blocked_validation";
  model?: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  errorMessage?: string;
}

export async function recordAIUsageEvent(input: RecordEventInput): Promise<void> {
  const supabase = await createServerClient();
  await supabase.from("ai_usage_events").insert({
    user_id: input.userId,
    session_id: input.sessionId,
    action: input.action,
    status: input.status,
    model: input.model ?? null,
    prompt_tokens: input.promptTokens ?? 0,
    completion_tokens: input.completionTokens ?? 0,
    total_tokens: input.totalTokens ?? 0,
    error_message: input.errorMessage ?? null,
  });
}

function actionLabel(action: AIAction): string {
  const labels: Record<AIAction, string> = {
    generate_summary: "resúmenes",
    generate_flashcards: "flashcards",
    generate_quiz: "quizzes",
    tutor_message: "mensajes al tutor",
    math_solver: "problemas del resolvedor",
  };
  return labels[action] ?? action;
}
