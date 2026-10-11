"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Rocket } from "lucide-react";
import type { SiteProfile } from "../../lib/types";
import {
  finishSetupAction,
  saveProfileAction,
  type ActionResult,
} from "../../actions/content";
import ImageUpload from "../(admin)/components/ImageUpload";
import { StatusText } from "../(admin)/components/Editor";

const STEPS = ["Identity", "Logo", "Links", "Done"] as const;

export default function SetupWizard({ profile }: { profile: SiteProfile }) {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [profileState, profileAction, profilePending] = useActionState<
    ActionResult,
    FormData
  >(saveProfileAction, { ok: false });

  const [finishState, finishAction, finishPending] = useActionState<
    ActionResult,
    FormData
  >(finishSetupAction, { ok: false });

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-accent-highlight border-[3px] border-theme rounded-full flex items-center justify-center" style={{ boxShadow: "3px 3px 0px 0px var(--shadow-color)" }}>
          <Rocket size={28} className="text-black" />
        </div>
        <h1 className="text-3xl font-bold text-theme mb-2">Let&apos;s set up your portfolio</h1>
        <p className="text-theme-muted text-sm">
          Three quick steps and this becomes yours.
        </p>
      </div>

      {/* Progress */}
      <ol className="flex items-center justify-center gap-2 mb-8" aria-label="Progress">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-theme text-xs font-bold ${
                i <= step ? "bg-accent-highlight text-black" : "bg-card text-theme-muted"
              }`}
              aria-current={i === step ? "step" : undefined}
            >
              {i < step ? <Check size={14} /> : i + 1}
            </span>
            <span className={`text-xs font-semibold ${i === step ? "text-theme" : "text-theme-muted"}`}>
              {label}
            </span>
            {i < STEPS.length - 1 ? (
              <span className="w-6 h-[2px] bg-theme/30 mx-1" />
            ) : null}
          </li>
        ))}
      </ol>

      {/* Step content */}
      {step === 0 ? (
        <form
          action={async (fd) => {
            await profileAction(fd);
            setStep(1);
          }}
          className="bg-card border-[3px] border-theme p-6 md:p-8 flex flex-col gap-5"
          style={{ boxShadow: "4px 4px 0px 0px var(--shadow-color)" }}
        >
          <h2 className="font-bold text-theme">Who are you?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-theme-muted">Name</span>
              <input name="name" defaultValue={profile.name === "Your Name" ? "" : profile.name} placeholder="Ehab" required className="bg-theme text-theme border-[3px] border-theme px-3 py-2 text-sm outline-none focus-visible:border-accent-pink" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-theme-muted">Handle</span>
              <input name="handle" defaultValue={profile.handle === "yourhandle" ? "" : profile.handle} placeholder="yourhandle" className="bg-theme text-theme border-[3px] border-theme px-3 py-2 text-sm outline-none focus-visible:border-accent-pink" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-theme-muted">Email</span>
              <input name="email" type="email" defaultValue={profile.email === "you@example.com" ? "" : profile.email} placeholder="you@example.com" className="bg-theme text-theme border-[3px] border-theme px-3 py-2 text-sm outline-none focus-visible:border-accent-pink" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-theme-muted">Role</span>
              <input name="role" defaultValue={profile.role} placeholder="Creative Web Developer" className="bg-theme text-theme border-[3px] border-theme px-3 py-2 text-sm outline-none focus-visible:border-accent-pink" />
            </label>
          </div>

          <input type="hidden" name="logoUrl" value={profile.logoUrl ?? ""} />
          <input type="hidden" name="photoUrl" value={profile.photoUrl ?? ""} />

          <button type="submit" disabled={profilePending} className="brutal-btn bg-accent-highlight text-black self-start disabled:opacity-60">
            {profilePending ? "saving..." : "next: add a logo"}
          </button>
          <StatusText result={profileState} />
        </form>
      ) : null}

      {step === 1 ? (
        <form
          action={async (fd) => {
            await profileAction(fd);
            setStep(2);
          }}
          className="bg-card border-[3px] border-theme p-6 md:p-8 flex flex-col gap-5"
          style={{ boxShadow: "4px 4px 0px 0px var(--shadow-color)" }}
        >
          <h2 className="font-bold text-theme">Add a logo and photo (optional)</h2>
          <p className="text-theme-muted text-xs -mt-3">
            You can skip these and come back any time.
          </p>

          <input type="hidden" name="name" value={profile.name} />
          <input type="hidden" name="handle" value={profile.handle} />
          <input type="hidden" name="email" value={profile.email} />
          <input type="hidden" name="role" value={profile.role} />

          <ImageUpload name="logoUrl" label="Logo" currentUrl={profile.logoUrl ?? ""} />
          <ImageUpload name="photoUrl" label="Photo" currentUrl={profile.photoUrl ?? ""} />

          <div className="flex items-center gap-3">
            <button type="submit" disabled={profilePending} className="brutal-btn bg-accent-highlight text-black disabled:opacity-60">
              {profilePending ? "saving..." : "finish setup"}
            </button>
            <button type="button" onClick={() => setStep(2)} className="brutal-btn">skip for now</button>
          </div>
          <StatusText result={profileState} />
        </form>
      ) : null}

      {step === 2 ? (
        <form
          action={async (formData: FormData) => {
            await finishAction(formData);
            router.refresh();
          }}
          className="bg-card border-[3px] border-theme p-6 md:p-8 flex flex-col gap-5"
          style={{ boxShadow: "4px 4px 0px 0px var(--shadow-color)" }}
        >
          <h2 className="font-bold text-theme">All done 🎉</h2>
          <p className="text-theme-muted text-sm">
            Your portfolio is ready. Add projects, skills and services from the
            dashboard, and toggle your social links on or off.
          </p>
          <button type="submit" disabled={finishPending} className="brutal-btn bg-accent-green text-black self-start disabled:opacity-60">
            {finishPending ? "finishing..." : "open my dashboard"}
          </button>
          <StatusText result={finishState} />
        </form>
      ) : null}
    </div>
  );
}