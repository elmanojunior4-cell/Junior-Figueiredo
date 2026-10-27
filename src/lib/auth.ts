import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "./env";

const ADMIN_COOKIE = "jf_admin";
const galleryCookie = (id: string) => `jf_g_${id}`;

function hmac(value: string) {
  return crypto.createHmac("sha256", env("SESSION_SECRET")).update(value).digest("base64url");
}

function sign(payload: string) {
  return `${payload}.${hmac(payload)}`;
}

function verify(token: string | undefined, expectedPrefix: string): boolean {
  if (!token) return false;
  const i = token.lastIndexOf(".");
  if (i < 0) return false;
  const payload = token.slice(0, i);
  const sig = token.slice(i + 1);
  const good = hmac(payload);
  if (sig.length !== good.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good))) return false;
  const parts = payload.split(":");
  const exp = Number(parts.at(-1));
  if (!exp || exp < Date.now()) return false;
  return payload.startsWith(expectedPrefix);
}

const cookieOpts = (maxAgeDays: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: maxAgeDays * 24 * 60 * 60,
});

/* ---------- Estúdio ---------- */

export function checkAdminPassword(password: string) {
  const a = Buffer.from(hmac(password));
  const b = Buffer.from(hmac(env("ADMIN_PASSWORD")));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function startAdminSession() {
  const exp = Date.now() + 30 * 24 * 60 * 60 * 1000;
  (await cookies()).set(ADMIN_COOKIE, sign(`admin:${exp}`), cookieOpts(30));
}

export async function endAdminSession() {
  (await cookies()).delete(ADMIN_COOKIE);
}

export async function isAdmin() {
  return verify((await cookies()).get(ADMIN_COOKIE)?.value, "admin:");
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/entrar");
}

/* ---------- Casal ---------- */

export async function grantGalleryAccess(galleryId: string) {
  const exp = Date.now() + 60 * 24 * 60 * 60 * 1000;
  (await cookies()).set(galleryCookie(galleryId), sign(`g:${galleryId}:${exp}`), cookieOpts(60));
}

export async function hasGalleryAccess(galleryId: string) {
  if (await isAdmin()) return true;
  return verify((await cookies()).get(galleryCookie(galleryId))?.value, `g:${galleryId}:`);
}
