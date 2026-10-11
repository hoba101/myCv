/**
 * ============================================
 * PROJECTS SECTION COMPONENT
 * ============================================
 * Photo-card style with image top and colored
 * text block bottom, driven by content/site.json.
 */

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { ACCENT_SWATCH } from "../lib/icons";
import type { Project } from "../lib/types";
import InView from "./InView";

export default function ProjectsSection({ items }: { items: Project[] }) {
  if (items.length === 0) return null;

  return (
    <section id="projects" className="py-20 relative">
      <div className="section-container">
        <InView className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-theme">my projects</h2>
        </InView>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {items.map((project, index) => {
            const Wrapper = project.href ? "a" : "div";

            return (
              <InView key={project.id} delay={index * 0.15} className="h-full">
                <Wrapper
                  {...(project.href
                    ? { href: project.href, target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="bg-card border-[3px] border-theme flex flex-col h-full hover:-translate-y-1 transition-all cursor-pointer group block"
                  style={{ boxShadow: "4px 4px 0px 0px var(--shadow-color)" }}
                >
                  <div className="relative w-full h-56 md:h-72 border-b-[3px] border-theme overflow-hidden bg-gray-200">
                    {project.imageUrl ? (
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : null}
                    <div className="absolute top-4 right-4 bg-card text-theme border-[3px] border-theme w-10 h-10 flex items-center justify-center group-hover:rotate-12 transition-transform" style={{ boxShadow: "2px 2px 0px 0px var(--shadow-color)" }}>
                      <ArrowUpRight size={20} strokeWidth={3} />
                    </div>
                  </div>
                  <div className={`p-5 md:p-6 ${ACCENT_SWATCH[project.accent]} text-black`}>
                    <h3 className="text-lg md:text-xl font-bold mb-2 line-clamp-2">{project.title}</h3>
                    <p className="text-black/70 text-xs md:text-sm font-bold">{project.category}</p>
                  </div>
                </Wrapper>
              </InView>
            );
          })}
        </div>
      </div>
    </section>
  );
}