"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Section = { id: string; name: string };
type Prepared = { file: File; width: number; height: number; thumb: Blob; web: Blob };

const collator = new Intl.Collator("pt-BR", { numeric: true, sensitivity: "base" });

async function toJpeg(bmp: ImageBitmap, maxSide: number, quality: number, watermark?: string) {
  const k = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * k);
  canvas.height = Math.round(bmp.height * k);
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  if (watermark) {
    const size = Math.round(Math.min(canvas.width, canvas.height) * 0.035);
    ctx.font = `500 ${size}px Georgia, serif`;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = size * 0.3;
    ctx.fillText(watermark, canvas.width - size, canvas.height - size * 0.8);
  }
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", quality));
  canvas.width = canvas.height = 0;
  if (!blob) throw new Error("Não foi possível gerar a versão web da foto.");
  return blob;
}

async function prepare(file: File, watermark: string): Promise<Prepared> {
  const bmp = await createImageBitmap(file);
  try {
    return {
      file,
      width: bmp.width,
      height: bmp.height,
      thumb: await toJpeg(bmp, 520, 0.8),
      web: await toJpeg(bmp, 2048, 0.86, watermark),
    };
  } finally {
    bmp.close();
  }
}

async function put(url: string, body: Blob, type: string) {
  const res = await fetch(url, { method: "PUT", body, headers: { "Content-Type": type } });
  if (!res.ok) throw new Error(`Falha no envio (${res.status}). Confira o CORS do bucket no R2.`);
}

export default function Uploader({ galleryId, sections, watermark }: { galleryId: string; sections: Section[]; watermark: string }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [section, setSection] = useState(sections[0]?.id ?? "");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);

  async function upload(list: FileList | null) {
    if (!list?.length) return;
    const files = [...list].filter((f) => /\.(jpe?g|png|webp)$/i.test(f.name)).sort((a, b) => collator.compare(a.name, b.name));
    if (!files.length) {
      setMsg("Escolha arquivos JPG, PNG ou WebP.");
      return;
    }
    setBusy(true);
    setMsg(null);
    setDone(0);
    setTotal(files.length);
    let failed = 0;
    try {
      // Lotes de 8: prepara no navegador, pede URLs assinadas, envia e registra na ordem.
      for (let i = 0; i < files.length; i += 8) {
        const batch = files.slice(i, i + 8);
        const prepared = await Promise.all(batch.map((f) => prepare(f, watermark).catch(() => null)));
        const ok = prepared.filter((p): p is Prepared => p !== null);
        failed += prepared.length - ok.length;
        if (!ok.length) continue;

        const res = await fetch("/api/admin/upload-urls", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ galleryId, files: ok.map((p) => ({ name: p.file.name, type: p.file.type || "image/jpeg" })) }),
        });
        if (!res.ok) throw new Error("O servidor recusou o envio. Entre de novo na área do estúdio.");
        const { items } = (await res.json()) as {
          items: { id: string; key_full: string; key_web: string; key_thumb: string; put_full: string; put_web: string; put_thumb: string }[];
        };

        await Promise.all(
          ok.map(async (p, j) => {
            const it = items[j];
            await Promise.all([
              put(it.put_full, p.file, p.file.type || "image/jpeg"),
              put(it.put_web, p.web, "image/jpeg"),
              put(it.put_thumb, p.thumb, "image/jpeg"),
            ]);
            setDone((d) => d + 1);
          }),
        );

        const reg = await fetch("/api/admin/photos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            galleryId,
            sectionId: section || null,
            photos: ok.map((p, j) => ({
              id: items[j].id,
              filename: p.file.name,
              width: p.width,
              height: p.height,
              size_bytes: p.file.size,
              key_full: items[j].key_full,
              key_web: items[j].key_web,
              key_thumb: items[j].key_thumb,
            })),
          }),
        });
        if (!reg.ok) throw new Error("As fotos subiram, mas não foram registradas. Tente de novo.");
      }
      setMsg(failed ? `Envio concluído. ${failed} arquivo(s) não puderam ser lidos.` : `${files.length} fotos enviadas.`);
      router.refresh();
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-3">
        <label className="label min-w-48">
          Seção
          <select className="input" value={section} onChange={(e) => setSection(e.target.value)} disabled={busy}>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </label>
        <button type="button" className="btn btn-primary" disabled={busy || !sections.length} onClick={() => input.current?.click()}>
          {busy ? "Enviando…" : "Escolher fotos"}
        </button>
        <input ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => upload(e.target.files)} />
      </div>
      {busy && (
        <div>
          <div className="h-1.5 bg-line rounded-full overflow-hidden">
            <div className="h-full bg-accent transition-all" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
          </div>
          <p className="text-xs text-muted mt-1 tabular">{done} de {total} fotos</p>
        </div>
      )}
      {msg && <p className="text-sm">{msg}</p>}
      <p className="text-xs text-muted">
        Envie as fotos tratadas, exportadas do Lightroom. A ordem segue o nome dos arquivos. O original vai em alta para o download do casal; a galeria mostra uma versão leve com a sua marca d&apos;água.
      </p>
    </div>
  );
}
