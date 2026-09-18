export type Theme = "ulang-tahun" | "anniversary" | "wisuda" | "lebaran" | "valentine";

export interface Card {
  id: string;
  order_index: number;
  text_content: string;
  image_url?: string;
}

export interface Gift {
  id: string;
  slug: string;
  recipient_name: string;
  opening_text: string;
  theme: Theme;
  closing_text: string;
  music_url?: string;
  cards: Card[];
  status: "draft" | "published";
  is_premium?: boolean;
  passcode?: string;
  view_count: number;
  like_count: number;
  is_public: boolean;
  published_at?: string;
  created_at: string;
}

export interface Reply {
  id: string;
  gift_id: string;
  sender_name: string;
  message: string;
  created_at: string;
}

export interface UserGift extends Gift {
  replies?: Reply[];
}

export interface PaymentTransaction {
  id: string;
  user_id: string;
  gift_id: string;
  mayar_invoice_id?: string;
  payment_url?: string;
  amount: number;
  status: "pending" | "paid" | "failed" | "expired";
  created_at: string;
  paid_at?: string;
}


