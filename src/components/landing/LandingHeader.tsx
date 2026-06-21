import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-150"
          aria-label="StudyFlow AI — inicio"
        >
          <Logo size={28} />
          <span className="text-[15px] font-serif font-medium text-foreground tracking-tight">
            StudyFlow AI
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Navegación principal">
          <Link
            href="#precios"
            className="text-[13px] text-foreground-muted hover:text-foreground transition-colors duration-150 font-sans"
          >
            Precios
          </Link>
          <Link
            href="/login"
            className="text-[13px] text-foreground-muted hover:text-foreground transition-colors duration-150 font-sans"
          >
            Iniciar sesión
          </Link>
          <Button href="/register" size="sm">
            Comenzar
          </Button>
        </nav>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-3">
          <Link
            href="/login"
            className="text-[13px] text-foreground-muted font-sans hover:text-foreground transition-colors duration-150"
          >
            Entrar
          </Link>
          <Button href="/register" size="sm">
            Comenzar
          </Button>
        </div>
      </div>
    </header>
  );
}
