import { redirect } from "next/navigation";
import { checkAdminPassword, startAdminSession } from "@/lib/auth";
import { STUDIO_NAME } from "@/lib/env";

async function login(formData: FormData) {
  "use server";
  const password = String(formData.get("password") || "");
  if (!checkAdminPassword(password)) redirect("/entrar?erro=1");
  await startAdminSession();
  redirect("/admin");
}

export default async function Entrar({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  return (
    <main className="min-h-dvh grid place-items-center px-6">
      <form action={login} className="card w-full max-w-sm flex flex-col gap-4">
        <div>
          <p className="eyebrow">Área do estúdio</p>
          <h1 className="font-display text-2xl mt-1">{STUDIO_NAME}</h1>
        </div>
        <label className="label">
          Senha
          <input className="input" type="password" name="password" autoFocus required autoComplete="current-password" />
        </label>
        {erro && <p className="text-sm text-danger">Senha incorreta. Confira e tente de novo.</p>}
        <button className="btn btn-primary">Entrar</button>
      </form>
    </main>
  );
}
