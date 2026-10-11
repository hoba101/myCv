/**
 * ============================================
 * SERVICES SECTION COMPONENT
 * ============================================
 * Numbered brutalist cards with a hover highlight
 * sweep and 3D tilt. Driven by content/site.json.
 */

import { getIcon, ACCENT_SWATCH } from "../lib/icons";
import type { Service } from "../lib/types";
import InView from "./InView";

export default function ServicesSection({ items }: { items: Service[] }) {
  if (items.length === 0) return null;

  return (
    <section id="services" className="relative py-20">
      <div className="section-container">
        <InView className="mb-12">
          <div className="flex items-end gap-4">
            <h2 className="text-4xl font-bold text-theme md:text-5xl">
              services I provide
            </h2>
            <span className="mb-2 h-3 flex-1 bg-accent-highlight" />
          </div>
        </InView>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {items.map((service, index) => {
            const Icon = getIcon(service.icon);

            return (
              <InView key={service.id} delay={index * 0.12}>
                <article className="group relative h-full overflow-hidden border-[3px] border-theme bg-card tilt-card">
                  {/* hover highlight sweep */}
                  <span className="sweep absolute inset-0 z-0" aria-hidden="true" />

                  <div className="relative z-10 flex h-full flex-col gap-5 p-7 md:flex-row md:p-8">
                    <div className="flex items-start gap-4 md:flex-col">
                      <span
                        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[3px] border-theme transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 ${ACCENT_SWATCH[service.accent]}`}
                        style={{ boxShadow: "3px 3px 0px 0px var(--shadow-color)" }}
                      >
                        <Icon size={28} strokeWidth={2.5} className="text-black" />
                      </span>

                      <span className="mt-auto hidden font-mono text-5xl font-bold text-theme/15 md:block">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h3 className="mb-3 text-xl font-bold lowercase text-theme transition-transform duration-300 group-hover:translate-x-1">
                        {service.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-theme-muted">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </article>
              </InView>
            );
          })}
        </div>
      </div>
    </section>
  );
}