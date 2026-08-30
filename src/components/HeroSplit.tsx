"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

export interface HeroPanel {
  label: string;
  href: string;
  image: string;
}

/** Héros écran scindé façon « art.gal » : éditorial à gauche, menu en
 *  colonnes d'images à droite (libellés verticaux, colonnes qui s'élargissent
 *  au survol). */
export function HeroSplit({
  panels,
  miniImage,
  miniCaption,
}: {
  panels: HeroPanel[];
  miniImage: string;
  miniCaption: string;
}) {
  const reduced = useReducedMotion();

  return (
    <section className="full-bleed flex min-h-[88vh] flex-col border-b border-line bg-paper lg:flex-row">
      {/* Panneau éditorial gauche */}
      <motion.div
        className="flex flex-1 flex-col justify-center px-6 py-14 sm:px-12 lg:py-0"
        initial={reduced ? false : "hidden"}
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
      >
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 48 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
          }}
          className="font-display text-5xl font-black uppercase leading-[0.95] tracking-tight text-ink sm:text-7xl"
        >
          Suivez
          <br />
          l&apos;art<span className="text-accent-warm">.</span>
        </motion.h1>
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 32 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
          }}
          className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft"
        >
          Euchenith Marie-Jean, enseignante en arts visuels, expose ici les
          projets réalisés en classe par ses élèves. Parents et proches,
          découvrez vos jeunes artistes.
        </motion.p>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 32 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
          }}
          className="mt-10"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={miniImage}
            alt=""
            className="h-36 w-52 border border-line object-cover shadow-frame"
          />
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-ink-faint">
            {miniCaption}
          </p>
        </motion.div>
      </motion.div>

      {/* Menu en colonnes d'images à droite */}
      <div className="flex h-64 w-full lg:h-auto lg:w-1/2">
        {panels.map((p, i) => (
          <motion.div
            key={p.label}
            className="group relative flex-1 overflow-hidden transition-all duration-700 ease-out hover:grow-[2]"
            initial={reduced ? false : { opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: EASE }}
          >
            <Link href={p.href} className="absolute inset-0 block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt=""
                aria-hidden
                style={{ objectPosition: `${12 + i * 25}% center` }}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-black/35 transition-colors duration-500 group-hover:bg-black/15"
                aria-hidden
              />
              <span className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-xl font-bold uppercase tracking-wide text-white [writing-mode:vertical-rl] rotate-180 drop-shadow-md sm:text-2xl lg:bottom-8 lg:text-3xl">
                {p.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
