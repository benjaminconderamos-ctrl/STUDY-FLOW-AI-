import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon?: LucideIcon;
  className?: string;
  animationDelay?: string;
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  className,
  animationDelay,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-[14px] p-5",
        "animate-fade-in",
        className
      )}
      style={animationDelay ? { animationDelay } : undefined}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted font-sans">
          {title}
        </p>
        {Icon && (
          <Icon size={14} className="text-foreground-muted" strokeWidth={1.5} />
        )}
      </div>
      <p className="font-serif text-3xl font-medium text-foreground leading-none mb-1.5">
        {value}
      </p>
      <p className="text-[12px] text-foreground-muted font-sans">{description}</p>
    </div>
  );
}
