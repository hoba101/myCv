"use client";

import { useActionState, useState } from "react";
import { saveSkillAction, type ActionResult } from "../../../actions/content";
import { ACCENT_SWATCH, getIcon, ICON_OPTIONS } from "../../../lib/icons";
import type { Skill } from "../../../lib/types";
import {
  AccentPicker,
  Card,
  Field,
  PageHeader,
  RowActions,
  Select,
  StatusText,
} from "../components/Editor";

export default function SkillsEditor({ items }: { items: Skill[] }) {
  const [result, formAction, pending] = useActionState<ActionResult, FormData>(
    saveSkillAction,
    { ok: false }
  );
  const [editing, setEditing] = useState<Skill | null>(null);

  return (
    <div>
      <PageHeader
        title="Skills"
        subtitle="The scattered stickers in your “my toolkit” section."
      />

      <Card className="mb-8">
        <h2 className="font-bold text-theme mb-4">
          {editing ? "Edit skill" : "Add a skill"}
        </h2>
        <form
          action={formAction}
          key={editing?.id ?? "new"}
          className="flex flex-col gap-4"
        >
          <input type="hidden" name="id" value={editing?.id ?? ""} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Name"
              name="name"
              defaultValue={editing?.name}
              placeholder="React"
              required
            />
            <Select
              label="Icon"
              name="icon"
              options={ICON_OPTIONS}
              defaultValue={editing?.icon ?? "sparkles"}
            />
            <Field
              label="Tilt (degrees)"
              name="rotation"
              type="number"
              defaultValue={editing?.rotation ?? 0}
              placeholder="-3"
            />
            <AccentPicker
              name="accent"
              defaultValue={editing?.accent ?? "blue"}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={pending}
              className="brutal-btn bg-accent-highlight text-black disabled:opacity-60"
            >
              {pending ? "saving..." : editing ? "save changes" : "add skill"}
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
          <p className="text-theme-muted text-sm">No skills yet.</p>
        ) : (
          items.map((skill, index) => {
            const Icon = getIcon(skill.icon);
            return (
              <Card key={skill.id}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`px-3 py-1.5 border-[3px] border-theme flex items-center gap-2 text-sm font-bold text-black ${ACCENT_SWATCH[skill.accent]}`}
                      style={{
                        transform: `rotate(${skill.rotation}deg)`,
                      }}
                    >
                      <Icon size={16} />
                      {skill.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(skill);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-3 py-1.5 border-[3px] border-theme bg-theme text-theme text-xs font-bold"
                    >
                      edit
                    </button>
                    <RowActions
                      collection="skills"
                      id={skill.id}
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