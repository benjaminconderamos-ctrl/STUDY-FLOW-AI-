import Link from "next/link";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { FlowSection } from "@/components/landing/FlowSection";
import { DemoSection } from "@/components/landing/DemoSection";
import { DifferentiatorSection } from "@/components/landing/DifferentiatorSection";
import { CTASection } from "@/components/landing/CTASection";
import { PricingSection } from "@/components/landing/PricingSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <LandingHeader />
      <main className="flex-1 flex flex-col">
        <HeroSection />
        <FlowSection />
        <DemoSection />
        <DifferentiatorSection />
        <PricingSection />
        <CTASection />
      </main>
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <p className="text-[13px] text-foreground-muted font-sans">
            © 2026 StudyFlow AI
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-[13px] text-foreground-muted hover:text-foreground transition-colors duration-150 font-sans">
              Privacidad
            </Link>
            <Link href="/terms" className="text-[13px] text-foreground-muted hover:text-foreground transition-colors duration-150 font-sans">
              Términos
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
