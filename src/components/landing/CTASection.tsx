import { Button } from "@/components/ui/Button";

export function CTASection() {
  return (
    <section className="px-6 py-24 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-foreground-muted mb-6 font-sans">
          Empieza ahora
        </p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground mb-6 leading-tight max-w-2xl">
          Empieza con un tema. Termina con una sesión completa de estudio.
        </h2>
        <p className="text-[15px] text-foreground-muted mb-10 max-w-md font-sans leading-relaxed">
          Sin tarjeta de crédito. Sin configuración. Solo escribe un tema y
          StudyFlow hace el resto.
        </p>
        <Button href="/register" size="lg">
          Crear mi primera sesión
        </Button>
      </div>
    </section>
  );
}
