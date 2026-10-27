export type GalleryStatus = "draft" | "published" | "selecting" | "selection_done" | "delivered";

export type Tier = { qty: number; price_cents: number };

export interface Gallery {
  id: string;
  client_id: string | null;
  slug: string;
  title: string;
  event_date: string | null;
  password_hash: string;
  status: GalleryStatus;
  package_limit: number;
  extra_price_cents: number;
  extra_tiers: Tier[];
  selection_deadline: string | null;
  allow_download: boolean;
  cover_photo_id: string | null;
  created_at: string;
}

export interface Section {
  id: string;
  gallery_id: string;
  name: string;
  position: number;
}

export interface Photo {
  id: string;
  gallery_id: string;
  section_id: string | null;
  number: number;
  filename: string;
  width: number;
  height: number;
  size_bytes: number;
  key_full: string;
  key_web: string;
  key_thumb: string;
}

export interface Order {
  id: string;
  gallery_id: string;
  selected_count: number;
  extra_count: number;
  amount_cents: number;
  status: "pending" | "paid" | "cancelled";
  mp_preference_id: string | null;
  mp_payment_id: string | null;
  created_at: string;
  paid_at: string | null;
}

/** Foto como o navegador do casal recebe: sem chaves internas. */
export interface ClientPhoto {
  id: string;
  number: number;
  section_id: string | null;
  width: number;
  height: number;
  thumb: string;
  web: string;
}

export const STATUS_LABEL: Record<GalleryStatus, string> = {
  draft: "Rascunho",
  published: "Galeria enviada",
  selecting: "Seleção em andamento",
  selection_done: "Seleção finalizada",
  delivered: "Entregue",
};
