"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Library,
  BookOpen,
  BarChart2,
  Settings,
  Calculator,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { Badge } from "@/components/ui/Badge";
import { Logo } from "@/components/ui/Logo";
import { SubjectsSidebar } from "@/components/dashboard/SubjectsSidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Panel", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/library", label: "Biblioteca", icon: Library },
  { href: "/dashboard/sessions", label: "Sesiones", icon: BookOpen },
  { href: "/dashboard/progress", label: "Progreso", icon: BarChart2 },
  { href: "/dashboard/settings", label: "Ajustes", icon: Settings },
];

const mathTools = [
  { href: "/dashboard/tools/math-solver", label: "Resolvedor", icon: Calculator },
];

interface AppSidebarProps {
  displayName: string;
  email: string;
  plan: "free" | "pro" | "max";
  subjects: { id: string; name: string }[];
  onClose?: () => void;
}

export function AppSidebar({ displayName, email, plan, subjects, onClose }: AppSidebarProps) {
  const pathname = usePathname();

  function isActive(item: (typeof navItems)[0]) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  return (
    <div className="h-full flex flex-col bg-sidebar border-r border-border w-60">
      {/* Logo */}
      <div className="px-5 h-14 flex items-center border-b border-border flex-shrink-0">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-150"
        >
          <Logo size={28} />
          <span className="text-[15px] font-serif font-medium text-foreground tracking-tight">
            StudyFlow AI
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Navegación principal">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-2.5 px-3 h-9 rounded-[8px] text-[13px] font-sans font-medium",
                  "transition-colors duration-150",
                  active
                    ? "bg-muted text-foreground border-l-2 border-l-foreground pl-[10px]"
                    : "text-foreground-muted hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon
                  size={15}
                  strokeWidth={active ? 2 : 1.5}
                  className={active ? "text-foreground" : "text-foreground-muted"}
                />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Sección Matemáticas */}
        <div className="mt-5">
          <div className="flex items-center gap-2 px-3 mb-1">
            <p className="text-[10px] font-semibold tracking-[0.08em] uppercase text-foreground-muted font-sans flex-1">
              Matemáticas
            </p>
            <Badge variant="premium" className="text-[9px] px-1.5 py-0">PRO</Badge>
          </div>
          <div className="space-y-0.5">
            {mathTools.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-2.5 px-3 h-9 rounded-[8px] text-[13px] font-sans font-medium",
                    "transition-colors duration-150",
                    active
                      ? "bg-muted text-foreground border-l-2 border-l-foreground pl-[10px]"
                      : "text-foreground-muted hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon
                    size={15}
                    strokeWidth={active ? 2 : 1.5}
                    className={active ? "text-foreground" : "text-foreground-muted"}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Materias */}
      <SubjectsSidebar initialSubjects={subjects} onClose={onClose} />

      {/* User block + bottom actions */}
      <div className="px-3 pb-4 border-t border-border pt-3 flex-shrink-0 space-y-0.5">
        <div className="px-3 py-2.5 mb-1">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-[13px] font-medium text-foreground font-sans truncate flex-1">
              {displayName}
            </p>
            <Badge variant={plan === "max" ? "premium" : "muted"} className="flex-shrink-0 text-[10px]">
              {plan === "free" ? "Free" : plan === "pro" ? "Pro" : "MAX"}
            </Badge>
          </div>
          <p className="text-[11px] text-foreground-muted font-sans truncate">{email}</p>
        </div>
        <ThemeToggle />
        <LogoutButton />
      </div>
    </div>
  );
}
