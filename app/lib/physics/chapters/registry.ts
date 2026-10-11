import type { Chapter } from "../types";

/**
 * Slug to chapter-body loaders.
 *
 * Phase 2 only adds a new `chapter-N.ts` file and one line here — no route,
 * component or registry change is required.
 */
const LOADERS: Record<string, () => Promise<Chapter | null>> = {
  "units-and-dimensions": async () => (await import("./chapter-1")).chapter1,
};

export async function getChapter(slug: string): Promise<Chapter | null> {
  const loader = LOADERS[slug];
  if (!loader) return null;
  return (await loader()) ?? null;
}

export function hasChapter(slug: string): boolean {
  return slug in LOADERS;
}
