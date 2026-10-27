import Link from "next/link";
import { createGallery } from "../../actions";

export default async function NovaGaleria({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  return (
    <div className="max-w-2xl flex flex-col gap-6">
      <div>
        <Link href="/admin" className="text-sm text-muted hover:text-ink">← Galerias</Link>
        <h1 className="font-display text-3xl mt-1">Nova galeria</h1>
        <p className="text-muted text-sm mt-1">
          As seções Pré-wedding, Making of, Cerimônia e Recepção são criadas automaticamente. Você pode mudar depois.
        </p>
      </div>
      <form action={createGallery} className="card flex flex-col gap-5">
        <fieldset className="grid sm:grid-cols-2 gap-4">
          <legend className="eyebrow mb-2">Casal</legend>
          <label className="label sm:col-span-2">Nomes do casal<input className="input" name="names" placeholder="Ana & Pedro" required /></label>
          <label className="label">Data do casamento<input className="input" type="date" name="event_date" /></label>
          <label className="label">Cidade<input className="input" name="city" placeholder="Nepomuceno - MG" /></label>
          <label className="label">WhatsApp<input className="input" name="phone" placeholder="(35) 99999-9999" inputMode="tel" /></label>
          <label className="label">E-mail<input className="input" type="email" name="email" /></label>
        </fieldset>
        <fieldset className="grid sm:grid-cols-2 gap-4">
          <legend className="eyebrow mb-2">Seleção e fotos extras</legend>
          <label className="label">Fotos do álbum no pacote<input className="input tabular" type="number" min="0" name="package_limit" defaultValue={80} /></label>
          <label className="label">Prazo para a seleção<input className="input" type="date" name="selection_deadline" /></label>
          <label className="label">Preço por foto extra (R$)<input className="input tabular" name="extra_price" placeholder="15,00" inputMode="decimal" /></label>
          <label className="label">Pacotes de extras (opcional)<input className="input" name="extra_tiers" placeholder="10=120; 20=200" /></label>
          <p className="text-xs text-muted sm:col-span-2">
            Pacotes no formato quantidade=valor. O sistema cobra sempre a combinação mais barata para o casal.
          </p>
        </fieldset>
        <fieldset className="grid sm:grid-cols-2 gap-4">
          <legend className="eyebrow mb-2">Acesso</legend>
          <label className="label">Senha da galeria<input className="input" name="password" minLength={4} required placeholder="Ex.: ana2027" /></label>
        </fieldset>
        {erro && <p className="text-sm text-danger">Preencha os nomes do casal e uma senha com pelo menos 4 caracteres.</p>}
        <div><button className="btn btn-primary">Criar galeria</button></div>
      </form>
    </div>
  );
}
