import { Button } from "@/components/ui/Button";
import { BookOpen, Sparkles, LayoutGrid, HelpCircle, MessageCircle, FileText } from "lucide-react";

const featureCards = [
  {
    number: "01",
    title: "Tema o PDF",
    description: "Escribe un tema o sube un PDF. StudyFlow crea una sesión de estudio desde tu contenido.",
    icon: BookOpen,
    badge: null,
  },
  {
    number: "02",
    title: "Resumen con IA",
    description: "Recibe un resumen claro y organizado generado automáticamente desde el tema o el PDF.",
    icon: Sparkles,
    badge: null,
  },
  {
    number: "03",
    title: "Flashcards",
    description: "Tarjetas de pregunta y respuesta basadas en el contenido de tu sesión o documento.",
    icon: LayoutGrid,
    badge: null,
  },
  {
    number: "04",
    title: "Quiz interactivo",
    description: "Pon a prueba tu comprensión con preguntas de opción múltiple y feedback inmediato.",
    icon: HelpCircle,
    badge: null,
  },
  {
    number: "05",
    title: "Tutor IA",
    description: "Pregunta lo que no entiendes. El tutor responde con contexto de tu material.",
    icon: MessageCircle,
    badge: null,
  },
  {
    number: "06",
    title: "Subir PDFs",
    description: "Sube un PDF con texto seleccionable y conviértelo en materiales de estudio con IA.",
    icon: FileText,
    badge: "Beta",
  },
];

export function HeroSection() {
  return (
    <section className="px-4 sm:px-6 pt-16 pb-20 md:pt-28 md:pb-32">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_1fr] gap-10 md:gap-16 items-start">
        {/* Left: copy */}
        <div className="animate-fade-in">
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-foreground-muted mb-6 font-sans">
            Espacio de estudio con IA
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-medium text-foreground leading-[1.05] tracking-tight mb-6">
            Estudia mejor.
            <br />
            <em className="not-italic opacity-60">Comprende mejor.</em>
          </h1>
          <p className="text-[15px] md:text-[16px] text-foreground-muted leading-relaxed mb-8 md:mb-10 max-w-sm font-sans">
            Escribe un tema o sube un PDF. StudyFlow genera resúmenes, flashcards,
            quizzes y un tutor IA basados en tu contenido.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Button href="/register" size="lg">
              Empezar a estudiar
            </Button>
            <Button href="/login" size="lg" variant="outline">
              Ya tengo cuenta
            </Button>
          </div>
        </div>

        {/* Right: feature cards grid 3x2 */}
        <div className="grid grid-cols-2 gap-2.5 md:gap-3">
          {featureCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={card.number}
                className={[
                  "group relative p-4 md:p-5 rounded-[14px] border border-border bg-card",
                  "flex flex-col justify-between min-h-[110px] md:min-h-[130px]",
                  "hover:border-foreground-muted transition-all duration-200 ease-out",
                  "hover:-translate-y-0.5",
                  "animate-fade-in",
                  `stagger-${i + 1}`,
                ].join(" ")}
              >
                <div className="flex items-start justify-between">
                  <span className="text-[11px] font-mono text-foreground-muted tracking-widest">
                    {card.number}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {card.badge && (
                      <span className="text-[9px] font-semibold tracking-widest uppercase text-foreground-muted border border-border rounded-full px-1.5 py-0.5 font-sans">
                        {card.badge}
                      </span>
                    )}
                    <Icon
                      size={15}
                      className="text-foreground-muted group-hover:text-foreground transition-colors duration-150"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-[14px] font-serif font-medium text-foreground mb-1 leading-snug">
                    {card.title}
                  </p>
                  <p className="text-[11px] text-foreground-muted leading-relaxed font-sans">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
