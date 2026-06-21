"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Button } from "@/components/ui/Button";
import { HCaptchaField } from "@/components/auth/HCaptchaField";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const captchaRef = useRef<HCaptcha>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    if (!captchaToken) {
      setError("Completa la verificación de seguridad.");
      return;
    }

    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: { captchaToken },
    });

    captchaRef.current?.resetCaptcha();
    setCaptchaToken(null);

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Correo o contraseña incorrectos."
          : "Error al iniciar sesión. Intenta de nuevo."
      );
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="px-6 h-14 flex items-center border-b border-border">
        <Link
          href="/"
          className="text-[15px] font-serif font-medium text-foreground tracking-tight hover:opacity-80 transition-opacity duration-150"
        >
          StudyFlow AI
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-12">
        <div className="w-full max-w-sm animate-fade-in-scale">
          {/* Card */}
          <div className="bg-card border border-border rounded-[16px] p-5 sm:p-8">
            <div className="mb-7">
              <h1 className="font-serif text-2xl font-medium text-foreground">
                Bienvenido de vuelta
              </h1>
              <p className="mt-1.5 text-[13px] text-foreground-muted font-sans">
                Inicia sesión para continuar estudiando.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-[12px] font-medium text-foreground-muted font-sans"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full h-9 px-3 rounded-[8px] border border-border bg-background text-[14px] text-foreground placeholder:text-foreground-muted font-sans outline-none focus:border-foreground transition-colors duration-150"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-[12px] font-medium text-foreground-muted font-sans"
                  >
                    Contraseña
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[12px] text-foreground-muted hover:text-foreground transition-colors duration-150 font-sans"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-9 px-3 rounded-[8px] border border-border bg-background text-[14px] text-foreground placeholder:text-foreground-muted font-sans outline-none focus:border-foreground transition-colors duration-150"
                />
              </div>

              <div className="pt-1">
                <HCaptchaField
                  ref={captchaRef}
                  onVerify={(token) => setCaptchaToken(token)}
                  onExpire={() => setCaptchaToken(null)}
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
                disabled={!captchaToken || loading}
              >
                Iniciar sesión
              </Button>
            </form>
          </div>

          {/* Footer link */}
          <p className="mt-5 text-center text-[13px] text-foreground-muted font-sans">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="text-foreground hover:underline underline-offset-2 transition-all duration-150"
            >
              Crear cuenta
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
