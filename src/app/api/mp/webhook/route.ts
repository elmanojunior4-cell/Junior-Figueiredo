import { NextResponse } from "next/server";
import { db, logEvent } from "@/lib/db";
import { getPayment, validWebhookSignature } from "@/lib/mp";

/** Aviso do Mercado Pago: confirma o pagamento e finaliza a seleção do casal. */
export async function POST(req: Request) {
  const url = new URL(req.url);
  const body = await req.json().catch(() => ({}) as Record<string, unknown>);
  const type = (body.type as string) || url.searchParams.get("type") || url.searchParams.get("topic");
  const dataId = String((body.data as { id?: string | number } | undefined)?.id ?? url.searchParams.get("data.id") ?? url.searchParams.get("id") ?? "");

  if (type !== "payment" || !dataId) return NextResponse.json({ ignored: true });
  if (!validWebhookSignature(req.headers, dataId)) return NextResponse.json({ error: "assinatura inválida" }, { status: 401 });

  const payment = await getPayment(dataId);
  const orderId = payment.external_reference;
  if (!orderId) return NextResponse.json({ ignored: true });

  const { data: order } = await db().from("orders").select("*").eq("id", orderId).maybeSingle();
  if (!order) return NextResponse.json({ ignored: true });

  if (payment.status === "approved" && order.status !== "paid") {
    const paidCents = Math.round((payment.transaction_amount || 0) * 100);
    if (paidCents < order.amount_cents) {
      await logEvent(order.gallery_id, "order_amount_mismatch", { order_id: order.id, paid_cents: paidCents });
      return NextResponse.json({ ok: false });
    }
    await db()
      .from("orders")
      .update({ status: "paid", mp_payment_id: String(payment.id), paid_at: new Date().toISOString() })
      .eq("id", order.id);
    await db().from("galleries").update({ status: "selection_done", updated_at: new Date().toISOString() }).eq("id", order.gallery_id);
    await logEvent(order.gallery_id, "order_paid", { order_id: order.id, amount_cents: order.amount_cents });
    await logEvent(order.gallery_id, "selection_done", { selected: order.selected_count, extra: order.extra_count });
  }
  return NextResponse.json({ ok: true });
}
