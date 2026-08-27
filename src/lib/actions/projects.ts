"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, projects, artworks } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { deleteArtworkFiles } from "@/lib/images";

function projectFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Le titre est requis");
  return {
    title,
    description: String(formData.get("description") ?? "").trim() || null,
    schoolYear: String(formData.get("schoolYear") ?? "").trim() || null,
    published: formData.get("published") === "on",
  };
}

export async function createProject(formData: FormData) {
  await requireAdmin();
  const [row] = await db.insert(projects).values(projectFields(formData)).returning();
  revalidatePath("/");
  redirect(`/admin/projets/${row.id}`);
}

export async function updateProject(id: number, formData: FormData) {
  await requireAdmin();
  await db.update(projects).set(projectFields(formData)).where(eq(projects.id, id));
  revalidatePath("/");
  revalidatePath(`/projets/${id}`);
}

export async function setCoverArtwork(projectId: number, artworkId: number) {
  await requireAdmin();
  await db
    .update(projects)
    .set({ coverArtworkId: artworkId })
    .where(eq(projects.id, projectId));
  revalidatePath("/");
  revalidatePath(`/admin/projets/${projectId}`);
}

export async function deleteProject(id: number) {
  await requireAdmin();
  const rows = await db.select().from(artworks).where(eq(artworks.projectId, id));
  for (const a of rows) {
    await deleteArtworkFiles(a.imagePath, a.thumbPath);
  }
  await db.delete(projects).where(eq(projects.id, id));
  revalidatePath("/");
  redirect("/admin");
}
