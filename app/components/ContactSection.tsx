/**
 * ============================================
 * CONTACT / FOOTER SECTION COMPONENT
 * ============================================
 * Contact CTA block + footer with the social
 * links you have switched on in the dashboard.
 */

import { Sparkles } from "lucide-react";
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
    <section id="contact" className="py-20 relative">
      <div className="section-container flex flex-col items-center">
        <InView className="w-full max-w-2xl">
          <div className="bg-accent-pink border-[3px] border-theme rounded-none p-8 md:p-12 text-center mb-12" style={{ boxShadow: '4px 4px 0px 0px var(--shadow-color)' }}>
            <h2 className="text-xl md:text-2xl font-bold text-black mb-4 lowercase">do you want me to work on your project?</h2>
            <p className="text-black/80 text-sm md:text-base font-medium max-w-md mx-auto mb-8">I will design a user-friendly, user-centered website/app for you. let&apos;s talk about the details.</p>
            <a href={`mailto:${profile.email}`} className="brutal-pill !bg-card text-theme !px-6 !py-2 hover:!bg-accent-highlight transition-colors">get in touch</a>
          </div>
        </InView>

        <InView delay={0.2} className="w-full max-w-3xl">
          <div className="bg-card border-[3px] border-theme rounded-none p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4" style={{ boxShadow: '3px 3px 0px 0px var(--shadow-color)' }}>
            <a href="#hero" className="flex items-center gap-2 text-md font-bold text-theme hover:opacity-80 transition-opacity">
              <Sparkles size={16} />
              <Logo handle={profile.handle} logoUrl={profile.logoUrl} size={16} />
            </a>
            {visible.length > 0 ? (
              <div className="flex items-center gap-4">
                {visible.map((link) => {
                  const Icon = SOCIAL_ICONS[link.platform];
                  return (
                    <a
                      key={link.id}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-theme hover:opacity-60 transition-opacity"
                      aria-label={link.label}
                      title={link.label}
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>
        </InView>
      </div>
    </section>
  );
}