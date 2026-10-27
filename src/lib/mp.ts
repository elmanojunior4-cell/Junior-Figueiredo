import "server-only";
import crypto from "node:crypto";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { env, optionalEnv } from "./env";

let cfg: MercadoPagoConfig | null = null;
function config() {
  if (!cfg) cfg = new MercadoPagoConfig({ accessToken: env("MP_ACCESS_TOKEN") });
  return cfg;
}

export function mpConfigured() {
  return Boolean(optionalEnv("MP_ACCESS_TOKEN"));
}

export async function createCheckout(opts: {
  orderId: string;
  title: string;
  amountCents: number;
  payerEmail?: string | null;
  successUrl: string;
  failureUrl: string;
  notificationUrl: string;
}) {
  const pref = await new Preference(config()).create({
    body: {
      items: [
        { id: opts.orderId, title: opts.title, quantity: 1, unit_price: opts.amountCents / 100, currency_id: "BRL" },
      ],
      external_reference: opts.orderId,
      payer: opts.payerEmail ? { email: opts.payerEmail } : undefined,
      back_urls: { success: opts.successUrl, pending: opts.successUrl, failure: opts.failureUrl },
      auto_return: "approved",
      notification_url: opts.notificationUrl,
      payment_methods: { installments: 12 },
      statement_descriptor: "JF FOTOGRAFIA",
    },
  });
  return { id: pref.id!, url: pref.init_point! };
}

export async function getPayment(id: string) {
  return new Payment(config()).get({ id });
}

/** Confere a assinatura do webhook quando MP_WEBHOOK_SECRET estiver definido. */
export function validWebhookSignature(headers: Headers, dataId: string) {
  const secret = optionalEnv("MP_WEBHOOK_SECRET");
  if (!secret) return true;
  const sig = headers.get("x-signature") || "";
  const reqId = headers.get("x-request-id") || "";
  const parts = Object.fromEntries(sig.split(",").map((p) => p.trim().split("=") as [string, string]));
  if (!parts.ts || !parts.v1) return false;
  const manifest = `id:${dataId.toLowerCase()};request-id:${reqId};ts:${parts.ts};`;
  const expected = crypto.createHmac("sha256", secret).update(manifest).digest("hex");
  return expected.length === parts.v1.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1));
}
