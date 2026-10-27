"use client";

import { useState } from "react";

export default function CopyBox({ text, label, rows = 3 }: { text: string; label: string; rows?: number }) {
  const [done, setDone] = useState(false);
  async function copy(e: React.MouseEvent<HTMLButtonElement>) {
    const area = e.currentTarget.parentElement?.parentElement?.querySelector("textarea");
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      area?.select();
    }
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="eyebrow">{label}</span>
        <button type="button" onClick={copy} className="btn text-xs py-1 px-2">{done ? "Copiado" : "Copiar"}</button>
      </div>
      <textarea readOnly value={text} rows={rows} className="input text-sm font-mono resize-y" />
    </div>
  );
}
