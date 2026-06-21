export type StudyTool = "summary" | "flashcards" | "quiz" | "tutor" | "mindmap";
export type SourceType = "topic" | "pdf" | "url" | "youtube";
export type StudyLevel = "basic" | "intermediate" | "advanced";
export type StudyGoal = "understand" | "exam" | "memorize" | "review";
export type StudySessionStatus = "draft" | "generated" | "in_progress" | "completed";

export interface StudySession {
  id: string;
  user_id: string;
  title: string;
  subject: string | null;
  source: SourceType;
  level: StudyLevel;
  goal: StudyGoal;
  tools: string[];
  status: StudySessionStatus;
  summary: string | null;
  progress: number;
  created_at: string;
  updated_at: string;
  document_id?: string | null;
}

export interface Document {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  sessions: string[];
  type: "pdf" | "url" | "youtube";
}

export interface Flashcard {
  id: string;
  sessionId: string;
  question: string;
  answer: string;
  order: number;
}

export interface QuizQuestion {
  id: string;
  sessionId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: "free" | "pro" | "max";
  createdAt: string;
}

export interface StudyActivity {
  id: string;
  sessionId: string;
  type: "summary" | "quiz" | "flashcards" | "tutor";
  minutesSpent: number;
  date: string;
}

export interface DashboardMetrics {
  sessionsCount: number;
  documentsCount: number;
  flashcardsCount: number;
  quizzesDone: number;
}

// ─── Math Solver ──────────────────────────────────────────────────────────────

export type MathCategory =
  | "auto"
  | "algebra"
  | "calculus"
  | "statistics"
  | "functions"
  | "geometry";

export type MathLevel = "basic" | "intermediate" | "advanced";

export type MathStep = {
  title: string;
  expression?: string;
  explanation: string;
};

export type MathGraphData = {
  shouldGraph: boolean;
  graphType?: "function" | "scatter" | "bar" | "line" | "none";
  functions?: string[];
  points?: { x: number; y: number }[];
  xLabel?: string;
  yLabel?: string;
  notes?: string;
};

export type MathSolverResult = {
  problemType: string;
  category: Exclude<MathCategory, "auto">;
  title: string;
  finalAnswer: string;
  steps: MathStep[];
  keyConcepts: string[];
  graph: MathGraphData;
  practiceProblems: { problem: string; answer: string }[];
  warnings?: string[];
};

export type MathSolverRequest = {
  id: string;
  user_id: string;
  problem: string;
  category: MathCategory;
  level: MathLevel;
  final_answer: string | null;
  solution: MathSolverResult | null;
  graph_data: MathGraphData | null;
  status: "completed" | "failed" | "blocked_limit" | "blocked_validation";
  created_at: string;
};
