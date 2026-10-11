"use client";

import { useSyncExternalStore } from "react";

/**
 * 0 = static (no motion)
 * 1 = canvas particles
 * 2 = 3D scene (opt-in, requires three + @react-three/fiber)
 */
export type Tier = 0 | 1 | 2;

function noopSubscribe() {
  return () => {};
}

function hasCanvas(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("2d"));
  } catch {
    return false;
  }
}

function detect(): Tier {
  if (typeof window === "undefined") return 0;

  // The user has told us they don't want motion — honour it absolutely.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return 0;
  }

  // Data saver: don't spend someone's bandwidth on decoration.
  const conn = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (conn?.saveData) return 0;
  if (conn?.effectiveType === "2g" || conn?.effectiveType === "slow-2g") {
    return 0;
  }

  if (!hasCanvas()) return 0;

  // Coarse hints only. Firefox and Safari report undefined for
  // deviceMemory / hardwareConcurrency, so absent values fall through to
  // tier 1 rather than being treated as low-end.
  const cores = navigator.hardwareConcurrency ?? 0;
  const memory = (
    navigator as Navigator & { deviceMemory?: number }
  ).deviceMemory;

  const narrow = window.matchMedia("(min-width: 768px)").matches;
  const roomy = window.matchMedia("(min-width: 1280px)").matches;

  if (narrow) return 1;
  if (cores >= 8 && (memory ?? 8) >= 8 && roomy) return 2;
  return 1;
}

let cached: Tier | null = null;

function getSnapshot(): Tier {
  if (cached === null) cached = detect();
  return cached;
}

function getServerSnapshot(): Tier {
  return 0;
}

export function useCapabilityTier(): Tier {
  return useSyncExternalStore(noopSubscribe, getSnapshot, getServerSnapshot);
}

/** True only once the client has taken over from the server render. */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}