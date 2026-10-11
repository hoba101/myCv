"use server";

import { revalidatePath } from "next/cache";
import { isAuthenticated } from "../lib/auth";
import { getContent, saveContent } from "../lib/content";
import { saveUpload } from "../lib/uploads";

export type ImageField = "logoUrl" | "photoUrl";

export interface UploadResult {
  ok: boolean;
  url?: string;
  error?: string;
}

function isImageField(value: unknown): value is ImageField {
  return value === "logoUrl" || value === "photoUrl";
}

/**
 * Uploads an image and persists it straight into the profile.
 *
 * The field is bound by the caller rather than passed through the form, so
 * this works without nesting a <form> inside the surrounding save form —
 * which is invalid HTML and breaks hydration.
 *
 * Auth is re-checked here: Server Actions are reachable by direct POST.
 */
export async function uploadAssetAction(
  field: ImageField,
  _prev: UploadResult,
  formData: FormData
): Promise<UploadResult> {
  if (!(await isAuthenticated())) {
    return { ok: false, error: "Not authorised." };
  }

  if (!isImageField(field)) {
    return { ok: false, error: "Unknown image field." };
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { ok: false, error: "No file received." };
  }

  if (formData.get("remove") === "1") {
    const content = await getContent();
    if (!content) return { ok: false, error: "Not authorised." };

    content.profile[field] = "";
    await saveContent(content);
    revalidatePath("/", "page");
    revalidatePath("/dashboard");

    return { ok: true, url: "" };
  }

  const result = await saveUpload(file);

  if (!result.ok || !result.url) {
    return { ok: false, error: result.error };
  }

  const content = await getContent();
  if (!content) return { ok: false, error: "Not authorised." };

  content.profile[field] = result.url;
  await saveContent(content);

  revalidatePath("/", "page");
  revalidatePath("/dashboard");

  return { ok: true, url: result.url };
}