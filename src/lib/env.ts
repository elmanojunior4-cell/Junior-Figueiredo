// Lê variáveis de ambiente só quando são usadas, para o build não quebrar sem elas.
export function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Variável de ambiente ausente: ${name}. Veja o arquivo .env.example.`);
  return v;
}

export function optionalEnv(name: string): string | undefined {
  return process.env[name] || undefined;
}

export function siteUrl(): string {
  return (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export const STUDIO_NAME = process.env.STUDIO_NAME || "Júnior Figueiredo Fotografia";
