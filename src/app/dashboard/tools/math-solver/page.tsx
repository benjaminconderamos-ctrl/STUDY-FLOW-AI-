"use client";

import { useState, useEffect } from "react";
import { Calculator } from "lucide-react";
import { PageShell } from "@/components/ui/PageShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { MathSolverInput, type MathSolverInputValues } from "@/components/dashboard/MathSolverInput";
import { MathSolverResult } from "@/components/dashboard/MathSolverResult";
import { createClient } from "@/lib/supabase/client";
import { formatRelativeDate } from "@/lib/utils";
import type { MathSolverRequest, MathSolverResult as MathResult } from "@/types";

const categoryLabels: Record<string, string> = {
  auto: "Auto",
  algebra: "Álgebra",
  calculus: "Cálculo",
  statistics: "Estadística",
  functions: "Funciones",
  geometry: "Geometría",
};

export default function MathSolverPage() {
  const [result, setResult] = useState<MathResult | null>(null);
  const [currentProblem, setCurrentProblem] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<MathSolverRequest[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyKey, setHistoryKey] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("math_solver_requests")
      .select("id, user_id, problem, category, level, final_answer, solution, graph_data, status, created_at")
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        setHistory((data as unknown as MathSolverRequest[]) ?? []);
        setHistoryLoading(false);
      });
  }, [historyKey]);

  async function handleSubmit(values: MathSolverInputValues) {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai/math-solver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg =
          data?.error?.code === "daily_limit_reached"
            ? data.error.message
            : data?.error?.message ?? "Error al resolver el problema. Intenta de nuevo.";
        setError(msg);
        return;
      }

      setResult(data.result as MathResult);
      setCurrentProblem(values.problem);
      setHistoryKey((k) => k + 1);
    } catch {
      setError("Error de conexión. Verifica tu internet e intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }

  function loadFromHistory(req: MathSolverRequest) {
    if (!req.solution) return;
    setResult(req.solution);
    setCurrentProblem(req.problem);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <PageShell>
      <PageHeader
        label="Herramienta PRO / MAX"
        title="Resolvedor de matemáticas"
        subtitle="Soluciones paso a paso y gráficas automáticas para álgebra, cálculo, estadística y más."
      />

      {/* Formulario */}
      <div className="mb-8">
        <MathSolverInput onSubmit={handleSubmit} isLoading={isLoading} />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 px-4 py-3 bg-muted border border-border rounded-[10px]">
          <p className="text-[13px] font-sans text-foreground-muted">{error}</p>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-4 mb-8 animate-pulse">
          <div className="h-4 bg-muted rounded-full w-32" />
          <div className="h-16 bg-muted rounded-[12px]" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-muted rounded-[10px]" />
            ))}
          </div>
        </div>
      )}

      {/* Resultado */}
      {!isLoading && result && (
        <div className="mb-10">
          <MathSolverResult result={result} problem={currentProblem} />
        </div>
      )}

      {/* Estado vacío inicial */}
      {!isLoading && !result && !error && (
        <div className="mb-10">
          <EmptyState
            icon={Calculator}
            title="Escribe un problema para comenzar."
            description="Puedes resolver ecuaciones, graficar funciones o analizar datos estadísticos."
            compact
          />
        </div>
      )}

      {/* Historial */}
      <section>
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted mb-4 font-sans">
          Problemas recientes
        </p>

        {historyLoading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-14 bg-muted rounded-[10px] animate-pulse" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <p className="text-[13px] text-foreground-muted font-sans">
            Aquí aparecerán tus problemas resueltos.
          </p>
        ) : (
          <div className="space-y-2">
            {history.map((req) => (
              <button
                key={req.id}
                onClick={() => loadFromHistory(req)}
                className="w-full text-left flex items-center justify-between gap-4 px-4 py-3
                           bg-card border border-border rounded-[10px] hover:border-foreground/20
                           transition-colors duration-150 group"
              >
                <div className="min-w-0">
                  <p className="text-[14px] font-sans text-foreground truncate group-hover:text-foreground">
                    {req.problem.length > 80 ? req.problem.slice(0, 80) + "…" : req.problem}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="muted">
                      {categoryLabels[req.category] ?? req.category}
                    </Badge>
                    <span className="text-[12px] text-foreground-muted font-sans">
                      {formatRelativeDate(req.created_at)}
                    </span>
                  </div>
                </div>
                {req.final_answer && (
                  <span className="flex-shrink-0 text-[13px] font-mono text-foreground-muted max-w-[120px] truncate">
                    {req.final_answer}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
