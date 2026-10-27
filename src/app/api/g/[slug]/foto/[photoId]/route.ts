import { NextResponse } from "next/server";
import { hasGalleryAccess, isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { galleryBySlug } from "@/lib/galleries";
import { getUrl } from "@/lib/r2";

/** Baixa o original em alta, com o nome do arquivo. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string; photoId: string }> }) {
  const { slug, photoId } = await params;
  const g = await galleryBySlug(slug);
  if (!g || !(await hasGalleryAccess(g.id))) return NextResponse.json({ error: "Acesso negado." }, { status: 401 });
  if (!g.allow_download && !(await isAdmin())) return NextResponse.json({ error: "Download desativado." }, { status: 403 });

  const { data: photo } = await db()
    .from("photos")
    .select("key_full, filename")
    .eq("id", photoId)
    .eq("gallery_id", g.id)
    .maybeSingle();
  if (!photo) return NextResponse.json({ error: "Foto não encontrada." }, { status: 404 });

  return NextResponse.redirect(await getUrl(photo.key_full, 60 * 10, photo.filename));
}
