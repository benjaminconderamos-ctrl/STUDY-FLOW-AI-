"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ReferenceLine,
  ReferenceDot,
} from "recharts";
import { cn } from "@/lib/utils";
import type { MathGraphData } from "@/types";

interface MathGraphProps {
  graph: MathGraphData;
}

function normalizeExpression(expr: string): string {
  return expr
    .replace(/^y\s*=\s*/i, "")
    .replace(/^f\s*\(\s*x\s*\)\s*=\s*/i, "")
    .trim();
}

function generateFunctionPoints(expr: string): { x: number; y: number }[] | null {
  try {
    const cleaned = normalizeExpression(expr);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { compile } = require("mathjs") as {
      compile: (e: string) => { evaluate: (scope: Record<string, number>) => number };
    };
    const compiled = compile(cleaned);
    const points: { x: number; y: number }[] = [];
    for (let x = -10; x <= 10; x += 0.25) {
      const xRounded = Math.round(x * 100) / 100;
      try {
        const y = compiled.evaluate({ x: xRounded });
        if (typeof y === "number" && isFinite(y) && Math.abs(y) < 1e6) {
          points.push({ x: xRounded, y: Math.round(y * 1000) / 1000 });
        }
      } catch {
        // saltar puntos indefinidos (ej. 1/0, sqrt de negativo)
      }
    }
    return points.length > 0 ? points : null;
  } catch {
    return null;
  }
}

type Dataset = { fn: string; points: { x: number; y: number }[] | null };
type Point = { x: number; y: number };

function buildMergedData(datasets: Dataset[]): Record<string, number>[] {
  const valid = datasets.filter((d) => d.points !== null);
  if (valid.length === 0) return [];
  const xs = Array.from(
    new Set(valid.flatMap((d) => d.points!.map((p) => p.x)))
  ).sort((a, b) => a - b);
  return xs.map((x) => {
    const point: Record<string, number> = { x };
    valid.forEach((d, i) => {
      const found = d.points!.find((p) => p.x === x);
      if (found !== undefined) point[`y${i}`] = found.y;
    });
    return point;
  });
}

// Selecciona 4-5 puntos representativos para destacar en la gráfica
function selectKeyPoints(points: Point[]): Point[] {
  if (points.length === 0) return [];
  const preferred = [-2, -1, 0, 1, 2];
  const found = preferred
    .map((px) => points.find((p) => p.x === px))
    .filter((p): p is Point => p !== undefined);
  if (found.length >= 3) return found.slice(0, 5);
  // Fallback: 5 puntos uniformemente espaciados
  const total = points.length;
  const indices = [0, Math.floor(total / 4), Math.floor(total / 2), Math.floor((3 * total) / 4), total - 1];
  return [...new Set(indices)].map((i) => points[i]);
}

const LINE_COLORS = ["#16120F", "#6F6962", "#9e9992"];

