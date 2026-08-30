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
    default: "Galerie des élèves d'arts plastiques",
    template: "%s · Galerie des élèves d'arts plastiques",
  },
  description:
    "La galerie d'art numérique d'Euchenith Marie-Jean, enseignante en arts visuels : les projets réalisés en classe par ses élèves, exposés pour les parents et les proches.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body
        className={`${fraunces.variable} ${workSans.variable} flex min-h-screen flex-col bg-cream font-body text-ink antialiased`}
      >
        <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <Link href="/" className="leading-tight">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">
                Arts visuels · Euchenith Marie-Jean
              </span>
              <span className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                Galerie des élèves <span className="accent-word">d&apos;arts plastiques</span>
              </span>
            </Link>
          </div>
        </header>
        <main className="grow">{children}</main>
        <footer className="bg-gradient-to-r from-accent-deep to-[#3d2f52] py-12 text-center text-white">
          <p className="font-display text-2xl">
            Galerie des élèves <span className="italic">d&apos;arts plastiques</span>
          </p>
          <p className="mt-2 text-sm text-white/60">
            L&apos;art des élèves d&apos;Euchenith Marie-Jean, enseignante en arts
            visuels, un projet à but non lucratif
          </p>
        </footer>
      </body>
    </html>
  );
}
