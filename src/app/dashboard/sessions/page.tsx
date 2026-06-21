import { BookOpen, Plus } from "lucide-react";
import { createServerClient } from "@/lib/supabase/server";
import { getStudySessions } from "@/lib/db/study-sessions";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/ui/PageShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { SessionsList } from "@/components/dashboard/SessionsList";
import type { StudySession } from "@/types";

export default async function SessionsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let sessions: StudySession[] = [];
  try {
    sessions = await getStudySessions();
  } catch {
    sessions = [];
  }

  return (
    <PageShell>
      <PageHeader
        label="Sesiones"
        title="Tus sesiones de estudio"
        subtitle="Organiza tus temas, documentos y repasos en un solo lugar."
        action={
          <Button href="/dashboard/sessions/new" size="sm">
            <Plus size={14} strokeWidth={2} />
            Nueva sesión
          </Button>
        }
      />

      {sessions.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Aún no tienes sesiones"
          description="Crea tu primera sesión a partir de un tema."
          action={
            <Button href="/dashboard/sessions/new" size="sm">
              Crear sesión
            </Button>
          }
        />
      ) : (
        <SessionsList initial={sessions} />
      )}
    </PageShell>
  );
}
