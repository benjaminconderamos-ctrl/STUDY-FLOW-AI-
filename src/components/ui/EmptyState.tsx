import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        "border border-dashed border-border rounded-[14px]",
        compact ? "py-10 px-6" : "py-16 px-8",
        className
      )}
    >
      {Icon && (
        <div className="mb-4 p-3 rounded-full bg-muted">
          <Icon size={20} className="text-foreground-muted" strokeWidth={1.5} />
        </div>
      )}
      <p className="text-[15px] font-medium text-foreground">{title}</p>
      {description && (
        <p className="mt-1.5 text-[13px] text-foreground-muted leading-relaxed max-w-xs">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
