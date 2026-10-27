import { NextResponse } from "next/server";
import { z } from "zod";
import { hasGalleryAccess } from "@/lib/auth";
import { db, logEvent } from "@/lib/db";
import { galleryBySlug, selectionOpen } from "@/lib/galleries";

const Body = z.object({ photoId: z.string().uuid(), selected: z.boolean() });

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = await galleryBySlug(slug);
  if (!g || !(await hasGalleryAccess(g.id))) return NextResponse.json({ error: "Acesso negado." }, { status: 401 });
  if (!selectionOpen(g)) return NextResponse.json({ error: "A seleção já foi finalizada." }, { status: 409 });

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  const { photoId, selected } = parsed.data;

  const { data: photo } = await db().from("photos").select("id").eq("id", photoId).eq("gallery_id", g.id).maybeSingle();
  if (!photo) return NextResponse.json({ error: "Foto não encontrada." }, { status: 404 });

  if (selected) {
    const { error } = await db().from("selections").upsert({ gallery_id: g.id, photo_id: photoId }, { ignoreDuplicates: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (g.status === "published") {
      await db().from("galleries").update({ status: "selecting", updated_at: new Date().toISOString() }).eq("id", g.id);
      await logEvent(g.id, "first_selection");
    }
  } else {
    await db().from("selections").delete().eq("gallery_id", g.id).eq("photo_id", photoId);
  }
  return NextResponse.json({ ok: true });
}
