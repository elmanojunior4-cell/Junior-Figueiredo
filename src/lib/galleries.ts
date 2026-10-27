import "server-only";
import { db } from "./db";
import { getUrl } from "./r2";
import type { ClientPhoto, Gallery, Order, Photo, Section } from "./types";

export async function galleryBySlug(slug: string) {
  const { data } = await db().from("galleries").select("*").eq("slug", slug).maybeSingle();
  return data as Gallery | null;
}

export async function galleryById(id: string) {
  const { data } = await db().from("galleries").select("*").eq("id", id).maybeSingle();
  return data as Gallery | null;
}

export async function sectionsOf(galleryId: string) {
  const { data } = await db().from("sections").select("*").eq("gallery_id", galleryId).order("position");
  return (data || []) as Section[];
}

/** Busca todas as fotos em páginas de 1000 (limite do PostgREST). */
export async function photosOf(galleryId: string) {
  const all: Photo[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db()
      .from("photos")
      .select("*")
      .eq("gallery_id", galleryId)
      .order("number")
      .range(from, from + 999);
    if (error) throw error;
    all.push(...((data || []) as Photo[]));
    if (!data || data.length < 1000) break;
  }
  return all;
}

export async function selectedIds(galleryId: string) {
  const ids: string[] = [];
  for (let from = 0; ; from += 1000) {
    const { data } = await db()
      .from("selections")
      .select("photo_id")
      .eq("gallery_id", galleryId)
      .range(from, from + 999);
    ids.push(...(data || []).map((r: { photo_id: string }) => r.photo_id));
    if (!data || data.length < 1000) break;
  }
  return ids;
}

export async function ordersOf(galleryId: string) {
  const { data } = await db().from("orders").select("*").eq("gallery_id", galleryId).order("created_at", { ascending: false });
  return (data || []) as Order[];
}

export async function toClientPhotos(photos: Photo[]): Promise<ClientPhoto[]> {
  return Promise.all(
    photos.map(async (p) => ({
      id: p.id,
      number: p.number,
      section_id: p.section_id,
      width: p.width,
      height: p.height,
      thumb: await getUrl(p.key_thumb),
      web: await getUrl(p.key_web),
    })),
  );
}

export const selectionOpen = (g: Gallery) => g.status === "published" || g.status === "selecting";
