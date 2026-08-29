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
      <Link
        href="/"
        className="text-sm text-ink-soft transition-colors hover:text-accent"
      >
        ← Tous les projets
      </Link>
      <header className="mb-12 mt-6 max-w-3xl">
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
          {project.title}
        </h1>
        <div className="mt-4 h-1 w-14 bg-accent" aria-hidden />
        {project.schoolYear && (
          <span className="mt-4 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            {project.schoolYear}
          </span>
        )}
        {project.description && (
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">{project.description}</p>
        )}
      </header>

      {works.length === 0 ? (
        <p className="text-ink-soft">Aucune œuvre pour l&apos;instant.</p>
      ) : (
        <Gallery artworks={works} />
      )}
    </div>
  );
}
