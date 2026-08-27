import fs from "node:fs/promises";
import path from "node:path";
import { uploadsRoot } from "@/lib/images";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: parts } = await params;
  const root = uploadsRoot();
  const filePath = path.resolve(root, ...parts);
  if (!filePath.startsWith(root + path.sep)) {
    return new Response("Interdit", { status: 403 });
  }
  try {
    const data = await fs.readFile(filePath);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Introuvable", { status: 404 });
  }
}
