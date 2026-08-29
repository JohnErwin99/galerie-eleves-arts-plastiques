import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
});
const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-work-sans" });

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
      <body
        className={`${fraunces.variable} ${workSans.variable} flex min-h-screen flex-col bg-cream font-body text-ink antialiased`}
      >
        <header className="border-b border-line bg-cream/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
            <Link
              href="/"
              className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
            >
              Galerie d&apos;art <span className="text-accent">des élèves</span>
            </Link>
            <nav className="text-sm text-ink-soft">
              <Link
                href="/admin"
                className="rounded-full border border-line px-4 py-2 transition-colors hover:border-accent hover:text-accent"
              >
                Espace enseignante
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl grow px-4 py-10 sm:px-6">{children}</main>
        <footer className="border-t border-line py-10 text-center">
          <p className="font-display text-lg">Galerie d&apos;art des élèves</p>
          <p className="mt-1 text-sm text-ink-faint">
            Un projet à but non lucratif du cours d&apos;arts visuels
          </p>
        </footer>
      </body>
    </html>
  );
}
