import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Galerie d'art des élèves",
    template: "%s — Galerie d'art des élèves",
  },
  description:
    "Galerie d'art numérique présentant les projets des élèves du cours d'arts visuels.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${geist.className} min-h-screen bg-stone-50 text-stone-900 antialiased`}>
        <header className="border-b border-stone-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Galerie d&apos;art des élèves
            </Link>
            <nav className="text-sm text-stone-500">
              <Link href="/admin" className="hover:text-stone-900">
                Espace enseignante
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="border-t border-stone-200 py-6 text-center text-sm text-stone-500">
          Galerie d&apos;art des élèves — un projet à but non lucratif
        </footer>
      </body>
    </html>
  );
}
