"use client";

import { useCallback, useEffect, useState } from "react";
import type { Artwork } from "@/db";

function formatDate(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-CA", { year: "numeric", month: "long", day: "numeric" });
}

export function Gallery({ artworks }: { artworks: Artwork[] }) {
  const [index, setIndex] = useState<number | null>(null);

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
      {/* Mur de galerie : chaque œuvre sur son passe-partout blanc */}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {artworks.map((w, i) => (
          <button
            key={w.id}
            onClick={() => setIndex(i)}
            className="group rounded-lg border border-line bg-paper p-3 text-left shadow-frame transition-all duration-300 hover:-translate-y-1 hover:shadow-frame-lift sm:p-4"
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
            <div className="pt-3">
              <p className="truncate font-display font-semibold group-hover:text-accent">
                {w.title}
              </p>
              <p className="truncate text-xs text-ink-soft">par {w.studentFirstName}</p>
            </div>
          </button>
        ))}
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${current.title}, par ${current.studentFirstName}`}
          className="fixed inset-0 z-50 flex flex-col bg-[#161215]/95 p-4 backdrop-blur-sm"
          onClick={close}
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/uploads/${current.imagePath}`}
              alt={`${current.title}, par ${current.studentFirstName}`}
              onClick={(e) => e.stopPropagation()}
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
        </div>
      )}
    </>
  );
}
