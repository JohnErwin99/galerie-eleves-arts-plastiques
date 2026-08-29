import type { Artwork } from "@/db";
import { updateArtwork } from "@/lib/actions/artworks";

// Inline edit form for an existing artwork's metadata.
export function ArtworkEditRow({ artwork }: { artwork: Artwork }) {
  return (
    <form action={updateArtwork.bind(null, artwork.id)} className="space-y-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          name="studentFirstName"
          defaultValue={artwork.studentFirstName}
          required
          aria-label="Prénom de l'élève"
          className="rounded-md border border-line px-2 py-1 text-sm"
        />
        <input
          name="title"
          defaultValue={artwork.title}
          required
          aria-label="Titre"
          className="rounded-md border border-line px-2 py-1 text-sm"
        />
        <input
          name="medium"
          defaultValue={artwork.medium ?? ""}
          placeholder="Médium"
          aria-label="Médium"
          className="rounded-md border border-line px-2 py-1 text-sm"
        />
        <input
          name="createdDate"
          type="date"
          defaultValue={artwork.createdDate ?? ""}
          aria-label="Date de création"
          className="rounded-md border border-line px-2 py-1 text-sm"
        />
      </div>
      <textarea
        name="description"
        defaultValue={artwork.description ?? ""}
        placeholder="Description"
        rows={2}
        aria-label="Description"
        className="w-full rounded-md border border-line px-2 py-1 text-sm"
      />
      <button className="rounded-md border border-line px-3 py-1 text-sm hover:bg-cream">
        Enregistrer
      </button>
    </form>
  );
}
