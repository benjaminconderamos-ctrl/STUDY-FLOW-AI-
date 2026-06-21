"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, X, BookMarked } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface Subject {
  id: string;
  name: string;
}

export function SubjectsSidebar({ onClose }: { onClose?: () => void }) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [adding, setAdding] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [sidebarError, setSidebarError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("subjects")
        .select("id, name")
        .order("created_at", { ascending: true });
      if (data) setSubjects(data);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);

  async function handleAdd() {
    const name = inputValue.trim();
    if (!name) { setAdding(false); setInputValue(""); return; }
    if (name.length > 100) {
      setSidebarError("El nombre no puede exceder 100 caracteres.");
      setAdding(false);
      setInputValue("");
      return;
    }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }
    const { data, error } = await supabase
      .from("subjects")
      .insert({ name, user_id: user.id })
      .select("id, name")
      .single();
    if (error || !data) {
      setSidebarError("Error al crear la materia. Intenta de nuevo.");
    } else {
      setSubjects((prev) => [...prev, data]);
      setSidebarError("");
    }
    setInputValue("");
    setAdding(false);
    setSaving(false);
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    const prev = subjects;
    setSubjects((s) => s.filter((x) => x.id !== id));
    const { error } = await supabase.from("subjects").delete().eq("id", id);
    if (error) {
      setSubjects(prev);
      setSidebarError("Error al eliminar la materia. Intenta de nuevo.");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleAdd();
    if (e.key === "Escape") { setAdding(false); setInputValue(""); }
  }

  return (
    <div className="px-3 py-3 border-t border-border">
      <div className="flex items-center justify-between px-3 mb-1.5">
        <span className="text-[10px] font-semibold tracking-[0.1em] uppercase text-foreground-muted font-sans">
          Materias
        </span>
        <button
          onClick={() => { setAdding(true); setSidebarError(""); }}
          className="w-4 h-4 flex items-center justify-center text-foreground-muted hover:text-foreground transition-colors duration-150"
          aria-label="Agregar materia"
        >
          <Plus size={13} strokeWidth={2} />
        </button>
      </div>

      <div className="space-y-0.5">
        {subjects.map((s) => {
          const active = pathname === `/dashboard/subjects/${s.id}`;
          return (
            <Link
              key={s.id}
              href={`/dashboard/subjects/${s.id}`}
              onClick={onClose}
              className={cn(
                "group flex items-center gap-2 px-3 h-9 rounded-[8px] text-[13px] font-sans font-medium",
                "transition-colors duration-150",
                active
                  ? "bg-muted text-foreground border-l-2 border-l-foreground pl-[10px]"
                  : "text-foreground-muted hover:bg-muted hover:text-foreground"
              )}
            >
              <BookMarked
                size={13}
                strokeWidth={active ? 2 : 1.5}
                className={cn("flex-shrink-0", active ? "text-foreground" : "text-foreground-muted")}
              />
              <span className="flex-1 truncate">{s.name}</span>
              <button
                onClick={(e) => handleDelete(e, s.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-100 text-foreground-muted hover:text-foreground flex-shrink-0"
                aria-label={`Eliminar ${s.name}`}
              >
                <X size={12} strokeWidth={2} />
              </button>
            </Link>
          );
        })}

        {subjects.length === 0 && !adding && (
          <p className="px-3 text-[12px] text-foreground-muted font-sans py-1">
            Sin materias aún
          </p>
        )}

        {adding && (
          <div className="flex items-center gap-2 px-3 h-9">
            <BookMarked size={13} strokeWidth={1.5} className="text-foreground-muted flex-shrink-0" />
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleAdd}
              placeholder="Nombre de materia"
              disabled={saving}
              maxLength={100}
              className={cn(
                "flex-1 bg-transparent text-[13px] font-sans text-foreground placeholder:text-foreground-muted",
                "outline-none border-b border-border focus:border-foreground transition-colors duration-150"
              )}
            />
          </div>
        )}

        {sidebarError && (
          <p className="px-3 text-[11px] text-red-500 font-sans py-1">
            {sidebarError}
          </p>
        )}
      </div>
    </div>
  );
}
