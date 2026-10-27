import Link from "next/link";
import { db } from "@/lib/db";
import { STATUS_LABEL, type Gallery } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  draft: "bg-line text-ink",
  published: "bg-accent-soft text-accent",
  selecting: "bg-accent-soft text-accent",
  selection_done: "bg-[#e3efe6] text-ok",
  delivered: "bg-[#e3efe6] text-ok",
};

export default async function AdminHome() {
  const { data } = await db().from("galleries").select("*").order("created_at", { ascending: false });
  const galleries = (data || []) as Gallery[];
  const counts = await Promise.all(
    galleries.map(async (g) => {
      const [{ count: photos }, { count: sel }] = await Promise.all([
        db().from("photos").select("id", { count: "exact", head: true }).eq("gallery_id", g.id),
        db().from("selections").select("photo_id", { count: "exact", head: true }).eq("gallery_id", g.id),
      ]);
      return { photos: photos || 0, sel: sel || 0 };
    }),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Galerias</p>
          <h1 className="font-display text-3xl">Casais</h1>
        </div>
        <Link href="/admin/galerias/nova" className="btn btn-primary">Nova galeria</Link>
      </div>

      {galleries.length === 0 ? (
        <div className="card text-center py-12">
          <p className="font-medium">Nenhuma galeria ainda</p>
          <p className="text-muted text-sm mt-1">Crie a primeira galeria, suba as fotos por momento e envie o link para o casal.</p>
          <Link href="/admin/galerias/nova" className="btn btn-primary mt-4">Criar galeria</Link>
        </div>
      ) : (
        <div className="card p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-line">
                <th className="font-normal px-4 py-3">Casal</th>
                <th className="font-normal px-4 py-3">Data</th>
                <th className="font-normal px-4 py-3">Situação</th>
                <th className="font-normal px-4 py-3 text-right">Fotos</th>
                <th className="font-normal px-4 py-3 text-right">Selecionadas</th>
              </tr>
            </thead>
            <tbody>
              {galleries.map((g, i) => (
                <tr key={g.id} className="border-b border-line last:border-0 hover:bg-paper">
                  <td className="px-4 py-3">
                    <Link href={`/admin/galerias/${g.id}`} className="font-medium hover:text-accent">{g.title}</Link>
                  </td>
                  <td className="px-4 py-3 tabular text-muted">
                    {g.event_date ? new Date(g.event_date + "T12:00:00").toLocaleDateString("pt-BR") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs ${STATUS_STYLE[g.status]}`}>{STATUS_LABEL[g.status]}</span>
                  </td>
                  <td className="px-4 py-3 text-right tabular">{counts[i].photos}</td>
                  <td className="px-4 py-3 text-right tabular">
                    {counts[i].sel}
                    {g.package_limit > 0 && <span className="text-muted"> / {g.package_limit}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
