import { createServerClient } from "@/lib/supabase/server";
import type { StudySession } from "@/types";

export const STUDY_SESSION_FIELDS =
  "id, user_id, title, study_topic, subject, source, level, goal, tools, status, summary, progress, created_at, updated_at, document_id, subject_id";

export async function getStudySessions(
  client?: Awaited<ReturnType<typeof createServerClient>>
): Promise<StudySession[]> {
  const supabase = client ?? (await createServerClient());
  const { data, error } = await supabase
    .from("study_sessions")
    .select(STUDY_SESSION_FIELDS)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as StudySession[];
}

export async function getRecentStudySessions(
  limit = 3,
  client?: Awaited<ReturnType<typeof createServerClient>>
): Promise<StudySession[]> {
  const supabase = client ?? (await createServerClient());
  const { data, error } = await supabase
    .from("study_sessions")
    .select(STUDY_SESSION_FIELDS)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as StudySession[];
}

export async function getStudySessionById(
  id: string,
  client?: Awaited<ReturnType<typeof createServerClient>>
): Promise<StudySession | null> {
  const supabase = client ?? (await createServerClient());
  const { data, error } = await supabase
    .from("study_sessions")
    .select(STUDY_SESSION_FIELDS)
    .eq("id", id)
    .single();
  if (error) return null;
  return data as StudySession;
}

export async function updateStudySession(
  id: string,
  updates: Partial<Pick<StudySession, "title" | "subject" | "progress" | "status" | "summary">>
): Promise<void> {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("study_sessions")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
}
