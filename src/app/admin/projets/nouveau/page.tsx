import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createProject } from "@/lib/actions/projects";
import { ProjectFields } from "@/components/ProjectForm";

export const metadata = { title: "Nouveau projet" };

export default async function NouveauProjetPage() {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-semibold">Nouveau projet</h1>
      <form action={createProject} className="space-y-6">
        <ProjectFields />
        <div className="flex gap-3">
          <button className="rounded-md bg-stone-900 px-4 py-2 font-medium text-white hover:bg-stone-700">
            Créer le projet
          </button>
          <Link
            href="/admin"
            className="rounded-md border border-stone-300 px-4 py-2 hover:bg-stone-100"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
