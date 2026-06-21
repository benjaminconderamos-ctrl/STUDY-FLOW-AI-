import { Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    tagline: "Para probar StudyFlow AI",
    price: 0,
    priceRegular: null as number | null,
    isPopular: false,
    isLaunch: false,
    cta: "Empezar gratis",
    ctaHref: "/register",
    ctaVariant: "outline" as const,
    features: [
      { text: "5 resúmenes con IA por día", included: true },
      { text: "5 sets de flashcards por día", included: true },
      { text: "5 quizzes por día", included: true },
      { text: "20 mensajes al tutor IA por día", included: true },
      { text: "Materias y sesiones ilimitadas", included: true },
      { text: "Resolvedor de matemáticas", included: false },
    ],
  },
  {
    name: "Pro",
    tagline: "Para estudiantes exigentes",
    price: 99,
    priceRegular: 129,
    isPopular: true,
    isLaunch: true,
    cta: "Obtener Pro",
    ctaHref: "/dashboard/upgrade?plan=pro",
    ctaVariant: "default" as const,
    founderNote: "Precio garantizado para quienes se registren durante el lanzamiento.",
    features: [
      { text: "25 resúmenes con IA por día", included: true },
      { text: "25 sets de flashcards por día", included: true },
      { text: "25 quizzes por día", included: true },
      { text: "100 mensajes al tutor IA por día", included: true },
      { text: "Materias y sesiones ilimitadas", included: true },
      { text: "Resolvedor de matemáticas — 3 por día", included: true },
    ],
  },
  {
    name: "Max",
    tagline: "Para usuarios intensivos y preparación de exámenes",
    price: 199,
    priceRegular: 249,
    isPopular: false,
    isLaunch: true,
    cta: "Obtener Max",
    ctaHref: "/dashboard/upgrade?plan=max",
    ctaVariant: "default" as const,
    founderNote: "Precio garantizado para quienes se registren durante el lanzamiento.",
    features: [
      { text: "50 resúmenes con IA por día", included: true },
      { text: "50 sets de flashcards por día", included: true },
      { text: "50 quizzes por día", included: true },
      { text: "200 mensajes al tutor IA por día", included: true },
      { text: "Materias y sesiones ilimitadas", included: true },
      { text: "Resolvedor de matemáticas — 50 por día", included: true },
    ],
  },
];

export function PricingSection() {
  return (
    <section id="precios" className="px-6 py-20 border-t border-border">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-foreground-muted mb-4 font-sans">
            Precios
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4 leading-tight">
            Un plan para cada etapa{" "}
            <em className="not-italic text-foreground-muted">de tu estudio.</em>
          </h2>
          <p className="text-[15px] text-foreground-muted font-sans max-w-xl leading-relaxed">
            Empieza gratis sin tarjeta de crédito. Actualiza cuando lo necesites.
          </p>
        </div>

        {/* Launch banner */}
        <div className="mb-8 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-[12px] border border-border bg-muted/60">
          <span
            className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"
            aria-hidden="true"
          />
          <p className="text-[13px] font-sans">
            <span className="font-medium text-foreground">Oferta de lanzamiento</span>
            <span className="text-foreground-muted">
              {" "}— Regístrate ahora para fijar el precio fundador cuando lancemos los planes de pago.
            </span>
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-[16px] border flex flex-col overflow-hidden",
                plan.isPopular ? "border-foreground" : "border-border"
              )}
            >
              {/* Popular banner */}
              {plan.isPopular && (
                <div className="bg-foreground px-5 py-2.5 flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-background uppercase tracking-[0.12em] font-sans">
                    ★ Más popular
                  </span>
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">

                {/* Plan name + tagline */}
                <div className="mb-5">
                  <h3 className="font-serif text-xl font-medium text-foreground mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-[13px] text-foreground-muted font-sans leading-snug">
                    {plan.tagline}
                  </p>
                </div>

                {/* Price block */}
                <div className="mb-5">
                  {/* Launch badge */}
                  {plan.isLaunch && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.08em] font-sans border bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50 mb-2">
                      Precio de lanzamiento
                    </span>
                  )}

                  {/* Strikethrough price */}
                  {plan.priceRegular !== null && (
                    <p className="text-[12px] text-foreground-muted font-sans line-through leading-none mb-1">
                      Antes: ${plan.priceRegular} MXN / mes
                    </p>
                  )}

                  {/* Main price */}
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-4xl font-medium text-foreground leading-none">
                      ${plan.price}
                    </span>
                    <span className="text-[13px] text-foreground-muted font-sans">
                      {plan.price === 0 ? "MXN / mes" : "MXN / mes"}
                    </span>
                  </div>

                  {/* Founder note */}
                  {"founderNote" in plan && plan.founderNote && (
                    <p className="text-[11px] text-foreground-muted font-sans leading-relaxed mt-1.5">
                      {plan.founderNote}
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-border mb-5" />

                {/* Features */}
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-2.5">
                      {feature.included ? (
                        <Check
                          size={14}
                          className="text-foreground mt-0.5 flex-shrink-0"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <Minus
                          size={14}
                          className="text-border mt-0.5 flex-shrink-0"
                          strokeWidth={2}
                        />
                      )}
                      <span
                        className={cn(
                          "text-[13px] font-sans leading-snug",
                          feature.included ? "text-foreground" : "text-foreground-muted/60"
                        )}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  href={plan.ctaHref}
                  variant={plan.ctaVariant}
                  size="md"
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Legal note */}
        <p className="mt-8 text-[12px] text-foreground-muted font-sans leading-relaxed max-w-2xl">
          Los precios de lanzamiento están disponibles por tiempo limitado. Los usuarios que se
          suscriban durante el lanzamiento conservarán su precio mientras mantengan activa su
          suscripción. Si la suscripción se cancela, al volver a contratar aplicará el precio
          vigente en ese momento. Precios en pesos mexicanos (MXN), impuestos no incluidos.
        </p>

      </div>
    </section>
  );
}
