import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "muted" | "premium" | "outline";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium leading-none font-sans tracking-wide",
        variant === "default" && "bg-muted text-foreground-muted",
        variant === "muted" && "bg-transparent border border-border text-foreground-muted",
        variant === "premium" && [
          "bg-[var(--foreground)] text-[var(--background)]",
          "font-semibold tracking-wider",
        ],
        variant === "outline" && "border border-border text-foreground-muted bg-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}
