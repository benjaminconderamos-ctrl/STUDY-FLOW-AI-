"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/ui/PageShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { StudySession } from "@/types";
import {
  FileText,
  Sparkles,
  RotateCcw,
  Loader2,
  Trash2,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Send,
  BookOpen,
  MessageCircle,
  HelpCircle,
  Pencil,
} from "lucide-react";

const LazyQuizTab = dynamic(
  () =>
    import("@/components/dashboard/session-tabs/QuizTab").then(
      (mod) => mod.QuizTab
    ),
  {
    loading: () => (
      <div className="flex items-center gap-2 text-foreground-muted">
        <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
        <span className="text-[13px] font-sans">Cargando quiz...</span>
      </div>
    ),
  }
);

const LazyTutorTab = dynamic(
  () =>
    import("@/components/dashboard/session-tabs/TutorTab").then(
      (mod) => mod.TutorTab
    ),
  {
    loading: () => (
      <div className="flex items-center gap-2 text-foreground-muted">
        <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
        <span className="text-[13px] font-sans">Cargando conversación...</span>
      </div>
    ),
  }
);

const goalLabels: Record<string, string> = {
  understand: "Entender rápido",
  exam: "Preparar examen",
  memorize: "Memorizar",
  review: "Repasar apuntes",
};

