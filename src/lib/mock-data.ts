import type {
  StudySession,
  Document,
  Flashcard,
  QuizQuestion,
  UserProfile,
  DashboardMetrics,
} from "@/types";

export const mockUser: UserProfile = {
  id: "user-1",
  name: "Alex García",
  email: "alex@studyflow.ai",
  plan: "free",
  createdAt: "2024-01-15T10:00:00Z",
};

export const mockMetrics: DashboardMetrics = {
  sessionsCount: 0,
  documentsCount: 0,
  flashcardsCount: 0,
  quizzesDone: 0,
};

export const mockSessions: StudySession[] = [
  {
    id: "session-1",
    user_id: "user-1",
    title: "Las 3 leyes de Newton",
    subject: "Física",
    progress: 68,
    tools: ["summary", "flashcards", "quiz"],
    source: "topic",
    level: "intermediate",
    goal: "exam",
    status: "generated",
    summary: null,
    created_at: "2024-01-20T09:00:00Z",
    updated_at: "2024-01-22T14:30:00Z",
  },
  {
    id: "session-2",
    user_id: "user-1",
    title: "Revolución Mexicana",
    subject: "Historia",
    progress: 42,
    tools: ["summary", "tutor"],
    source: "pdf",
    level: "basic",
    goal: "understand",
    status: "in_progress",
    summary: null,
    created_at: "2024-01-18T11:00:00Z",
    updated_at: "2024-01-19T16:00:00Z",
  },
  {
    id: "session-3",
    user_id: "user-1",
    title: "Derivadas básicas",
    subject: "Matemáticas",
    progress: 20,
    tools: ["flashcards"],
    source: "topic",
    level: "intermediate",
    goal: "memorize",
    status: "draft",
    summary: null,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T09:00:00Z",
  },
];

export const mockDocuments: Document[] = [];

export const mockFlashcards: Flashcard[] = [
  {
    id: "fc-1",
    sessionId: "session-1",
    question: "¿Qué es la inercia?",
    answer:
      "La inercia es la tendencia de un objeto a mantener su estado de reposo o movimiento uniforme a menos que una fuerza externa actúe sobre él.",
    order: 1,
  },
  {
    id: "fc-2",
    sessionId: "session-1",
    question: "¿Qué fórmula representa la segunda ley de Newton?",
    answer:
      "F = ma. La fuerza neta aplicada a un objeto es igual a su masa multiplicada por la aceleración que produce.",
    order: 2,
  },
  {
    id: "fc-3",
    sessionId: "session-1",
    question: "¿Qué dice la tercera ley de Newton?",
    answer:
      "Para toda acción existe una reacción igual y opuesta. Si un objeto A ejerce una fuerza sobre B, entonces B ejerce una fuerza de igual magnitud pero en dirección opuesta sobre A.",
    order: 3,
  },
];

export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: "q-1",
    sessionId: "session-1",
    question:
      "¿Qué ley explica que un objeto mantiene su estado de movimiento si no actúa una fuerza externa?",
    options: [
      "Primera ley (Inercia)",
      "Segunda ley (Fuerza)",
      "Tercera ley (Acción y reacción)",
      "Ley de gravitación universal",
    ],
    correctIndex: 0,
    explanation:
      "La primera ley de Newton, también llamada ley de inercia, establece que un objeto en reposo permanece en reposo y un objeto en movimiento permanece en movimiento a velocidad constante, a menos que una fuerza externa actúe sobre él.",
  },
  {
    id: "q-2",
    sessionId: "session-1",
    question:
      "Si aplicamos una fuerza de 10 N a un objeto de 2 kg, ¿cuál es su aceleración?",
    options: ["2 m/s²", "5 m/s²", "20 m/s²", "0.2 m/s²"],
    correctIndex: 1,
    explanation:
      "Usando F = ma, despejamos a = F/m = 10/2 = 5 m/s².",
  },
];

export const mockSummary = {
  sessionId: "session-1",
  content: `Las leyes de Newton describen la relación entre el movimiento de un objeto y las fuerzas que actúan sobre él.

**Primera ley (Inercia):** Un objeto en reposo permanece en reposo y un objeto en movimiento continúa moviéndose a velocidad constante en línea recta, a menos que una fuerza externa actúe sobre él.

**Segunda ley (Fuerza):** La aceleración de un objeto es directamente proporcional a la fuerza neta que actúa sobre él e inversamente proporcional a su masa. Esto se expresa como F = ma.

**Tercera ley (Acción y reacción):** Para cada acción existe una reacción igual y de sentido contrario. Las fuerzas siempre actúan en pares sobre objetos diferentes.`,
};

export const mockMindMapNodes = [
  { id: "root", label: "Leyes de Newton", x: 50, y: 50 },
  { id: "l1", label: "1ª Ley: Inercia", x: 20, y: 75 },
  { id: "l2", label: "2ª Ley: F = ma", x: 50, y: 80 },
  { id: "l3", label: "3ª Ley: Acción y Reacción", x: 80, y: 75 },
];

export const demoSession: StudySession = mockSessions[0];
