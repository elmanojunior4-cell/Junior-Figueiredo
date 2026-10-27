import type { Metadata, Viewport } from "next";
import "@fontsource-variable/figtree";
import "@fontsource/newsreader/400.css";
import "@fontsource/newsreader/500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Júnior Figueiredo Fotografia",
  description: "Galerias de casamento, seleção de fotos e entrega.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
