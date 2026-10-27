import { NextResponse } from "next/server";
import { hasGalleryAccess } from "@/lib/auth";
import { db, logEvent } from "@/lib/db";
import { siteUrl } from "@/lib/env";
import { galleryBySlug, ordersOf, selectedIds, selectionOpen } from "@/lib/galleries";
import { createCheckout, mpConfigured } from "@/lib/mp";
import { extrasCost } from "@/lib/pricing";

export async function POST(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = await galleryBySlug(slug);
  if (!g || !(await hasGalleryAccess(g.id))) return NextResponse.json({ error: "Acesso negado." }, { status: 401 });
  if (!selectionOpen(g)) return NextResponse.json({ error: "A seleção já foi finalizada." }, { status: 409 });

  const [sel, orders] = await Promise.all([selectedIds(g.id), ordersOf(g.id)]);
  if (!sel.length) return NextResponse.json({ error: "Escolham pelo menos uma foto." }, { status: 400 });

  const paidExtras = orders.filter((o) => o.status === "paid").reduce((m, o) => Math.max(m, o.extra_count), 0);
  const extra = g.package_limit > 0 ? Math.max(0, sel.length - g.package_limit - paidExtras) : 0;
  const { total } = extrasCost(extra, g.extra_price_cents, g.extra_tiers);

  // Sem extras a pagar: finaliza na hora.
  if (extra === 0 || total === 0) {
    await db().from("galleries").update({ status: "selection_done", updated_at: new Date().toISOString() }).eq("id", g.id);
    await logEvent(g.id, "selection_done", { selected: sel.length, extra: 0 });
    return NextResponse.json({ done: true });
  }

  if (!mpConfigured()) {
    return NextResponse.json({ error: "O pagamento online ainda não está ativo. Fale com o estúdio pelo WhatsApp." }, { status: 503 });
  }

  // Cancela cobranças antigas em aberto: o valor muda se a seleção mudou.
  await db().from("orders").update({ status: "cancelled" }).eq("gallery_id", g.id).eq("status", "pending");

  const { data: order, error } = await db()
    .from("orders")
    .insert({ gallery_id: g.id, selected_count: sel.length, extra_count: extra + paidExtras, amount_cents: total })
    .select("id")
    .single();
  if (error || !order) return NextResponse.json({ error: "Não foi possível gerar a cobrança." }, { status: 500 });

  const { data: client } = g.client_id
    ? await db().from("clients").select("email").eq("id", g.client_id).maybeSingle()
    : { data: null };

  const base = siteUrl();
  const checkout = await createCheckout({
    orderId: order.id,
    title: `${extra} fotos extras · ${g.title}`,
    amountCents: total,
    payerEmail: client?.email,
    successUrl: `${base}/g/${g.slug}/obrigado`,
    failureUrl: `${base}/g/${g.slug}?pagamento=falhou`,
    notificationUrl: `${base}/api/mp/webhook`,
  });
  await db().from("orders").update({ mp_preference_id: checkout.id }).eq("id", order.id);
  await logEvent(g.id, "order_created", { order_id: order.id, extra, amount_cents: total });

  return NextResponse.json({ checkoutUrl: checkout.url });
}
