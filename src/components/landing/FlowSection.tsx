import { ArrowRight } from "lucide-react";

const steps = [
  { label: "Escribe un tema", sub: "Cualquier materia o asignatura" },
  { label: "IA lo analiza", sub: "StudyFlow prepara el material" },
  { label: "Estudia completo", sub: "Resumen, tarjetas, quiz y tutor" },
];

export function FlowSection() {
  return (
    <section className="px-6 py-20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-foreground-muted mb-4 font-sans">
          Flujo de estudio
        </p>
        <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-14 max-w-lg leading-tight">
          De apuntes desordenados a una sesión lista para estudiar.
        </h2>

        {/* Flow */}
        <div className="flex flex-wrap items-center gap-3">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-3">
              <div className="flex flex-col items-center bg-card border border-border rounded-[12px] px-5 py-4 min-w-[110px] text-center hover:border-foreground-muted transition-colors duration-150">
                <span className="text-[14px] font-serif font-medium text-foreground">
                  {step.label}
                </span>
                <span className="text-[11px] text-foreground-muted mt-0.5 font-sans">
                  {step.sub}
                </span>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight
                  size={16}
                  className="text-foreground-muted flex-shrink-0"
                  strokeWidth={1.5}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
