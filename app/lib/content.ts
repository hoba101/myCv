import { promises as fs } from "node:fs";
import path from "node:path";
import { connection } from "next/server";
import {
  isAccentKey,
  isSocialPlatform,
  type Project,
  type Service,
  type SiteContent,
  type Skill,
  type SocialLink,
} from "./types";

const CONTENT_PATH = path.join(process.cwd(), "content", "site.json");

const FALLBACK: SiteContent = {
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

export function parseContent(raw: string): SiteContent {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return FALLBACK;
  }
  const data = (parsed ?? {}) as Record<string, unknown>;
  return {
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