export function MathGraph({ graph }: MathGraphProps) {
  const functionDatasets = useMemo<Dataset[] | null>(() => {
    if (!graph.shouldGraph) return null;
    if (graph.graphType !== "function" && graph.graphType !== "line") return null;
    if (graph.points && graph.points.length > 0) {
      return [{ fn: "points", points: graph.points }];
    }
    if (!graph.functions?.length) return null;
    return graph.functions.map((fn) => ({
      fn,
      points: generateFunctionPoints(fn),
    }));
  }, [graph]);

  const mergedData = useMemo(
    () => (functionDatasets ? buildMergedData(functionDatasets) : []),
    [functionDatasets]
  );

  // Puntos clave para destacar — debe llamarse antes de cualquier early return
  const keyPoints = useMemo<Point[]>(() => {
    const pts = functionDatasets?.[0]?.points ?? graph.points ?? [];
    return selectKeyPoints(pts as Point[]);
  }, [functionDatasets, graph.points]);

  if (!graph.shouldGraph) return null;

  const isFunctionGraph =
    (graph.graphType === "function" || graph.graphType === "line") && functionDatasets !== null;
  const isScatterGraph =
    graph.graphType === "scatter" && graph.points && graph.points.length > 0;
  const hasValidData = isFunctionGraph ? mergedData.length > 0 : !!isScatterGraph;

  const tooltipStyle = {
    backgroundColor: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    fontSize: 12,
    fontFamily: "var(--font-inter)",
    color: "var(--foreground)",
  };

  return (
    <div className="bg-card border border-border rounded-[14px] p-5">
      <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground-muted font-sans mb-4">
        Gráfica
      </p>

      {!hasValidData && (
        <p className="text-[13px] text-foreground-muted font-sans py-8 text-center">
          No pudimos graficar esta función automáticamente.
        </p>
      )}

      {/* Función(es) — LineChart */}
      {isFunctionGraph && hasValidData && (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={mergedData}
            margin={{ top: 12, right: 20, left: 0, bottom: graph.xLabel ? 28 : 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />

            {/* Líneas de referencia en los ejes */}
            <ReferenceLine
              x={0}
              stroke="var(--foreground-muted)"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            <ReferenceLine
              y={0}
              stroke="var(--foreground-muted)"
              strokeWidth={1}
              strokeDasharray="4 3"
            />

            <XAxis
              dataKey="x"
              type="number"
              domain={["dataMin", "dataMax"]}
              stroke="var(--foreground-muted)"
              tick={{ fontSize: 11, fontFamily: "var(--font-inter)", fill: "var(--foreground-muted)" }}
              tickCount={9}
              label={
                graph.xLabel
                  ? { value: graph.xLabel, position: "insideBottom", offset: -14, fontSize: 11, fill: "var(--foreground-muted)" }
                  : undefined
              }
            />
            <YAxis
              stroke="var(--foreground-muted)"
              tick={{ fontSize: 11, fontFamily: "var(--font-inter)", fill: "var(--foreground-muted)" }}
              label={
                graph.yLabel
                  ? { value: graph.yLabel, angle: -90, position: "insideLeft", fontSize: 11, fill: "var(--foreground-muted)" }
                  : undefined
              }
              width={48}
            />

            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={{ color: "var(--foreground-muted)", marginBottom: 2 }}
              labelFormatter={(label) => {
                const xVal = Number(label);
                if (xVal === 0) return "x = 0 — intersección eje y";
                return `x = ${label}`;
              }}
              formatter={(value) => [
                typeof value === "number" ? value.toFixed(2) : value,
                "y",
              ]}
            />

            {functionDatasets!.map((dataset, i) =>
              dataset.points ? (
                <Line
                  key={`${dataset.fn}-${i}`}
                  type="monotone"
                  dataKey={`y${i}`}
                  stroke={LINE_COLORS[i % LINE_COLORS.length]}
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                  connectNulls={false}
                />
              ) : null
            )}

            {/* Puntos clave destacados */}
            {keyPoints.map(({ x, y }) => {
              const isYIntercept = x === 0;
              return (
                <ReferenceDot
                  key={`dot-${x}`}
                  x={x}
                  y={y}
                  r={isYIntercept ? 5 : 3.5}
                  fill={isYIntercept ? "var(--foreground)" : "var(--card)"}
                  stroke="var(--foreground)"
                  strokeWidth={1.5}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Puntos dispersos */}
      {isScatterGraph && (
        <ResponsiveContainer width="100%" height={320}>
          <ScatterChart margin={{ top: 12, right: 20, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <ReferenceLine x={0} stroke="var(--foreground-muted)" strokeWidth={1} strokeDasharray="4 3" />
            <ReferenceLine y={0} stroke="var(--foreground-muted)" strokeWidth={1} strokeDasharray="4 3" />
            <XAxis
              dataKey="x"
              type="number"
              stroke="var(--foreground-muted)"
              tick={{ fontSize: 11, fontFamily: "var(--font-inter)", fill: "var(--foreground-muted)" }}
              name={graph.xLabel ?? "x"}
            />
            <YAxis
              dataKey="y"
              type="number"
              stroke="var(--foreground-muted)"
              tick={{ fontSize: 11, fontFamily: "var(--font-inter)", fill: "var(--foreground-muted)" }}
              name={graph.yLabel ?? "y"}
              width={48}
            />
            <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: "3 3" }} />
            <Scatter data={graph.points} fill="var(--foreground)" fillOpacity={0.8} />
          </ScatterChart>
        </ResponsiveContainer>
      )}

      {/* Puntos calculados */}
      {isFunctionGraph && hasValidData && keyPoints.length > 0 && (
        <div className="mt-4">
          <p className="text-[10px] font-semibold tracking-[0.08em] uppercase text-foreground-muted font-sans mb-2">
            Puntos calculados
          </p>
          <div className="flex flex-wrap gap-1.5">
            {keyPoints.map(({ x, y }) => (
              <span
                key={`chip-${x}`}
                className={cn(
                  "text-[12px] font-mono px-2 py-0.5 rounded-[6px] border",
                  x === 0
                    ? "bg-foreground text-background border-foreground"
                    : "bg-muted text-foreground border-border"
                )}
              >
                ({x}, {y})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notas */}
      {graph.notes && (
        <p className="text-[12px] text-foreground-muted font-sans mt-3 leading-relaxed">
          <span className="font-medium text-foreground">Nota: </span>
          {graph.notes}
        </p>
      )}
    </div>
  );
}
