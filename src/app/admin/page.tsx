import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { db, projects, artworks } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { logout } from "@/lib/actions/auth";
import { deleteProject } from "@/lib/actions/projects";
import { DeleteButton } from "@/components/DeleteButton";

export const metadata = { title: "Tableau de bord" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();
  const rows = await db
    .select({
      project: projects,
      artworkCount: sql<number>`count(${artworks.id})`,
    })
    .from(projects)
    .leftJoin(artworks, eq(artworks.projectId, projects.id))
    .groupBy(projects.id)
    .orderBy(desc(projects.createdAt));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Tableau de bord</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/projets/nouveau"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-deep"
          >
            + Nouveau projet
          </Link>
          <form action={logout}>
            <button className="rounded-md border border-line px-4 py-2 text-sm hover:bg-cream">
              Se déconnecter
            </button>
          </form>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="text-ink-soft">Aucun projet pour l&apos;instant. Créez votre premier projet!</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-line bg-paper">
          <table className="w-full text-sm">
            <thead className="border-b border-line text-left text-ink-soft">
              <tr>
                <th className="px-4 py-3">Projet</th>
                <th className="px-4 py-3">Année</th>
                <th className="px-4 py-3">Œuvres</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ project, artworkCount }) => (
                <tr key={project.id} className="border-b border-line-soft last:border-0">
                  <td className="px-4 py-3 font-medium">{project.title}</td>
                  <td className="px-4 py-3">{project.schoolYear ?? "—"}</td>
                  <td className="px-4 py-3">{artworkCount}</td>
                  <td className="px-4 py-3">
                    {project.published ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                        Publié
                      </span>
                    ) : (
                      <span className="rounded-full bg-line-soft px-2 py-0.5 text-xs text-ink-soft">
                        Brouillon
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/projets/${project.id}`}
                        className="rounded-md border border-line px-3 py-1 hover:bg-cream"
                      >
                        Modifier
                      </Link>
                      <form action={deleteProject.bind(null, project.id)}>
                        <DeleteButton confirmText={`Supprimer le projet « ${project.title} » et toutes ses œuvres?`} />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
