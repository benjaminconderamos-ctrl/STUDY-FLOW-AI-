// Seguridad: el frontend envía el problema del usuario. El prompt completo se construye en servidor.
// La OPENAI_API_KEY nunca se expone al cliente.

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createServerClient } from "@/lib/supabase/server";
import { buildMathSolverPrompt } from "@/lib/ai/prompts";
import { AI_ACTIONS, getUsageLimit } from "@/lib/ai/limits";
import { getUserPlan, updateAiEvent } from "@/lib/ai/usage";
import type { MathSolverResult } from "@/types";

const ACTION = AI_ACTIONS.MATH_SOLVER;

const VALID_CATEGORIES = ["auto", "algebra", "calculus", "statistics", "functions", "geometry"];
const VALID_LEVELS = ["basic", "intermediate", "advanced"];

function err(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(request: Request) {
  // 1. Parsear body
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return err("invalid_body", "Cuerpo de la solicitud inválido.", 400);
  }

  // 2. Rechazar prompts libres (anti-inyección)
  if ("prompt" in body) {
    return err("custom_prompt_not_allowed", "No se permiten prompts personalizados en esta API.", 400);
  }

  // 3. Validar problema
  const problem = body.problem;
  if (!problem || typeof problem !== "string" || problem.trim().length === 0) {
    return err("invalid_math_problem", "El problema es requerido.", 400);
  }
  if (problem.length > 1000) {
    return err("invalid_math_problem", "El problema no puede superar 1000 caracteres.", 400);
  }

  // 4. Validar categoría y nivel
  const category = typeof body.category === "string" ? body.category : "auto";
  const level = typeof body.level === "string" ? body.level : "basic";
  const includeGraph = body.includeGraph === true;
  const includePractice = body.includePractice === true;

  if (!VALID_CATEGORIES.includes(category)) {
    return err("invalid_body", "Categoría inválida.", 400);
  }
  if (!VALID_LEVELS.includes(level)) {
    return err("invalid_body", "Nivel inválido.", 400);
  }

  // 5. Autenticar usuario
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err("unauthorized", "No autenticado.", 401);

  // 6. Verificar cuota
  const plan = await getUserPlan(user.id, supabase);
  const limit = getUsageLimit(plan, ACTION);

  const { data: quotaResult, error: quotaError } = await supabase.rpc(
    "try_consume_ai_quota",
    {
      p_user_id: user.id,
      p_session_id: null,
      p_action: ACTION,
      p_limit: limit,
    }
  );

  if (quotaError) {
    console.error("[math-solver] quota error", quotaError);
    return err("internal_error", "Error al verificar cuota. Intenta de nuevo.", 500);
  }

  const quota = quotaResult as {
    allowed: boolean;
    used: number;
    limit: number;
    event_id?: string;
  };

  if (!quota.allowed) {
    // Registrar intento bloqueado
    await supabase.from("math_solver_requests").insert({
      user_id: user.id,
      problem: problem.slice(0, 500),
      category,
      level,
      status: "blocked_limit",
    });
    return err(
      "daily_limit_reached",
      plan === "free"
        ? "El Resolvedor de matemáticas es una herramienta exclusiva para planes PRO y MAX."
        : `Has alcanzado tu límite diario de ${quota.limit} problemas. Inténtalo mañana.`,
      429
    );
  }

  const eventId = quota.event_id;

  // 7. Verificar OpenAI configurado
  if (!process.env.OPENAI_API_KEY) {
    if (eventId) await updateAiEvent(eventId, { status: "failed", errorMessage: "OPENAI_API_KEY no configurada." });
    return err("internal_error", "El servicio de IA no está disponible.", 503);
  }

  // 8. Llamar a OpenAI
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 2000,
      messages: [
        {
          role: "system",
          content:
            "Eres un tutor experto en matemáticas. Siempre respondes en español con JSON válido y sin texto adicional.",
        },
        {
          role: "user",
          content: buildMathSolverPrompt({ problem: problem.trim(), category, level, includeGraph, includePractice }),
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) {
      if (eventId) await updateAiEvent(eventId, { status: "failed", model: "gpt-4o-mini", errorMessage: "Respuesta vacía de OpenAI." });
      return err("internal_error", "No se pudo resolver el problema. Intenta de nuevo.", 500);
    }

    // 9. Limpiar markdown fences y parsear JSON
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    let result: MathSolverResult;
    try {
      result = JSON.parse(cleaned) as MathSolverResult;
      if (!result.finalAnswer || !Array.isArray(result.steps)) {
        throw new Error("Estructura inválida");
      }
    } catch {
      if (eventId) await updateAiEvent(eventId, { status: "failed", model: "gpt-4o-mini", errorMessage: "JSON inválido de OpenAI." });
      return err("invalid_ai_response", "No se pudo procesar la respuesta. Intenta de nuevo.", 500);
    }

    const usage = completion.usage;

    // 10. Guardar resultado en DB
    const { data: savedRequest, error: insertError } = await supabase
      .from("math_solver_requests")
      .insert({
        user_id: user.id,
        problem: problem.trim(),
        category: result.category ?? category,
        level,
        final_answer: result.finalAnswer,
        solution: result as unknown as Record<string, unknown>,
        graph_data: result.graph ?? null,
        status: "completed",
        model: "gpt-4o-mini",
        prompt_tokens: usage?.prompt_tokens ?? 0,
        completion_tokens: usage?.completion_tokens ?? 0,
        total_tokens: usage?.total_tokens ?? 0,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("[math-solver] insert error", insertError);
    }

    // 11. Actualizar evento de uso a éxito
    if (eventId) {
      await updateAiEvent(eventId, {
        status: "success",
        model: "gpt-4o-mini",
        promptTokens: usage?.prompt_tokens ?? 0,
        completionTokens: usage?.completion_tokens ?? 0,
        totalTokens: usage?.total_tokens ?? 0,
      });
    }

    return NextResponse.json({
      result,
      requestId: savedRequest?.id ?? null,
    });
  } catch (error) {
    console.error("[math-solver]", error);
    if (eventId) await updateAiEvent(eventId, { status: "failed", model: "gpt-4o-mini", errorMessage: "Error interno al llamar OpenAI." });
    return err("internal_error", "Error interno del servidor.", 500);
  }
}
