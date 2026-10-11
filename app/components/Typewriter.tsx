"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false
  );
}

/**
 * Minimal rotating typewriter. ~40 lines beats pulling in an animation
 * library for one effect — which matters on a metered connection.
 */
export default function Typewriter({
  words,
  className = "",
}: {
  words: string[];
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const list = words.filter(Boolean);

  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (list.length === 0 || reduced) return;

    const current = list[index % list.length];
    const finished = !deleting && text === current;
    const emptied = deleting && text === "";

    const delay = finished ? 1600 : emptied ? 0 : deleting ? 45 : 85;

    const timer = setTimeout(() => {
      if (finished) {
        setDeleting(true);
      } else if (emptied) {
        setDeleting(false);
        setIndex((i) => (i + 1) % list.length);
      } else {
        setText(
          deleting
            ? current.slice(0, text.length - 1)
            : current.slice(0, text.length + 1)
        );
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [text, deleting, index, list, reduced]);

  if (list.length === 0) return null;

  // Reduced motion: show the first word statically rather than animating.
  const shown = reduced ? list[0] : text;

  return (
    <span className={className}>
      {shown}
      {!reduced ? (
        <span className="animate-cursor-blink ml-1 inline-block h-[0.95em] w-[3px] align-middle bg-current" />
      ) : null}
    </span>
  );
}