import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { siteUrl, STUDIO_NAME } from "@/lib/env";
import { galleryById, ordersOf, photosOf, sectionsOf, selectedIds } from "@/lib/galleries";
import { brl, extrasCost, tiersToText } from "@/lib/pricing";
import { STATUS_LABEL } from "@/lib/types";
import CopyBox from "@/components/CopyBox";
import Uploader from "@/components/Uploader";
import { addSection, deleteSection, setStatus, updateGallery } from "../../actions";

export const dynamic = "force-dynamic";

const EVENT_LABEL: Record<string, string> = {
  first_selection: "O casal começou a seleção",
  selection_done: "Seleção finalizada",
  order_created: "Checkout de extras aberto",
  order_paid: "Extras pagos",
  status_published: "Galeria publicada",
  status_selecting: "Seleção reaberta",
  status_selection_done: "Seleção encerrada pelo estúdio",
  status_delivered: "Marcada como entregue",
  status_draft: "Voltou para rascunho",
};

export default async function GaleriaAdmin({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await galleryById(id);
  if (!g) notFound();
  const [sections, photos, sel, orders, { data: events }] = await Promise.all([
    sectionsOf(id),
    photosOf(id),
    selectedIds(id),
    ordersOf(id),
    db().from("gallery_events").select("*").eq("gallery_id", id).order("created_at", { ascending: false }).limit(20),
  ]);

  const selSet = new Set(sel);
  const selectedPhotos = photos.filter((p) => selSet.has(p.id));
  const baseNames = selectedPhotos.map((p) => p.filename.replace(/\.[^.]+$/, ""));
  const extra = g.package_limit > 0 ? Math.max(0, sel.length - g.package_limit) : 0;
  const cost = extrasCost(extra, g.extra_price_cents, g.extra_tiers);
  const link = `${siteUrl()}/g/${g.slug}`;
  const firstName = g.title.split(/\s*&\s*|\s+e\s+/)[0];
  const whatsapp =
    `Oi, ${firstName}! Suas fotos estão prontas 💛\n\n` +
    `Acesse a galeria: ${link}\nSenha: (a senha combinada)\n\n` +
    (g.package_limit > 0 ? `Escolham as ${g.package_limit} fotos do álbum tocando no coração de cada uma` : `Escolham as fotos do álbum tocando no coração de cada uma`) +
    (g.selection_deadline ? ` até ${new Date(g.selection_deadline + "T12:00:00").toLocaleDateString("pt-BR")}` : "") +
    `. Quando terminarem, é só tocar em Finalizar seleção.\n\n${STUDIO_NAME}`;
  const countBySection = new Map<string | null, number>();
  photos.forEach((p) => countBySection.set(p.section_id, (countBySection.get(p.section_id) || 0) + 1));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/admin" className="text-sm text-muted hover:text-ink">← Galerias</Link>
          <h1 className="font-display text-3xl mt-1">{g.title}</h1>
          <p className="text-sm text-muted mt-1">
            {STATUS_LABEL[g.status]} · {photos.length} fotos · {sel.length} selecionadas
            {g.package_limit > 0 && ` de ${g.package_limit}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={link} target="_blank" className="btn">Ver como o casal</a>
          {g.status === "draft" && (
            <form action={setStatus}><input type="hidden" name="id" value={g.id} /><input type="hidden" name="status" value="published" />
              <button className="btn btn-primary" disabled={!photos.length}>Publicar galeria</button></form>
          )}
          {g.status === "selection_done" && (
            <form action={setStatus}><input type="hidden" name="id" value={g.id} /><input type="hidden" name="status" value="selecting" />
              <button className="btn">Reabrir seleção</button></form>
          )}
          {(g.status === "published" || g.status === "selecting") && (
            <form action={setStatus}><input type="hidden" name="id" value={g.id} /><input type="hidden" name="status" value="selection_done" />
              <button className="btn">Encerrar seleção</button></form>
          )}
          {g.status === "selection_done" && (
            <form action={setStatus}><input type="hidden" name="id" value={g.id} /><input type="hidden" name="status" value="delivered" />
              <button className="btn btn-primary">Marcar como entregue</button></form>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
        <div className="flex flex-col gap-6 min-w-0">
          <section className="card flex flex-col gap-4">
            <h2 className="font-medium">Enviar fotos</h2>
            <Uploader galleryId={g.id} sections={sections.map((s) => ({ id: s.id, name: s.name }))} watermark={STUDIO_NAME} />
          </section>

          <section className="card flex flex-col gap-3">
            <h2 className="font-medium">Seções</h2>
            <ul className="divide-y divide-line">
              {sections.map((s) => (
                <li key={s.id} className="flex items-center justify-between py-2 gap-3">
                  <span>{s.name} <span className="text-muted text-sm tabular">· {countBySection.get(s.id) || 0} fotos</span></span>
                  {!countBySection.get(s.id) && (
                    <form action={deleteSection}>
                      <input type="hidden" name="id" value={g.id} /><input type="hidden" name="section_id" value={s.id} />
                      <button className="text-sm text-muted hover:text-danger">Remover</button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
            <form action={addSection} className="flex gap-2">
              <input type="hidden" name="id" value={g.id} />
              <input className="input" name="name" placeholder="Nova seção, ex.: Festa" />
              <button className="btn">Adicionar</button>
            </form>
          </section>

          <section className="card flex flex-col gap-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-medium">Seleção do casal</h2>
              <span className="text-sm text-muted tabular">
                {sel.length} fotos{extra > 0 && ` · ${extra} extras (${brl(cost.total)})`}
              </span>
            </div>
            {sel.length === 0 ? (
              <p className="text-sm text-muted">O casal ainda não marcou nenhuma foto.</p>
            ) : (
              <>
                <CopyBox label="Para o Lightroom" text={baseNames.join(" ")} rows={4} />
                <p className="text-xs text-muted">
                  No Lightroom, abra o Filtro da Biblioteca → Texto → Nome do arquivo → Contém, cole a lista e selecione tudo para criar a coleção do álbum.
                </p>
                <CopyBox label="Números das fotos" text={selectedPhotos.map((p) => p.number).join(", ")} rows={2} />
              </>
            )}
          </section>

          <section className="card flex flex-col gap-3">
            <h2 className="font-medium">Pagamentos de extras</h2>
            {orders.length === 0 ? (
              <p className="text-sm text-muted">Nenhuma cobrança gerada ainda.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-muted text-left"><tr><th className="font-normal py-1">Data</th><th className="font-normal">Extras</th><th className="font-normal">Valor</th><th className="font-normal">Situação</th></tr></thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-t border-line">
                        <td className="py-2 tabular">{new Date(o.created_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</td>
                        <td className="tabular">{o.extra_count}</td>
                        <td className="tabular">{brl(o.amount_cents)}</td>
                        <td className={o.status === "paid" ? "text-ok" : "text-muted"}>{o.status === "paid" ? "Pago" : o.status === "pending" ? "Aguardando" : "Cancelado"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <aside className="flex flex-col gap-6 min-w-0">
          <section className="card flex flex-col gap-3">
            <CopyBox label="Link da galeria" text={link} rows={1} />
            <CopyBox label="Mensagem para o WhatsApp" text={whatsapp} rows={9} />
          </section>

          <form action={updateGallery} className="card flex flex-col gap-3">
            <h2 className="font-medium">Configurações</h2>
            <input type="hidden" name="id" value={g.id} />
            <label className="label">Nome do casal<input className="input" name="title" defaultValue={g.title} /></label>
            <label className="label">Data do casamento<input className="input" type="date" name="event_date" defaultValue={g.event_date ?? ""} /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="label">Fotos no pacote<input className="input tabular" type="number" min="0" name="package_limit" defaultValue={g.package_limit} /></label>
              <label className="label">Foto extra (R$)<input className="input tabular" name="extra_price" defaultValue={(g.extra_price_cents / 100).toFixed(2).replace(".", ",")} /></label>
            </div>
            <label className="label">Pacotes de extras<input className="input" name="extra_tiers" defaultValue={tiersToText(g.extra_tiers)} placeholder="10=120; 20=200" /></label>
            <label className="label">Prazo da seleção<input className="input" type="date" name="selection_deadline" defaultValue={g.selection_deadline ?? ""} /></label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="allow_download" defaultChecked={g.allow_download} /> Casal pode baixar as fotos em alta</label>
            <label className="label">Nova senha (deixe vazio para manter)<input className="input" name="password" minLength={4} /></label>
            <button className="btn btn-primary">Salvar</button>
          </form>

          <section className="card flex flex-col gap-2">
            <h2 className="font-medium">Linha do tempo</h2>
            {(events || []).length === 0 ? (
              <p className="text-sm text-muted">Nada aconteceu nesta galeria ainda.</p>
            ) : (
              <ul className="text-sm flex flex-col gap-2">
                {(events || []).map((e: { id: number; type: string; created_at: string }) => (
                  <li key={e.id} className="flex justify-between gap-3">
                    <span>{EVENT_LABEL[e.type] || e.type}</span>
                    <span className="text-muted tabular whitespace-nowrap">{new Date(e.created_at).toLocaleDateString("pt-BR")}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
