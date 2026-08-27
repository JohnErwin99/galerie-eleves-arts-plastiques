import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="mb-2 text-3xl font-bold">Page introuvable</h1>
      <p className="mb-6 text-stone-500">Cette page n&apos;existe pas ou n&apos;est plus disponible.</p>
      <Link href="/" className="rounded-md bg-stone-900 px-4 py-2 text-white hover:bg-stone-700">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
