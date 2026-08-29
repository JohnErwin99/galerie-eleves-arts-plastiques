import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db, projects, artworks } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { updateProject, setCoverArtwork } from "@/lib/actions/projects";
import { deleteArtwork } from "@/lib/actions/artworks";
import { ProjectFields } from "@/components/ProjectForm";
import { ArtworkUploadForm } from "@/components/ArtworkUploadForm";
import { ArtworkEditRow } from "@/components/ArtworkEditRow";
import { DeleteButton } from "@/components/DeleteButton";

export const metadata = { title: "Modifier le projet" };
export const dynamic = "force-dynamic";

export default async function EditProjetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const [project] = await db.select().from(projects).where(eq(projects.id, id));
  if (!project) notFound();
  const works = await db
    .select()
    .from(artworks)
    .where(eq(artworks.projectId, id))
    .orderBy(asc(artworks.sortOrder), asc(artworks.id));

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Modifier le projet</h1>
        <div className="flex gap-3 text-sm">
          <Link href={`/projets/${id}`} className="text-ink-soft hover:text-ink">
            Voir la page publique →
          </Link>
          <Link href="/admin" className="text-ink-soft hover:text-ink">
            ← Tableau de bord
          </Link>
        </div>
      </div>

      <form action={updateProject.bind(null, id)} className="max-w-lg space-y-6">
        <ProjectFields project={project} />
        <button className="rounded-full bg-accent px-4 py-2 font-medium text-white hover:bg-accent-deep">
          Enregistrer
        </button>
      </form>

      <section>
        <h2 className="mb-4 font-display text-xl font-semibold">Ajouter une œuvre</h2>
        <ArtworkUploadForm projectId={id} />
      </section>

      <section>
        <h2 className="mb-4 font-display text-xl font-semibold">
          Œuvres ({works.length})
        </h2>
        {works.length === 0 ? (
          <p className="text-ink-soft">Aucune œuvre pour l&apos;instant.</p>
        ) : (
          <ul className="space-y-4">
            {works.map((w) => (
              <li
                key={w.id}
                className="flex flex-col gap-4 rounded-lg border border-line bg-paper p-4 sm:flex-row"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/uploads/${w.thumbPath}`}
                  alt={w.title}
                  className="h-32 w-32 shrink-0 rounded-md object-cover"
                />
                <div className="grow">
                  <ArtworkEditRow artwork={w} />
                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    {project.coverArtworkId === w.id ? (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">
                        Image de couverture
                      </span>
                    ) : (
                      <form action={setCoverArtwork.bind(null, id, w.id)}>
                        <button className="rounded-md border border-line px-3 py-1 hover:bg-cream">
                          Choisir comme couverture
                        </button>
                      </form>
                    )}
                    <form action={deleteArtwork.bind(null, w.id)}>
                      <DeleteButton
                        confirmText={`Supprimer l'œuvre « ${w.title} » de ${w.studentFirstName}?`}
                      />
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
