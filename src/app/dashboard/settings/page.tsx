import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/ui/PageShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LogoutButton } from "@/components/dashboard/LogoutButton";

export default async function SettingsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, plan")
    .eq("id", user.id)
    .single();

  const displayName = profile?.name ?? user.email?.split("@")[0] ?? "Usuario";
  const plan = profile?.plan ?? "free";

  return (
    <PageShell>
      <PageHeader
        label="Configuración"
        title="Ajustes de cuenta"
      />

      <div className="space-y-6 max-w-lg">
        {/* Profile */}
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
              <Button size="sm" variant="ghost" disabled>
                Editar
              </Button>
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-[12px] text-foreground-muted font-sans mb-0.5">
                  Correo electrónico
                </p>
                <p className="text-[14px] text-foreground font-sans">{user.email}</p>
              </div>
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-[12px] text-foreground-muted font-sans mb-0.5">
                  Plan actual
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={plan === "max" ? "premium" : "muted"}>
                    {plan === "free" ? "Gratuito" : plan === "pro" ? "Pro" : "MAX"}
                  </Badge>
                </div>
              </div>
              <Button size="sm" variant="ghost" disabled>
                Próximamente
              </Button>
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section>
          <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted mb-3 font-sans">
            Apariencia
          </p>
          <div className="bg-card border border-border rounded-[14px] px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-foreground font-sans">
                Tema
              </p>
              <p className="text-[12px] text-foreground-muted font-sans mt-0.5">
                Cambia entre modo claro y oscuro.
              </p>
            </div>
            <ThemeToggle compact />
          </div>
        </section>

        {/* Account */}
        <section>
          <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted mb-3 font-sans">
            Cuenta
          </p>
          <div className="bg-card border border-border rounded-[14px] px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-foreground font-sans">
                Cerrar sesión
              </p>
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
