import Link from "next/link";
import { STUDIO_NAME } from "@/lib/env";

export default async function Obrigado({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ status?: string; collection_status?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const st = sp.collection_status || sp.status;
  const pending = st === "pending" || st === "in_process";

  return (
    <main className="min-h-dvh grid place-items-center px-6">
      <div className="max-w-md text-center flex flex-col gap-4">
        <p className="eyebrow">{STUDIO_NAME}</p>
        <h1 className="font-display text-4xl">{pending ? "Pagamento em análise" : "Seleção recebida"}</h1>
        <p className="text-muted">
          {pending
            ? "Assim que o Mercado Pago confirmar o pagamento, a seleção é finalizada automaticamente. Se pagaram por Pix, isso leva poucos minutos."
            : "Obrigado! Recebemos a seleção e o pagamento das fotos extras. Avisaremos pelo WhatsApp quando a diagramação do álbum estiver pronta."}
        </p>
        <Link href={`/g/${slug}`} className="btn mx-auto">Voltar para a galeria</Link>
      </div>
    </main>
  );
}
