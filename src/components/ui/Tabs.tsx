"use client";

import { cn } from "@/lib/utils";

export interface Tab {
  value: string;
  label: string;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  size?: "sm" | "md";
}

export function Tabs({
  tabs,
  value,
  onChange,
  className,
  size = "md",
}: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex items-center gap-0.5 p-1 bg-muted rounded-[10px] w-fit",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={value === tab.value}
          disabled={tab.disabled}
          onClick={() => !tab.disabled && onChange(tab.value)}
          className={cn(
            "relative font-sans font-medium rounded-[8px] transition-all duration-150 ease-out",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "active:scale-[0.97] transition-transform duration-[160ms] ease-out",
            size === "sm" && "px-3 py-1.5 text-[12px]",
            size === "md" && "px-4 py-2 text-[13px]",
            value === tab.value
              ? "bg-card text-foreground shadow-sm"
              : "text-foreground-muted hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
