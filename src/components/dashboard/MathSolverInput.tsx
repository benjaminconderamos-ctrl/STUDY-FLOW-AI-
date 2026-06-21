"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { MathCategory, MathLevel } from "@/types";

export type MathSolverInputValues = {
  problem: string;
  category: MathCategory;
  level: MathLevel;
  includeGraph: boolean;
  includePractice: boolean;
};

interface MathSolverInputProps {
  onSubmit: (values: MathSolverInputValues) => void;
  isLoading: boolean;
}

const CATEGORIES: { value: MathCategory; label: string }[] = [
  { value: "auto", label: "Automático" },
  { value: "algebra", label: "Álgebra" },
  { value: "calculus", label: "Cálculo" },
  { value: "statistics", label: "Estadística" },
  { value: "functions", label: "Funciones y gráficas" },
  { value: "geometry", label: "Geometría" },
];

const LEVELS: { value: MathLevel; label: string }[] = [
  { value: "basic", label: "Básico" },
  { value: "intermediate", label: "Intermedio" },
  { value: "advanced", label: "Avanzado" },
];

const selectClass =
  "w-full bg-card border border-border rounded-[10px] px-3 py-2 text-[13px] font-sans text-foreground " +
  "focus:outline-none focus:ring-1 focus:ring-foreground/30 transition-colors appearance-none cursor-pointer";

export function MathSolverInput({ onSubmit, isLoading }: MathSolverInputProps) {
  const [problem, setProblem] = useState("");
  const [category, setCategory] = useState<MathCategory>("auto");
  const [level, setLevel] = useState<MathLevel>("basic");
  const [includeGraph, setIncludeGraph] = useState(true);
  const [includePractice, setIncludePractice] = useState(true);

  const charCount = problem.length;
  const isDisabled = problem.trim().length === 0 || isLoading;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isDisabled) return;
    onSubmit({ problem, category, level, includeGraph, includePractice });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-card border border-border rounded-[14px] p-5 space-y-4">
        {/* Textarea */}
        <div>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Ej. Resuelve 2x + 3 = 11 o grafica y = x² - 4x + 3"
            rows={5}
            maxLength={1000}
            disabled={isLoading}
            className="w-full bg-transparent border border-border rounded-[10px] px-4 py-3
                       text-[14px] font-sans text-foreground placeholder:text-foreground-muted
                       focus:outline-none focus:ring-1 focus:ring-foreground/30 transition-colors
                       resize-y min-h-[100px] disabled:opacity-50"
          />
          <p className="text-[11px] text-foreground-muted font-sans text-right mt-1">
            {charCount}/1000
          </p>
        </div>

        {/* Selectores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold tracking-[0.08em] uppercase text-foreground-muted font-sans mb-1.5">
              Categoría
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as MathCategory)}
              disabled={isLoading}
              className={selectClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold tracking-[0.08em] uppercase text-foreground-muted font-sans mb-1.5">
              Nivel
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as MathLevel)}
              disabled={isLoading}
              className={selectClass}
            >
              {LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Opciones */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeGraph}
              onChange={(e) => setIncludeGraph(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 accent-foreground rounded"
            />
            <span className="text-[13px] font-sans text-foreground-muted">
              Generar gráfica si aplica
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includePractice}
              onChange={(e) => setIncludePractice(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 accent-foreground rounded"
            />
            <span className="text-[13px] font-sans text-foreground-muted">
              Ejercicios similares
            </span>
          </label>
        </div>

        {/* Botón */}
        <Button
          type="submit"
          disabled={isDisabled}
          loading={isLoading}
          className="w-full"
        >
          {isLoading ? "Resolviendo paso a paso..." : "Resolver problema"}
        </Button>
      </div>
    </form>
  );
}
