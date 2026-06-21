// El frontend nunca envía prompts libres. Solo envía sessionId + action.
// El servidor construye los prompts internamente usando datos de la sesión.

export const AI_ACTIONS = {
  GENERATE_SUMMARY: "generate_summary",
  GENERATE_FLASHCARDS: "generate_flashcards",
  GENERATE_QUIZ: "generate_quiz",
  TUTOR_MESSAGE: "tutor_message",
  MATH_SOLVER: "math_solver",
} as const;

export type AIAction = (typeof AI_ACTIONS)[keyof typeof AI_ACTIONS];

export const VALID_GOALS = ["understand", "exam", "memorize", "review"] as const;
export const VALID_LEVELS = ["basic", "intermediate", "advanced"] as const;
export const VALID_SOURCES = ["topic", "pdf", "url", "youtube"] as const;

type PlanLimits = Record<AIAction, number>;

const FREE_PLAN_LIMITS: PlanLimits = {
  generate_summary: 5,
  generate_flashcards: 5,
  generate_quiz: 5,
  tutor_message: 20,
  math_solver: 0,
};

const PRO_PLAN_LIMITS: PlanLimits = {
  generate_summary: 25,
  generate_flashcards: 25,
  generate_quiz: 25,
  tutor_message: 100,
  math_solver: 3,
};

const MAX_PLAN_LIMITS: PlanLimits = {
  generate_summary: 50,
  generate_flashcards: 50,
  generate_quiz: 50,
  tutor_message: 200,
  math_solver: 50,
};

export function isAIAction(value: unknown): value is AIAction {
  return Object.values(AI_ACTIONS).includes(value as AIAction);
}

export function getUsageLimit(plan: string, action: AIAction): number {
  if (plan === "max") return MAX_PLAN_LIMITS[action];
  if (plan === "pro") return PRO_PLAN_LIMITS[action];
  return FREE_PLAN_LIMITS[action];
}
