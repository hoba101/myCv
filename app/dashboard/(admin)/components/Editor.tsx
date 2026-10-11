"use client";

import { useTransition } from "react";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import {
  moveItemAction,
  removeItemAction,
} from "../../../actions/content";
import type { ActionResult } from "../../../actions/content";
import { ACCENT_OPTIONS, ACCENT_SWATCH } from "../../../lib/icons";
import type { Collection } from "../../../lib/types";

export function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold uppercase tracking-wide text-theme-muted">
        {label}
      </span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="bg-theme text-theme border-[3px] border-theme px-3 py-2 text-sm outline-none focus-visible:border-accent-pink"
      />
    </label>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold uppercase tracking-wide text-theme-muted">
        {label}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={4}
        className="bg-theme text-theme border-[3px] border-theme px-3 py-2 text-sm outline-none focus-visible:border-accent-pink resize-y"
      />
    </label>
  );
}

export function Select<T extends string>({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  options: readonly T[];
  defaultValue: T;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold uppercase tracking-wide text-theme-muted">
        {label}
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="bg-theme text-theme border-[3px] border-theme px-3 py-2 text-sm outline-none focus-visible:border-accent-pink"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AccentPicker({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-bold uppercase tracking-wide text-theme-muted">
        Accent
      </span>
      <div className="flex gap-2">
        {ACCENT_OPTIONS.map((accent) => (
          <label key={accent} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={accent}
              defaultChecked={defaultValue === accent}
              className="sr-only peer"
            />
            <span
              className={`block w-9 h-9 border-[3px] border-theme ${ACCENT_SWATCH[accent]} peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-accent-blue peer-checked:scale-110 transition-transform`}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

export function RowActions({
  collection,
  id,
  index,
  total,
}: {
  collection: Collection;
  id: string;
  index: number;
  total: number;
}) {
  const [pending, startTransition] = useTransition();

  function run(work: () => Promise<ActionResult>) {
    startTransition(async () => {
      await work();
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        disabled={pending || index === 0}
        onClick={() => run(() => moveItemAction(collection, id, "up"))}
        aria-label="Move up"
        className="p-1.5 border-[3px] border-theme bg-theme text-theme disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ArrowUp size={14} />
      </button>
      <button
        type="button"
        disabled={pending || index === total - 1}
        onClick={() => run(() => moveItemAction(collection, id, "down"))}
        aria-label="Move down"
        className="p-1.5 border-[3px] border-theme bg-theme text-theme disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ArrowDown size={14} />
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (confirm("Delete this item?")) {
            run(() => removeItemAction(collection, id));
          }
        }}
        aria-label="Delete"
        className="p-1.5 border-[3px] border-theme bg-accent-pink text-black disabled:opacity-30"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-card border-[3px] border-theme p-4 ${className}`}
      style={{ boxShadow: "3px 3px 0px 0px var(--shadow-color)" }}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-theme">{title}</h1>
      <p className="text-theme-muted text-sm mt-1">{subtitle}</p>
    </div>
  );
}

export function StatusText({ result }: { result: ActionResult | null }) {
  if (!result) return null;

  if (result.error) {
    return (
      <p className="text-accent-pink text-sm font-semibold" role="alert">
        {result.error}
      </p>
    );
  }

  // Initial useActionState is { ok: false } — don't claim success on page load.
  if (!result.ok) return null;

  return <p className="text-accent-green text-sm font-semibold">Saved.</p>;
}