"use server";

import { revalidatePath } from "next/cache";
import { isAuthenticated } from "../lib/auth";
import { saveUpload } from "../lib/uploads";

export interface UploadResult {
  ok: boolean;
  url?: string;
  error?: string;
}

/**
 * Uploads an image and returns the /media path to store in content/site.json.
 * Auth is re-checked here: Server Actions are reachable by direct POST.
 */
export async function uploadImageAction(
  _prev: UploadResult,
  formData: FormData
): Promise<UploadResult> {
  if (!(await isAuthenticated())) {
    return { ok: false, error: "Not authorised." };
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { ok: false, error: "No file received." };
  }

  const result = await saveUpload(file);

  if (result.ok) {
    revalidatePath("/", "page");
    revalidatePath("/dashboard");
  }

  return result.ok
    ? { ok: true, url: result.url }
    : { ok: false, error: result.error };
}