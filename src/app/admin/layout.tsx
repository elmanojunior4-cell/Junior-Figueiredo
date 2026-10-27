import Link from "next/link";
import { requireAdmin, endAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

async function sair() {
  "use server";
  await endAdminSession();
  redirect("/entrar");
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-dvh">
      <header className="border-b border-line bg-panel">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full border border-accent text-accent grid place-items-center font-display text-sm">JF</span>
            <span className="font-medium">Estúdio</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/admin" className="btn">Galerias</Link>
            <form action={sair}><button className="btn">Sair</button></form>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">{children}</main>
    </div>
  );
}
