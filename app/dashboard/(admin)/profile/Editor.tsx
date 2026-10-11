"use client";

import { useActionState } from "react";
import {
  saveHeroAction,
  saveProfileAction,
  type ActionResult,
} from "../../../actions/content";
import type { HeroContent, SiteProfile } from "../../../lib/types";
import ImageUpload from "../components/ImageUpload";
import { Card, Field, PageHeader, StatusText, TextArea } from "../components/Editor";

export default function ProfileEditor({
  profile,
  hero,
}: {
  profile: SiteProfile;
  hero: HeroContent;
}) {
  const [profileState, profileAction, profilePending] = useActionState<
    ActionResult,
    FormData
  >(saveProfileAction, { ok: false });

  const [heroState, heroAction, heroPending] = useActionState<
    ActionResult,
    FormData
  >(saveHeroAction, { ok: false });

  return (
    <div>
      <PageHeader
        title="Profile & hero"
        subtitle="Your name, logo, photo, and the words at the top of the page."
      />

      {/* --- Identity --- */}
      <Card className="mb-8">
        <h2 className="font-bold text-theme mb-4">Identity</h2>
        <form action={profileAction} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Name"
              name="name"
              defaultValue={profile.name}
              placeholder="Ehab"
              required
            />
            <Field
              label="Handle"
              name="handle"
              defaultValue={profile.handle}
              placeholder="ehabo._.o"
            />
            <Field
              label="Email"
              name="email"
              type="email"
              defaultValue={profile.email}
              placeholder="you@example.com"
            />
            <Field
              label="Role"
              name="role"
              defaultValue={profile.role}
              placeholder="Creative Web Developer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ImageUpload
              name="logoUrl"
              label="Logo"
              currentUrl={profile.logoUrl}
              shape="square"
            />
            <ImageUpload
              name="photoUrl"
              label="Photo"
              currentUrl={profile.photoUrl}
              shape="square"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={profilePending}
              className="brutal-btn bg-accent-highlight text-black disabled:opacity-60"
            >
              {profilePending ? "saving..." : "save profile"}
            </button>
            <StatusText result={profileState} />
          </div>
        </form>
      </Card>

      {/* --- Hero --- */}
      <Card>
        <h2 className="font-bold text-theme mb-1">Hero section</h2>
        <p className="text-theme-muted text-xs mb-4">
          The first thing visitors see.
        </p>

        <form action={heroAction} className="flex flex-col gap-5">
          <Field
            label="Eyebrow"
            name="eyebrow"
            defaultValue={hero.eyebrow}
            placeholder="Creative Web Developer"
          />
          <Field
            label="Headline"
            name="headline"
            defaultValue={hero.headline}
            placeholder="I design and build web experiences people enjoy using."
            required
          />
          <Field
            label="Rotating words (comma separated)"
            name="typedWords"
            defaultValue={hero.typedWords.join(", ")}
            placeholder="fast, modern, accessible"
          />
          <TextArea
            label="Subheadline"
            name="subheadline"
            defaultValue={hero.subheadline}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wide text-theme-muted">
                Primary button
              </span>
              <input
                name="primaryLabel"
                defaultValue={hero.primaryCta.label}
                placeholder="See my work"
                className="bg-theme text-theme border-[3px] border-theme px-3 py-2 text-sm outline-none focus-visible:border-accent-pink"
              />
              <input
                name="primaryHref"
                defaultValue={hero.primaryCta.href}
                placeholder="#projects"
                className="bg-theme text-theme border-[3px] border-theme px-3 py-2 text-sm outline-none focus-visible:border-accent-pink"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wide text-theme-muted">
                Secondary button
              </span>
              <input
                name="secondaryLabel"
                defaultValue={hero.secondaryCta.label}
                placeholder="Hire me"
                className="bg-theme text-theme border-[3px] border-theme px-3 py-2 text-sm outline-none focus-visible:border-accent-pink"
              />
              <input
                name="secondaryHref"
                defaultValue={hero.secondaryCta.href}
                placeholder="#contact"
                className="bg-theme text-theme border-[3px] border-theme px-3 py-2 text-sm outline-none focus-visible:border-accent-pink"
              />
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              name="showPhoto"
              defaultChecked={hero.showPhoto}
              className="w-4 h-4 accent-[var(--accent-highlight)]"
            />
            <span className="text-sm font-semibold text-theme">
              Show my photo in the hero
            </span>
          </label>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={heroPending}
              className="brutal-btn bg-accent-highlight text-black disabled:opacity-60"
            >
              {heroPending ? "saving..." : "save hero"}
            </button>
            <StatusText result={heroState} />
          </div>
        </form>
      </Card>
    </div>
  );
}