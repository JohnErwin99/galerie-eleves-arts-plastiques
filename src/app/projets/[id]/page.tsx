import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db, projects, artworks } from "@/db";
import { Gallery } from "@/components/Gallery";
import { isLoggedIn } from "@/lib/auth";
import { Reveal } from "@/components/Reveal";

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
      {/* Bandeau du projet, illustration en fond */}
      <section className="relative overflow-hidden bg-[#f2f0eb]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/banniere.webp"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20"
          aria-hidden
        />
        <Reveal className="relative mx-auto max-w-6xl px-4 pb-12 pt-20 sm:px-6 sm:pt-28" y={36}>
          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-[0.25em] text-mint transition-colors hover:text-white"
          >
            ← Tous les projets
          </Link>
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-tight text-white sm:text-5xl">
            {project.title}
          </h1>
          <div className="mt-4 h-[3px] w-14 bg-gradient-to-r from-mint to-lilac" aria-hidden />
          {project.schoolYear && (
            <span className="mt-4 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-lilac backdrop-blur">
              {project.schoolYear}
            </span>
          )}
          {project.description && (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90">
              {project.description}
            </p>
          )}
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Reveal>
          <h2 className="line-after mb-10 text-2xl font-bold sm:text-3xl">
            Les <span className="accent-word">œuvres</span> du projet
          </h2>
        </Reveal>
        {works.length === 0 ? (
          <p className="text-ink-soft">Aucune œuvre pour l&apos;instant.</p>
        ) : (
          <Gallery artworks={works} />
        )}
      </section>
    </div>
  );
}
