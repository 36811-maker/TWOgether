import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "TWOgether — Our future, together.",
  description: "Plataforma privada de planejamento de vida a dois de Pedro & Emilly. Objetivos, sonhos, viagens, futura casa, finanças e memórias em tons suaves.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💍</text></svg>",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#faf7f2] text-stone-700 antialiased selection:bg-rose-100 selection:text-stone-800">
        {children}
      </body>
    </html>
  );
}
