import { promises as fs } from "node:fs";
import path from "node:path";
import { connection } from "next/server";
import {
  isAccentKey,
  isSocialPlatform,
  type Cta,
  type HeroContent,
  type Project,
  type Service,
  type SiteContent,
  type SiteProfile,
  type Skill,
  type SocialLink,
} from "./types";

const CONTENT_PATH = path.join(process.cwd(), "content", "site.json");

const DEFAULT_PROFILE: SiteProfile = {
  name: "Your Name",
  handle: "yourhandle",
  email: "you@example.com",
  role: "Creative Web Developer",
  logoUrl: "",
  photoUrl: "",
  configured: false,
};

const DEFAULT_HERO: HeroContent = {
  eyebrow: "Creative Web Developer",
  headline: "I design and build web experiences people enjoy using.",
  typedWords: ["fast", "modern", "accessible"],
  subheadline:
    "Thoughtful interfaces, clean code, and a dashboard so you can keep everything up to date yourself.",
  primaryCta: { label: "See my work", href: "#projects" },
  secondaryCta: { label: "Hire me", href: "#contact" },
  showPhoto: true,
};

const FALLBACK: SiteContent = {
  profile: DEFAULT_PROFILE,
  hero: DEFAULT_HERO,
  services: [],
  skills: [],
  projects: [],
  socials: [],
};

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function sanitizeService(input: unknown, index: number): Service {
  const raw = (input ?? {}) as Record<string, unknown>;
  return {
    id: asString(raw.id, `svc-${Date.now()}-${index}`),
    title: asString(raw.title, "untitled service"),
    description: asString(raw.description),
    icon: asString(raw.icon, "star"),
    accent: isAccentKey(raw.accent) ? raw.accent : "blue",
  };
}

function sanitizeSkill(input: unknown, index: number): Skill {
  const raw = (input ?? {}) as Record<string, unknown>;
  return {
    id: asString(raw.id, `skill-${Date.now()}-${index}`),
    name: asString(raw.name, "untitled skill"),
    icon: asString(raw.icon, "sparkles"),
    accent: isAccentKey(raw.accent) ? raw.accent : "blue",
    rotation: asNumber(raw.rotation, 0),
  };
}

function sanitizeProject(input: unknown, index: number): Project {
  const raw = (input ?? {}) as Record<string, unknown>;
  return {
    id: asString(raw.id, `proj-${Date.now()}-${index}`),
    title: asString(raw.title, "untitled project"),
    category: asString(raw.category),
    imageUrl: asString(raw.imageUrl),
    accent: isAccentKey(raw.accent) ? raw.accent : "blue",
    href: asString(raw.href),
  };
}

function sanitizeSocial(input: unknown, index: number): SocialLink {
  const raw = (input ?? {}) as Record<string, unknown>;
  return {
    id: asString(raw.id, `soc-${Date.now()}-${index}`),
    platform: isSocialPlatform(raw.platform) ? raw.platform : "github",
    label: asString(raw.label, "Link"),
    href: asString(raw.href),
    active: asBoolean(raw.active, false),
  };
}

function sanitizeProfile(input: unknown): SiteProfile {
  const raw = (input ?? {}) as Record<string, unknown>;
  return {
    name: asString(raw.name, DEFAULT_PROFILE.name),
    handle: asString(raw.handle, DEFAULT_PROFILE.handle),
    email: asString(raw.email, DEFAULT_PROFILE.email),
    role: asString(raw.role, DEFAULT_PROFILE.role),
    logoUrl: asString(raw.logoUrl, DEFAULT_PROFILE.logoUrl),
    photoUrl: asString(raw.photoUrl, DEFAULT_PROFILE.photoUrl),
    configured: asBoolean(raw.configured, DEFAULT_PROFILE.configured),
  };
}

function sanitizeCta(input: unknown, fallback: Cta): Cta {
  const raw = (input ?? {}) as Record<string, unknown>;
  return {
    label: asString(raw.label, fallback.label),
    href: asString(raw.href, fallback.href),
  };
}

function sanitizeHero(input: unknown): HeroContent {
  const raw = (input ?? {}) as Record<string, unknown>;
  return {
    eyebrow: asString(raw.eyebrow, DEFAULT_HERO.eyebrow),
    headline: asString(raw.headline, DEFAULT_HERO.headline),
    typedWords: Array.isArray(raw.typedWords)
      ? raw.typedWords
          .filter((w): w is string => typeof w === "string")
          .map((w) => w.slice(0, 24))
          .slice(0, 6)
      : DEFAULT_HERO.typedWords,
    subheadline: asString(raw.subheadline, DEFAULT_HERO.subheadline),
    primaryCta: sanitizeCta(raw.primaryCta, DEFAULT_HERO.primaryCta),
    secondaryCta: sanitizeCta(raw.secondaryCta, DEFAULT_HERO.secondaryCta),
    showPhoto: asBoolean(raw.showPhoto, DEFAULT_HERO.showPhoto),
  };
}

export function parseContent(raw: string): SiteContent {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return FALLBACK;
  }
  const data = (parsed ?? {}) as Record<string, unknown>;
  return {
    profile: sanitizeProfile(data.profile),
    hero: sanitizeHero(data.hero),
    services: Array.isArray(data.services)
      ? data.services.map(sanitizeService)
      : [],
    skills: Array.isArray(data.skills)
      ? data.skills.map(sanitizeSkill)
      : [],
    projects: Array.isArray(data.projects)
      ? data.projects.map(sanitizeProject)
      : [],
    socials: Array.isArray(data.socials)
      ? data.socials.map(sanitizeSocial)
      : [],
  };
}

export async function getContent(): Promise<SiteContent> {
  await connection();
  try {
    const raw = await fs.readFile(CONTENT_PATH, "utf-8");
    return parseContent(raw);
  } catch {
    return FALLBACK;
  }
}

export async function saveContent(content: SiteContent): Promise<void> {
  const dir = path.dirname(CONTENT_PATH);
  await fs.mkdir(dir, { recursive: true });

  const tmp = path.join(
    dir,
    `.site.${process.pid}.${Date.now()}.tmp`
  );
  const payload = `${JSON.stringify(content, null, 2)}\n`;

  await fs.writeFile(tmp, payload, "utf-8");
  await fs.rename(tmp, CONTENT_PATH);
}

export function newId(prefix: string): string {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${suffix}`;
}