"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { EmailOtpType } from "@supabase/supabase-js";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type") as EmailOtpType | null;

    if (!token_hash || !type) {
      setError("El enlace ha expirado o no es válido. Solicita uno nuevo.");
      setVerifying(false);
      return;
    }

    const supabase = createClient();
    supabase.auth.verifyOtp({ token_hash, type }).then(({ error }) => {
      if (error) {
        setError("El enlace ha expirado o no es válido. Solicita uno nuevo.");
      } else {
        setSessionReady(true);
      }
      setVerifying(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password || !confirm) {
      setError("Completa ambos campos.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (authError) {
      setError(
        authError.message.includes("expired") || authError.message.includes("invalid") || authError.message.includes("session")
          ? "El enlace ha expirado. Solicita uno nuevo."
          : "Error al actualizar la contraseña. Intenta de nuevo."
      );
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="px-6 h-14 flex items-center border-b border-border">
        <Link
          href="/"
          className="text-[15px] font-serif font-medium text-foreground tracking-tight hover:opacity-80 transition-opacity duration-150"
        >
          StudyFlow AI
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-fade-in-scale">
          <div className="bg-card border border-border rounded-[16px] p-8">
            {verifying ? (
              <p className="text-[14px] text-foreground-muted font-sans text-center py-4">
                Verificando enlace...
              </p>
            ) : !sessionReady ? (
              <div>
                <h1 className="font-serif text-2xl font-medium text-foreground mb-3">
                  Enlace inválido
                </h1>
                <p className="text-[13px] text-red-500 font-sans">{error}</p>
                <Link
                  href="/forgot-password"
                  className="mt-4 inline-block text-[13px] text-foreground hover:underline underline-offset-2 font-sans"
                >
                  Solicitar nuevo enlace →
                </Link>
              </div>
            ) : (
            <>
            <div className="mb-7">
              <h1 className="font-serif text-2xl font-medium text-foreground">
                Nueva contraseña
              </h1>
              <p className="mt-1.5 text-[13px] text-foreground-muted font-sans">
                Elige una contraseña segura para tu cuenta.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-[12px] font-medium text-foreground-muted font-sans"
                >
                  Nueva contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full h-9 px-3 rounded-[8px] border border-border bg-background text-[14px] text-foreground placeholder:text-foreground-muted font-sans outline-none focus:border-foreground transition-colors duration-150"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="confirm"
                  className="text-[12px] font-medium text-foreground-muted font-sans"
                >
                  Confirmar contraseña
                </label>
                <input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repite la contraseña"
                  className="w-full h-9 px-3 rounded-[8px] border border-border bg-background text-[14px] text-foreground placeholder:text-foreground-muted font-sans outline-none focus:border-foreground transition-colors duration-150"
                />
              </div>

              {error && (
                <p className="text-[12px] text-red-500 font-sans">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full mt-2"
                size="md"
                loading={loading}
                disabled={loading}
              >
                Guardar contraseña
              </Button>
            </form>
            </>
            )}
          </div>

          <p className="mt-5 text-center text-[13px] text-foreground-muted font-sans">
            <Link
              href="/login"
              className="text-foreground hover:underline underline-offset-2 transition-all duration-150"
            >
              ← Volver al inicio de sesión
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
