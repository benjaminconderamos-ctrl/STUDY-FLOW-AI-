"use client";

import { useState } from "react";
import { Check, Minus, Tag, X } from "lucide-react";
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
    founderNote: "Precio de lanzamiento por 6 meses. Después aplica el precio regular.",
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
    founderNote: "Precio de lanzamiento por 6 meses. Después aplica el precio regular.",
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

type CouponState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "valid"; code: string; discountText: string }
  | { status: "error"; message: string };

export function PricingSection() {
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<CouponState>({ status: "idle" });

  async function handleApplyCoupon() {
    const code = couponInput.trim();
    if (!code) return;

    setCoupon({ status: "loading" });

    const res = await fetch(`/api/stripe/validate-coupon?code=${encodeURIComponent(code)}`);
    const data = await res.json();

    if (data.valid) {
      setCoupon({ status: "valid", code: data.code, discountText: data.discountText });
    } else {
      setCoupon({ status: "error", message: data.error ?? "Cupón inválido" });
    }
  }

  function handleClearCoupon() {
    setCoupon({ status: "idle" });
    setCouponInput("");
  }

  function planHref(baseHref: string) {
    if (coupon.status === "valid") {
      return `${baseHref}&coupon=${encodeURIComponent(coupon.code)}`;
    }
    return baseHref;
  }

  return (
    <section id="precios" className="px-4 sm:px-6 py-16 md:py-20 border-t border-border">
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
        <div className="mb-4 flex items-start gap-2.5 px-4 py-2.5 rounded-[12px] border border-border bg-muted/60 max-w-full">
          <span
            className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5"
            aria-hidden="true"
          />
          <p className="text-[13px] font-sans">
            <span className="font-medium text-foreground">Oferta de lanzamiento</span>
            <span className="text-foreground-muted">
              {" "}— Paga $99 o $199 MXN / mes durante 6 meses. Después aplica el precio regular.
            </span>
          </p>
        </div>

        {/* Coupon section */}
        <div className="mb-8">
          {coupon.status === "valid" ? (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] border border-green-200 bg-green-50 dark:border-green-800/40 dark:bg-green-950/20 max-w-md">
              <Tag size={13} className="text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-[13px] font-sans text-green-700 dark:text-green-400 flex-1">
                <span className="font-medium">{coupon.code}</span>
                {" "}— {coupon.discountText} aplicado
              </p>
              <button
                onClick={handleClearCoupon}
                className="text-green-500 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                aria-label="Quitar cupón"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-start gap-2 max-w-md">
              <div className="flex-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      if (coupon.status === "error") setCoupon({ status: "idle" });
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    placeholder="¿Tienes un cupón?"
                    className={cn(
                      "flex-1 h-9 px-3 rounded-[10px] border text-[13px] font-sans bg-background text-foreground placeholder:text-foreground-muted/60 outline-none transition-colors",
                      coupon.status === "error"
                        ? "border-red-300 dark:border-red-700 focus:border-red-400"
                        : "border-border focus:border-foreground/40"
                    )}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={!couponInput.trim() || coupon.status === "loading"}
                    className="h-9 px-3.5 rounded-[10px] border border-border bg-muted text-[12px] font-medium font-sans text-foreground hover:bg-muted/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {coupon.status === "loading" ? "..." : "Aplicar"}
                  </button>
                </div>
                {coupon.status === "error" && (
                  <p className="mt-1.5 text-[11px] text-red-500 font-sans">{coupon.message}</p>
                )}
              </div>
            </div>
          )}
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
                      MXN / mes
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
                  href={planHref(plan.ctaHref)}
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
          Los precios de lanzamiento ($99 y $199 MXN / mes) aplican durante los primeros 6 meses
          a partir de la fecha de suscripción. Al término de ese período, la suscripción continuará
          al precio regular vigente. Precios en pesos mexicanos (MXN), impuestos no incluidos.
        </p>

      </div>
    </section>
  );
}
