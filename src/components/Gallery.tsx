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
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {artworks.map((w, i) => (
          <button
            key={w.id}
            onClick={() => setIndex(i)}
            className="group overflow-hidden rounded-lg border border-stone-200 bg-white text-left transition-shadow hover:shadow-md"
          >
            <div className="aspect-square bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/uploads/${w.thumbPath}`}
                alt={`${w.title}, par ${w.studentFirstName}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-3">
              <p className="truncate text-sm font-medium">{w.title}</p>
              <p className="truncate text-xs text-stone-500">par {w.studentFirstName}</p>
            </div>
          </button>
        ))}
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${current.title}, par ${current.studentFirstName}`}
          className="fixed inset-0 z-50 flex flex-col bg-black/90 p-4"
          onClick={close}
        >
          <div className="flex justify-end gap-2 pb-2">
            <button
              onClick={(e) => { e.stopPropagation(); close(); }}
              aria-label="Fermer"
              className="rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20"
            >
              ✕ Fermer
            </button>
          </div>
          <div className="flex min-h-0 grow items-center justify-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Œuvre précédente"
              className="shrink-0 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20"
            >
              ←
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/uploads/${current.imagePath}`}
              alt={`${current.title}, par ${current.studentFirstName}`}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full min-h-0 max-w-full rounded-md object-contain"
            />
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Œuvre suivante"
              className="shrink-0 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20"
            >
              →
            </button>
          </div>
          <div
            className="mx-auto max-w-2xl pt-4 text-center text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-lg font-semibold">{current.title}</p>
            <p className="text-sm text-stone-300">
              par {current.studentFirstName}
              {current.medium && ` · ${current.medium}`}
              {formatDate(current.createdDate) && ` · ${formatDate(current.createdDate)}`}
            </p>
            {current.description && (
              <p className="mt-2 text-sm text-stone-400">{current.description}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
