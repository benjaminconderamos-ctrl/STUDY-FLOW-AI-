import { redirect, notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { BookOpen, Plus } from "lucide-react";
import { PageShell } from "@/components/ui/PageShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { SessionsList } from "@/components/dashboard/SessionsList";
import { STUDY_SESSION_FIELDS } from "@/lib/db/study-sessions";
import type { StudySession } from "@/types";

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: subject } = await supabase
    .from("subjects")
    .select("id, name")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!subject) notFound();

  const { data: sessions } = await supabase
    .from("study_sessions")
    .select(STUDY_SESSION_FIELDS)
    .eq("subject_id", id)
    .order("created_at", { ascending: false });

  const list = (sessions ?? []) as StudySession[];

  return (
    <PageShell>
      <PageHeader
        label="Materia"
        title={subject.name}
        subtitle={
          list.length > 0
            ? `${list.length} sesión${list.length !== 1 ? "es" : ""} en esta materia`
            : "Aún no hay sesiones en esta materia"
        }
        action={
          <Button href="/dashboard/sessions/new" size="sm">
            <Plus size={14} strokeWidth={2} />
            Nueva sesión
          </Button>
        }
      />

      {list.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Sin sesiones aún"
          description="Crea una sesión y asígnala a esta materia para que aparezca aquí."
          action={
            <Button href="/dashboard/sessions/new" size="sm">
              Crear sesión
            </Button>
          }
        />
      ) : (
        <SessionsList initial={list} />
      )}
    </PageShell>
  );
}
