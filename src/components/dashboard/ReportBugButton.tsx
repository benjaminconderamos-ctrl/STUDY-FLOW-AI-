"use client";

import { useState } from "react";
import { Flag, X, CheckCircle, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  email: string;
  displayName: string;
  plan: string;
}

export function ReportBugButton({ email, displayName, plan }: Props) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleOpen() {
    setOpen(true);
    setDescription("");
    setError("");
    setSuccess(false);
  }

  function handleClose() {
    if (loading) return;
    setOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim() || loading) return;

    setError("");
    setLoading(true);

    const res = await fetch("/api/feedback/report-bug", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: description.trim(),
        pageUrl: window.location.href,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error?.message ?? "Error al enviar. Intenta de nuevo.");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      setOpen(false);
      setSuccess(false);
    }, 2000);
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className={cn(
          "w-full flex items-center gap-2.5 px-3 h-9 rounded-[8px]",
          "text-[13px] text-foreground-muted hover:text-foreground hover:bg-muted",
          "transition-colors duration-150 font-sans cursor-pointer"
        )}
      >
        <Flag size={15} strokeWidth={1.5} />
        Reportar problema
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/40"
              onClick={handleClose}
            />

            {/* Card */}
            <motion.div
              className="relative w-full max-w-md bg-card border border-border rounded-[16px] p-6 shadow-lg"
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-serif text-xl font-medium text-foreground">
                    Reportar problema
                  </h2>
                  <p className="text-[12px] text-foreground-muted font-sans mt-0.5">
                    Beta — {displayName} · {plan.toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="text-foreground-muted hover:text-foreground transition-colors duration-150 p-1 -mr-1 -mt-1"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>

              {success ? (
                <motion.div
                  className="flex flex-col items-center gap-2 py-6 text-center"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CheckCircle size={32} strokeWidth={1.5} className="text-green-500" />
                  <p className="text-[14px] font-medium text-foreground font-sans">
                    Reporte enviado
                  </p>
                  <p className="text-[12px] text-foreground-muted font-sans">
                    Gracias por ayudarnos a mejorar StudyFlow AI.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-foreground-muted font-sans">
                      ¿Qué problema encontraste?
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe el problema que encontraste…"
                      maxLength={2000}
                      rows={5}
                      disabled={loading}
                      className="w-full px-3 py-2.5 rounded-[8px] border border-border bg-background text-[14px] text-foreground placeholder:text-foreground-muted font-sans outline-none focus:border-foreground-muted transition-colors duration-150 resize-none disabled:opacity-60"
                    />
                    <p className="text-[11px] text-foreground-muted font-sans text-right">
                      {description.length}/2000
                    </p>
                  </div>

                  {error && (
                    <p className="text-[12px] text-red-500 font-sans">{error}</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={loading}
                      className="flex-1 h-9 rounded-[8px] border border-border text-[13px] font-sans font-medium text-foreground-muted hover:text-foreground hover:bg-muted transition-colors duration-150 disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !description.trim()}
                      className="flex-1 h-9 rounded-[8px] bg-foreground text-background text-[13px] font-sans font-medium hover:opacity-85 transition-opacity duration-150 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading && <Loader2 size={13} strokeWidth={1.5} className="animate-spin" />}
                      {loading ? "Enviando…" : "Enviar reporte"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
