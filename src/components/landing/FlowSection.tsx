import { ArrowRight } from "lucide-react";

const steps = [
  { label: "Escribe un tema", sub: "Cualquier materia o asignatura" },
  { label: "IA lo analiza", sub: "StudyFlow prepara el material" },
  { label: "Estudia completo", sub: "Resumen, tarjetas, quiz y tutor" },
];

export function FlowSection() {
  return (
    <section className="px-4 sm:px-6 py-16 md:py-20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-foreground-muted mb-4 font-sans">
          Flujo de estudio
        </p>
        <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium text-foreground mb-10 md:mb-14 max-w-lg leading-tight">
          De apuntes desordenados a una sesión lista para estudiar.
        </h2>

        {/* Flow — vertical on mobile, horizontal on md+ */}
        <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-2 md:gap-3">
          {steps.map((step, i) => (
            <div key={step.label} className="flex flex-col md:flex-row md:items-center md:gap-3">
              <div className="flex flex-col items-start md:items-center bg-card border border-border rounded-[12px] px-5 py-4 w-full md:w-auto md:min-w-[110px] text-left md:text-center hover:border-foreground-muted transition-colors duration-150">
                <span className="text-[14px] font-serif font-medium text-foreground">
                  {step.label}
                </span>
                <span className="text-[11px] text-foreground-muted mt-0.5 font-sans">
                  {step.sub}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex justify-start md:justify-center py-1 md:py-0 pl-5 md:pl-0">
                  <ArrowRight
                    size={14}
                    className="text-foreground-muted flex-shrink-0 rotate-90 md:rotate-0"
                    strokeWidth={1.5}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
