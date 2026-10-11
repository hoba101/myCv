"use client";

import { useCapabilityTier, useHasMounted } from "../../hooks/useCapability";
import PetalField from "./PetalField";

/**
 * Three tiers, chosen on the device rather than guessed:
 *
 *   0  static — reduced motion, data saver, or no canvas support
 *   1  canvas petals
 *   2  interactive canvas — denser field that reacts to the pointer
 *
 * A true WebGL tier (three.js) is deliberately not wired up: for a petal field
 * it costs ~250kB gzipped for a near-identical result, which is a bad trade on
 * a metered connection. The slot is here if you later want it.
 */
export default function HeroBackdrop() {
  const mounted = useHasMounted();
  const tier = useCapabilityTier();

  const animated = mounted && tier >= 1;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base wash — always on, costs nothing */}
      <div className="hero-backdrop-wash absolute inset-0" aria-hidden="true" />

      {/* Slow drifting colour fields */}
      <div className="hero-backdrop-blob hero-backdrop-blob--a" aria-hidden="true" />
      <div className="hero-backdrop-blob hero-backdrop-blob--b" aria-hidden="true" />

      {animated ? (
        <PetalField maxPetals={tier === 2 ? 90 : 46} interactive={tier === 2} />
      ) : null}

      {/* Grain + vignette so petals read as depth rather than flat stickers */}
      <div className="hero-backdrop-grain absolute inset-0" aria-hidden="true" />
      <div className="hero-backdrop-vignette absolute inset-0" aria-hidden="true" />
    </div>
  );
}