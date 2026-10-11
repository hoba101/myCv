"use server";

import { revalidatePath } from "next/cache";
import { isAuthenticated } from "../lib/auth";
import { getContent, newId, saveContent } from "../lib/content";
import {
  isAccentKey,
  isCollection,
  isSocialPlatform,
  type AccentKey,
  type Collection,
  type Project,
  type Service,
  type SiteContent,
  type Skill,
  type SocialLink,
} from "../lib/types";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

const PATHS = ["/", "/dashboard", "/dashboard/projects", "/dashboard/skills", "/dashboard/services", "/dashboard/social"];

function refresh() {
  for (const path of PATHS) revalidatePath(path);
}

async function load(): Promise<SiteContent | null> {
  if (!(await isAuthenticated())) return null;
  return await getContent();
}

function text(value: FormDataEntryValue | null, max = 500): string {
  return String(value ?? "").trim().slice(0, max);
}

function rotate(value: FormDataEntryValue | null): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(-15, Math.min(15, Math.round(parsed)));
}

function accentOf(value: FormDataEntryValue | null): AccentKey {
  return isAccentKey(value) ? value : "blue";
}

export async function saveServiceAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const content = await load();
  if (!content) return { ok: false, error: "Not authorised." };

  const id = text(formData.get("id"), 80);
  const item: Service = {
    id: id || newId("svc"),
    title: text(formData.get("title"), 80) || "untitled service",
    description: text(formData.get("description"), 1000),
    icon: text(formData.get("icon"), 40),
    accent: accentOf(formData.get("accent")),
  };

  const index = content.services.findIndex((entry) => entry.id === item.id);
  if (index === -1) content.services.push(item);
  else content.services[index] = item;

  await saveContent(content);
  refresh();
  return { ok: true };
}

export async function saveSkillAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const content = await load();
  if (!content) return { ok: false, error: "Not authorised." };

  const id = text(formData.get("id"), 80);
  const item: Skill = {
    id: id || newId("skill"),
    name: text(formData.get("name"), 60) || "untitled skill",
    icon: text(formData.get("icon"), 40),
    accent: accentOf(formData.get("accent")),
    rotation: rotate(formData.get("rotation")),
  };

  const index = content.skills.findIndex((entry) => entry.id === item.id);
  if (index === -1) content.skills.push(item);
  else content.skills[index] = item;

  await saveContent(content);
  refresh();
  return { ok: true };
}

export async function saveProjectAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const content = await load();
  if (!content) return { ok: false, error: "Not authorised." };

  const id = text(formData.get("id"), 80);
  const item: Project = {
    id: id || newId("proj"),
    title: text(formData.get("title"), 160) || "untitled project",
    category: text(formData.get("category"), 120),
    imageUrl: text(formData.get("imageUrl"), 2000),
    accent: accentOf(formData.get("accent")),
    href: text(formData.get("href"), 2000),
  };

  const index = content.projects.findIndex((entry) => entry.id === item.id);
  if (index === -1) content.projects.push(item);
  else content.projects[index] = item;

  await saveContent(content);
  refresh();
  return { ok: true };
}

export async function saveSocialAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const content = await load();
  if (!content) return { ok: false, error: "Not authorised." };

  const platformRaw = formData.get("platform");
  const id = text(formData.get("id"), 80);
  const existing = content.socials.find((entry) => entry.id === id);

  const item: SocialLink = {
    id: id || newId("soc"),
    platform: isSocialPlatform(platformRaw)
      ? platformRaw
      : (existing?.platform ?? "github"),
    label: text(formData.get("label"), 40) || "Link",
    href: text(formData.get("href"), 2000),
    active: formData.get("active") === "on",
  };

  const index = content.socials.findIndex((entry) => entry.id === item.id);
  if (index === -1) content.socials.push(item);
  else content.socials[index] = item;

  await saveContent(content);
  refresh();
  return { ok: true };
}

export async function saveProfileAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const content = await load();
  if (!content) return { ok: false, error: "Not authorised." };

  content.profile = {
    name: text(formData.get("name"), 60) || content.profile.name,
    handle: text(formData.get("handle"), 60),
    email: text(formData.get("email"), 120),
    role: text(formData.get("role"), 80),
    logoUrl: text(formData.get("logoUrl"), 400),
    photoUrl: text(formData.get("photoUrl"), 400),
    configured: content.profile.configured,
  };

  await saveContent(content);
  refresh();
  return { ok: true };
}

export async function saveHeroAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const content = await load();
  if (!content) return { ok: false, error: "Not authorised." };

  const words = text(formData.get("typedWords"), 200)
    .split(",")
    .map((w) => w.trim())
    .filter(Boolean)
    .slice(0, 6);

  content.hero = {
    eyebrow: text(formData.get("eyebrow"), 60),
    headline: text(formData.get("headline"), 120),
    typedWords: words.length ? words : content.hero.typedWords,
    subheadline: text(formData.get("subheadline"), 400),
    primaryCta: {
      label: text(formData.get("primaryLabel"), 40),
      href: text(formData.get("primaryHref"), 200),
    },
    secondaryCta: {
      label: text(formData.get("secondaryLabel"), 40),
      href: text(formData.get("secondaryHref"), 200),
    },
    showPhoto: formData.get("showPhoto") === "on",
  };

  await saveContent(content);
  refresh();
  return { ok: true };
}

export async function finishSetupAction(
  ...[]: [ActionResult?, FormData?]
): Promise<ActionResult> {
  const content = await load();
  if (!content) return { ok: false, error: "Not authorised." };

  content.profile = { ...content.profile, configured: true };

  await saveContent(content);
  refresh();
  return { ok: true };
}

export async function removeItemAction(
  collection: Collection,
  id: string
): Promise<ActionResult> {
  if (!isCollection(collection)) return { ok: false, error: "Unknown section." };

  const content = await load();
  if (!content) return { ok: false, error: "Not authorised." };

  const list = content[collection] as Array<{ id: string }>;
  content[collection] = list.filter((entry) => entry.id !== id) as never;

  await saveContent(content);
  refresh();
  return { ok: true };
}

export async function moveItemAction(
  collection: Collection,
  id: string,
  direction: "up" | "down"
): Promise<ActionResult> {
  if (!isCollection(collection)) return { ok: false, error: "Unknown section." };

  const content = await load();
  if (!content) return { ok: false, error: "Not authorised." };

  const list = content[collection] as Array<{ id: string }>;
  const index = list.findIndex((entry) => entry.id === id);
  if (index === -1) return { ok: false, error: "Not found." };

  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= list.length) return { ok: true };

  const reordered = [...list];
  const [moved] = reordered.splice(index, 1);
  reordered.splice(target, 0, moved);
  content[collection] = reordered as never;

  await saveContent(content);
  refresh();
  return { ok: true };
}

export async function toggleSocialAction(id: string): Promise<ActionResult> {
  const content = await load();
  if (!content) return { ok: false, error: "Not authorised." };

  const index = content.socials.findIndex((entry) => entry.id === id);
  if (index === -1) return { ok: false, error: "Not found." };

  content.socials[index] = {
    ...content.socials[index],
    active: !content.socials[index].active,
  };

  await saveContent(content);
  refresh();
  return { ok: true };
}