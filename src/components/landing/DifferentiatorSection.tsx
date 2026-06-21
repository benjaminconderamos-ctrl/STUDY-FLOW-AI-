import { Check, X } from "lucide-react";

const comparisons = [
  {
    feature: "Responde preguntas generales",
    chatgpt: true,
    studyflow: true,
  },
  {
    feature: "Genera resúmenes estructurados",
    chatgpt: false,
    studyflow: true,
  },
  {
    feature: "Organiza sesiones por tema",
    chatgpt: false,
    studyflow: true,
  },
  {
    feature: "Flashcards automáticas",
    chatgpt: false,
    studyflow: true,
  },
  {
    feature: "Quiz con feedback inmediato",
    chatgpt: false,
    studyflow: true,
  },
  {
    feature: "Tutor contextual por sesión",
    chatgpt: false,
    studyflow: true,
  },
];

export function DifferentiatorSection() {
  return (
    <section className="px-6 py-20 border-t border-border">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        {/* Copy */}
        <div>
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-foreground-muted mb-4 font-sans">
            Por qué StudyFlow
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6 leading-tight">
            No es otro chat con IA.{" "}
            <em className="not-italic text-foreground-muted">
              Es un sistema de estudio guiado.
            </em>
          </h2>
          <p className="text-[15px] text-foreground-muted leading-relaxed font-sans max-w-md">
            ChatGPT responde preguntas. StudyFlow te ayuda a estudiar,
            practicar, equivocarte, repasar y medir tu progreso.
          </p>
        </div>

        {/* Comparison table */}
        <div className="border border-border rounded-[16px] overflow-hidden">
          <div className="grid grid-cols-[1fr_80px_80px] border-b border-border px-5 py-3">
            <span className="text-[11px] font-semibold text-foreground-muted uppercase tracking-widest font-sans">
              Función
            </span>
            <span className="text-[11px] font-semibold text-foreground-muted uppercase tracking-widest font-sans text-center">
              ChatGPT
            </span>
            <span className="text-[11px] font-semibold text-foreground uppercase tracking-widest font-sans text-center">
              StudyFlow
            </span>
          </div>
          {comparisons.map((row, i) => (
            <div
              key={row.feature}
              className={[
                "grid grid-cols-[1fr_80px_80px] px-5 py-3.5 items-center",
                i < comparisons.length - 1 ? "border-b border-border" : "",
              ].join(" ")}
            >
              <span className="text-[13px] text-foreground font-sans">
                {row.feature}
              </span>
              <div className="flex justify-center">
                {row.chatgpt ? (
                  <Check size={14} className="text-foreground-muted" strokeWidth={2} />
                ) : (
                  <X size={14} className="text-border" strokeWidth={2} />
                )}
              </div>
              <div className="flex justify-center">
                {row.studyflow ? (
                  <Check size={14} className="text-foreground" strokeWidth={2.5} />
                ) : (
                  <X size={14} className="text-border" strokeWidth={2} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
