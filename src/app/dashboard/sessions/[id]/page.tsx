import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getStudySessionById } from "@/lib/db/study-sessions";
import { SessionDetail } from "@/components/dashboard/SessionDetail";
import { redirect } from "next/navigation";

interface SessionPageProps {
  params: Promise<{ id: string }>;
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { id } = await params;

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const session = await getStudySessionById(id, supabase);
  if (!session) notFound();

  return <SessionDetail session={session} />;
}
