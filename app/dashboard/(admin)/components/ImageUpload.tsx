"use client";

import Image from "next/image";
import { useActionState, useRef } from "react";
import { Check, Trash2, Upload } from "lucide-react";
import { uploadAssetAction, type ImageField } from "../../../actions/upload";
import {
  ACCEPT_ATTR,
  humanSize,
  MAX_UPLOAD_BYTES,
} from "../../../lib/uploads-shared";

/**
 * Renders its own <form> and must therefore never be placed inside another
 * <form> — nested forms are invalid HTML and break hydration.
 *
 * The upload persists directly into the profile via a bound action, so this
 * component needs no hidden field feeding a surrounding save form.
 */
export default function ImageUpload({
  field,
  label,
  currentUrl,
}: {
  field: ImageField;
  label: string;
  currentUrl: string;
}) {
  const action = uploadAssetAction.bind(null, field);
  const [state, formAction, pending] = useActionState<
    { ok: boolean; url?: string; error?: string },
    FormData
  >(action, { ok: false });

  const inputRef = useRef<HTMLInputElement>(null);
  const value = state.url ?? currentUrl;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-bold uppercase tracking-wide text-theme-muted">
        {label}
      </span>

      <div className="flex items-start gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden border-[3px] border-theme bg-theme">
          {value ? (
            <Image
              src={value}
              alt=""
              fill
              sizes="80px"
              className="object-contain p-1"
              unoptimized
            />
          ) : (
            <span className="px-1 text-center text-[10px] leading-tight text-theme-muted">
              none
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <form action={formAction} className="flex flex-wrap items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              name="file"
              accept={ACCEPT_ATTR}
              className="hidden"
              onChange={(e) => {
                const input = e.currentTarget;
                if (input.files?.length) input.form?.requestSubmit();
              }}
            />

            <button
              type="button"
              disabled={pending}
              onClick={() => inputRef.current?.click()}
              className="brutal-btn bg-accent-highlight text-black text-xs disabled:opacity-60"
            >
              <Upload size={13} />
              {pending ? "uploading..." : "choose image"}
            </button>

            {value ? (
              <button
                type="submit"
                name="remove"
                value="1"
                disabled={pending}
                className="brutal-btn text-xs disabled:opacity-60"
              >
                <Trash2 size={13} />
                remove
              </button>
            ) : null}
          </form>

          <p className="text-xs text-theme-muted">
            PNG, JPG, WebP, GIF, AVIF or SVG · max{" "}
            {humanSize(MAX_UPLOAD_BYTES)}
          </p>

          {state.error ? (
            <p className="text-xs font-semibold text-accent-pink" role="alert">
              {state.error}
            </p>
          ) : state.ok ? (
            <p className="flex items-center gap-1 text-xs font-semibold text-accent-green">
              <Check size={12} /> saved
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}