/**
 * ============================================
 * SKILLS SECTION COMPONENT
 * ============================================
 * Cute, playful neo-brutalism skills display.
 * Styled as scattered chunky stickers.
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
    <section id="skills" className="py-20 relative overflow-hidden">
      {/* Cute Floating Decorative Element */}
      <div className="absolute top-8 left-[15%] animate-float delay-300">
        <div className="w-14 h-14 bg-accent-pink border-[3px] border-theme rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_var(--shadow-color)] -rotate-12">
          <HeartIcon />
        </div>
      </div>

      <div className="absolute bottom-12 right-[20%] animate-float delay-500">
        <div className="w-12 h-12 bg-accent-highlight border-[3px] border-theme flex items-center justify-center shadow-[4px_4px_0px_0px_var(--shadow-color)] rotate-12" style={{ borderRadius: '4px' }}>
          <StarIcon />
        </div>
      </div>

      <div className="section-container text-center">
        {/* --- Section Header --- */}
        <InView className="mb-14 relative inline-block">
          <h2 className="text-4xl md:text-5xl font-extrabold text-theme lowercase">
            my toolkit
          </h2>
          <svg className="absolute -bottom-6 left-0 w-full h-4 stroke-accent-green" viewBox="0 0 100 20" preserveAspectRatio="none">
             <path d="M0 10 Q 25 20, 50 10 T 100 10" fill="none" strokeWidth="6" strokeLinecap="round" />
          </svg>
        </InView>

        {/* --- Scattered Sticker Skills --- */}
        <div className="flex flex-wrap justify-center items-center gap-6 max-w-4xl mx-auto mt-8">
          {items.map((skill, index) => {
            const Icon = getIcon(skill.icon);
            return (
              <InView key={skill.id} animation="scale-in" delay={index * 0.1}>
                <div
                  className={`brutal-pill ${ACCENT_SWATCH[skill.accent]} !px-6 !py-3 flex items-center gap-2.5 cursor-pointer group relative hover:!translate-y-[-8px] hover:!rotate-0 hover:!scale-110 hover:!shadow-[8px_8px_0px_0px_var(--shadow-color)] focus-within:z-10`}
                  style={{ transform: `rotate(${skill.rotation}deg)` }}
                >
                  <span className="text-black group-hover:animate-wiggle">
                    <Icon size={20} strokeWidth={2.5} />
                  </span>
                  <span className="text-base font-extrabold text-black lowercase tracking-wide">
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