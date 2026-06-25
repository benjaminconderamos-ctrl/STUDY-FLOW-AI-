"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/Badge";
import type { MathSolverResult } from "@/types";

const MathGraph = dynamic(
  () => import("@/components/dashboard/MathGraph").then((mod) => mod.MathGraph),
  {
    loading: () => (
      <div className="h-[330px] bg-muted rounded-[14px] animate-pulse" />
    ),
  }
);

const categoryLabels: Record<string, string> = {
  algebra: "Álgebra",
  calculus: "Cálculo",
  statistics: "Estadística",
  functions: "Funciones",
  geometry: "Geometría",
};

interface MathSolverResultProps {
  result: MathSolverResult;
  problem: string;
}

function PracticeItem({ item }: { item: { problem: string; answer: string } }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="border border-border rounded-[10px] px-4 py-3">
      <p className="text-[14px] font-sans text-foreground">{item.problem}</p>
      {revealed ? (
        <p className="text-[13px] text-foreground-muted font-sans mt-1">
          <span className="font-medium text-foreground">Respuesta:</span> {item.answer}
        </p>
      ) : (
        <button
          onClick={() => setRevealed(true)}
          className="text-[12px] font-sans text-foreground-muted underline underline-offset-2 mt-1 hover:text-foreground transition-colors"
        >
          Ver respuesta
        </button>
      )}
    </div>
  );
}

export function MathSolverResult({ result, problem }: MathSolverResultProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="premium">
          {categoryLabels[result.category] ?? result.category}
        </Badge>
        <span className="text-[13px] text-foreground-muted font-sans">
          {result.problemType}
        </span>
      </div>

      {/* Problema original */}
      <div>
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted font-sans mb-2">
          Problema
        </p>
        <p className="text-[14px] font-sans text-foreground leading-relaxed">{problem}</p>
      </div>

      {/* Respuesta final */}
      <div>
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted font-sans mb-2">
          Respuesta
        </p>
        <div className="bg-muted rounded-[12px] px-5 py-4">
          <p className="font-serif text-2xl font-medium text-foreground leading-tight">
            {result.finalAnswer}
          </p>
        </div>
      </div>

      {/* Pasos */}
      {result.steps.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted font-sans mb-3">
            Solución paso a paso
          </p>
          <div className="space-y-3">
            {result.steps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center mt-0.5">
                  <span className="text-[11px] font-semibold font-sans text-foreground-muted">
                    {i + 1}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium font-sans text-foreground mb-1">
                    {step.title}
                  </p>
                  {step.expression && (
                    <div className="overflow-x-auto mb-1.5">
                      <p className="font-mono text-[13px] bg-muted text-foreground px-3 py-1.5 rounded-[8px] inline-block whitespace-nowrap">
                        {step.expression}
                      </p>
                    </div>
                  )}
                  <p className="text-[13px] font-sans text-foreground-muted leading-relaxed">
                    {step.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gráfica */}
      {result.graph?.shouldGraph && <MathGraph graph={result.graph} />}

      {/* Conceptos clave */}
      {result.keyConcepts.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted font-sans mb-2">
            Conceptos clave
          </p>
          <div className="flex flex-wrap gap-2">
            {result.keyConcepts.map((concept, i) => (
              <Badge key={i} variant="muted">
                {concept}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Ejercicios similares */}
      {result.practiceProblems.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted font-sans mb-3">
            Ejercicios similares
          </p>
          <div className="space-y-2">
            {result.practiceProblems.map((item, i) => (
              <PracticeItem key={i} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Advertencias */}
      {result.warnings && result.warnings.length > 0 && (
        <div className="space-y-1">
          {result.warnings.map((w, i) => (
            <p key={i} className="text-[12px] text-foreground-muted font-sans italic">
              {w}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
