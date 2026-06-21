"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 h-9 rounded-[8px]",
        "text-[13px] text-foreground-muted hover:text-foreground hover:bg-muted",
        "transition-colors duration-150 font-sans cursor-pointer"
      )}
    >
      <LogOut size={15} strokeWidth={1.5} />
      Cerrar sesión
    </button>
  );
}
