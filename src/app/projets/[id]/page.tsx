import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db, projects, artworks } from "@/db";
import { Gallery } from "@/components/Gallery";
import { isLoggedIn } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProjetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const [project] = await db.select().from(projects).where(eq(projects.id, id));
  // Draft projects stay visible to the logged-in teacher for previewing.
  if (!project || (!project.published && !(await isLoggedIn()))) notFound();

  const works = await db
    .select()
    .from(artworks)
    .where(eq(artworks.projectId, id))
    .orderBy(asc(artworks.sortOrder), asc(artworks.id));

  return (
    <div>
      <Link href="/" className="text-sm text-stone-500 hover:text-stone-900">
        ← Tous les projets
      </Link>
      <div className="mb-8 mt-3 max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">{project.title}</h1>
        {project.schoolYear && (
          <p className="mb-2 text-sm text-stone-500">{project.schoolYear}</p>
        )}
        {project.description && <p className="text-stone-600">{project.description}</p>}
      </div>

      {works.length === 0 ? (
        <p className="text-stone-500">Aucune œuvre pour l&apos;instant.</p>
      ) : (
        <Gallery artworks={works} />
      )}
    </div>
  );
}
