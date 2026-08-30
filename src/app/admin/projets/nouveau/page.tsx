import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createProject } from "@/lib/actions/projects";
import { ProjectFields } from "@/components/ProjectForm";

export const metadata = { title: "Nouveau projet" };

export default async function NouveauProjetPage() {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-6 font-display text-3xl font-semibold">Nouveau projet</h1>
      <form action={createProject} className="space-y-6">
        <ProjectFields />
        <div className="flex gap-3">
          <button className="rounded-full bg-accent px-4 py-2 font-medium text-white hover:bg-accent-deep">
            Créer le projet
          </button>
          <Link
            href="/admin"
            className="rounded-md border border-line px-4 py-2 hover:bg-cream"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
