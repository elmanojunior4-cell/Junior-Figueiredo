import type { Tier } from "./types";

export const brl = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/**
 * Menor custo para cobrir `extra` fotos, combinando preço avulso e pacotes.
 * Um pacote maior que o necessário pode sair mais barato que avulsas, então
 * calculamos até `extra + maior pacote` e ficamos com o menor valor que cobre o total.
 */
export function extrasCost(extra: number, unitCents: number, tiers: Tier[]) {
  if (extra <= 0) return { total: 0, parts: [] as { label: string; cents: number }[] };
  const valid = tiers.filter((t) => t.qty > 0 && t.price_cents > 0);
  const maxQ = valid.reduce((m, t) => Math.max(m, t.qty), 0);
  const limit = extra + maxQ;
  const INF = Number.MAX_SAFE_INTEGER;
  const cost = new Array<number>(limit + 1).fill(INF);
  const pick = new Array<number>(limit + 1).fill(-1); // -1 = avulsa, i = pacote i
  cost[0] = 0;
  for (let n = 1; n <= limit; n++) {
    if (unitCents > 0 && cost[n - 1] < INF) {
      cost[n] = cost[n - 1] + unitCents;
      pick[n] = -1;
    }
    valid.forEach((t, i) => {
      if (n >= t.qty && cost[n - t.qty] < INF && cost[n - t.qty] + t.price_cents < cost[n]) {
        cost[n] = cost[n - t.qty] + t.price_cents;
        pick[n] = i;
      }
    });
  }
  let best = -1;
  for (let n = extra; n <= limit; n++) if (cost[n] < INF && (best < 0 || cost[n] < cost[best])) best = n;
  if (best < 0) return { total: 0, parts: [] };

  const counts = new Map<number, number>();
  for (let n = best; n > 0; ) {
    const p = pick[n];
    counts.set(p, (counts.get(p) || 0) + 1);
    n -= p === -1 ? 1 : valid[p].qty;
  }
  const parts = [...counts.entries()].map(([p, k]) =>
    p === -1
      ? { label: `${k} foto${k > 1 ? "s" : ""} avulsa${k > 1 ? "s" : ""}`, cents: k * unitCents }
      : { label: `${k}× pacote de ${valid[p].qty} fotos`, cents: k * valid[p].price_cents },
  );
  return { total: cost[best], parts };
}

/** Lê pacotes no formato "10=150; 20=250" (quantidade=reais). */
export function parseTiers(text: string): Tier[] {
  return text
    .split(/[;\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const [q, v] = s.split("=").map((x) => x.trim());
      return { qty: parseInt(q, 10), price_cents: Math.round(parseFloat((v || "").replace(",", ".")) * 100) };
    })
    .filter((t) => t.qty > 0 && t.price_cents > 0)
    .sort((a, b) => a.qty - b.qty);
}

export function tiersToText(tiers: Tier[]) {
  return tiers.map((t) => `${t.qty}=${(t.price_cents / 100).toFixed(2).replace(".", ",")}`).join("; ");
}
