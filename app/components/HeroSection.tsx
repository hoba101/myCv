/**
 * ============================================
 * HERO SECTION COMPONENT
 * ============================================
 * Neo-brutalist structure with modern motion.
 * All decorative movement is CSS (scroll-driven where supported),
 * so no JavaScript is required to see the page.
 */

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { HeroContent, SiteProfile } from "../lib/types";
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
      className="relative overflow-hidden flex items-center pt-32 pb-16 md:pt-36 md:pb-24"
    >
      {/* --- Ambient glow (pure CSS) --- */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full opacity-25 blur-[120px] hero-glow"
        aria-hidden="true"
      />

      {/* --- Floating decorations --- */}
      <Star className="parallax-slow absolute top-28 left-[8%] w-10 h-10 fill-accent-pink animate-float delay-100" />
      <Star className="parallax-fast absolute top-40 right-[12%] w-8 h-8 fill-accent-blue -rotate-12 animate-float delay-300" />
      <Star className="parallax-slow absolute bottom-24 left-[14%] w-6 h-6 fill-accent-green rotate-12 animate-float delay-500" />

      <div className="section-container relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-12">
          {/* --- Copy --- */}
          <div className="flex-1 max-w-2xl">
            {hero.eyebrow ? (
              <p className="mb-5 inline-flex items-center gap-2 border-[3px] border-theme bg-accent-highlight px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-black hero-rise">
                <span className="inline-block h-2 w-2 rounded-full bg-black animate-pulse" />
                {hero.eyebrow}
              </p>
            ) : null}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-theme leading-[1.08] tracking-tight hero-rise delay-100">
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
              <p className="mt-6 max-w-xl text-theme-muted text-base md:text-lg leading-relaxed hero-rise delay-200">
                {hero.subheadline}
              </p>
            ) : null}

            {/* --- Calls to action --- */}
            <div className="mt-10 flex flex-wrap items-center gap-4 hero-rise delay-300">
              {hero.primaryCta.label ? (
                <a
                  href={hero.primaryCta.href || "#projects"}
                  className="brutal-btn bg-accent-highlight text-black hover:-translate-y-0.5 text-base"
                >
                  {hero.primaryCta.label}
                  <ArrowRight size={17} />
                </a>
              ) : null}

              {hero.secondaryCta.label ? (
                <a
                  href={hero.secondaryCta.href || "#contact"}
                  className="brutal-btn text-base"
                >
                  {hero.secondaryCta.label}
                </a>
              ) : null}
            </div>

            {/* --- Social proof strip --- */}
            <div className="mt-12 flex items-center gap-3 hero-rise delay-400">
              <svg
                viewBox="0 0 24 24"
                className="w-9 h-9 -rotate-12 text-theme shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M10 9l-6 6 6 6" />
                <path d="M20 4v7a4 4 0 0 1-4 4H4" />
              </svg>
              <p className="text-theme font-semibold rotate-2 text-lg">
                it&apos;s {profile.name}, hi!
              </p>
            </div>
          </div>

          {/* --- Portrait --- */}
          <div className="flex-1 w-full flex justify-center hero-rise delay-200">
            <div className="relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px]">
              {/* Offset frame lines */}
              <span
                className="absolute -top-3 -bottom-3 left-0 w-[3px]"
                style={{ backgroundColor: "var(--border-color)" }}
                aria-hidden="true"
              />
              <span
                className="absolute -top-3 -bottom-3 right-0 w-[3px]"
                style={{ backgroundColor: "var(--border-color)" }}
                aria-hidden="true"
              />
              <span
                className="absolute top-0 -left-3 -right-3 h-[3px]"
                style={{ backgroundColor: "var(--border-color)" }}
                aria-hidden="true"
              />
              <span
                className="absolute bottom-0 -left-3 -right-3 h-[3px]"
                style={{ backgroundColor: "var(--border-color)" }}
                aria-hidden="true"
              />

              <div className="absolute inset-0 flex items-center justify-center overflow-hidden border-[3px] border-theme bg-accent-blue">
                {showPortrait ? (
                  <Image
                    src={profile.photoUrl}
                    alt={`${profile.name}, ${profile.role}`}
                    fill
                    sizes="320px"
                    priority
                    className="object-cover"
                  />
                ) : (
                  <span className="select-none text-8xl font-bold text-black">
                    :)
                  </span>
                )}
              </div>

              {/* Floating badge */}
              <div
                className="absolute -bottom-5 -right-5 flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-theme bg-accent-highlight animate-float delay-300"
                style={{ boxShadow: "2px 2px 0px 0px var(--shadow-color)" }}
                aria-hidden="true"
              >
                <Spark size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Spark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="text-black">
      <path
        fill="currentColor"
        d="M12 2l2.4 6.2L21 9l-5 4.2L17 20l-5-3.6L7 20l1-6.8L3 9l6.6-.8z"
      />
    </svg>
  );
}