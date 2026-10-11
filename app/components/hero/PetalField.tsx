"use client";

import { useEffect, useRef } from "react";

interface Petal {
  x: number;
  y: number;
  size: number;
  rot: number;
  rotSpeed: number;
  swayAmp: number;
  swaySpeed: number;
  swayPhase: number;
  fallSpeed: number;
  drift: number;
  layer: number;
  alpha: number;
  /** pre-computed petal shape variant 0..2 */
  shape: number;
}

/**
 * Canvas 2D sakura field.
 *
 * Chosen over a 3D scene on purpose: for a petal field the visual result is
 * near-identical at roughly 1/30th of the bundle cost, and it stays smooth on
 * cheap hardware. Density adapts to measured frame rate, so a mid-range
 * machine thins out rather than stuttering.
 */

const LAYERS = [
  { size: 3.0, fall: 14, drift: 10, alpha: 0.32 },
  { size: 5.5, fall: 26, drift: 20, alpha: 0.55 },
  { size: 9.0, fall: 44, drift: 34, alpha: 0.85 },
];

export default function PetalField({
  className = "",
  maxPetals = 70,
  interactive = false,
}: {
  className?: string;
  maxPetals?: number;
  interactive?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Capture into locals so the closures below keep the non-null narrowing.
    const el = canvas;
    const g = ctx;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let petals: Petal[] = [];
    const target = maxPetals;
    let raf = 0;
    let running = true;
    let last = performance.now();
    let scrollY = 0;
    let elapsed = 0;
    let pointerX = 0;
    let pointerY = 0;
    let smoothPX = 0;
    let smoothPY = 0;

    // frame-rate sampling
    let frames = 0;
    let sampleStart = last;
    let quality = 1;

    const rand = (min: number, max: number) =>
      min + Math.random() * (max - min);

    function makePetal(layer: number): Petal {
      const spec = LAYERS[layer];
      return {
        x: rand(0, width),
        y: rand(-height, height),
        size: rand(spec.size * 0.6, spec.size),
        rot: rand(0, Math.PI * 2),
        rotSpeed: rand(-1.1, 1.1),
        swayAmp: rand(8, 30) + layer * 8,
        swaySpeed: rand(0.4, 1.1),
        swayPhase: rand(0, Math.PI * 2),
        fallSpeed: rand(spec.fall * 0.6, spec.fall),
        drift: rand(-spec.drift, spec.drift),
        layer,
        alpha: spec.alpha,
        shape: Math.floor(rand(0, 3)),
      };
    }

    function seed() {
      const area = (width * height) / 12000;
      const wanted = Math.round(
        Math.max(18, Math.min(target * quality, area))
      );
      petals = [];
      for (let i = 0; i < wanted; i++) {
        petals.push(makePetal(i % LAYERS.length));
      }
    }

    function resize() {
      const rect = el.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      el.width = Math.floor(width * dpr);
      el.height = Math.floor(height * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function drawPetal(p: Petal, t: number) {
      const sway = Math.sin(t * p.swaySpeed + p.swayPhase) * p.swayAmp;

      // Nearer layers react more to the pointer — cheap fake depth.
      const depth = p.layer / (LAYERS.length - 1);
      const px =
        p.x +
        sway +
        scrollY * (0.02 + p.layer * 0.035) +
        (interactive ? smoothPX * (12 + depth * 46) : 0);
      const py =
        p.y +
        scrollY * (0.05 + p.layer * 0.05) +
        (interactive ? smoothPY * (8 + depth * 30) : 0);

      if (px < -60 || px > width + 60) return;

      g.save();
      g.translate(px, py % (height + 80));
      g.rotate(p.rot);
      g.globalAlpha = p.alpha;

      const s = p.size;
      g.fillStyle = "currentColor";

      // three petal silhouettes so it doesn't read as identical stamps
      if (p.shape === 0) {
        g.beginPath();
        g.ellipse(0, 0, s, s * 0.62, 0, 0, Math.PI * 2);
        g.fill();
      } else if (p.shape === 1) {
        g.beginPath();
        g.moveTo(0, -s);
        g.bezierCurveTo(s, -s * 0.2, s * 0.6, s, 0, s * 0.8);
        g.bezierCurveTo(-s * 0.6, s, -s, -s * 0.2, 0, -s);
        g.fill();
      } else {
        g.beginPath();
        g.ellipse(0, 0, s * 0.8, s * 0.45, Math.PI / 4, 0, Math.PI * 2);
        g.fill();
      }

      g.restore();
    }

    function frame(now: number) {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      elapsed += dt;

      g.clearRect(0, 0, width, height);

      if (interactive) {
        smoothPX += (pointerX - smoothPX) * Math.min(dt * 3, 1);
        smoothPY += (pointerY - smoothPY) * Math.min(dt * 3, 1);
      }

      for (const p of petals) {
        p.y += p.fallSpeed * dt;
        p.x += p.drift * dt;
        p.rot += p.rotSpeed * dt;

        if (p.y > height + 40) {
          p.y = -40;
          p.x = Math.random() * width;
        }
        if (p.x < -80) p.x = width + 40;
        if (p.x > width + 80) p.x = -40;

        drawPetal(p, elapsed);
      }

      // adaptive quality: thin out if we're dropping frames
      frames++;
      if (now - sampleStart >= 1000) {
        const fps = (frames * 1000) / (now - sampleStart);
        if (fps < 40 && quality > 0.35) {
          quality = Math.max(0.35, quality - 0.25);
          seed();
        } else if (fps > 56 && quality < 1) {
          quality = Math.min(1, quality + 0.15);
          seed();
        }
        frames = 0;
        sampleStart = now;
      }

      raf = requestAnimationFrame(frame);
    }

    function onScroll() {
      scrollY = window.scrollY;
    }

    function onPointer(e: PointerEvent) {
      pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    }

    function onVisibility() {
      running = document.visibilityState === "visible";
      if (running) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else {
        cancelAnimationFrame(raf);
      }
    }

    resize();
    scrollY = window.scrollY;
    raf = requestAnimationFrame(frame);

    const ro = new ResizeObserver(resize);
    ro.observe(el);

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    if (interactive) {
      window.addEventListener("pointermove", onPointer, { passive: true });
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      if (interactive) {
        window.removeEventListener("pointermove", onPointer);
      }
    };
  }, [maxPetals, interactive]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full text-accent-pink ${className}`}
    />
  );
}