import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/ui/PageShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { BillingButton } from "@/components/dashboard/BillingButton";

export default async function SettingsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: sub }] = await Promise.all([
    supabase
      .from("profiles")
      .select("name, plan")
      .eq("id", user.id)
      .single(),
    supabase
      .from("subscriptions")
      .select("status, current_period_end, stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  const displayName = profile?.name ?? user.email?.split("@")[0] ?? "Usuario";
  const plan = profile?.plan ?? "free";
  const hasPaidPlan = plan === "pro" || plan === "max";

  const planLabel = plan === "free" ? "Gratuito" : plan === "pro" ? "Pro" : "MAX";

  const periodEnd = sub?.current_period_end
    ? new Date(sub.current_period_end).toLocaleDateString("es-MX", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  return (
    <PageShell>
      <PageHeader label="Configuración" title="Ajustes de cuenta" />

      <div className="space-y-6 max-w-lg">

        {/* Perfil */}
        <section>
          <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted mb-3 font-sans">
            Perfil
          </p>
          <div className="bg-card border border-border rounded-[14px] divide-y divide-border">
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-[12px] text-foreground-muted font-sans mb-0.5">Nombre</p>
                <p className="text-[14px] text-foreground font-sans">{displayName}</p>
              </div>
              <Button size="sm" variant="ghost" disabled>Editar</Button>
            </div>
            <div className="px-5 py-4">
              <p className="text-[12px] text-foreground-muted font-sans mb-0.5">Correo electrónico</p>
              <p className="text-[14px] text-foreground font-sans">{user.email}</p>
            </div>
          </div>
        </section>

        {/* Suscripción */}
        <section>
          <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted mb-3 font-sans">
            Suscripción
          </p>
          <div className="bg-card border border-border rounded-[14px] divide-y divide-border">
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-[12px] text-foreground-muted font-sans mb-1">Plan actual</p>
                <Badge variant={plan === "max" ? "premium" : "muted"}>{planLabel}</Badge>
                {periodEnd && (
                  <p className="text-[11px] text-foreground-muted font-sans mt-1.5">
                    {sub?.status === "canceled" ? "Activo hasta" : "Próximo cobro"}: {periodEnd}
                  </p>
                )}
              </div>
              {hasPaidPlan ? (
                <BillingButton />
              ) : (
                <Button size="sm" href="/dashboard/upgrade?plan=pro">
                  Mejorar plan
                </Button>
              )}
            </div>

            {!hasPaidPlan && (
              <div className="px-5 py-4">
                <p className="text-[13px] font-sans font-medium text-foreground mb-3">
                  Planes disponibles
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" href="/dashboard/upgrade?plan=pro">
                    Pro — $99 MXN/mes
                  </Button>
                  <Button size="sm" variant="outline" href="/dashboard/upgrade?plan=max">
                    Max — $199 MXN/mes
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Apariencia */}
        <section>
          <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted mb-3 font-sans">
            Apariencia
          </p>
          <div className="bg-card border border-border rounded-[14px] px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-foreground font-sans">Tema</p>
              <p className="text-[12px] text-foreground-muted font-sans mt-0.5">
                Cambia entre modo claro y oscuro.
              </p>
            </div>
            <ThemeToggle compact />
          </div>
        </section>

        {/* Cuenta */}
        <section>
          <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted mb-3 font-sans">
            Cuenta
          </p>
          <div className="bg-card border border-border rounded-[14px] px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-foreground font-sans">Cerrar sesión</p>
              <p className="text-[12px] text-foreground-muted font-sans mt-0.5">
                Salir de tu cuenta en este dispositivo.
              </p>
            </div>
            <LogoutButton />
          </div>
        </section>

      </div>
    </PageShell>
  );
}
