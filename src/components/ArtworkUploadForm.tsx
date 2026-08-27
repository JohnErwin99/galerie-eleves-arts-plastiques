"use client";

import { useActionState, useRef, useEffect } from "react";
import { createArtwork } from "@/lib/actions/artworks";

export function ArtworkUploadForm({ projectId }: { projectId: number }) {
  const action = createArtwork.bind(null, projectId);
  const [state, formAction, pending] = useActionState(action, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the form after a successful upload so the next artwork can be added quickly.
  useEffect(() => {
    if (state && !state.error) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="max-w-lg space-y-4 rounded-lg border border-stone-200 bg-white p-4"
    >
      <div>
        <label htmlFor="image" className="mb-1 block text-sm font-medium">
          Photo de l&apos;œuvre * <span className="font-normal text-stone-500">(max 15 Mo)</span>
        </label>
        <input id="image" name="image" type="file" accept="image/*" required className="w-full text-sm" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="studentFirstName" className="mb-1 block text-sm font-medium">
            Prénom de l&apos;élève *
          </label>
          <input
            id="studentFirstName"
            name="studentFirstName"
            required
            className="w-full rounded-md border border-stone-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium">
            Titre de l&apos;œuvre *
          </label>
          <input
            id="title"
            name="title"
            required
            className="w-full rounded-md border border-stone-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="medium" className="mb-1 block text-sm font-medium">
            Médium
          </label>
          <input
            id="medium"
            name="medium"
            placeholder="Ex. : Acrylique sur toile"
            className="w-full rounded-md border border-stone-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="createdDate" className="mb-1 block text-sm font-medium">
            Date de création
          </label>
          <input
            id="createdDate"
            name="createdDate"
            type="date"
            className="w-full rounded-md border border-stone-300 px-3 py-2"
          />
        </div>
      </div>
      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={2}
          className="w-full rounded-md border border-stone-300 px-3 py-2"
        />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        disabled={pending}
        className="rounded-md bg-stone-900 px-4 py-2 font-medium text-white hover:bg-stone-700 disabled:opacity-50"
      >
        {pending ? "Téléversement…" : "Ajouter l'œuvre"}
      </button>
    </form>
  );
}
