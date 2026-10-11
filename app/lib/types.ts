export const ACCENT_KEYS = ["highlight", "pink", "blue", "green"] as const;
export type AccentKey = (typeof ACCENT_KEYS)[number];

export const SOCIAL_PLATFORMS = [
  "github",
  "linkedin",
  "x",
  "instagram",
  "facebook",
  "behance",
  "dribbble",
  "youtube",
] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  accent: AccentKey;
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  accent: AccentKey;
  rotation: number;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  accent: AccentKey;
  href: string;
}

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  label: string;
  href: string;
  active: boolean;
}

export interface Cta {
  label: string;
  href: string;
}

export interface HeroContent {
  eyebrow: string;
  headline: string;
  typedWords: string[];
  subheadline: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  showPhoto: boolean;
}

export interface SiteProfile {
  name: string;
  handle: string;
  email: string;
  role: string;
  logoUrl: string;
  photoUrl: string;
  configured: boolean;
}

export interface SiteContent {
  profile: SiteProfile;
  hero: HeroContent;
  services: Service[];
  skills: Skill[];
  projects: Project[];
  socials: SocialLink[];
}

export type Collection = "services" | "skills" | "projects" | "socials";

export const COLLECTIONS: Collection[] = [
  "services",
  "skills",
  "projects",
  "socials",
];

export function isCollection(value: unknown): value is Collection {
  return (
    typeof value === "string" &&
    (COLLECTIONS as readonly string[]).includes(value)
  );
}

export function isAccentKey(value: unknown): value is AccentKey {
  return (
    typeof value === "string" && (ACCENT_KEYS as readonly string[]).includes(value)
  );
}

export function isSocialPlatform(value: unknown): value is SocialPlatform {
  return (
    typeof value === "string" &&
    (SOCIAL_PLATFORMS as readonly string[]).includes(value)
  );
}