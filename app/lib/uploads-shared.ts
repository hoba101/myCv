/**
 * Client-safe upload metadata. Kept free of any node:* import so client
 * components can reference these constants without pulling fs into the
 * browser bundle.
 */

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",
};

export const ACCEPT_ATTR = Object.keys(ALLOWED_TYPES).join(",");

export function extensionFor(type: string): string | null {
  return ALLOWED_TYPES[type] ?? null;
}

export function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}