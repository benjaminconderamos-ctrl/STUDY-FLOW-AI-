import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { Logo } from "@/components/ui/Logo";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, plan")
    .eq("id", user.id)
    .single();

  const displayName = profile?.name ?? user.email?.split("@")[0] ?? "Usuario";
  const plan = (profile?.plan ?? "free") as "free" | "pro" | "max";
  const email = user.email ?? "";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:block flex-shrink-0">
        <AppSidebar displayName={displayName} email={email} plan={plan} />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex items-center gap-3 px-4 h-14 border-b border-border bg-background flex-shrink-0">
          <MobileNav displayName={displayName} email={email} plan={plan} />
          <Logo size={26} />
          <span className="text-[15px] font-serif font-medium text-foreground">
            StudyFlow AI
          </span>
        </header>

        {/* Page content */}
        {children}
      </div>
    </div>
  );
}
