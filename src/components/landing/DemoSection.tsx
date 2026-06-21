"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const DEMO_TABS = [
  { value: "summary", label: "Resumen" },
  { value: "flashcards", label: "Tarjetas" },
  { value: "quiz", label: "Quiz" },
];

const laws = [
  { num: "1ª", text: "Un objeto en reposo permanece en reposo a menos que una fuerza actúe sobre él." },
  { num: "2ª", text: "La fuerza es igual a la masa por la aceleración: F = ma." },
  { num: "3ª", text: "Para cada acción existe una reacción igual y opuesta." },
];

const flashcards = [
  {
    question: "¿Qué establece la Primera Ley de Newton?",
    answer: "Todo objeto permanece en reposo o en movimiento rectilíneo uniforme a menos que una fuerza externa actúe sobre él.",
  },
  {
    question: "¿Qué expresa F = ma?",
    answer: "La Segunda Ley de Newton: la fuerza neta aplicada a un objeto es igual a su masa multiplicada por la aceleración.",
  },
  {
    question: "¿Cuál es el principio de acción y reacción?",
    answer: "La Tercera Ley: para cada fuerza que ejerce un cuerpo A sobre un cuerpo B, existe una fuerza igual y opuesta de B sobre A.",
  },
];

const quizQuestion = {
  question: "Si aplicamos una fuerza de 20 N a un objeto de 4 kg, ¿cuál es su aceleración?",
  options: ["2 m/s²", "5 m/s²", "80 m/s²", "0.2 m/s²"],
  correctIndex: 1,
  explanation: "Usando F = ma, despejamos a = F/m = 20/4 = 5 m/s².",
};

