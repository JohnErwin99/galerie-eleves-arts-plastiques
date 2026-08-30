import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-4 py-24 text-center">
      <h1 className="font-display text-4xl font-semibold">Page introuvable</h1>
      <div className="mx-auto mt-4 h-1 w-14 bg-accent" aria-hidden />
      <p className="mt-6 text-ink-soft">
        Cette page n&apos;existe pas ou n&apos;est plus disponible.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent-deep"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
