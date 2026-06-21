"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  compact?: boolean;
}

export function ThemeToggle({ className, compact = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "rounded-[8px]",
          compact ? "w-8 h-8" : "w-full h-9",
          className
        )}
      />
    );
  }

  const isDark = theme === "dark";

  if (compact) {
    return (
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        className={cn(
          "w-8 h-8 flex items-center justify-center rounded-[8px]",
          "text-foreground-muted hover:text-foreground hover:bg-muted",
          "transition-colors duration-150",
          "active:scale-[0.95] transition-transform duration-[160ms] ease-out",
          className
        )}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 h-9 rounded-[8px]",
        "text-[13px] text-foreground-muted hover:text-foreground hover:bg-muted",
        "transition-colors duration-150",
        "active:scale-[0.97] transition-transform duration-[160ms] ease-out",
        className
      )}
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
      <span>{isDark ? "Modo claro" : "Modo oscuro"}</span>
    </button>
  );
}
