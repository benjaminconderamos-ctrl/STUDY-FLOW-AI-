import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <main
      className={cn(
        "flex-1 min-h-0 overflow-y-auto",
        "px-6 py-8 md:px-8 lg:px-10",
        className
      )}
    >
      <div className="max-w-4xl w-full mx-auto">
        {children}
      </div>
    </main>
  );
}
