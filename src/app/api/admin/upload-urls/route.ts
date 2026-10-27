import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/auth";
import { photoKeys, putUrl } from "@/lib/r2";

const Body = z.object({
  galleryId: z.string().uuid(),
  files: z.array(z.object({ name: z.string(), type: z.string() })).min(1).max(50),
});

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const { galleryId, files } = parsed.data;

  const items = await Promise.all(
    files.map(async (f) => {
      const id = crypto.randomUUID();
      const ext = (f.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const keys = photoKeys(galleryId, id, ext);
      return {
        id,
        ...keys,
        put_full: await putUrl(keys.key_full, f.type || "image/jpeg"),
        put_web: await putUrl(keys.key_web, "image/jpeg"),
        put_thumb: await putUrl(keys.key_thumb, "image/jpeg"),
      };
    }),
  );
  return NextResponse.json({ items });
}
