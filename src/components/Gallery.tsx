"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Artwork } from "@/db";

const EASE = [0.22, 1, 0.36, 1] as const;

function formatDate(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-CA", { year: "numeric", month: "long", day: "numeric" });
}

export function Gallery({ artworks }: { artworks: Artwork[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const reduced = useReducedMotion();

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? null : (i - 1 + artworks.length) % artworks.length)),
    [artworks.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? null : (i + 1) % artworks.length)),
    [artworks.length]
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, prev, next]);

  const current = index === null ? null : artworks[index];

  return (
    <>
      {/* Cartes façon L'Original : bord fin, coins nets, légende compacte */}
      <motion.div
        className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4"
        initial={reduced ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
      >
        {artworks.map((w, i) => (
          <motion.button
            key={w.id}
            onClick={() => setIndex(i)}
            variants={{
              hidden: { opacity: 0, y: 56 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
            }}
            className="group border border-line bg-paper text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-frame-lift"
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
              <p className="truncate text-sm font-bold group-hover:text-accent">{w.title}</p>
              <p className="truncate text-xs text-ink-soft">par {w.studentFirstName}</p>
              {w.medium && (
                <p className="truncate text-[11px] text-ink-faint">{w.medium}</p>
              )}
            </div>
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence>
      {current && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${current.title}, par ${current.studentFirstName}`}
          className="fixed inset-0 z-50 flex flex-col bg-[#161215]/95 p-4 backdrop-blur-sm"
          onClick={close}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex justify-end gap-2 pb-2">
            <button
              onClick={(e) => { e.stopPropagation(); close(); }}
              aria-label="Fermer"
              className="rounded-full bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-accent"
            >
              ✕ Fermer
            </button>
          </div>
          <div className="flex min-h-0 grow items-center justify-center gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Œuvre précédente"
              className="shrink-0 rounded-full bg-white/10 px-4 py-3 text-white transition-colors hover:bg-accent"
            >
              ←
            </button>
            <motion.img
              key={current.id}
              src={`/uploads/${current.imagePath}`}
              alt={`${current.title}, par ${current.studentFirstName}`}
              onClick={(e) => e.stopPropagation()}
              initial={reduced ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="max-h-full min-h-0 max-w-full rounded-sm bg-paper object-contain p-1 shadow-2xl sm:p-2"
            />
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Œuvre suivante"
              className="shrink-0 rounded-full bg-white/10 px-4 py-3 text-white transition-colors hover:bg-accent"
            >
              →
            </button>
          </div>
          <div
            className="mx-auto max-w-2xl pt-5 text-center text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-display text-xl font-semibold">{current.title}</p>
            <p className="mt-1 text-sm text-white/70">
              par {current.studentFirstName}
              {current.medium && ` · ${current.medium}`}
              {formatDate(current.createdDate) && ` · ${formatDate(current.createdDate)}`}
            </p>
            {current.description && (
              <p className="mt-2 text-sm text-white/50">{current.description}</p>
            )}
            <p className="mt-2 text-xs text-white/30">
              {index! + 1} / {artworks.length}
            </p>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}
