"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { saveProjectAction, type ActionResult } from "../../../actions/content";
import { ACCENT_SWATCH } from "../../../lib/icons";
import type { Project } from "../../../lib/types";
import {
  AccentPicker,
  Card,
  Field,
  PageHeader,
  RowActions,
  StatusText,
} from "../components/Editor";

export default function ProjectsEditor({ items }: { items: Project[] }) {
  const [result, formAction, pending] = useActionState<ActionResult, FormData>(
    saveProjectAction,
    { ok: false }
  );
  const [editing, setEditing] = useState<Project | null>(null);

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="The cards in your “my projects” section."
      />

      <Card className="mb-8">
        <h2 className="font-bold text-theme mb-4">
          {editing ? "Edit project" : "Add a project"}
        </h2>
        <form
          action={formAction}
          key={editing?.id ?? "new"}
          className="flex flex-col gap-4"
        >
          <input type="hidden" name="id" value={editing?.id ?? ""} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Title"
              name="title"
              defaultValue={editing?.title}
              placeholder="Project name"
              required
            />
            <Field
              label="Category"
              name="category"
              defaultValue={editing?.category}
              placeholder="Design | Web"
            />
          </div>

          <Field
            label="Image URL"
            name="imageUrl"
            defaultValue={editing?.imageUrl}
            placeholder="https://images.unsplash.com/..."
          />

          <Field
            label="Project link (optional)"
            name="href"
            defaultValue={editing?.href}
            placeholder="https://example.com"
          />

          <AccentPicker
            name="accent"
            defaultValue={editing?.accent ?? "blue"}
          />

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={pending}
              className="brutal-btn bg-accent-highlight text-black disabled:opacity-60"
            >
              {pending ? "saving..." : editing ? "save changes" : "add project"}
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

      <div className="flex flex-col gap-4">
        {items.length === 0 ? (
          <p className="text-theme-muted text-sm">No projects yet.</p>
        ) : (
          items.map((project, index) => (
            <Card key={project.id}>
              <div className="flex gap-4">
                <div
                  className={`relative w-24 h-20 shrink-0 border-[3px] border-theme overflow-hidden ${ACCENT_SWATCH[project.accent]}`}
                >
                  {project.imageUrl ? (
                    <Image
                      src={project.imageUrl}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-bold text-theme">{project.title}</p>
                  <p className="text-theme-muted text-xs mt-0.5">
                    {project.category || "no category"}
                  </p>
                  <p className="text-theme-muted/70 text-xs mt-1 truncate font-mono">
                    {project.href || "no link"}
                  </p>
                </div>

                <div className="flex items-start gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(project);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-3 py-1.5 border-[3px] border-theme bg-theme text-theme text-xs font-bold"
                  >
                    edit
                  </button>
                  <RowActions
                    collection="projects"
                    id={project.id}
                    index={index}
                    total={items.length}
                  />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}