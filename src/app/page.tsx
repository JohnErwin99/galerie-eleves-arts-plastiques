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
      <section className="py-10 sm:py-16">
        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          L&apos;art de nos élèves,
          <br />
          <span className="text-accent">exposé pour vous.</span>
        </h1>
        <div className="mt-5 h-1 w-14 bg-accent" aria-hidden />
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
          Bienvenue dans la galerie numérique du cours d&apos;arts visuels. Chaque
          projet réalisé en classe devient ici une petite exposition — parents et
          proches, découvrez le travail de vos jeunes artistes.
        </p>
      </section>

      <section className="py-8">
        <h2 className="line-after mb-10 text-3xl font-semibold">Les projets</h2>

        {published.length === 0 ? (
          <p className="text-ink-soft">Aucun projet publié pour l&apos;instant. Revenez bientôt!</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {published.map((p) => (
              <Link
                key={p.id}
                href={`/projets/${p.id}`}
                className="group overflow-hidden rounded-xl border border-line bg-paper shadow-frame transition-all duration-300 hover:-translate-y-1 hover:shadow-frame-lift"
              >
                <div className="aspect-[4/3] overflow-hidden bg-line-soft">
                  {covers.has(p.id) ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={`/uploads/${covers.get(p.id)}`}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl text-line">
                      🎨
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-semibold group-hover:text-accent">
                    {p.title}
                  </h3>
                  {p.schoolYear && (
                    <span className="mt-2 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                      {p.schoolYear}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
