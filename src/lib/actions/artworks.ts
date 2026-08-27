"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, artworks, projects } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { saveArtworkImage, deleteArtworkFiles } from "@/lib/images";

function artworkFields(formData: FormData) {
  const studentFirstName = String(formData.get("studentFirstName") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  if (!studentFirstName) throw new Error("Le prénom de l'élève est requis");
  if (!title) throw new Error("Le titre est requis");
  return {
    studentFirstName,
    title,
    description: String(formData.get("description") ?? "").trim() || null,
    medium: String(formData.get("medium") ?? "").trim() || null,
    createdDate: String(formData.get("createdDate") ?? "").trim() || null,
  };
}

function revalidateProject(projectId: number) {
  revalidatePath("/");
  revalidatePath(`/projets/${projectId}`);
  revalidatePath(`/admin/projets/${projectId}`);
}

export async function createArtwork(
  projectId: number,
  _prev: { error?: string } | undefined,
  formData: FormData
) {
  await requireAdmin();
  try {
    const file = formData.get("image");
    if (!(file instanceof File) || file.size === 0) {
      return { error: "Veuillez choisir une image." };
    }
    const saved = await saveArtworkImage(file);
    await db.insert(artworks).values({ projectId, ...artworkFields(formData), ...saved });

    // First artwork automatically becomes the project cover.
    const [project] = await db.select().from(projects).where(eq(projects.id, projectId));
    if (project && project.coverArtworkId === null) {
      const rows = await db.select().from(artworks).where(eq(artworks.projectId, projectId));
      if (rows.length === 1) {
        await db
          .update(projects)
          .set({ coverArtworkId: rows[0].id })
          .where(eq(projects.id, projectId));
      }
    }
    revalidateProject(projectId);
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur lors du téléversement." };
  }
}

export async function updateArtwork(id: number, formData: FormData) {
  await requireAdmin();
  const [row] = await db.select().from(artworks).where(eq(artworks.id, id));
  if (!row) return;
  await db.update(artworks).set(artworkFields(formData)).where(eq(artworks.id, id));
  revalidateProject(row.projectId);
}

export async function deleteArtwork(id: number) {
  await requireAdmin();
  const [row] = await db.select().from(artworks).where(eq(artworks.id, id));
  if (!row) return;
  await deleteArtworkFiles(row.imagePath, row.thumbPath);
  await db.delete(artworks).where(eq(artworks.id, id));
  await db
    .update(projects)
    .set({ coverArtworkId: null })
    .where(eq(projects.coverArtworkId, id));
  revalidateProject(row.projectId);
}
