"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ClientPhoto, GalleryStatus, Tier } from "@/lib/types";
import { brl, extrasCost } from "@/lib/pricing";

type Props = {
  gallery: {
    slug: string;
    title: string;
    eventDate: string | null;
    status: GalleryStatus;
    packageLimit: number;
    extraPriceCents: number;
    tiers: Tier[];
    deadline: string | null;
    allowDownload: boolean;
    paidExtras: number;
  };
  sections: { id: string; name: string }[];
  photos: ClientPhoto[];
  initialSelected: string[];
  studio: string;
};

const fmtDate = (d: string, opts: Intl.DateTimeFormatOptions) => new Date(d + "T12:00:00").toLocaleDateString("pt-BR", opts);

function Heart({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20s-7-4.4-9.2-8.6C1.3 8.4 3 5 6.4 5c2 0 3.3 1.1 4 2.3h3.2C14.3 6.1 15.6 5 17.6 5 21 5 22.7 8.4 21.2 11.4 19 15.6 12 20 12 20z" />
    </svg>
  );
}

export default function GalleryClient({ gallery, sections, photos, initialSelected, studio }: Props) {
  const [selected, setSelected] = useState(() => new Set(initialSelected));
  const [status, setStatus] = useState(gallery.status);
  const [onlySelected, setOnlySelected] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editable = status === "published" || status === "selecting";
  const limit = gallery.packageLimit;
  const count = selected.size;
  const extra = limit > 0 ? Math.max(0, count - limit - gallery.paidExtras) : 0;
  const cost = useMemo(() => extrasCost(extra, gallery.extraPriceCents, gallery.tiers), [extra, gallery.extraPriceCents, gallery.tiers]);

  const visible = useMemo(() => (onlySelected ? photos.filter((p) => selected.has(p.id)) : photos), [onlySelected, photos, selected]);
  const groups = useMemo(() => {
    const bySection = sections.map((s) => ({ ...s, items: visible.filter((p) => p.section_id === s.id) }));
    const loose = visible.filter((p) => !sections.some((s) => s.id === p.section_id));
    if (loose.length) bySection.push({ id: "outras", name: "Outras fotos", items: loose });
    return bySection.filter((g) => g.items.length);
  }, [sections, visible]);
  const order = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const cover = photos.find((p) => p.width > p.height) ?? photos[0];

  const toggle = useCallback(
    async (id: string) => {
      if (!editable) return;
      const on = !selected.has(id);
      setSelected((s) => {
        const n = new Set(s);
        if (on) n.add(id);
        else n.delete(id);
        return n;
      });
      setError(null);
      const res = await fetch(`/api/g/${gallery.slug}/select`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId: id, selected: on }),
      }).catch(() => null);
      if (!res?.ok) {
        setSelected((s) => {
          const n = new Set(s);
          if (on) n.delete(id);
          else n.add(id);
          return n;
        });
        setError(res?.status === 409 ? "A seleção já foi finalizada." : "Não foi possível salvar. Confira sua internet e toque de novo.");
        if (res?.status === 409) setStatus("selection_done");
      } else if (status === "published") setStatus("selecting");
    },
    [editable, selected, gallery.slug, status],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : Math.min(order.length - 1, i + 1)));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : Math.max(0, i - 1)));
      if (e.key === " " && order[open]) {
        e.preventDefault();
        toggle(order[open].id);
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, order, toggle]);

  async function finalize() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/g/${gallery.slug}/finalize`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Não foi possível finalizar.");
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      setStatus("selection_done");
      setConfirming(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const current = open !== null ? order[open] : null;

  return (
    <div className="min-h-dvh pb-28">
      <header className="relative">
        {cover && (
          <div className="relative h-[52vh] min-h-72 max-h-[560px] overflow-hidden bg-ink">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover.web} alt="" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 px-5 sm:px-10 pb-8 text-white">
              <p className="text-xs tracking-[.12em] uppercase opacity-80">{studio}</p>
              <h1 className="font-display text-4xl sm:text-6xl mt-2 leading-none">{gallery.title}</h1>
              {gallery.eventDate && <p className="mt-3 opacity-90">{fmtDate(gallery.eventDate, { day: "numeric", month: "long", year: "numeric" })}</p>}
            </div>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="py-6 flex flex-col gap-4">
          {editable ? (
            <p className="max-w-2xl text-[15px] leading-relaxed">
              Toque no coração das fotos que vão para o álbum
              {limit > 0 && <> — o pacote inclui <strong>{limit + gallery.paidExtras} fotos</strong></>}
              {gallery.deadline && <>, até <strong>{fmtDate(gallery.deadline, { day: "numeric", month: "long" })}</strong></>}. A seleção fica salva enquanto vocês escolhem; quando terminarem, toquem em Finalizar seleção.
            </p>
          ) : (
            <div className="card bg-accent-soft border-transparent max-w-2xl">
              <p className="font-medium">Seleção finalizada</p>
              <p className="text-sm mt-1">Recebemos as {count} fotos escolhidas para o álbum. Agora é com a gente — avisaremos pelo WhatsApp quando a diagramação estiver pronta.</p>
            </div>
          )}
          <nav className="flex flex-wrap gap-2 items-center">
            {groups.map((g) => (
              <a key={g.id} href={`#sec-${g.id}`} className="btn text-sm py-1.5">{g.name} <span className="text-muted tabular">{g.items.length}</span></a>
            ))}
            <label className="flex items-center gap-2 text-sm ml-auto">
              <input type="checkbox" checked={onlySelected} onChange={(e) => setOnlySelected(e.target.checked)} /> Só as selecionadas
            </label>
          </nav>
        </div>

        {groups.length === 0 && <p className="text-muted py-16 text-center">{onlySelected ? "Nenhuma foto selecionada ainda." : "As fotos ainda estão sendo enviadas."}</p>}

        {groups.map((g) => (
          <section key={g.id} id={`sec-${g.id}`} className="scroll-mt-4 mb-10">
            <h2 className="font-display text-2xl mb-3">{g.name}</h2>
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-2 [column-fill:_balance]">
              {g.items.map((p) => {
                const on = selected.has(p.id);
                return (
                  <figure key={p.id} className="relative mb-2 break-inside-avoid group">
                    <button type="button" onClick={() => setOpen(order.indexOf(p))} className="block w-full" aria-label={`Abrir foto ${p.number}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.thumb} alt="" loading="lazy" width={p.width} height={p.height} className="w-full h-auto block bg-line" style={{ aspectRatio: `${p.width} / ${p.height}` }} />
                    </button>
                    <span className="absolute left-1.5 bottom-1.5 text-[11px] bg-black/55 text-white rounded px-1.5 tabular">{p.number}</span>
                    {(editable || on) && (
                      <button
                        type="button"
                        onClick={() => toggle(p.id)}
                        disabled={!editable}
                        aria-pressed={on}
                        aria-label={on ? `Tirar a foto ${p.number} do álbum` : `Escolher a foto ${p.number} para o álbum`}
                        className={`absolute right-1.5 top-1.5 w-9 h-9 rounded-full grid place-items-center transition ${on ? "bg-accent text-white" : "bg-black/35 text-white opacity-90 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"}`}
                      >
                        <Heart on={on} />
                      </button>
                    )}
                  </figure>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {editable && (
        <div className="fixed inset-x-0 bottom-0 bg-panel/95 backdrop-blur border-t border-line z-20" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4 justify-between">
            <div className="text-sm min-w-0">
              <p className="font-medium tabular">
                {count}{limit > 0 && <span className="text-muted font-normal"> de {limit + gallery.paidExtras}</span>} fotos no álbum
              </p>
              {extra > 0 && <p className="text-accent tabular">{extra} extra{extra > 1 ? "s" : ""} · {brl(cost.total)}</p>}
              {error && <p className="text-danger">{error}</p>}
            </div>
            <button className="btn btn-primary" disabled={!count} onClick={() => setConfirming(true)}>Finalizar seleção</button>
          </div>
        </div>
      )}

      {confirming && (
        <div className="fixed inset-0 z-40 bg-black/50 grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="card w-full max-w-md flex flex-col gap-4">
            <h2 id="confirm-title" className="font-display text-2xl">Finalizar a seleção?</h2>
            <p className="text-sm">
              Vocês escolheram <strong className="tabular">{count} fotos</strong> para o álbum. Depois de finalizar, a seleção não pode mais ser alterada por aqui.
            </p>
            {extra > 0 && (
              <div className="rounded-lg bg-accent-soft p-3 text-sm">
                <p>
                  O pacote inclui {limit + gallery.paidExtras} fotos. As <strong>{extra} fotos extras</strong> custam <strong>{brl(cost.total)}</strong>
                  {cost.parts.length > 1 && <> ({cost.parts.map((p) => p.label).join(" + ")})</>}.
                </p>
                <p className="mt-1 text-muted">O pagamento é feito em seguida pelo Mercado Pago, por Pix ou cartão em até 12x.</p>
              </div>
            )}
            {error && <p className="text-sm text-danger">{error}</p>}
            <div className="flex gap-2 justify-end">
              <button className="btn" onClick={() => setConfirming(false)} disabled={busy}>Continuar escolhendo</button>
              <button className="btn btn-primary" onClick={finalize} disabled={busy}>
                {busy ? "Finalizando…" : extra > 0 ? `Finalizar e pagar ${brl(cost.total)}` : "Finalizar seleção"}
              </button>
            </div>
          </div>
        </div>
      )}

      {current && (
        <div className="fixed inset-0 z-30 bg-black/95 text-white flex flex-col" role="dialog" aria-modal="true" aria-label={`Foto ${current.number}`}>
          <div className="flex items-center justify-between px-4 py-3" style={{ paddingTop: "max(12px, env(safe-area-inset-top, 0px))" }}>
            <span className="text-sm tabular opacity-80">Foto {current.number} · {open! + 1} de {order.length}</span>
            <div className="flex items-center gap-2">
              {gallery.allowDownload && (
                <a href={`/api/g/${gallery.slug}/foto/${current.id}`} className="btn bg-transparent text-white border-white/30 text-sm">Baixar</a>
              )}
              {(editable || selected.has(current.id)) && (
                <button
                  onClick={() => toggle(current.id)}
                  disabled={!editable}
                  aria-pressed={selected.has(current.id)}
                  className={`btn text-sm ${selected.has(current.id) ? "btn-primary" : "bg-transparent text-white border-white/30"}`}
                >
                  <Heart on={selected.has(current.id)} /> {selected.has(current.id) ? "No álbum" : "Escolher"}
                </button>
              )}
              <button onClick={() => setOpen(null)} className="btn bg-transparent text-white border-white/30 text-sm" aria-label="Fechar">Fechar</button>
            </div>
          </div>
          <div className="relative flex-1 min-h-0 flex items-center justify-center px-2 pb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={current.id} src={current.web} alt={`Foto ${current.number}`} className="max-w-full max-h-full object-contain select-none" />
            <button onClick={() => setOpen(Math.max(0, open! - 1))} disabled={open === 0} aria-label="Foto anterior" className="absolute left-0 inset-y-0 w-1/4 sm:w-24 grid place-items-center text-3xl opacity-70 hover:opacity-100 disabled:opacity-0">‹</button>
            <button onClick={() => setOpen(Math.min(order.length - 1, open! + 1))} disabled={open === order.length - 1} aria-label="Próxima foto" className="absolute right-0 inset-y-0 w-1/4 sm:w-24 grid place-items-center text-3xl opacity-70 hover:opacity-100 disabled:opacity-0">›</button>
          </div>
        </div>
      )}
    </div>
  );
}
