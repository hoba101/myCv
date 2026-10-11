"use client";

import Image from "next/image";
import { useActionState, useRef, useState } from "react";
import { Check, Trash2, Upload } from "lucide-react";
import { uploadImageAction, type UploadResult } from "../../../actions/upload";
import {
  ACCEPT_ATTR,
  humanSize,
  MAX_UPLOAD_BYTES,
} from "../../../lib/uploads-shared";

/**
 * The upload action cannot write into the surrounding form's fields, so the
 * returned URL is derived directly from the action state and fed to the hidden
 * input that the save form submits.
 */
export default function ImageUpload({
  name,
  label,
  currentUrl,
  shape = "square",
}: {
  name: string;
  label: string;
  currentUrl: string;
  shape?: "square" | "wide";
}) {
  const [state, formAction, pending] = useActionState<
    UploadResult,
    FormData
  >(uploadImageAction, { ok: false });

  const [removed, setRemoved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const value = removed ? "" : state.ok && state.url ? state.url : currentUrl;
  const frame = shape === "square" ? "w-20 h-20" : "w-full h-32";

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-bold uppercase tracking-wide text-theme-muted">
        {label}
      </span>

      <input type="hidden" name={name} value={value} />

      <div className="flex items-start gap-4">
        <div
          className={`${frame} shrink-0 border-[3px] border-theme bg-theme flex items-center justify-center overflow-hidden`}
        >
          {value ? (
            <Image
              src={value}
              alt=""
              fill
              sizes="128px"
              className="object-contain p-1"
              unoptimized
            />
          ) : (
            <span className="px-2 text-center text-xs text-theme-muted">
              none
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <form action={formAction} className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              name="file"
              accept={ACCEPT_ATTR}
              className="hidden"
              onChange={(e) => {
                setRemoved(false);
                e.currentTarget.form?.requestSubmit();
              }}
            />
            <button
              type="submit"
              disabled={pending}
              className="brutal-btn bg-accent-highlight text-black text-xs disabled:opacity-60"
            >
              <Upload size={13} />
              {pending ? "uploading..." : "choose image"}
            </button>

            {value ? (
              <button
                type="button"
                onClick={() => {
                  setRemoved(true);
                  if (inputRef.current) inputRef.current.value = "";
                }}
                className="brutal-btn text-xs"
                aria-label={`Remove ${label.toLowerCase()}`}
              >
                <Trash2 size={13} />
                remove
              </button>
            ) : null}
          </form>

          <p className="text-xs text-theme-muted">
            PNG, JPG, WebP, GIF, AVIF or SVG · max {humanSize(MAX_UPLOAD_BYTES)}
          </p>

          {state.error ? (
            <p className="text-xs font-semibold text-accent-pink" role="alert">
              {state.error}
            </p>
          ) : state.ok ? (
            <p className="flex items-center gap-1 text-xs font-semibold text-accent-green">
              <Check size={12} /> uploaded
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}