export function DemoSection() {
  const [activeTab, setActiveTab] = useState("summary");
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  function switchTab(tab: string) {
    setActiveTab(tab);
    setFlipped(false);
    setSelected(null);
    setCardIndex(0);
  }

  useEffect(() => {
    if (activeTab !== "flashcards") return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") {
        setCardIndex((i) => Math.min(i + 1, flashcards.length - 1));
        setFlipped(false);
      } else if (e.key === "ArrowLeft") {
        setCardIndex((i) => Math.max(i - 1, 0));
        setFlipped(false);
      } else if (e.key === " ") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeTab]);

  return (
    <section className="px-6 py-20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-foreground-muted mb-4 font-sans">
          Demo en vivo
        </p>
        <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-8 leading-tight">
          Sesión generada:{" "}
          <em className="not-italic text-foreground-muted">
            Las 3 leyes de Newton
          </em>
        </h2>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-border">
          {DEMO_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => switchTab(tab.value)}
              className={cn(
                "px-4 py-2 text-[13px] font-sans font-medium transition-colors duration-150",
                "-mb-px border-b-2",
                activeTab === tab.value
                  ? "border-foreground text-foreground"
                  : "border-transparent text-foreground-muted hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="border border-border rounded-[16px] bg-card overflow-hidden">

          {/* RESUMEN */}
          {activeTab === "summary" && (
            <div className="p-6 md:p-8">
              <div className="space-y-4">
                <p className="text-[13px] font-semibold tracking-[0.1em] uppercase text-foreground-muted font-sans">
                  Resumen claro
                </p>
                <p className="font-serif text-[22px] md:text-[26px] font-medium text-foreground leading-relaxed max-w-xl">
                  Las leyes de Newton explican cómo se mueven los objetos cuando actúan
                  fuerzas sobre ellos.
                </p>
                <div className="space-y-3 pt-2">
                  {laws.map((law) => (
                    <div key={law.num} className="flex items-start gap-3">
                      <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[11px] font-mono text-foreground-muted">
                        {law.num}
                      </span>
                      <p className="text-[14px] text-foreground leading-relaxed font-sans">
                        {law.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FLASHCARDS */}
          {activeTab === "flashcards" && (
            <div className="p-6 md:p-8">
              <div className="max-w-lg">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-[13px] font-semibold tracking-[0.1em] uppercase text-foreground-muted font-sans">
                    Tarjeta {cardIndex + 1} de {flashcards.length}
                  </p>
                  <div className="flex gap-2">
                    {flashcards.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { setCardIndex(i); setFlipped(false); }}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-all duration-150",
                          i === cardIndex ? "bg-foreground" : "bg-border hover:bg-foreground-muted"
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Card */}
                <div
                  className="relative h-44 cursor-pointer select-none mb-3"
                  style={{ perspective: "1000px" }}
                  onClick={() => setFlipped((f) => !f)}
                >
                  <div className={`flashcard-inner relative w-full h-full${flipped ? " flipped" : ""}`}>
                    <div className="flashcard-face w-full h-full bg-muted/50 border border-border rounded-[14px] p-6 flex flex-col items-center justify-center">
                      <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted font-sans mb-3">
                        Pregunta
                      </p>
                      <p className="font-serif text-[18px] text-center leading-snug text-foreground">
                        {flashcards[cardIndex].question}
                      </p>
                    </div>
                    <div className="flashcard-face flashcard-back bg-muted border border-border rounded-[14px] p-6 flex flex-col items-center justify-center">
                      <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted font-sans mb-3">
                        Respuesta
                      </p>
                      <p className="text-[14px] text-center text-foreground leading-relaxed font-sans">
                        {flashcards[cardIndex].answer}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-[12px] text-foreground-muted font-sans text-center mb-5">
                  Click para voltear · ← →
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => { setCardIndex((i) => Math.max(i - 1, 0)); setFlipped(false); }}
                    disabled={cardIndex === 0}
                    className="flex-1 h-9 rounded-[8px] border border-border text-[13px] font-sans text-foreground-muted hover:text-foreground hover:border-foreground-muted transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ← Anterior
                  </button>
                  <button
                    onClick={() => { setCardIndex((i) => Math.min(i + 1, flashcards.length - 1)); setFlipped(false); }}
                    disabled={cardIndex === flashcards.length - 1}
                    className="flex-1 h-9 rounded-[8px] border border-border text-[13px] font-sans text-foreground-muted hover:text-foreground hover:border-foreground-muted transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* QUIZ */}
          {activeTab === "quiz" && (
            <div className="p-6 md:p-8 max-w-xl">
              <p className="text-[13px] font-semibold tracking-[0.1em] uppercase text-foreground-muted font-sans mb-5">
                Pregunta 1 de 5
              </p>
              <p className="font-serif text-[20px] font-medium text-foreground leading-snug mb-6">
                {quizQuestion.question}
              </p>

              <div className="space-y-2.5 mb-5">
                {quizQuestion.options.map((option, i) => {
                  const isCorrect = i === quizQuestion.correctIndex;
                  const isSelected = i === selected;
                  const answered = selected !== null;

                  return (
                    <button
                      key={i}
                      onClick={() => !answered && setSelected(i)}
                      disabled={answered}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-[12px] border text-left transition-all duration-150 font-sans text-[14px]",
                        !answered && "bg-card border-border text-foreground hover:border-foreground-muted cursor-pointer",
                        answered && isCorrect && "border-green-600 bg-green-50 dark:bg-green-950/30 text-foreground cursor-default",
                        answered && isSelected && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/30 text-foreground cursor-default",
                        answered && !isSelected && !isCorrect && "bg-card border-border text-foreground-muted cursor-default opacity-60"
                      )}
                    >
                      <span className={cn(
                        "flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-semibold border transition-colors duration-150",
                        answered && isCorrect ? "bg-green-600 border-green-600 text-white" :
                        answered && isSelected ? "bg-red-500 border-red-500 text-white" :
                        "border-border text-foreground-muted"
                      )}>
                        {["A", "B", "C", "D"][i]}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>

              {selected !== null && (
                <div className="px-4 py-3 bg-muted rounded-[10px]">
                  <p className="text-[12px] font-semibold text-foreground-muted font-sans uppercase tracking-[0.08em] mb-1">
                    Explicación
                  </p>
                  <p className="text-[13px] text-foreground font-sans leading-relaxed">
                    {quizQuestion.explanation}
                  </p>
                </div>
              )}

              {selected === null && (
                <p className="text-[12px] text-foreground-muted font-sans">
                  Selecciona una opción para ver la respuesta correcta.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
