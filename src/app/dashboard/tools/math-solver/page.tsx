import { redirect } from "next/navigation";
import { MathSolverWorkspace } from "@/components/dashboard/MathSolverWorkspace";
import { createServerClient } from "@/lib/supabase/server";
import type { MathSolverRequest } from "@/types";

export default async function MathSolverPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data } = await supabase
    .from("math_solver_requests")
    .select("id, user_id, problem, category, level, final_answer, solution, graph_data, status, created_at")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <MathSolverWorkspace
      initialHistory={(data as unknown as MathSolverRequest[] | null) ?? []}
    />
  );
}
