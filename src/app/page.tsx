import Link from "next/link";
import { STUDIO_NAME } from "@/lib/env";

export default function Home() {
  return (
    <main className="min-h-dvh grid place-items-center px-6">
      <div className="text-center max-w-md">
        <p className="eyebrow">Galerias</p>
        <h1 className="font-display text-4xl mt-2">{STUDIO_NAME}</h1>
        <p className="text-muted mt-3">
          Se você é um casal, use o link e a senha que recebeu pelo WhatsApp para abrir a sua galeria.
        </p>
        <Link href="/admin" className="btn mt-6">Área do estúdio</Link>
      </div>
    </main>
  );
}
