/**
 * ============================================
 * SKILLS SECTION COMPONENT
 * ============================================
 * Scattered chunky stickers with 3D tilt and orbit
 * on hover. Driven by content/site.json.
 */

import { ACCENT_SWATCH, getIcon } from "../lib/icons";
import type { Skill } from "../lib/types";
import InView from "./InView";

function HeartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" className="fill-white">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" className="fill-white">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default function SkillsSection({ items }: { items: Skill[] }) {
  return (
    <section id="skills" className="relative overflow-hidden py-20">
      <div className="absolute left-[15%] top-8 animate-float delay-300" aria-hidden="true">
        <div className="flex h-14 w-14 -rotate-12 items-center justify-center rounded-full border-[3px] border-theme bg-accent-pink shadow-[4px_4px_0px_0px_var(--shadow-color)]">
          <HeartIcon />
        </div>
      </div>

      <div className="absolute bottom-12 right-[20%] animate-float delay-500" aria-hidden="true">
        <div className="flex h-12 w-12 rotate-12 items-center justify-center border-[3px] border-theme bg-accent-highlight shadow-[4px_4px_0px_0px_var(--shadow-color)]" style={{ borderRadius: "4px" }}>
          <StarIcon />
        </div>
      </div>

      <div className="section-container text-center">
        <InView className="relative mb-14 inline-block">
          <h2 className="text-4xl font-extrabold lowercase text-theme md:text-5xl">
            my toolkit
          </h2>
          <svg className="absolute -bottom-6 left-0 h-4 w-full stroke-accent-green" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 10 Q 25 20, 50 10 T 100 10" fill="none" strokeWidth="6" strokeLinecap="round" />
          </svg>
        </InView>

        <div className="mx-auto mt-8 flex max-w-4xl flex-wrap items-center justify-center gap-5">
          {items.map((skill, index) => {
            const Icon = getIcon(skill.icon);

            return (
              <InView key={skill.id} animation="scale-in" delay={index * 0.07}>
                <div
                  className={`brutal-pill group flex cursor-pointer items-center gap-2.5 !px-6 !py-3 transition-transform duration-300 hover:!translate-y-[-10px] hover:!scale-110 hover:!rotate-0 hover:!shadow-[8px_8px_0px_0px_var(--shadow-color)] focus-within:z-10 tilt-chip ${ACCENT_SWATCH[skill.accent]}`}
                  style={{ transform: `rotate(${skill.rotation}deg)` }}
                >
                  <span className="text-black transition-transform duration-300 group-hover:animate-wiggle">
                    <Icon size={20} strokeWidth={2.5} />
                  </span>
                  <span className="text-base font-extrabold lowercase tracking-wide text-black">
                    {skill.name}
                  </span>
                </div>
              </InView>
            );
          })}
        </div>
      </div>
    </section>
  );
}