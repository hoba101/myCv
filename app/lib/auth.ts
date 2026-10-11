import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "dash_session";
const MAX_AGE_SECONDS = 60 * 60 * 8;

function secret(): string | null {
  const password = process.env.DASHBOARD_PASSWORD;
  const salt = process.env.DASHBOARD_SECRET;
  if (!password) return null;
  return `${password}::${salt ?? "no-salt"}`;
}

export function isAuthConfigured(): boolean {
  return Boolean(process.env.DASHBOARD_PASSWORD);
}

function sign(value: string, key: string): string {
  return createHmac("sha256", key).update(value).digest("hex");
}

export function verifyPassword(candidate: string): boolean {
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) return false;

  const a = Buffer.from(candidate);
  const b = Buffer.from(password);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function createSessionToken(): string {
  const key = secret();
  if (!key) throw new Error("DASHBOARD_PASSWORD is not set");
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  return `${expires}.${sign(String(expires), key)}`;
}

export function isValidSessionToken(token: string | undefined): boolean {
  const key = secret();
  if (!key || !token) return false;

  const separator = token.lastIndexOf(".");
  if (separator <= 0) return false;

  const expires = Number(token.slice(0, separator));
  const signature = token.slice(separator + 1);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;

  const expected = sign(String(expires), key);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return isValidSessionToken(store.get(COOKIE_NAME)?.value);
}

export const SESSION_COOKIE = {
  name: COOKIE_NAME,
  maxAge: MAX_AGE_SECONDS,
};