const levelLabels: Record<string, string> = {
  basic: "Básico",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

const sourceLabels: Record<string, string> = {
  topic: "Tema",
  pdf: "PDF",
  url: "URL",
  youtube: "YouTube",
};

interface SessionDetailProps {
  session: StudySession;
}

export function SessionDetail({ session }: SessionDetailProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [activeTab, setActiveTab] = useState("summary");
  const [sessionProgress, setSessionProgress] = useState(session.progress);
  const [sessionTitle, setSessionTitle] = useState(session.title);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(session.title);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Tiempo de estudio — refs para evitar stale closures en efectos
  const tabStartRef = useRef<number>(0);
  const activeTabRef = useRef<string>("summary");

  // Inicializar timer al montar (Date.now no puede llamarse durante render)
  useEffect(() => {
    tabStartRef.current = Date.now();
  }, []);

  async function recordStudyActivity(tabType: string, minutes: number) {
    if (minutes < 1) return;
    const validTypes = ["summary", "flashcards", "quiz", "tutor"];
    if (!validTypes.includes(tabType)) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("study_activity").insert({
      user_id: user.id,
      session_id: session.id,
      type: tabType,
      minutes_spent: minutes,
      date: new Date().toISOString().split("T")[0],
    });
  }

  // Al cambiar de tab: registrar tiempo en el tab anterior
  useEffect(() => {
    const prev = activeTabRef.current;
    const minutes = Math.floor((Date.now() - tabStartRef.current) / 60000);
    if (prev !== activeTab && minutes >= 1) {
      recordStudyActivity(prev, minutes);
    }
    tabStartRef.current = Date.now();
    activeTabRef.current = activeTab;
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  // Al salir de la página: registrar tiempo del tab activo
  useEffect(() => {
    return () => {
      const minutes = Math.floor((Date.now() - tabStartRef.current) / 60000);
      if (minutes >= 1) {
        recordStudyActivity(activeTabRef.current, minutes);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function startEditTitle() {
    setTitleDraft(sessionTitle);
    setEditingTitle(true);
    setTimeout(() => titleInputRef.current?.select(), 0);
  }

  async function saveTitle() {
    const trimmed = titleDraft.trim();
    setEditingTitle(false);
    if (!trimmed || trimmed === sessionTitle) return;
    if (trimmed.length > 300) return;
    setSessionTitle(trimmed);
    const supabase = createClient();
    await supabase
      .from("study_sessions")
      .update({ title: trimmed })
      .eq("id", session.id);
  }

  function handleTitleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") saveTitle();
    if (e.key === "Escape") { setEditingTitle(false); setTitleDraft(sessionTitle); }
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError("");
    const supabase = createClient();
    const { error } = await supabase
      .from("study_sessions")
      .delete()
      .eq("id", session.id);
    if (error) {
      setDeleteError("Error al eliminar. Intenta de nuevo.");
      setDeleting(false);
      setConfirmDelete(false);
      return;
    }
    router.push("/dashboard/sessions");
  }

  return (
    <PageShell className="max-w-none">
      {/* Header */}
      <div className="mb-6">
        {/* Row 1: title + delete button */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {session.subject && (
                <Badge variant="muted">{session.subject}</Badge>
              )}
              <Badge variant="default">{sourceLabels[session.source]}</Badge>
              <Badge variant="default">{levelLabels[session.level]}</Badge>
              <span className="text-[12px] text-foreground-muted font-sans">
                {formatDate(session.created_at)}
              </span>
            </div>
            {editingTitle ? (
              <input
                ref={titleInputRef}
                autoFocus
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onBlur={saveTitle}
                onKeyDown={handleTitleKeyDown}
                maxLength={300}
                className="font-serif text-2xl md:text-3xl font-medium text-foreground leading-tight bg-transparent border-b border-foreground outline-none w-full max-w-xl"
              />
            ) : (
              <div className="flex items-center gap-2 group">
                <h1 className="font-serif text-2xl md:text-3xl font-medium text-foreground leading-tight">
                  {sessionTitle}
                </h1>
                {session.source === "pdf" && (
                  <button
                    onClick={startEditTitle}
                    className="opacity-40 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150 p-1 rounded-[6px] text-foreground-muted hover:text-foreground hover:bg-muted"
                    aria-label="Editar nombre"
                  >
                    <Pencil size={14} strokeWidth={1.5} />
                  </button>
                )}
              </div>
            )}
            {session.goal && (
              <p className="mt-1.5 text-[13px] text-foreground-muted font-sans">
                Objetivo: {goalLabels[session.goal]}
              </p>
            )}
          </div>

          {/* Delete button — always on top-right */}
          <div className="flex-shrink-0 pt-1">
            {confirmDelete ? (
              <div className="flex items-center gap-1.5 animate-pop-in">
                <span className="text-[12px] text-foreground-muted font-sans hidden sm:inline">¿Eliminar?</span>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center justify-center w-7 h-7 rounded-[6px] bg-foreground text-background hover:opacity-80 transition-opacity duration-150 disabled:opacity-50"
                  aria-label="Confirmar eliminación"
                >
                  {deleting ? (
                    <Loader2 size={12} strokeWidth={2} className="animate-spin" />
                  ) : (
                    <Check size={12} strokeWidth={2.5} />
                  )}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex items-center justify-center w-7 h-7 rounded-[6px] border border-border text-foreground-muted hover:text-foreground hover:border-foreground-muted transition-colors duration-150"
                  aria-label="Cancelar"
                >
                  <X size={12} strokeWidth={2} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center justify-center w-7 h-7 rounded-[6px] text-foreground-muted hover:text-foreground hover:bg-muted transition-all duration-150"
                aria-label="Eliminar sesión"
              >
                <Trash2 size={14} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>

        {/* Row 2: progress bar — full width */}
        <div className="flex items-center gap-2.5">
          <span className="text-[12px] font-medium text-foreground font-sans flex-shrink-0">
            {sessionProgress}%
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-foreground transition-all duration-500"
              style={{ width: `${sessionProgress}%` }}
            />
          </div>
        </div>

        {deleteError && (
          <p className="text-[12px] text-red-500 font-sans mt-2">{deleteError}</p>
        )}
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { value: "summary", label: "Resumen" },
          { value: "flashcards", label: "Tarjetas" },
          { value: "quiz", label: "Quiz" },
          { value: "tutor", label: "Tutor" },
        ]}
        value={activeTab}
        onChange={setActiveTab}
        size="md"
        className="mb-8"
      />

      {/* Content */}
      {activeTab === "summary" && <SummaryTab session={session} onProgressUpdate={setSessionProgress} />}
      {activeTab === "flashcards" && <FlashcardsTab session={session} onProgressUpdate={setSessionProgress} />}
      {activeTab === "quiz" && <LazyQuizTab session={session} onProgressUpdate={setSessionProgress} />}
      {activeTab === "tutor" && <LazyTutorTab session={session} />}
    </PageShell>
  );
}

/* ─── Summary renderer ─── */
function renderSummaryContent(text: string): React.ReactNode {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) { i++; continue; }

    // ## N. Section header
    const headerMatch = line.match(/^##\s*(\d+)\.\s*(.+)$/);
    if (headerMatch) {
      elements.push(
        <div key={`h-${i}`} className="flex items-center gap-2.5 mt-8 mb-3 first:mt-0">
          <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-foreground text-background text-[10px] font-bold font-sans">
            {headerMatch[1]}
          </span>
          <h3 className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted font-sans">
            {headerMatch[2]}
          </h3>
        </div>
      );
      i++;
      continue;
    }

    // Bullet list — collect consecutive `- ` lines
    if (line.startsWith("- ")) {
      const bullets: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        bullets.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-2">
          {bullets.map((b, bi) => (
            <li key={bi} className="flex items-start gap-2.5 text-[14px] font-sans text-foreground leading-relaxed">
              <span className="flex-shrink-0 mt-[9px] w-1 h-1 rounded-full bg-foreground-muted" />
              {b}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list — collect consecutive `N. ` lines
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-2.5">
          {items.map((item, ii) => (
            <li key={ii} className="flex items-start gap-3 text-[14px] font-sans text-foreground leading-relaxed">
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full border border-border text-[11px] font-semibold text-foreground-muted font-sans mt-0.5">
                {ii + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Definition **Term:** text — collect consecutive definition lines
    if (/^\*\*[^*]+:\*\*/.test(line)) {
      const defs: { term: string; body: string }[] = [];
      while (i < lines.length && /^\*\*[^*]+:\*\*/.test(lines[i].trim())) {
        const m = lines[i].trim().match(/^\*\*([^*]+):\*\*\s*(.*)$/);
        if (m) defs.push({ term: m[1], body: m[2] });
        i++;
      }
      elements.push(
        <div key={`def-${i}`} className="space-y-3">
          {defs.map((d, di) => (
            <div key={di} className="flex gap-3">
              <div className="flex-shrink-0 w-px bg-border mt-0.5" />
              <p className="text-[14px] font-sans text-foreground leading-relaxed">
                <span className="font-semibold">{d.term}</span>
                {d.body && <span className="text-foreground-muted"> — {d.body}</span>}
              </p>
            </div>
          ))}
        </div>
      );
      continue;
    }

    // Plain paragraph
    elements.push(
      <p key={`p-${i}`} className="text-[15px] font-sans text-foreground leading-relaxed">
        {line}
      </p>
    );
    i++;
  }

  return <div className="space-y-3">{elements}</div>;
}

/* ─── Summary Tab ─── */
function SummaryTab({ session, onProgressUpdate }: { session: StudySession; onProgressUpdate: (p: number) => void }) {
  const [summary, setSummary] = useState<string | null>(session.summary);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");

  async function handleGenerate() {
    setGenerating(true);
    setGenError("");
    try {
      const res = await fetch("/api/ai/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        const message =
          typeof data.error === "object" && data.error !== null
            ? (data.error.message ?? "Error al generar el resumen.")
            : (data.error ?? "Error al generar el resumen.");
        setGenError(message);
        return;
      }
      setSummary(data.summary);
      if (data.progress != null) onProgressUpdate(data.progress);
    } catch {
      setGenError("Error de conexión. Intenta de nuevo.");
    } finally {
      setGenerating(false);
    }
  }

  if (!summary) {
    return (
      <div className="max-w-sm">
        <div className="flex items-center justify-center w-10 h-10 rounded-[12px] bg-muted mb-4">
          <FileText size={18} className="text-foreground-muted" strokeWidth={1.5} />
        </div>
        <p className="font-serif text-[18px] font-medium text-foreground mb-2">
          Resumen pendiente
        </p>
        <p className="text-[13px] text-foreground-muted font-sans leading-relaxed mb-5">
          Genera un resumen claro y estructurado sobre{" "}
          <span className="text-foreground font-medium">{session.title}</span>{" "}
          usando IA.
        </p>

        {genError && (
          <p className="text-[12px] text-red-500 font-sans mb-4">{genError}</p>
        )}

        <Button size="sm" onClick={handleGenerate} disabled={generating}>
          {generating ? (
            <>
              <Loader2 size={13} strokeWidth={1.5} className="animate-spin" />
              Generando resumen...
            </>
          ) : (
            <>
              <Sparkles size={13} strokeWidth={1.5} />
              Generar resumen
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted font-sans">
          Resumen
        </p>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-1.5 text-[12px] text-foreground-muted hover:text-foreground transition-colors duration-150 font-sans disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? (
            <Loader2 size={12} strokeWidth={1.5} className="animate-spin" />
          ) : (
            <RotateCcw size={12} strokeWidth={1.5} />
          )}
          {generating ? "Regenerando..." : "Regenerar"}
        </button>
      </div>

      {genError && (
        <p className="text-[12px] text-red-500 font-sans mb-4">{genError}</p>
      )}

      <div>{renderSummaryContent(summary)}</div>
    </div>
  );
}

/* ─── Flashcards Tab ─── */
type FlashcardRow = {
  id: string;
  session_id: string;
  question: string;
  answer: string;
  order: number;
};

function FlashcardsTab({ session, onProgressUpdate }: { session: StudySession; onProgressUpdate: (p: number) => void }) {
  const [flashcards, setFlashcards] = useState<FlashcardRow[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("flashcards")
      .select("id, session_id, question, answer, order")
      .eq("session_id", session.id)
      .order("order")
      .then(({ data }) => {
        if (data) setFlashcards(data);
        setIsLoading(false);
      });
  }, [session.id]);

  useEffect(() => {
    if (flashcards.length === 0) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") {
        setIsFlipped(false);
        setCurrentIndex((i) => Math.min(i + 1, flashcards.length - 1));
      } else if (e.key === "ArrowLeft") {
        setIsFlipped(false);
        setCurrentIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === " ") {
        e.preventDefault();
        setIsFlipped((f) => !f);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flashcards.length]);

  async function handleGenerate() {
    setIsGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/ai/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        const message =
          typeof data.error === "object" && data.error !== null
            ? (data.error.message ?? "Error al generar las tarjetas.")
            : (data.error ?? "Error al generar las tarjetas.");
        setError(message);
        return;
      }
      setFlashcards(data.flashcards ?? []);
      setCurrentIndex(0);
      setIsFlipped(false);
      if (data.progress != null) onProgressUpdate(data.progress);
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-foreground-muted">
        <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
        <span className="text-[13px] font-sans">Cargando tarjetas...</span>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="max-w-sm">
        <div className="flex items-center justify-center w-10 h-10 rounded-[12px] bg-muted mb-4">
          <BookOpen size={18} className="text-foreground-muted" strokeWidth={1.5} />
        </div>
        <p className="font-serif text-[18px] font-medium text-foreground mb-2">
          Sin tarjetas aún
        </p>
        <p className="text-[13px] text-foreground-muted font-sans leading-relaxed mb-5">
          Genera 8 flashcards de pregunta y respuesta sobre{" "}
          <span className="text-foreground font-medium">{session.title}</span>{" "}
          para repasar el tema.
        </p>

        {error && (
          <p className="text-[12px] text-red-500 font-sans mb-4">{error}</p>
        )}

        <Button size="sm" onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 size={13} strokeWidth={1.5} className="animate-spin" />
              Generando tarjetas...
            </>
          ) : (
            <>
              <Sparkles size={13} strokeWidth={1.5} />
              Generar tarjetas
            </>
          )}
        </Button>
      </div>
    );
  }

  const current = flashcards[currentIndex];

  return (
    <div className="max-w-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted font-sans">
          Tarjetas · {currentIndex + 1} / {flashcards.length}
        </p>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-1.5 text-[12px] text-foreground-muted hover:text-foreground transition-colors duration-150 font-sans disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <Loader2 size={12} strokeWidth={1.5} className="animate-spin" />
          ) : (
            <RotateCcw size={12} strokeWidth={1.5} />
          )}
          {isGenerating ? "Generando..." : "Regenerar"}
        </button>
      </div>

      {error && (
        <p className="text-[12px] text-red-500 font-sans mb-4">{error}</p>
      )}

      {/* 3D Card */}
      <div
        style={{ perspective: "1000px" }}
        className="relative h-52 cursor-pointer select-none mb-3"
        onClick={() => setIsFlipped((f) => !f)}
      >
        <div className={`flashcard-inner relative w-full h-full${isFlipped ? " flipped" : ""}`}>
          {/* Front — Question */}
          <div className="flashcard-face relative w-full h-full bg-card border border-border rounded-[14px] p-6 flex flex-col items-center justify-center">
            <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted font-sans mb-3">
              Pregunta
            </p>
            <p className="font-serif text-xl text-center leading-snug text-foreground">
              {current.question}
            </p>
          </div>
          {/* Back — Answer */}
          <div className="flashcard-face flashcard-back bg-muted border border-border rounded-[14px] p-6 flex flex-col items-center justify-center">
            <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted font-sans mb-3">
              Respuesta
            </p>
            <p className="text-[15px] text-center text-foreground leading-relaxed font-sans">
              {current.answer}
            </p>
          </div>
        </div>
      </div>

      {/* Hint */}
      <p className="text-center text-[11px] text-foreground-muted font-sans mb-5">
        Click para voltear · Space · ← →
      </p>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => {
            setCurrentIndex((i) => Math.max(i - 1, 0));
            setIsFlipped(false);
          }}
          disabled={currentIndex === 0}
          className="flex items-center justify-center w-9 h-9 rounded-[8px] border border-border text-foreground-muted hover:text-foreground hover:border-foreground-muted transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Anterior"
        >
          <ChevronLeft size={16} strokeWidth={1.5} />
        </button>

        <div className="flex gap-1.5">
          {flashcards.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentIndex(i);
                setIsFlipped(false);
              }}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-150 ${
                i === currentIndex
                  ? "bg-foreground"
                  : "bg-border hover:bg-foreground-muted"
              }`}
              aria-label={`Tarjeta ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => {
            setCurrentIndex((i) => Math.min(i + 1, flashcards.length - 1));
            setIsFlipped(false);
          }}
          disabled={currentIndex === flashcards.length - 1}
          className="flex items-center justify-center w-9 h-9 rounded-[8px] border border-border text-foreground-muted hover:text-foreground hover:border-foreground-muted transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Siguiente"
        >
          <ChevronRight size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

/* ─── Tutor Tab ─── */
type ChatMessage = { role: "user" | "assistant"; content: string };

const WELCOME_MESSAGE = (title: string): ChatMessage => ({
  role: "assistant",
  content: `Hola, soy tu tutor para "${title}". ¿Qué quieres entender mejor o tienes alguna duda?`,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LegacyTutorTab({ session }: { session: StudySession }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userIdRef = useRef<string | null>(null);

  // Cargar historial desde DB al montar
  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.auth.getUser(),
      supabase
        .from("tutor_messages")
        .select("role, content")
        .eq("session_id", session.id)
        .order("created_at"),
    ]).then(([{ data: authData }, { data: dbMessages }]) => {
      userIdRef.current = authData.user?.id ?? null;
      if (dbMessages && dbMessages.length > 0) {
        setMessages(dbMessages as ChatMessage[]);
      } else {
        setMessages([WELCOME_MESSAGE(session.title)]);
      }
      setIsLoading(false);
    });
  }, [session.id, session.title]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isSending) return;
    if (text.length > 800) {
      setError("Tu mensaje es demasiado largo (máx. 800 caracteres).");
      return;
    }

    setError("");
    setInput("");
    setIsSending(true);

    const newUserMsg: ChatMessage = { role: "user", content: text };
    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);

    const supabase = createClient();
    const userId = userIdRef.current;

    // Guardar mensaje del usuario en DB
    if (userId) {
      await supabase.from("tutor_messages").insert({
        session_id: session.id,
        user_id: userId,
        role: "user",
        content: text,
      });
    }

    try {
      // Enviar últimos 40 mensajes al API (ventana de contexto)
      const apiContext = newMessages.slice(-40);

      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id, messages: apiContext }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const message =
          typeof data.error === "object" && data.error !== null
            ? (data.error.message ?? "Error al contactar al tutor.")
            : (data.error ?? "Error al contactar al tutor.");
        setError(message);
        setIsSending(false);
        return;
      }

      if (!res.body) {
        setError("No se pudo leer la respuesta.");
        setIsSending(false);
        return;
      }

      // Agregar burbuja de assistant vacía y llenarla con el stream
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: assistantContent };
          return updated;
        });
      }

      // Guardar respuesta del tutor en DB
      if (userId && assistantContent) {
        await supabase.from("tutor_messages").insert({
          session_id: session.id,
          user_id: userId,
          role: "assistant",
          content: assistantContent,
        });
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-foreground-muted">
        <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
        <span className="text-[13px] font-sans">Cargando conversación...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl flex flex-col" style={{ height: "calc(100vh - 340px)", minHeight: "400px" }}>
      {!session.summary && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-muted rounded-[8px]">
          <MessageCircle size={13} strokeWidth={1.5} className="text-foreground-muted flex-shrink-0" />
          <p className="text-[12px] text-foreground-muted font-sans">
            El tutor funciona mejor cuando tienes un resumen generado.
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-[12px] px-4 py-2.5 text-[14px] leading-relaxed font-sans ${
                msg.role === "user"
                  ? "bg-foreground text-background"
                  : "bg-card border border-border text-foreground"
              }`}
            >
              {msg.content || (
                <span className="flex items-center gap-1.5 text-foreground-muted">
                  <Loader2 size={12} strokeWidth={1.5} className="animate-spin" />
                  <span className="text-[13px]">Escribiendo...</span>
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <p className="text-[12px] text-red-500 font-sans mb-2">{error}</p>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-border pt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu pregunta..."
          maxLength={800}
          disabled={isSending}
          className="flex-1 h-10 px-3 text-[14px] font-sans bg-card border border-border rounded-[10px] text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-foreground-muted transition-colors duration-150 disabled:opacity-60"
        />
        <button
          onClick={handleSend}
          disabled={isSending || !input.trim()}
          className="flex items-center justify-center w-10 h-10 rounded-[10px] bg-foreground text-background hover:opacity-80 transition-opacity duration-150 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
          aria-label="Enviar"
        >
          {isSending ? (
            <Loader2 size={15} strokeWidth={1.5} className="animate-spin" />
          ) : (
            <Send size={15} strokeWidth={1.5} />
          )}
        </button>
      </div>
    </div>
  );
}

/* ─── Quiz Tab ─── */
type QuizQuestionRow = {
  id: string;
  session_id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string | null;
  order: number;
};

const OPTION_LABELS = ["A", "B", "C", "D"];

// Kept temporarily as an exact reference implementation while the lazily loaded
// module is validated against the existing behavior.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LegacyQuizTab({
  session,
  onProgressUpdate,
}: {
  session: StudySession;
  onProgressUpdate: (p: number) => void;
}) {
  const [questions, setQuestions] = useState<QuizQuestionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("quiz_questions")
      .select("id, session_id, question, options, correct_index, explanation, order")
      .eq("session_id", session.id)
      .order("order")
      .then(({ data }) => {
        if (data) setQuestions(data);
        setIsLoading(false);
      });
  }, [session.id]);

  async function handleGenerate() {
    setIsGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/ai/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        const message =
          typeof data.error === "object" && data.error !== null
            ? (data.error.message ?? "Error al generar el quiz.")
            : (data.error ?? "Error al generar el quiz.");
        setError(message);
        return;
      }
      setQuestions(data.questions ?? []);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setScore(0);
      setIsFinished(false);
      if (data.progress != null) onProgressUpdate(data.progress);
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleAnswer(index: number) {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === questions[currentIndex].correct_index) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  }

  function handleRestart() {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-foreground-muted">
        <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
        <span className="text-[13px] font-sans">Cargando quiz...</span>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-sm">
        <div className="flex items-center justify-center w-10 h-10 rounded-[12px] bg-muted mb-4">
          <HelpCircle size={18} className="text-foreground-muted" strokeWidth={1.5} />
        </div>
        <p className="font-serif text-[18px] font-medium text-foreground mb-2">
          Sin quiz aún
        </p>
        <p className="text-[13px] text-foreground-muted font-sans leading-relaxed mb-5">
          Genera 5 preguntas de opción múltiple sobre{" "}
          <span className="text-foreground font-medium">{session.title}</span>{" "}
          para poner a prueba tu comprensión.
        </p>
        {error && (
          <p className="text-[12px] text-red-500 font-sans mb-4">{error}</p>
        )}
        <Button size="sm" onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 size={13} strokeWidth={1.5} className="animate-spin" />
              Generando quiz...
            </>
          ) : (
            <>
              <Sparkles size={13} strokeWidth={1.5} />
              Generar quiz
            </>
          )}
        </Button>
      </div>
    );
  }

  // Pantalla final
  if (isFinished) {
    const emoji = score >= 4 ? "⭐" : score >= 2 ? "👍" : "🔁";
    const subtitle =
      score >= 4
        ? "¡Excelente dominio del tema!"
        : score >= 2
        ? "Buen intento, sigue repasando."
        : "Repasa el resumen e inténtalo de nuevo.";

    return (
      <div className="max-w-sm">
        <p className="text-4xl mb-4">{emoji}</p>
        <p className="font-serif text-2xl font-medium text-foreground mb-2">
          {score} de {questions.length} correctas
        </p>
        <p className="text-[13px] text-foreground-muted font-sans mb-8">{subtitle}</p>
        <div className="flex gap-3">
          <Button size="sm" variant="outline" onClick={handleRestart}>
            Intentar de nuevo
          </Button>
          <Button size="sm" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 size={13} strokeWidth={1.5} className="animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <RotateCcw size={13} strokeWidth={1.5} />
                Regenerar quiz
              </>
            )}
          </Button>
        </div>
        {error && (
          <p className="text-[12px] text-red-500 font-sans mt-4">{error}</p>
        )}
      </div>
    );
  }

  // Pantalla de pregunta
  const current = questions[currentIndex];
  const isAnswered = selectedAnswer !== null;

  return (
    <div className="max-w-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted font-sans">
          Pregunta {currentIndex + 1} de {questions.length}
        </p>
        <div className="flex items-center gap-3">
          <p className="text-[12px] text-foreground-muted font-sans">
            {score} correcta{score !== 1 ? "s" : ""}
          </p>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-1.5 text-[12px] text-foreground-muted hover:text-foreground transition-colors duration-150 font-sans disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <Loader2 size={12} strokeWidth={1.5} className="animate-spin" />
            ) : (
              <RotateCcw size={12} strokeWidth={1.5} />
            )}
            {isGenerating ? "Generando..." : "Regenerar"}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-[12px] text-red-500 font-sans mb-4">{error}</p>
      )}

      {/* Question */}
      <p className="font-serif text-xl font-medium text-foreground leading-snug mb-6">
        {current.question}
      </p>

      {/* Options */}
      <div className="space-y-2.5 mb-6">
        {current.options.map((option, i) => {
          const isCorrect = i === current.correct_index;
          const isSelected = i === selectedAnswer;

          let optionClass =
            "w-full flex items-center gap-3 px-4 py-3 rounded-[12px] border text-left transition-all duration-150 font-sans text-[14px]";

          if (!isAnswered) {
            optionClass +=
              " bg-card border-border text-foreground hover:border-foreground-muted cursor-pointer";
          } else if (isCorrect) {
            optionClass +=
              " border-green-600 bg-green-50 dark:bg-green-950/30 text-foreground cursor-default";
          } else if (isSelected) {
            optionClass +=
              " border-red-500 bg-red-50 dark:bg-red-950/30 text-foreground cursor-default";
          } else {
            optionClass +=
              " bg-card border-border text-foreground-muted cursor-default opacity-60";
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={isAnswered}
              className={optionClass}
            >
              <span
                className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-semibold border transition-colors duration-150 ${
                  isAnswered && isCorrect
                    ? "bg-green-600 border-green-600 text-white"
                    : isAnswered && isSelected
                    ? "bg-red-500 border-red-500 text-white"
                    : "border-border text-foreground-muted"
                }`}
              >
                {OPTION_LABELS[i]}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {isAnswered && current.explanation && (
        <div className="mb-6 px-4 py-3 bg-muted rounded-[10px]">
          <p className="text-[12px] font-semibold text-foreground-muted font-sans uppercase tracking-[0.08em] mb-1">
            Explicación
          </p>
          <p className="text-[13px] text-foreground font-sans leading-relaxed">
            {current.explanation}
          </p>
        </div>
      )}

      {/* Next button */}
      {isAnswered && (
        <Button size="sm" onClick={handleNext}>
          {currentIndex < questions.length - 1 ? "Siguiente pregunta" : "Ver resultado"}
        </Button>
      )}
    </div>
  );
}
