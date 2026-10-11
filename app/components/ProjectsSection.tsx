/**
 * ============================================
 * PROJECTS SECTION COMPONENT
 * ============================================
 * Alternating offset grid with image zoom, an
 * overlay reveal and a hover metadata slide.
 */

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { ACCENT_SWATCH } from "../lib/icons";
import type { Project } from "../lib/types";
import InView from "./InView";

export default function ProjectsSection({ items }: { items: Project[] }) {
  if (items.length === 0) return null;

  return (
    <section id="projects" className="relative py-20">
      <div className="section-container">
        <InView className="mb-14">
          <div className="flex items-end gap-4">
            <h2 className="text-4xl font-bold text-theme md:text-5xl">
              my projects
            </h2>
            <span className="mb-2 h-3 flex-1 bg-accent-blue" />
          </div>
        </InView>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {items.map((project, index) => {
            const Tag = project.href ? "a" : "div";
            // every second card drops down to break the grid rhythm
            const offset = index % 2 === 1 ? "md:mt-14" : "";

            return (
              <InView
                key={project.id}
                delay={index * 0.1}
                className={`h-full ${offset}`}
              >
                <Tag
                  {...(project.href
                    ? {
                        href: project.href,
                        target: "_blank",
                        rel: "noopener noreferrer",
                      }
                    : {})}
                  className="group relative block h-full overflow-hidden border-[3px] border-theme bg-card transition-transform duration-300 hover:-translate-y-1.5 tilt-card"
                  style={{ boxShadow: "5px 5px 0px 0px var(--shadow-color)" }}
                >
                  <div className="relative h-56 w-full overflow-hidden border-b-[3px] border-theme bg-gray-200 md:h-72">
                    {project.imageUrl ? (
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : null}

                    {/* overlay reveal */}
                    <span
                      className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background:
                          "linear-gradient(to top, color-mix(in oklab, var(--bg-color) 85%, transparent), transparent 60%)",
                      }}
                      aria-hidden="true"
                    />

                    <span className="absolute left-4 top-4 border-[3px] border-theme bg-card px-2.5 py-1 font-mono text-xs font-bold text-theme">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border-[3px] border-theme bg-card text-theme transition-transform duration-500 group-hover:rotate-45">
                      <ArrowUpRight size={18} strokeWidth={3} />
                    </span>

                    {/* hover metadata slide */}
                    {project.category ? (
                      <span className="absolute bottom-0 left-0 translate-y-full bg-theme px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--bg-color)] transition-transform duration-500 group-hover:translate-y-0">
                        {project.category}
                      </span>
                    ) : null}
                  </div>

                  <div
                    className={`p-5 md:p-6 ${ACCENT_SWATCH[project.accent]} text-black`}
                  >
                    <h3 className="mb-2 line-clamp-2 text-lg font-bold md:text-xl">
                      {project.title}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-wide text-black/60 md:text-sm">
                      view case study
                    </p>
                  </div>
                </Tag>
              </InView>
            );
          })}
        </div>
      </div>
    </section>
  );
}