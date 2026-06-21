"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Button } from "@/components/ui/Button";
import { HCaptchaField } from "@/components/auth/HCaptchaField";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const captchaRef = useRef<HCaptcha>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (!acceptedTerms) {
      setError("Debes aceptar los Términos de Servicio y el Aviso de Privacidad.");
      return;
    }
    if (!captchaToken) {
      setError("Completa la verificación de seguridad.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        captchaToken,
        data: { name, terms_version: "2026-06-20", privacy_version: "2026-06-20" },
      },
    });

    captchaRef.current?.resetCaptcha();
    setCaptchaToken(null);

    if (authError) {
      setError(
        authError.message.includes("already registered")
          ? "Este correo ya tiene una cuenta. Inicia sesión."
          : "Error al crear la cuenta. Intenta de nuevo."
      );
      setLoading(false);
      return;
    }

    // Supabase puede requerir confirmación de email antes de crear sesión
    if (data.session) {
      await fetch("/api/auth/record-legal", { method: "POST" });
      router.push("/dashboard");
      router.refresh();
    } else {
      setLoading(false);
      setSuccess("Revisa tu correo para confirmar tu cuenta.");
    }
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
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-sm animate-fade-in-scale">

          {success ? (
            <div className="bg-card border border-border rounded-[16px] p-5 sm:p-8 text-center">
              <p className="font-serif text-xl font-medium text-foreground mb-2">
                Revisa tu correo
              </p>
              <p className="text-[13px] text-foreground-muted font-sans leading-relaxed">
                Te enviamos un enlace de confirmación a{" "}
                <span className="text-foreground font-medium">{email}</span>.
                Ábrelo para activar tu cuenta.
              </p>
              <p className="mt-5 text-[12px] text-foreground-muted font-sans">
                ¿Ya confirmaste?{" "}
                <Link href="/login" className="text-foreground hover:underline underline-offset-2">
                  Inicia sesión
                </Link>
              </p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-[16px] p-5 sm:p-8">
              <div className="mb-7">
                <h1 className="font-serif text-2xl font-medium text-foreground">
                  Crea tu cuenta
                </h1>
                <p className="mt-1.5 text-[13px] text-foreground-muted font-sans">
                  Gratis. Sin tarjeta de crédito.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className="text-[12px] font-medium text-foreground-muted font-sans"
                  >
                    Nombre
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full h-9 px-3 rounded-[8px] border border-border bg-background text-[14px] text-foreground placeholder:text-foreground-muted font-sans outline-none focus:border-foreground transition-colors duration-150"
                  />
                </div>

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
                  <label
                    htmlFor="password"
                    className="text-[12px] font-medium text-foreground-muted font-sans"
                  >
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full h-9 px-3 rounded-[8px] border border-border bg-background text-[14px] text-foreground placeholder:text-foreground-muted font-sans outline-none focus:border-foreground transition-colors duration-150"
                  />
                </div>

                {/* Legal checkbox */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    id="accept-terms"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 flex-shrink-0 w-4 h-4 rounded border-border accent-foreground cursor-pointer"
                  />
                  <label htmlFor="accept-terms" className="text-[12px] text-foreground-muted font-sans leading-relaxed cursor-pointer">
                    Acepto los{" "}
                    <Link href="/terms" target="_blank" className="text-foreground hover:underline underline-offset-2">
                      Términos de Servicio
                    </Link>{" "}
                    y el{" "}
                    <Link href="/privacy" target="_blank" className="text-foreground hover:underline underline-offset-2">
                      Aviso de Privacidad
                    </Link>{" "}
                    de StudyFlow AI.
                  </label>
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
                  disabled={!acceptedTerms || !captchaToken || loading}
                >
                  Crear cuenta
                </Button>
              </form>
            </div>
          )}

          <p className="mt-5 text-center text-[13px] text-foreground-muted font-sans">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-foreground hover:underline underline-offset-2 transition-all duration-150"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
