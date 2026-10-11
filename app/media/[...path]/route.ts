import { promises as fs } from "node:fs";
import { mimeForFile, resolveUploadPath } from "@/app/lib/uploads";

/**
 * Serves uploaded images from content/uploads.
 *
 * public/ cannot be used: Next.js snapshots that directory once at server
 * boot, so anything uploaded afterwards 404s until a restart.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;

  if (!segments?.length) {
    return new Response("Not found", { status: 404 });
  }

  const target = resolveUploadPath(segments);
  if (!target) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const file = await fs.readFile(target);
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": mimeForFile(target),
        "Content-Length": String(file.byteLength),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}