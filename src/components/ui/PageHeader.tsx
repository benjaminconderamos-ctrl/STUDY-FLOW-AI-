import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PageHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({
  label,
  title,
  subtitle,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-8 flex-wrap", className)}>
      <div>
        {label && (
          <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted mb-2 font-sans">
            {label}
          </p>
        )}
        <h1 className="text-3xl font-serif font-medium text-foreground leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-[15px] text-foreground-muted leading-relaxed max-w-xl">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0 pt-1">{action}</div>
      )}
    </div>
  );
}
