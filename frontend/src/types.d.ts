export type User = {
  id: number;
  login: string;
  avatar_url?: string;
  role: string;
};

export type Transaction = {
  id: number;
  type: string;
  shift: number;
  from_currency?: string;
  from_amount?: number;
  to_currency?: string;
  to_amount?: number;
  comment?: string;
  author_id: number;
  date: string;
};

export type FireMessage = {
  id: number;
  text: string;
  author_id: number;
  date: string;
};