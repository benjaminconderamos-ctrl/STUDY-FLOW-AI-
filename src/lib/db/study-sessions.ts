import { createServerClient } from "@/lib/supabase/server";
import type { StudySession } from "@/types";

export async function getStudySessions(): Promise<StudySession[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("study_sessions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as StudySession[];
}

export async function getRecentStudySessions(limit = 3): Promise<StudySession[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("study_sessions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as StudySession[];
}

export async function getStudySessionById(id: string): Promise<StudySession | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("study_sessions")
    .select("*")
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
