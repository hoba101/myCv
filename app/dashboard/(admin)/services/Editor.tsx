"use client";

import { useActionState, useState } from "react";
import {
  saveServiceAction,
  type ActionResult,
} from "../../../actions/content";
import { getIcon, ICON_OPTIONS, ACCENT_SWATCH } from "../../../lib/icons";
import type { Service } from "../../../lib/types";
import {
  AccentPicker,
  Card,
  Field,
  PageHeader,
  RowActions,
  Select,
  StatusText,
  TextArea,
} from "../components/Editor";

export default function ServicesEditor({ items }: { items: Service[] }) {
  const [result, formAction, pending] = useActionState<ActionResult, FormData>(
    saveServiceAction,
    { ok: false }
  );
  const [editing, setEditing] = useState<Service | null>(null);

  function startEdit(service: Service) {
    setEditing(service);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      <PageHeader
        title="Services"
        subtitle="The cards in your “services I provide” section."
      />

      <Card className="mb-8">
        <h2 className="font-bold text-theme mb-4">
          {editing ? "Edit service" : "Add a service"}
        </h2>
        <form action={formAction} key={editing?.id ?? "new"} className="flex flex-col gap-4">
          <input type="hidden" name="id" value={editing?.id ?? ""} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Title"
              name="title"
              defaultValue={editing?.title}
              placeholder="ui designing"
              required
            />
            <Select
              label="Icon"
              name="icon"
              options={ICON_OPTIONS}
              defaultValue={editing?.icon ?? "star"}
            />
          </div>

          <TextArea
            label="Description"
            name="description"
            defaultValue={editing?.description}
            placeholder="What do you offer?"
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
              {pending ? "saving..." : editing ? "save changes" : "add service"}
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
          <p className="text-theme-muted text-sm">No services yet.</p>
        ) : (
          items.map((service, index) => {
            const Icon = getIcon(service.icon);
            return (
              <Card key={service.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <span
                      className={`w-10 h-10 shrink-0 rounded-full border-[3px] border-theme flex items-center justify-center ${ACCENT_SWATCH[service.accent]}`}
                    >
                      <Icon size={18} className="text-black" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-theme truncate">
                        {service.title}
                      </p>
                      <p className="text-theme-muted text-xs line-clamp-2">
                        {service.description || "no description"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(service)}
                      className="px-3 py-1.5 border-[3px] border-theme bg-theme text-theme text-xs font-bold"
                    >
                      edit
                    </button>
                    <RowActions
                      collection="services"
                      id={service.id}
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