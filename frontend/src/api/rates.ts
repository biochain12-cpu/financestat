import { api } from "./backend";

export async function getRates() {
  const res = await api.get("/rates");
  return res.data;
}