/**
 * ============================================
 * CONTACT / FOOTER SECTION COMPONENT
 * ============================================
 * Split layout: CTA on the left, social links and
 * identity on the right.
 */

import { ArrowUpRight, Sparkles } from "lucide-react";
import { SOCIAL_ICONS } from "./SocialIcons";
import type { SiteProfile, SocialLink } from "../lib/types";
import Logo from "./Logo";
import InView from "./InView";

interface ContactSectionProps {
  links: SocialLink[];
  profile: SiteProfile;
}

export default function ContactSection({
  links,
  profile,
}: ContactSectionProps) {
  const visible = links.filter((link) => link.active && link.href);

  return (
    <section id="contact" className="relative py-20">
      <div className="section-container">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* --- CTA --- */}
          <InView>
            <div
              className="h-full border-[3px] border-theme bg-accent-pink p-8 md:p-12"
              style={{ boxShadow: "6px 6px 0px 0px var(--shadow-color)" }}
            >
              <h2 className="mb-4 text-2xl font-bold lowercase text-black md:text-4xl">
                do you want me to work on your project?
              </h2>
              <p className="mb-8 max-w-md text-sm font-medium text-black/80 md:text-base">
                I will design a user-friendly, user-centered website/app for
                you. let&apos;s talk about the details.
              </p>

              <a
                href={`mailto:${profile.email}`}
                className="brutal-btn group bg-card px-7 py-3 text-base text-theme hover:-translate-y-0.5 hover:bg-accent-highlight"
              >
                get in touch
                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>
          </InView>

          {/* --- Identity + socials --- */}
          <InView delay={0.15}>
            <div
              className="flex h-full flex-col justify-between border-[3px] border-theme bg-card p-8 md:p-10"
              style={{ boxShadow: "6px 6px 0px 0px var(--shadow-color)" }}
            >
              <div>
                <span className="mb-4 inline-flex items-center gap-2 border-[3px] border-theme bg-accent-highlight px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-black">
                  <Sparkles size={13} />
                  {profile.role}
                </span>

                <p className="text-3xl font-bold text-theme md:text-4xl">
                  <Logo handle={profile.handle} logoUrl={profile.logoUrl} size={30} />
                </p>

                <p className="mt-3 text-sm text-theme-muted">
                  <a
                    href={`mailto:${profile.email}`}
                    className="underline decoration-accent-highlight decoration-2 underline-offset-4 transition-opacity hover:opacity-70"
                  >
                    {profile.email}
                  </a>
                </p>
              </div>

              {visible.length > 0 ? (
                <div className="mt-10">
                  <p className="mb-4 text-xs font-bold uppercase tracking-widest text-theme-muted">
                    find me online
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {visible.map((link) => {
                      const Icon = SOCIAL_ICONS[link.platform];
                      return (
                        <a
                          key={link.id}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex h-12 w-12 items-center justify-center border-[3px] border-theme bg-theme text-theme transition-all duration-300 hover:-translate-y-1 hover:bg-accent-highlight hover:text-black"
                          style={{ boxShadow: "2px 2px 0px 0px var(--shadow-color)" }}
                          aria-label={link.label}
                          title={link.label}
                        >
                          <Icon size={20} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </InView>
        </div>

        <p className="mt-10 text-center text-xs text-theme-muted">
          built with Next.js 16, React 19 &amp; Tailwind CSS v4
        </p>
      </div>
    </section>
  );
}