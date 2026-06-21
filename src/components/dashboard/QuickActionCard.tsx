import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  className?: string;
  animationDelay?: string;
}

export function QuickActionCard({
  icon: Icon,
  title,
  description,
  href,
  className,
  animationDelay,
}: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-start justify-between gap-4 p-5 rounded-[14px]",
        "bg-card border border-border",
        "hover:border-foreground-muted transition-all duration-200 ease-out",
        "hover:-translate-y-0.5",
        "animate-fade-in",
        className
      )}
      style={animationDelay ? { animationDelay } : undefined}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-[8px] bg-muted flex items-center justify-center">
          <Icon size={14} className="text-foreground-muted" strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <p className="text-[14px] font-medium text-foreground font-sans leading-snug">
            {title}
          </p>
          <p className="mt-0.5 text-[12px] text-foreground-muted font-sans leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <ArrowRight
        size={15}
        className="flex-shrink-0 text-foreground-muted mt-0.5 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
        strokeWidth={1.5}
      />
    </Link>
  );
}
