import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db, projects, artworks } from "@/db";

export const dynamic = "force-dynamic";

export default async function AccueilPage() {
  const published = await db
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(desc(projects.createdAt));

  const covers = new Map<number, string>();
  for (const p of published) {
    if (p.coverArtworkId !== null) {
      const [art] = await db.select().from(artworks).where(eq(artworks.id, p.coverArtworkId));
      if (art) covers.set(p.id, art.thumbPath);
    }
  }

  return (
    <div>
      <section className="mb-10 max-w-2xl">
        <h1 className="mb-3 text-3xl font-bold tracking-tight">
          Les projets de nos élèves
        </h1>
        <p className="text-stone-600">
          Bienvenue dans la galerie d&apos;art numérique du cours d&apos;arts visuels.
          Découvrez les projets réalisés en classe par les élèves — les parents sont
          invités à explorer le travail de leurs jeunes artistes.
        </p>
      </section>

      {published.length === 0 ? (
        <p className="text-stone-500">Aucun projet publié pour l&apos;instant. Revenez bientôt!</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {published.map((p) => (
            <Link
              key={p.id}
              href={`/projets/${p.id}`}
              className="group overflow-hidden rounded-lg border border-stone-200 bg-white transition-shadow hover:shadow-md"
            >
              <div className="aspect-[4/3] bg-stone-100">
                {covers.has(p.id) ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={`/uploads/${covers.get(p.id)}`}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-4xl text-stone-300">
                    🎨
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="font-semibold">{p.title}</h2>
                {p.schoolYear && <p className="text-sm text-stone-500">{p.schoolYear}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
