"use client";

import { useState, useEffect, useMemo } from "react";
import { Clock, BarChart2, Flame, Calendar } from "lucide-react";
import { PageShell } from "@/components/ui/PageShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { createClient } from "@/lib/supabase/client";
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

const typeLabels: Record<string, string> = {
  summary: "Resumen",
  flashcards: "Tarjetas",
  quiz: "Quiz",
  tutor: "Tutor",
};

function calcStreak(activities: ActivityRow[]): number {
  const uniqueDates = [...new Set(activities.map((a) => a.date))].sort().reverse();
  let count = 0;
  const check = new Date();
  check.setHours(0, 0, 0, 0);
  for (const date of uniqueDates) {
    const d = new Date(date + "T00:00:00");
    if (d.toDateString() === check.toDateString()) {
      count++;
      check.setDate(check.getDate() - 1);
    } else {
      break;
    }
  }
  return count;
}

export default function ProgressPage() {
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("study_activity")
      .select("id, type, minutes_spent, date, created_at, session_id, study_sessions(title)")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setActivities((data as unknown as ActivityRow[]) ?? []);
        setIsLoading(false);
      });
  }, []);

  const { totalMinutes, todayMinutes, weekMinutes, streak } = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const weekAgo = new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split("T")[0];
    return {
      totalMinutes: activities.reduce((s, a) => s + a.minutes_spent, 0),
      todayMinutes: activities.filter((a) => a.date === today).reduce((s, a) => s + a.minutes_spent, 0),
      weekMinutes: activities.filter((a) => a.date >= weekAgo).reduce((s, a) => s + a.minutes_spent, 0),
      streak: calcStreak(activities),
    };
  }, [activities]);

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

  const recentActivities = activities.slice(0, 10);

  return (
    <PageShell>
      <PageHeader
        label="Estadísticas"
        title="Tu progreso de estudio"
        subtitle="Tiempo dedicado, tu racha y actividad reciente."
      />

      {/* Metrics */}
      <section
        aria-label="Métricas de progreso"
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10"
      >
        {progressMetrics.map((m, i) => (
          <MetricCard key={m.title} {...m} animationDelay={`${i * 40}ms`} />
        ))}
      </section>

      {/* Recent activity */}
      <section>
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted mb-4 font-sans">
          Actividad reciente
        </p>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-muted rounded-[10px] animate-pulse" />
            ))}
          </div>
        ) : recentActivities.length === 0 ? (
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
