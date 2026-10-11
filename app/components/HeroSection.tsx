/**
 * ============================================
 * HERO SECTION COMPONENT
 * ============================================
 * Neo-brutalist structure, modern depth and motion.
 * The backdrop picks its own quality tier on the device, so the page
 * never depends on JavaScript to be readable.
 */

import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import type { HeroContent, SiteProfile } from "../lib/types";
import HeroBackdrop from "./hero/HeroBackdrop";
import Typewriter from "./Typewriter";

function Star({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      stroke="var(--border-color)"
      strokeWidth="2"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function Spark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="text-black">
      <path
        fill="currentColor"
        d="M12 2l2.4 6.2L21 9l-5 4.2L17 20l-5-3.6L7 20l1-6.8L3 9l6.6-.8z"
      />
    </svg>
  );
}

export default function HeroSection({
  hero,
  profile,
}: {
  hero: HeroContent;
  profile: SiteProfile;
}) {
  const showPortrait = hero.showPhoto && Boolean(profile.photoUrl);

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-28 pb-16 md:pt-32 md:pb-24"
    >
      <HeroBackdrop />

      <div className="section-container relative z-10 w-full">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* --- Copy --- */}
          <div className="max-w-2xl">
            {hero.eyebrow ? (
              <p className="hero-rise inline-flex items-center gap-2 border-[3px] border-theme bg-accent-highlight px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-black">
                <span className="relative inline-flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-black" />
                </span>
                Available for work
              </p>
            ) : null}

            <h1 className="hero-rise delay-100 mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-theme sm:text-5xl lg:text-6xl xl:text-7xl">
              {hero.headline}
              {hero.typedWords.length > 0 ? (
                <>
                  {" "}
                  {/* The highlight bar is bright lime in both themes, so
                      black text on top stays legible in light and dark. */}
                  <span className="relative inline-block -rotate-1 bg-accent-highlight px-2 pb-0.5 text-black">
                    <Typewriter words={hero.typedWords} />
                  </span>
                </>
              ) : null}
            </h1>

            {hero.subheadline ? (
              <p className="hero-rise delay-200 mt-6 max-w-xl text-base leading-relaxed text-theme-muted md:text-lg">
                {hero.subheadline}
              </p>
            ) : null}

            <div className="hero-rise delay-300 mt-9 flex flex-wrap items-center gap-4">
              {hero.primaryCta.label ? (
                <a
                  href={hero.primaryCta.href || "#projects"}
                  className="brutal-btn group bg-accent-highlight px-6 py-3 text-base text-black hover:-translate-y-0.5"
                >
                  {hero.primaryCta.label}
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </a>
              ) : null}

              {hero.secondaryCta.label ? (
                <a
                  href={hero.secondaryCta.href || "#contact"}
                  className="brutal-btn px-6 py-3 text-base"
                >
                  {hero.secondaryCta.label}
                </a>
              ) : null}
            </div>

            {/* --- Meta strip --- */}
            <div className="hero-rise delay-400 mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
              <span className="flex items-center gap-2 text-sm text-theme-muted">
                <MapPin size={15} className="text-accent-highlight" />
                {profile.role}
              </span>
              <span className="flex items-center gap-2 text-sm text-theme-muted">
                <Spark size={14} />
                <span className="italic">it&apos;s {profile.name}, hi!</span>
              </span>
            </div>
          </div>

          {/* --- Portrait --- */}
          <div className="hero-rise delay-200 flex justify-center lg:justify-end">
            <div className="hero-portrait group relative h-[280px] w-[280px] sm:h-[360px] sm:w-[360px]">
              <span
                className="absolute -left-3 -right-3 -top-3 -bottom-3 border-[3px] border-transparent transition-transform duration-500 group-hover:rotate-3"
                style={{ borderColor: "var(--border-color)" }}
                aria-hidden="true"
              />
              <span
                className="absolute -inset-3 -z-10 transition-transform duration-500 group-hover:-rotate-2"
                aria-hidden="true"
              >
                <span className="absolute inset-0 bg-accent-pink" />
              </span>

              <div className="absolute inset-0 overflow-hidden border-[3px] border-theme bg-accent-blue">
                {showPortrait ? (
                  <Image
                    src={profile.photoUrl}
                    alt={`${profile.name}, ${profile.role}`}
                    fill
                    sizes="360px"
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <span className="select-none text-8xl font-bold text-black">
                    :)
                  </span>
                )}

                {/* scanline sheen */}
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--accent-highlight) 28%, transparent) 50%, transparent 100%)",
                  }}
                  aria-hidden="true"
                />
              </div>

              <div
                className="absolute -bottom-5 -right-5 flex h-16 w-16 animate-float items-center justify-center rounded-full border-[3px] border-theme bg-accent-highlight delay-300"
                style={{ boxShadow: "2px 2px 0px 0px var(--shadow-color)" }}
                aria-hidden="true"
              >
                <Spark size={22} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Floating decorations --- */}
      <Star className="parallax-slow absolute left-[6%] top-[22%] h-9 w-9 animate-float fill-accent-pink delay-100" />
      <Star className="parallax-fast absolute right-[8%] top-[16%] h-7 w-7 animate-float fill-accent-blue delay-300" />
      <Star className="parallax-slow absolute bottom-[18%] left-[12%] h-5 w-5 animate-float fill-accent-green delay-500" />
    </section>
  );
}