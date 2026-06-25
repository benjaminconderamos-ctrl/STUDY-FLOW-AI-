import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal"],
  variable: "--font-cormorant",
  display: "swap",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "StudyFlow AI — Estudia mejor con IA",
  description:
    "Crea sesiones de estudio con IA desde un tema o PDF. Genera resúmenes, flashcards, quizzes y apoyo personalizado para estudiar mejor. Subida de PDFs disponible en beta.",
  icons: {
    icon: "/logo-dark.png",
    apple: "/logo-dark.png",
  },
  openGraph: {
    images: ["/logo-dark.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${inter.variable} ${cormorant.variable} h-full`}
    >
      <body className="min-h-full antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
