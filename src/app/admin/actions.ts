"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, logEvent } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { parseTiers } from "@/lib/pricing";
import type { GalleryStatus } from "@/lib/types";

const DEFAULT_SECTIONS = ["Pré-wedding", "Making of", "Cerimônia", "Recepção"];

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, "e")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function money(v: FormDataEntryValue | null) {
  const n = parseFloat(String(v || "0").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

export async function createGallery(formData: FormData) {
  await requireAdmin();
  const names = String(formData.get("names") || "").trim();
  const date = String(formData.get("event_date") || "") || null;
  const password = String(formData.get("password") || "").trim();
  if (!names || password.length < 4) redirect("/admin/galerias/nova?erro=1");

  const { data: client } = await db()
    .from("clients")
    .insert({
      names,
      email: String(formData.get("email") || "") || null,
      phone: String(formData.get("phone") || "") || null,
      wedding_date: date,
      city: String(formData.get("city") || "") || null,
    })
    .select("id")
    .single();

  const base = slugify(names) || "galeria";
  let slug = base;
  for (let i = 2; ; i++) {
    const { data } = await db().from("galleries").select("id").eq("slug", slug).maybeSingle();
    if (!data) break;
    slug = `${base}-${i}`;
  }

  const { data: gallery, error } = await db()
    .from("galleries")
    .insert({
      client_id: client?.id ?? null,
      slug,
      title: names,
      event_date: date,
      password_hash: await bcrypt.hash(password, 10),
      package_limit: parseInt(String(formData.get("package_limit") || "0"), 10) || 0,
      extra_price_cents: money(formData.get("extra_price")),
      extra_tiers: parseTiers(String(formData.get("extra_tiers") || "")),
      selection_deadline: String(formData.get("selection_deadline") || "") || null,
    })
    .select("id")
    .single();
  if (error || !gallery) throw new Error("Não foi possível criar a galeria: " + error?.message);

  await db()
    .from("sections")
    .insert(DEFAULT_SECTIONS.map((name, position) => ({ gallery_id: gallery.id, name, position })));

  redirect(`/admin/galerias/${gallery.id}`);
}

export async function updateGallery(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const patch: Record<string, unknown> = {
    title: String(formData.get("title") || "").trim(),
    event_date: String(formData.get("event_date") || "") || null,
    package_limit: parseInt(String(formData.get("package_limit") || "0"), 10) || 0,
    extra_price_cents: money(formData.get("extra_price")),
    extra_tiers: parseTiers(String(formData.get("extra_tiers") || "")),
    selection_deadline: String(formData.get("selection_deadline") || "") || null,
    allow_download: formData.get("allow_download") === "on",
    updated_at: new Date().toISOString(),
  };
  const password = String(formData.get("password") || "").trim();
  if (password.length >= 4) patch.password_hash = await bcrypt.hash(password, 10);
  await db().from("galleries").update(patch).eq("id", id);
  revalidatePath(`/admin/galerias/${id}`);
}

export async function setStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as GalleryStatus;
  await db().from("galleries").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  await logEvent(id, `status_${status}`, { by: "studio" });
  revalidatePath(`/admin/galerias/${id}`);
}

export async function addSection(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const name = String(formData.get("name") || "").trim();
  if (!name) return;
  const { count } = await db().from("sections").select("id", { count: "exact", head: true }).eq("gallery_id", id);
  await db().from("sections").insert({ gallery_id: id, name, position: count || 0 });
  revalidatePath(`/admin/galerias/${id}`);
}

export async function deleteSection(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await db().from("sections").delete().eq("id", String(formData.get("section_id")));
  revalidatePath(`/admin/galerias/${id}`);
}
