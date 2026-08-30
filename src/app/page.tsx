import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db, projects, artworks } from "@/db";
import { Reveal, RevealStagger, RevealItem } from "@/components/Reveal";
import { HeroSplit } from "@/components/HeroSplit";

export const dynamic = "force-dynamic";

export default async function AccueilPage() {
  const published = await db
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(desc(projects.createdAt));

  // Œuvres récentes des projets publiés (bande « en vedette » + héros)
  const recent = await db
    .select({ artwork: artworks, projectTitle: projects.title })
    .from(artworks)
    .innerJoin(projects, eq(artworks.projectId, projects.id))
    .where(eq(projects.published, true))
    .orderBy(desc(artworks.createdAt))
    .limit(12);

  const covers = new Map<number, string>();
  for (const p of published) {
    if (p.coverArtworkId !== null) {
      const [art] = await db.select().from(artworks).where(eq(artworks.id, p.coverArtworkId));
      if (art) covers.set(p.id, art.thumbPath);
    }
  }

  const panelImage = (i: number) =>
    recent[i] ? `/uploads/${recent[i].artwork.imagePath}` : "/banniere.webp";

  return (
    <div>
      {/* Héros écran scindé façon art.gal : éditorial + menu en colonnes */}
      <HeroSplit
        panels={[
          { label: "Projets", href: "#projets", image: panelImage(0) },
          { label: "Œuvres", href: "#oeuvres", image: panelImage(1) },
          { label: "Un mot", href: "#apropos", image: panelImage(2) },
        ]}
        miniImage={recent[0] ? `/uploads/${recent[0].artwork.thumbPath}` : "/banniere.webp"}
        miniCaption="Accueil — les projets les plus récents"
      />

      {/* Bande d'œuvres en vedette */}
      <section id="oeuvres" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="line-after text-2xl font-bold sm:text-3xl">
              Nos <span className="accent-word">œuvres</span> en vedette
            </h2>
            <p className="mt-3 text-sm text-ink-soft">
              Les dernières créations ajoutées à la galerie.
            </p>
          </div>
          <Link
            href="#projets"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
          >
            Explorer les projets
          </Link>
        </Reveal>

        {recent.length === 0 ? (
          <p className="text-ink-soft">Aucune œuvre pour l&apos;instant. Revenez bientôt!</p>
        ) : (
          <RevealStagger className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6">
            {recent.map(({ artwork: w, projectTitle }) => (
              <RevealItem key={w.id} className="w-44 shrink-0 sm:w-52" y={56}>
              <Link
                href={`/projets/${w.projectId}`}
                className="group block border border-line bg-paper transition-all duration-300 hover:-translate-y-1 hover:shadow-frame-lift"
              >
                <div className="aspect-square overflow-hidden bg-line-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/uploads/${w.thumbPath}`}
                    alt={`${w.title}, par ${w.studentFirstName}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-0.5 p-3">
                  <p className="truncate text-sm font-bold">{w.title}</p>
                  <p className="truncate text-xs text-ink-soft">par {w.studentFirstName}</p>
                  <p className="truncate text-[11px] text-ink-faint">
                    {w.medium ?? projectTitle}
                  </p>
                </div>
              </Link>
              </RevealItem>
            ))}
          </RevealStagger>
        )}
      </section>

      {/* Bannière pleine largeur teintée */}
      <section id="apropos" className="full-bleed pastel-gradient relative overflow-hidden">
        {recent[1] && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={`/uploads/${recent[1].artwork.imagePath}`}
            alt=""
            aria-hidden
            className="absolute inset-y-0 right-0 hidden w-1/2 object-cover opacity-90 md:block"
          />
        )}
        <div
          className="absolute inset-0 hidden bg-gradient-to-r from-mint via-pale/85 to-transparent md:block"
          aria-hidden
        />
        <Reveal className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6" y={56}>
          <h2 className="max-w-md font-display text-2xl font-semibold sm:text-3xl">
            Un mot de <span className="accent-word">Mme Marie-Jean</span>
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
            « Chaque projet réalisé en classe devient ici une exposition. Mes
            élèves n&apos;ont pas eu à choisir entre la salle de classe et le
            numérique : chacun a sa place, chaque œuvre a son mur. »
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="#projets"
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
            >
              Voir les projets
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Grille des projets */}
      <section id="projets" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Reveal>
          <h2 className="line-after mb-10 text-2xl font-bold sm:text-3xl">
            Nos <span className="accent-word">projets</span> en vedette
          </h2>
        </Reveal>

        {published.length === 0 ? (
          <p className="text-ink-soft">Aucun projet publié pour l&apos;instant. Revenez bientôt!</p>
        ) : (
          <RevealStagger className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" stagger={0.12}>
            {published.map((p) => (
              <RevealItem key={p.id} y={64}>
              <Link
                href={`/projets/${p.id}`}
                className="group block overflow-hidden border border-line bg-paper transition-all duration-300 hover:-translate-y-1 hover:shadow-frame-lift"
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
                    <span className="mt-2 inline-block rounded-full bg-tint px-3 py-1 text-xs font-medium text-accent-warm">
                      {p.schoolYear}
                    </span>
                  )}
                </div>
              </Link>
              </RevealItem>
            ))}
          </RevealStagger>
        )}
      </section>
    </div>
  );
}
