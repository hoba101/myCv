"use client";

import { useCallback, useSyncExternalStore } from "react";

const EVENT = "physics-store";

/**
 * `useSyncExternalStore` requires `getSnapshot` to return a referentially
 * stable value for unchanged state. Re-parsing JSON on every call would hand
 * back a fresh object each time and spin React into an infinite render loop,
 * so parsed snapshots are memoised by their serialised form.
 */
const parsedCache = new Map<string, unknown>();

function parse<T>(raw: string, fallback: T): T {
  const hit = parsedCache.get(raw);
  if (hit !== undefined) return hit as T;
  try {
    const value = JSON.parse(raw) as T;
    parsedCache.set(raw, value);
    return value;
  } catch {
    return fallback;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

/**
 * `useState` backed by `localStorage` that survives reloads without tripping
 * hydration mismatches or the set-state-in-effect lint rule.
 *
 * The server always renders `fallback`; the stored value is adopted on the
 * first client commit, so the markup is identical on both sides.
 */
export function usePersistentState<T>(
  key: string,
  fallback: T,
): [T, (next: T | ((previous: T) => T)) => void] {
  const fallbackRef = useCallback(() => fallback, [fallback]);

  const value = useSyncExternalStore<T>(
    subscribe,
    () => {
      const raw = window.localStorage.getItem(key);
      return raw === null ? fallbackRef() : parse<T>(raw, fallbackRef());
    },
    fallbackRef,
  );

  const setValue = useCallback(
    (next: T | ((previous: T) => T)) => {
      const resolved =
        typeof next === "function" ? (next as (previous: T) => T)(value) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        // Private browsing or a full quota — the UI still works in memory.
      }
      window.dispatchEvent(new Event(EVENT));
    },
    [key, value],
  );

  return [value, setValue];
}

export function clearPersistentState(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore: nothing to clear.
  }
}
