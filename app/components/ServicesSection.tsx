/**
 * ============================================
 * SERVICES SECTION COMPONENT
 * ============================================
 * Neo-brutalism 2x2 services grid, driven by
 * content/site.json via the dashboard.
 */

import { getIcon, ACCENT_SWATCH } from "../lib/icons";
import type { Service } from "../lib/types";
import InView from "./InView";

export default function ServicesSection({ items }: { items: Service[] }) {
  if (items.length === 0) return null;

  return (
    <section id="services" className="relative py-20">
      {/* Decorative Star */}
      <div className="absolute top-10 right-[10%] animate-float delay-200">
        <svg width="40" height="40" viewBox="0 0 24 24" className="fill-accent-highlight" stroke="var(--border-color)" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>

      <div className="section-container">
        {/* --- Section Header --- */}
        <InView className="mb-12 relative inline-block">
          <h2 className="text-4xl md:text-5xl font-bold text-theme">
            services I provide
          </h2>
          <div className="absolute -top-6 -right-8 animate-wiggle delay-500">
            <svg width="30" height="30" viewBox="0 0 24 24" className="fill-accent-blue" stroke="var(--border-color)" strokeWidth="2">
               <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
        </InView>

        {/* --- Services Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {items.map((service, index) => {
            const IconComponent = getIcon(service.icon);

            return (
              <InView key={service.id} delay={index * 0.15}>
                <div
                  className="bg-card border-[3px] border-theme p-6 md:p-8 flex flex-col md:flex-row gap-6 hover:-translate-y-1 transition-all h-full"
                  style={{
                    borderRadius: "0px",
                    boxShadow: "4px 4px 0px 0px var(--shadow-color)",
                  }}
                >
                  {/* Icon Wrapper */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-16 h-16 rounded-full border-[3px] border-theme flex items-center justify-center ${ACCENT_SWATCH[service.accent]}`}
                      style={{ boxShadow: "2px 2px 0px 0px var(--shadow-color)" }}
                    >
                      <IconComponent size={28} strokeWidth={2.5} className="text-black" />
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl font-bold text-theme mb-3 lowercase">
                      {service.title}
                    </h3>
                    <p className="text-theme-muted text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </InView>
            );
          })}
        </div>
      </div>
    </section>
  );
}