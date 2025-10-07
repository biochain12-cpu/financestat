import { api } from "./backend";

export async function getFireMessages() {
  const res = await api.get("/fire");
  return res.data;
}

export async function createFireMessage(text: string) {
  const res = await api.post("/fire", { text });
  return res.data;
}

export async function deleteFireMessage(id: number) {
  const res = await api.delete(`/fire/${id}`);
  return res.data;
}