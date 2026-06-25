import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/ui/PageShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createServerClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

interface DocRow {
  id: string;
  name: string;
  size_bytes: number | null;
  created_at: string;
  study_sessions: { id: string; title: string }[] | null;
}

export default async function LibraryPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data } = await supabase
    .from("documents")
    .select("id, name, size_bytes, created_at, study_sessions(id, title)")
    .eq("user_id", user.id)
    .eq("type", "pdf")
    .order("created_at", { ascending: false });

  const docs = (data as DocRow[] | null) ?? [];

  return (
    <PageShell>
      <PageHeader
        label="Biblioteca"
        title="Tus documentos PDF"
        subtitle="PDFs subidos para generar sesiones de estudio con IA. La extracción funciona mejor con documentos de texto seleccionable."
      />

      <div className="flex items-center gap-3 mb-6">
        <Button href="/dashboard/sessions/new" size="sm">
          <Plus size={13} strokeWidth={2} />
          Crear sesión desde PDF
        </Button>
        <Badge variant="muted">Beta</Badge>
      </div>

      {docs.length === 0 ? (
        <div className="max-w-lg">
          <div className="bg-card border border-dashed border-border rounded-[16px] px-8 py-14 flex flex-col items-center text-center">
            <div className="mb-4 p-4 rounded-full bg-muted">
              <FileText size={22} className="text-foreground-muted" strokeWidth={1.5} />
            </div>
            <p className="text-[16px] font-serif font-medium text-foreground mb-2">
              Sin documentos aún
            </p>
            <p className="text-[13px] text-foreground-muted font-sans leading-relaxed max-w-xs mb-6">
              Sube un PDF desde &quot;Nueva sesión&quot; y StudyFlow extraerá su contenido para
              generar resúmenes, flashcards y quizzes basados en tu material.
            </p>
            <Button href="/dashboard/sessions/new" size="sm">
              <Plus size={13} strokeWidth={2} />
              Crear sesión desde PDF
            </Button>
          </div>

          <p className="text-[11px] text-foreground-muted font-sans mt-6 leading-relaxed">
            Nota: la función PDF funciona mejor con documentos que contienen texto seleccionable.
            Los PDFs escaneados o protegidos con contraseña pueden no procesarse correctamente.
          </p>
        </div>
      ) : (
        <div className="max-w-2xl space-y-3">
          {docs.map((doc) => {
            const session = doc.study_sessions?.[0];
            const sizeLabel = doc.size_bytes
              ? `${(doc.size_bytes / 1024 / 1024).toFixed(1)} MB`
              : null;

            return (
              <div
                key={doc.id}
                className="flex items-center gap-4 px-4 py-3.5 bg-card border border-border rounded-[12px]"
              >
                <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-[8px] bg-muted">
                  <FileText size={16} strokeWidth={1.5} className="text-foreground-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-sans font-medium text-foreground truncate">
                    {doc.name}
                  </p>
                  <p className="text-[11px] text-foreground-muted font-sans">
                    {formatDate(doc.created_at)}
                    {sizeLabel && ` · ${sizeLabel}`}
                  </p>
                </div>
                {session ? (
                  <Link
                    href={`/dashboard/sessions/${session.id}`}
                    className="flex-shrink-0 text-[12px] font-sans text-foreground-muted hover:text-foreground transition-colors duration-150 underline underline-offset-2"
                  >
                    Ver sesión
                  </Link>
                ) : (
                  <span className="flex-shrink-0 text-[11px] font-sans text-foreground-muted">
                    Sin sesión
                  </span>
                )}
              </div>
            );
          })}

          <p className="text-[11px] text-foreground-muted font-sans pt-2 leading-relaxed">
            Nota: la función PDF funciona mejor con documentos que contienen texto seleccionable.
            Los PDFs escaneados o protegidos con contraseña pueden no procesarse correctamente.
          </p>
        </div>
      )}
    </PageShell>
  );
}
