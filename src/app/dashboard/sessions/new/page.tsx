import { redirect } from "next/navigation";
import { NewSessionForm } from "@/components/dashboard/NewSessionForm";
import { createServerClient } from "@/lib/supabase/server";

export default async function NewSessionPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, name")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  return <NewSessionForm initialSubjects={subjects ?? []} />;
}
