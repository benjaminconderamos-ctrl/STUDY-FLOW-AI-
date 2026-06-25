import { Clock, BarChart2, Flame, Calendar } from "lucide-react";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/ui/PageShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { createServerClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

type ActivityRow = {
  id: string;
  type: string;
  minutes_spent: number;
  date: string;
  created_at: string;
  session_id: string | null;
  study_sessions: { title: string } | null;
};

type ProgressData = {
  totalMinutes: number;
  todayMinutes: number;
  weekMinutes: number;
  streak: number;
  recentActivities: ActivityRow[];
};

const typeLabels: Record<string, string> = {
  summary: "Resumen",
  flashcards: "Tarjetas",
  quiz: "Quiz",
  tutor: "Tutor",
};

function calcStreak(activities: ActivityRow[]): number {
  const uniqueDates = [...new Set(activities.map((activity) => activity.date))]
    .sort()
    .reverse();
  let count = 0;
  const check = new Date();
  check.setHours(0, 0, 0, 0);

  for (const date of uniqueDates) {
    const activityDate = new Date(`${date}T00:00:00`);
    if (activityDate.toDateString() !== check.toDateString()) break;
    count++;
    check.setDate(check.getDate() - 1);
  }

  return count;
}

async function getProgressData(): Promise<ProgressData> {
  const supabase = await createServerClient();
  const { data: rpcData, error: rpcError } = await supabase.rpc(
    "get_study_progress"
  );

  if (!rpcError && rpcData) {
    return rpcData as ProgressData;
  }

  const { data } = await supabase
    .from("study_activity")
    .select("id, type, minutes_spent, date, created_at, session_id, study_sessions(title)")
    .order("created_at", { ascending: false });

  const activities = (data as unknown as ActivityRow[] | null) ?? [];
  const today = new Date().toISOString().split("T")[0];
  const weekAgoDate = new Date();
  weekAgoDate.setDate(weekAgoDate.getDate() - 7);
  const weekAgo = weekAgoDate.toISOString().split("T")[0];

  return {
    totalMinutes: activities.reduce((sum, activity) => sum + activity.minutes_spent, 0),
    todayMinutes: activities
      .filter((activity) => activity.date === today)
      .reduce((sum, activity) => sum + activity.minutes_spent, 0),
    weekMinutes: activities
      .filter((activity) => activity.date >= weekAgo)
      .reduce((sum, activity) => sum + activity.minutes_spent, 0),
    streak: calcStreak(activities),
    recentActivities: activities.slice(0, 10),
  };
}

export default async function ProgressPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const {
    totalMinutes,
    todayMinutes,
    weekMinutes,
    streak,
    recentActivities,
  } = await getProgressData();

  const progressMetrics = [
    {
      title: "Minutos totales",
      value: String(totalMinutes),
      description: "Tiempo acumulado de estudio",
      icon: Clock,
    },
    {
      title: "Hoy",
      value: String(todayMinutes),
      description: "Minutos estudiados hoy",
      icon: BarChart2,
    },
    {
      title: "Últimos 7 días",
      value: String(weekMinutes),
      description: "Minutos esta semana",
      icon: Calendar,
    },
    {
      title: "Días de racha",
      value: String(streak),
      description: "Días consecutivos estudiando",
      icon: Flame,
    },
  ];

  return (
    <PageShell>
      <PageHeader
        label="Estadísticas"
        title="Tu progreso de estudio"
        subtitle="Tiempo dedicado, tu racha y actividad reciente."
      />

      <section
        aria-label="Métricas de progreso"
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10"
      >
        {progressMetrics.map((metric, index) => (
          <MetricCard
            key={metric.title}
            {...metric}
            animationDelay={`${index * 40}ms`}
          />
        ))}
      </section>

      <section>
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted mb-4 font-sans">
          Actividad reciente
        </p>

        {recentActivities.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="Aún no hay tiempo de estudio"
            description="Abre una sesión y empieza a estudiar — tu tiempo aparecerá aquí."
            action={
              <Button href="/dashboard/sessions/new" size="sm" variant="outline">
                Crear sesión de estudio
              </Button>
            }
          />
        ) : (
          <div className="space-y-2">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between px-4 py-3 bg-card border border-border rounded-[10px]"
              >
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-foreground font-sans truncate">
                    {activity.study_sessions?.title ?? "Sesión eliminada"}
                  </p>
                  <p className="text-[12px] text-foreground-muted font-sans">
                    {typeLabels[activity.type] ?? activity.type} ·{" "}
                    {formatDate(activity.created_at)}
                  </p>
                </div>
                <span className="text-[13px] font-medium text-foreground font-sans flex-shrink-0 ml-4">
                  {activity.minutes_spent} min
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
