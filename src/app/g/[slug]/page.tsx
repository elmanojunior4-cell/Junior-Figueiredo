import { notFound, redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { grantGalleryAccess, hasGalleryAccess, isAdmin } from "@/lib/auth";
import { STUDIO_NAME } from "@/lib/env";
import { galleryBySlug, ordersOf, photosOf, sectionsOf, selectedIds, toClientPhotos } from "@/lib/galleries";
import GalleryClient from "./GalleryClient";

export const dynamic = "force-dynamic";

async function unlock(formData: FormData) {
  "use server";
  const slug = String(formData.get("slug"));
  const g = await galleryBySlug(slug);
  if (!g) notFound();
  const ok = await bcrypt.compare(String(formData.get("password") || ""), g.password_hash);
  if (!ok) redirect(`/g/${slug}?erro=1`);
  await grantGalleryAccess(g.id);
  redirect(`/g/${slug}`);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = await galleryBySlug(slug);
  return { title: g ? `${g.title} · ${STUDIO_NAME}` : STUDIO_NAME };
}

export default async function Galeria({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { slug } = await params;
  const { erro } = await searchParams;
  const g = await galleryBySlug(slug);
  if (!g || (g.status === "draft" && !(await isAdmin()))) notFound();

  if (!(await hasGalleryAccess(g.id))) {
    return (
      <main className="min-h-dvh grid place-items-center px-6">
        <form action={unlock} className="w-full max-w-sm flex flex-col gap-5 text-center">
          <p className="eyebrow">{STUDIO_NAME}</p>
          <h1 className="font-display text-4xl leading-tight">{g.title}</h1>
          {g.event_date && (
            <p className="text-muted -mt-3">{new Date(g.event_date + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}</p>
          )}
          <input type="hidden" name="slug" value={g.slug} />
          <label className="label text-left">
            Senha da galeria
            <input className="input" type="password" name="password" required autoFocus />
          </label>
          {erro && <p className="text-sm text-danger">Senha incorreta. Confira a mensagem que você recebeu e tente de novo.</p>}
          <button className="btn btn-primary">Abrir galeria</button>
        </form>
      </main>
    );
  }

  const [sections, photos, sel, orders] = await Promise.all([sectionsOf(g.id), photosOf(g.id), selectedIds(g.id), ordersOf(g.id)]);
  const clientPhotos = await toClientPhotos(photos);
  const paid = orders.filter((o) => o.status === "paid").reduce((m, o) => Math.max(m, o.extra_count), 0);

  return (
    <GalleryClient
      gallery={{
        slug: g.slug,
        title: g.title,
        eventDate: g.event_date,
        status: g.status,
        packageLimit: g.package_limit,
        extraPriceCents: g.extra_price_cents,
        tiers: g.extra_tiers,
        deadline: g.selection_deadline,
        allowDownload: g.allow_download,
        paidExtras: paid,
      }}
      sections={sections.map((s) => ({ id: s.id, name: s.name }))}
      photos={clientPhotos}
      initialSelected={sel}
      studio={STUDIO_NAME}
    />
  );
}
