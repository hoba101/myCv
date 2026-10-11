"use client";

import { useActionState, useState, useTransition } from "react";
import { Power } from "lucide-react";
import {
  saveSocialAction,
  toggleSocialAction,
  type ActionResult,
} from "../../../actions/content";
import {
  PLATFORM_LABELS,
  SOCIAL_ICONS,
} from "../../../components/SocialIcons";
import {
  SOCIAL_PLATFORMS,
  type SocialLink,
} from "../../../lib/types";
import {
  Card,
  Field,
  PageHeader,
  RowActions,
  Select,
  StatusText,
} from "../components/Editor";

export default function SocialEditor({ items }: { items: SocialLink[] }) {
  const [result, formAction, pending] = useActionState<ActionResult, FormData>(
    saveSocialAction,
    { ok: false }
  );
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [toggling, startToggle] = useTransition();

  function startEdit(link: SocialLink) {
    setEditing(link);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      <PageHeader
        title="Social links"
        subtitle="Links shown in your footer. Toggle one off to hide it without deleting it."
      />

      <Card className="mb-8">
        <h2 className="font-bold text-theme mb-4">
          {editing ? "Edit link" : "Add a link"}
        </h2>
        <form
          action={formAction}
          key={editing?.id ?? "new"}
          className="flex flex-col gap-4"
        >
          <input type="hidden" name="id" value={editing?.id ?? ""} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Platform"
              name="platform"
              options={SOCIAL_PLATFORMS}
              defaultValue={editing?.platform ?? "github"}
            />
            <Field
              label="Label"
              name="label"
              defaultValue={editing?.label}
              placeholder="GitHub"
              required
            />
          </div>

          <Field
            label="URL"
            name="href"
            defaultValue={editing?.href}
            placeholder="https://github.com/you"
          />

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              name="active"
              defaultChecked={editing?.active ?? true}
              className="w-4 h-4 accent-[var(--accent-highlight)]"
            />
            <span className="text-sm font-semibold text-theme">
              Show this link on the site
            </span>
          </label>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={pending}
              className="brutal-btn bg-accent-highlight text-black disabled:opacity-60"
            >
              {pending ? "saving..." : editing ? "save changes" : "add link"}
            </button>
            {editing ? (
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="brutal-btn"
              >
                cancel
              </button>
            ) : null}
            <StatusText result={result} />
          </div>
        </form>
      </Card>

      <div className="flex flex-col gap-3">
        {items.length === 0 ? (
          <p className="text-theme-muted text-sm">No links yet.</p>
        ) : (
          items.map((link, index) => {
            const Icon = SOCIAL_ICONS[link.platform];
            return (
              <Card key={link.id} className={link.active ? "" : "opacity-60"}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 shrink-0 border-[3px] border-theme bg-theme text-theme flex items-center justify-center">
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-theme">
                        {link.label}
                        <span className="text-theme-muted text-xs font-normal">
                          {" "}
                          · {PLATFORM_LABELS[link.platform]}
                        </span>
                      </p>
                      <p className="text-theme-muted/70 text-xs truncate font-mono">
                        {link.href || "no url"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      disabled={toggling}
                      onClick={() =>
                        startToggle(async () => {
                          await toggleSocialAction(link.id);
                        })
                      }
                      aria-pressed={link.active}
                      title={
                        link.active ? "Hide from site" : "Show on site"
                      }
                      className={`px-2.5 py-1.5 border-[3px] border-theme flex items-center gap-1.5 text-xs font-bold disabled:opacity-50 ${
                        link.active
                          ? "bg-accent-green text-black"
                          : "bg-theme text-theme-muted"
                      }`}
                    >
                      <Power size={13} />
                      {link.active ? "active" : "hidden"}
                    </button>
                    <button
                      type="button"
                      onClick={() => startEdit(link)}
                      className="px-3 py-1.5 border-[3px] border-theme bg-theme text-theme text-xs font-bold"
                    >
                      edit
                    </button>
                    <RowActions
                      collection="socials"
                      id={link.id}
                      index={index}
                      total={items.length}
                    />
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}