"use client";

import { useEffect, useState } from "react";
import { HelpCircle, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import type { StudySession } from "@/types";

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

export function QuizTab({
  session,
  onProgressUpdate,
}: {
  session: StudySession;
  onProgressUpdate: (progress: number) => void;
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
      setScore((currentScore) => currentScore + 1);
    }
  }

  function handleNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((index) => index + 1);
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

  const current = questions[currentIndex];
  const isAnswered = selectedAnswer !== null;

  return (
    <div className="max-w-xl">
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

      <p className="font-serif text-xl font-medium text-foreground leading-snug mb-6">
        {current.question}
      </p>

      <div className="space-y-2.5 mb-6">
        {current.options.map((option, index) => {
          const isCorrect = index === current.correct_index;
          const isSelected = index === selectedAnswer;
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
              key={index}
              onClick={() => handleAnswer(index)}
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
                {OPTION_LABELS[index]}
              </span>
              {option}
            </button>
          );
        })}
      </div>

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

      {isAnswered && (
        <Button size="sm" onClick={handleNext}>
          {currentIndex < questions.length - 1 ? "Siguiente pregunta" : "Ver resultado"}
        </Button>
      )}
    </div>
  );
}
