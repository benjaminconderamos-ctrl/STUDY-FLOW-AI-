"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Trash2, X, Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { StudySession } from "@/types";

const toolLabels: Record<string, string> = {
  summary: "Resumen",
  flashcards: "Tarjetas",
  quiz: "Quiz",
  tutor: "Tutor",
  mindmap: "Mapa conceptual",
};

interface StudySessionCardProps {
  session: StudySession;
  className?: string;
  animationDelay?: string;
  onDelete?: (id: string) => void;
}

export function StudySessionCard({
  session,
  className,
  animationDelay,
  onDelete,
}: StudySessionCardProps) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirming) { setConfirming(true); return; }
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("study_sessions").delete().eq("id", session.id);
    setTimeout(() => onDelete?.(session.id), 260);
  }

  function handleCancel(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setConfirming(false);
  }

  return (
    <div
      className={cn(
        "relative animate-fade-in",
        deleting && "animate-slide-out",
        className
      )}
      style={animationDelay ? { animationDelay } : undefined}
    >
      <Link
        href={`/dashboard/sessions/${session.id}`}
        className={cn(
          "group flex items-start justify-between gap-4 p-5 rounded-[14px]",
          "bg-card border border-border",
          "hover:border-foreground-muted transition-all duration-200 ease-out",
          "hover:-translate-y-0.5 hover:shadow-sm",
          confirming && "border-foreground-muted"
        )}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-2">
            <p className="text-[15px] font-serif font-medium text-foreground leading-snug flex-1">
              {session.title}
            </p>
          </div>
          {session.subject && (
            <Badge variant="muted" className="mb-3">
              {session.subject}
            </Badge>
          )}

          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-foreground-muted font-sans">Progreso</span>
              <span className="text-[11px] font-medium text-foreground font-sans">
                {session.progress}%
              </span>
            </div>
            <div className="h-1 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-foreground transition-all duration-500"
                style={{ width: `${session.progress}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {session.tools.map((tool) => (
              <Badge key={tool} variant="default">
                {toolLabels[tool]}
              </Badge>
            ))}
          </div>
        </div>

        {/* Right side: delete actions or arrow */}
        <div className="flex-shrink-0 flex items-center gap-1.5 pt-1">
          {confirming ? (
            <div className="flex items-center gap-1 animate-pop-in">
              <span className="text-[12px] text-foreground-muted font-sans mr-1">¿Eliminar?</span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center justify-center w-7 h-7 rounded-[6px] bg-foreground text-background hover:opacity-80 transition-opacity duration-150 disabled:opacity-50"
                aria-label="Confirmar eliminación"
              >
                <Check size={12} strokeWidth={2.5} />
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center justify-center w-7 h-7 rounded-[6px] border border-border text-foreground-muted hover:text-foreground hover:border-foreground-muted transition-colors duration-150"
                aria-label="Cancelar"
              >
                <X size={12} strokeWidth={2} />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={handleDelete}
                className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-7 h-7 rounded-[6px] text-foreground-muted hover:text-foreground hover:bg-muted transition-all duration-150"
                aria-label="Eliminar sesión"
              >
                <Trash2 size={13} strokeWidth={1.5} />
              </button>
              <ArrowRight
                size={15}
                className="text-foreground-muted transition-transform duration-150 ease-out group-hover:translate-x-0.5"
                strokeWidth={1.5}
              />
            </>
          )}
        </div>
      </Link>
    </div>
  );
}
