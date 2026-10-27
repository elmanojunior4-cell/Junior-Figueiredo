import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

const Body = z.object({
  galleryId: z.string().uuid(),
  sectionId: z.string().uuid().nullable(),
  photos: z
    .array(
      z.object({
        id: z.string().uuid(),
        filename: z.string(),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
        size_bytes: z.number().int().nonnegative(),
        key_full: z.string(),
        key_web: z.string(),
        key_thumb: z.string(),
      }),
    )
    .min(1)
    .max(50),
});

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const { galleryId, sectionId, photos } = parsed.data;

  // Continua a numeração da galeria. Uma nova tentativa resolve o raro choque entre dois envios simultâneos.
  for (let attempt = 0; attempt < 3; attempt++) {
    const { data: last } = await db()
      .from("photos")
      .select("number")
      .eq("gallery_id", galleryId)
      .order("number", { ascending: false })
      .limit(1)
      .maybeSingle();
    const start = (last?.number || 0) + 1;
    const rows = photos.map((p, i) => ({ ...p, gallery_id: galleryId, section_id: sectionId, number: start + i }));
    const { error } = await db().from("photos").insert(rows);
    if (!error) return NextResponse.json({ ok: true, first: start });
    if (error.code !== "23505") return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ error: "conflict" }, { status: 409 });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { photoId } = (await req.json()) as { photoId?: string };
  if (!photoId) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  await db().from("photos").delete().eq("id", photoId);
  return NextResponse.json({ ok: true });
}
