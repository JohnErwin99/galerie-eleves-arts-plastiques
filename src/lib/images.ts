import sharp from "sharp";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const uploadsDir = process.env.UPLOADS_DIR ?? "data/uploads";
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

export interface SavedImage {
  imagePath: string; // relative to uploadsDir, e.g. "2026/ab12cd.webp"
  thumbPath: string;
  width: number;
  height: number;
}

export function uploadsRoot() {
  return path.resolve(uploadsDir);
}

export async function saveArtworkImage(file: File): Promise<SavedImage> {
  if (file.size === 0) throw new Error("Fichier vide");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("Image trop volumineuse (max 15 Mo)");

  const buffer = Buffer.from(await file.arrayBuffer());
  const img = sharp(buffer, { failOn: "error" }).rotate(); // rotate: honor EXIF orientation
  const meta = await img.metadata();
  if (!meta.width || !meta.height) throw new Error("Fichier non reconnu comme image");

  const year = String(new Date().getFullYear());
  const id = crypto.randomBytes(8).toString("hex");
  const dir = path.join(uploadsRoot(), year);
  await fs.mkdir(dir, { recursive: true });

  const display = await img
    .clone()
    .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer({ resolveWithObject: true });
  await fs.writeFile(path.join(dir, `${id}.webp`), display.data);

  const thumb = await img
    .clone()
    .resize({ width: 480, height: 480, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 75 })
    .toBuffer();
  await fs.writeFile(path.join(dir, `${id}_thumb.webp`), thumb);

  return {
    imagePath: `${year}/${id}.webp`,
    thumbPath: `${year}/${id}_thumb.webp`,
    width: display.info.width,
    height: display.info.height,
  };
}

export async function deleteArtworkFiles(imagePath: string, thumbPath: string) {
  for (const p of [imagePath, thumbPath]) {
    await fs.unlink(path.join(uploadsRoot(), p)).catch(() => {});
  }
}
