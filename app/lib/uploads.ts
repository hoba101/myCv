import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  ACCEPT_ATTR,
  ALLOWED_TYPES,
  extensionFor,
  humanSize,
  MAX_UPLOAD_BYTES,
} from "./uploads-shared";

export {
  ACCEPT_ATTR,
  ALLOWED_TYPES,
  extensionFor,
  humanSize,
  MAX_UPLOAD_BYTES,
};

export const UPLOAD_DIR = path.join(process.cwd(), "content", "uploads");

/**
 * Resolves a URL segment list to an absolute path inside UPLOAD_DIR.
 * Returns null if the result would escape the directory.
 */
export function resolveUploadPath(segments: string[]): string | null {
  const resolved = path.resolve(UPLOAD_DIR, segments.join("/"));
  const root = path.resolve(UPLOAD_DIR);

  if (resolved !== root && !resolved.startsWith(root + path.sep)) {
    return null;
  }
  return resolved;
}

export function mimeForFile(filename: string): string {
  const ext = path.extname(filename).slice(1).toLowerCase();
  const found = Object.entries(ALLOWED_TYPES).find(([, e]) => e === ext);
  return found ? found[0] : "application/octet-stream";
}

export interface SaveResult {
  ok: boolean;
  url?: string;
  filename?: string;
  error?: string;
}

/**
 * Persists an uploaded file. The client-supplied name is never used for the
 * path — only the MIME type decides the extension.
 */
export async function saveUpload(file: File): Promise<SaveResult> {
  if (!file || typeof file.arrayBuffer !== "function") {
    return { ok: false, error: "No file received." };
  }

  if (file.size === 0) {
    return { ok: false, error: "That file is empty." };
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      ok: false,
      error: `Too large (${humanSize(file.size)}). Max is ${humanSize(MAX_UPLOAD_BYTES)}.`,
    };
  }

  const ext = extensionFor(file.type);
  if (!ext) {
    return {
      ok: false,
      error: `Unsupported image type "${file.type || "unknown"}". Use PNG, JPG, WebP, GIF, AVIF or SVG.`,
    };
  }

  // SVG can embed script. Uploaded images render inside <img>, which does not
  // execute it, but reject it explicitly rather than relying on that.
  if (ext === "svg") {
    const text = await file.text();
    if (/<script|\son\w+\s*=|javascript:/i.test(text)) {
      return { ok: false, error: "That SVG contains scripting and was rejected." };
    }
  }

  const filename = `${randomUUID()}.${ext}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(
    path.join(UPLOAD_DIR, filename),
    Buffer.from(await file.arrayBuffer())
  );

  return { ok: true, url: `/media/${filename}`, filename };
}