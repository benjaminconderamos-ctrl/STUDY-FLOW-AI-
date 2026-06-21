"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/ui/PageShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { BookMarked, FileText, Plus, Upload, X } from "lucide-react";

type GoalType = "understand" | "exam" | "memorize" | "review";
type LevelType = "basic" | "intermediate" | "advanced";
type ModeType = "topic" | "pdf";

interface Subject {
  id: string;
  name: string;
}

const goals: { value: GoalType; label: string }[] = [
  { value: "understand", label: "Entender rápido" },
  { value: "exam", label: "Prepararme para examen" },
  { value: "memorize", label: "Memorizar conceptos" },
  { value: "review", label: "Repasar apuntes" },
];

const levels: { value: LevelType; label: string }[] = [
  { value: "basic", label: "Básico" },
  { value: "intermediate", label: "Intermedio" },
  { value: "advanced", label: "Avanzado" },
];

export default function NewSessionPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<ModeType>("topic");
  const [topic, setTopic] = useState("");
  const [goal, setGoal] = useState<GoalType>("understand");
  const [level, setLevel] = useState<LevelType>("intermediate");
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [addingSubject, setAddingSubject] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // PDF state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function loadSubjects() {
      const { data } = await supabase
        .from("subjects")
        .select("id, name")
        .order("created_at", { ascending: true });
      if (data) setSubjects(data);
    }
    loadSubjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreateSubject() {
    const name = newSubjectName.trim();
    if (!name) { setAddingSubject(false); return; }
    if (name.length > 100) {
      setError("El nombre de la materia no puede exceder 100 caracteres.");
      setAddingSubject(false);
      setNewSubjectName("");
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error: insertError } = await supabase
      .from("subjects")
      .insert({ name, user_id: user.id })
      .select("id, name")
      .single();
    if (insertError || !data) {
      setError("Error al crear la materia. Intenta de nuevo.");
      setAddingSubject(false);
      setNewSubjectName("");
      return;
    }
    setSubjects((prev) => [...prev, data]);
    setSubjectId(data.id);
    setNewSubjectName("");
    setAddingSubject(false);
  }

  function handleFileSelect(file: File) {
    if (file.type !== "application/pdf") {
      setError("Solo se aceptan archivos PDF.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("El archivo no puede superar 20 MB.");
      return;
    }
    setError("");
    setSelectedFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "pdf") {
      await handleCreateFromPdf();
    } else {
      await handleCreateFromTopic();
    }
  }

  async function handleCreateFromTopic() {
    const trimmedTopic = topic.trim();
    if (!trimmedTopic) { setLoading(false); return; }
    if (trimmedTopic.length > 300) {
      setError("El título no puede exceder 300 caracteres.");
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const selectedSubject = subjects.find((s) => s.id === subjectId);

    const { data: session, error: dbError } = await supabase
      .from("study_sessions")
      .insert({
        user_id: user.id,
        title: trimmedTopic,
        subject: selectedSubject?.name ?? null,
        subject_id: subjectId ?? null,
        source: "topic",
        goal,
        level,
        tools: ["summary"],
      })
      .select("id")
      .single();

    if (dbError || !session) {
      setError("Error al crear la sesión. Intenta de nuevo.");
      setLoading(false);
      return;
    }

    router.push(`/dashboard/sessions/${session.id}`);
  }

  async function handleCreateFromPdf() {
    if (!selectedFile) {
      setError("Selecciona un archivo PDF.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("goal", goal);
    formData.append("level", level);
    if (subjectId) formData.append("subjectId", subjectId);

    try {
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error?.message ?? "Error al procesar el PDF. Intenta de nuevo.");
        setLoading(false);
        return;
      }

      router.push(`/dashboard/sessions/${json.sessionId}`);
    } catch {
      setError("Error de red. Intenta de nuevo.");
      setLoading(false);
    }
  }

  const canSubmit =
    !loading &&
    (mode === "topic" ? topic.trim().length > 0 : selectedFile !== null);

  return (
    <PageShell>
      <PageHeader
        label="Nueva sesión"
        title="¿Qué quieres estudiar hoy?"
        subtitle={
          mode === "topic"
            ? "Escribe un tema para crear una sesión de estudio con resumen generado con IA."
            : "Sube un PDF y la IA generará un resumen basado en su contenido."
        }
      />

      {/* Mode toggle */}
      <div className="max-w-2xl mb-4">
        <div className="inline-flex rounded-[10px] border border-border bg-muted p-1 gap-1">
          {(["topic", "pdf"] as ModeType[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError(""); }}
              className={cn(
                "flex items-center gap-1.5 px-4 py-1.5 rounded-[7px] text-[13px] font-sans font-medium",
                "transition-all duration-150 ease-out",
                mode === m
                  ? "bg-background text-foreground shadow-sm"
                  : "text-foreground-muted hover:text-foreground"
              )}
            >
              {m === "topic" ? (
                <>Por tema</>
              ) : (
                <><FileText size={13} strokeWidth={1.5} />Desde PDF</>
              )}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleCreate} className="max-w-2xl">
        <div className="bg-card border border-border rounded-[16px] p-6 md:p-8 space-y-8">

          {/* Topic input or PDF upload */}
          {mode === "topic" ? (
            <div className="space-y-2">
              <label className="text-[12px] font-semibold tracking-[0.08em] uppercase text-foreground-muted font-sans">
                Tema o título
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ej. Las 3 leyes de Newton"
                maxLength={300}
                className="w-full h-11 px-4 rounded-[10px] border border-border bg-background text-[15px] text-foreground placeholder:text-foreground-muted font-sans outline-none focus:border-foreground transition-colors duration-150 font-serif"
                autoFocus
              />
              {topic.length > 260 && (
                <p className="text-[11px] text-foreground-muted font-sans text-right">
                  {topic.length}/300
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-foreground-muted font-sans">
                Archivo PDF
              </p>
              {selectedFile ? (
                <div className="flex items-center gap-3 px-4 py-3 rounded-[10px] border border-border bg-muted">
                  <FileText size={18} strokeWidth={1.5} className="text-foreground-muted flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-sans text-foreground truncate">{selectedFile.name}</p>
                    <p className="text-[11px] font-sans text-foreground-muted">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="p-1 rounded-md text-foreground-muted hover:text-foreground transition-colors"
                  >
                    <X size={15} strokeWidth={2} />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "flex flex-col items-center justify-center text-center cursor-pointer",
                    "border-2 border-dashed rounded-[12px] px-6 py-10",
                    "transition-all duration-200 ease-out",
                    dragging
                      ? "border-foreground bg-muted"
                      : "border-border hover:border-foreground-muted"
                  )}
                >
                  <div className="mb-3 p-3 rounded-full bg-muted">
                    {dragging ? (
                      <FileText size={20} strokeWidth={1.5} className="text-foreground" />
                    ) : (
                      <Upload size={20} strokeWidth={1.5} className="text-foreground-muted" />
                    )}
                  </div>
                  <p className="text-[15px] font-serif font-medium text-foreground mb-1">
                    {dragging ? "Suelta el PDF aquí" : "Arrastra un PDF o haz clic para elegir"}
                  </p>
                  <p className="text-[12px] text-foreground-muted font-sans">
                    PDF de hasta 20 MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Materia */}
          <div className="space-y-2.5">
            <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-foreground-muted font-sans">
              Materia <span className="normal-case font-normal">(opcional)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {subjects.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSubjectId(subjectId === s.id ? null : s.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 h-8 rounded-[8px] border text-[13px] font-sans font-medium",
                    "transition-all duration-150 ease-out active:scale-[0.97]",
                    subjectId === s.id
                      ? "border-foreground bg-muted text-foreground"
                      : "border-border text-foreground-muted hover:border-foreground-muted hover:text-foreground"
                  )}
                >
                  <BookMarked size={12} strokeWidth={1.5} />
                  {s.name}
                </button>
              ))}

              {addingSubject ? (
                <div className="flex items-center gap-1.5 px-3 h-8 rounded-[8px] border border-foreground bg-muted">
                  <BookMarked size={12} strokeWidth={1.5} className="text-foreground-muted flex-shrink-0" />
                  <input
                    autoFocus
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); handleCreateSubject(); }
                      if (e.key === "Escape") { setAddingSubject(false); setNewSubjectName(""); }
                    }}
                    onBlur={handleCreateSubject}
                    placeholder="Nueva materia"
                    maxLength={100}
                    className="bg-transparent text-[13px] font-sans text-foreground placeholder:text-foreground-muted outline-none w-32"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingSubject(true)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 h-8 rounded-[8px] border border-dashed border-border text-[13px] font-sans",
                    "text-foreground-muted hover:border-foreground-muted hover:text-foreground transition-all duration-150"
                  )}
                >
                  <Plus size={12} strokeWidth={2} />
                  Nueva materia
                </button>
              )}
            </div>
          </div>

          {/* Goal */}
          <div className="space-y-2.5">
            <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-foreground-muted font-sans">
              Objetivo
            </p>
            <div className="grid grid-cols-2 gap-2">
              {goals.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGoal(g.value)}
                  className={cn(
                    "px-4 py-2.5 rounded-[10px] border text-[13px] font-sans font-medium text-left",
                    "transition-all duration-150 ease-out active:scale-[0.98]",
                    goal === g.value
                      ? "border-foreground bg-muted text-foreground"
                      : "border-border text-foreground-muted hover:border-foreground-muted hover:text-foreground"
                  )}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Level */}
          <div className="space-y-2.5">
            <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-foreground-muted font-sans">
              Nivel
            </p>
            <div className="grid grid-cols-3 gap-2">
              {levels.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => setLevel(l.value)}
                  className={cn(
                    "px-4 py-2.5 rounded-[10px] border text-[13px] font-sans font-medium",
                    "transition-all duration-150 ease-out active:scale-[0.98]",
                    level === l.value
                      ? "border-foreground bg-muted text-foreground"
                      : "border-border text-foreground-muted hover:border-foreground-muted hover:text-foreground"
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-[12px] text-red-500 font-sans">{error}</p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={loading}
            disabled={!canSubmit}
          >
            {loading
              ? mode === "pdf"
                ? "Procesando PDF..."
                : "Guardando sesión..."
              : mode === "pdf"
                ? "Crear sesión desde PDF"
                : "Crear sesión"}
          </Button>
        </div>
      </form>
    </PageShell>
  );
}
