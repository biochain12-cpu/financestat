import { api } from "./backend";

export async function getBalances() {
  const res = await api.get("/balances");
  return res.data;
}