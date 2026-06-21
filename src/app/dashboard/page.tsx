import Link from "next/link";
import {
  BookOpen,
  Sparkles,
  Brain,
  Plus,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getRecentStudySessions } from "@/lib/db/study-sessions";
import { PageShell } from "@/components/ui/PageShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { StudySessionCard } from "@/components/dashboard/StudySessionCard";
import type { StudySession } from "@/types";

const quickActions = [
  {
    icon: BookOpen,
    title: "Nueva sesión",
    description: "Crea una sesión de estudio a partir de un tema",
    href: "/dashboard/sessions/new",
  },
  {
    icon: Sparkles,
    title: "Genera un resumen",
    description: "Escribe un tema y obtén un resumen con IA",
    href: "/dashboard/sessions/new",
  },
];

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let recentSessions: StudySession[] = [];
  let totalSessions = 0;
  try {
    recentSessions = await getRecentStudySessions(3);
    const { count } = await supabase
      .from("study_sessions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);
    totalSessions = count ?? 0;
  } catch {
    recentSessions = [];
  }

  const metrics = [
    {
      title: "Sesiones",
      value: String(totalSessions),
      description: totalSessions === 1 ? "sesión de estudio" : "sesiones de estudio",
      icon: BookOpen,
    },
  ];

  return (
    <PageShell>
      <PageHeader
        label="Espacio de trabajo"
        title="Qué bueno verte."
        subtitle="Retoma donde lo dejaste o empieza algo nuevo."
        action={
          <Button href="/dashboard/sessions/new" size="sm" variant="outline">
            <Plus size={14} strokeWidth={1.5} />
            Nueva sesión
          </Button>
        }
      />

      {/* Metrics */}
      <section aria-label="Métricas" className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 max-w-xs">
        {metrics.map((m, i) => (
          <MetricCard
            key={m.title}
            {...m}
            animationDelay={`${i * 40}ms`}
          />
        ))}
      </section>

      {/* Quick actions */}
      <section className="mb-10">
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted mb-4 font-sans">
          Acciones rápidas
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map((action, i) => (
            <QuickActionCard
              key={action.title}
              {...action}
              animationDelay={`${(i + 4) * 40}ms`}
            />
          ))}
        </div>
      </section>

      {/* Featured tool */}
      <section className="mb-10">
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted mb-4 font-sans">
          Herramientas PRO / MAX
        </p>
        <Link
          href="/dashboard/tools/math-solver"
          className="bg-card border border-border rounded-[14px] p-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between
                     hover:border-foreground/20 transition-colors duration-200 group block"
        >
          <div className="flex items-start gap-4 min-w-0">
            <div className="flex-shrink-0 w-9 h-9 rounded-[10px] bg-muted flex items-center justify-center">
              <Brain size={16} className="text-foreground-muted" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="text-[15px] font-serif font-medium text-foreground">
                  Resolvedor de matemáticas
                </p>
                <Badge variant="premium">PRO / MAX</Badge>
              </div>
              <p className="text-[13px] text-foreground-muted font-sans leading-relaxed mb-3">
                Soluciones paso a paso y gráficas generadas automáticamente para
                álgebra, cálculo, estadística y más.
              </p>
              <div className="flex gap-2 flex-wrap">
                {["Álgebra", "Cálculo", "Estadística"].map((tag) => (
                  <Badge key={tag} variant="muted">{tag}</Badge>
                ))}
              </div>
            </div>
          </div>
          <Button size="sm" variant="outline" tabIndex={-1} className="flex-shrink-0 self-start sm:mt-0.5">
            Abrir
          </Button>
        </Link>
      </section>

      {/* Recent sessions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted font-sans">
            Sesiones recientes
          </p>
          {recentSessions.length > 0 && (
            <Button href="/dashboard/sessions" size="sm" variant="ghost">
              Ver todas
            </Button>
          )}
        </div>
        {recentSessions.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Aún no has creado sesiones."
            description="Crea tu primera sesión de estudio a partir de un tema o PDF."
            action={
              <Button href="/dashboard/sessions/new" size="sm" variant="outline">
                Crear primera sesión
              </Button>
            }
            compact
          />
        ) : (
          <div className="space-y-3">
            {recentSessions.map((session, i) => (
              <StudySessionCard
                key={session.id}
                session={session}
                animationDelay={`${i * 50}ms`}
              />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
