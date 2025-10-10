import { api } from "./backend";

export async function getTransactions(params: any = {}) {
  const res = await api.get("/transactions", { params });
  return res.data; // убери квадратные скобки!
}

export async function createTransaction(data: any) {
  const res = await api.post("/transactions", data); // убери квадратные скобки!
  return res.data;
}

export async function deleteTransaction(id: number) {
  const res = await api.delete(`/transactions/${id}`);
  return res.data;
}