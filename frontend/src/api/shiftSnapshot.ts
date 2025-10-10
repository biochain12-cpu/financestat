import { api } from "./backend";

export async function saveShiftSnapshot(data: {
  shift_number: number;
  balances: any;
  rates: any;
}) {
  const res = await api.post("/shift_snapshot", data);
  return res.data;
}

export async function getShiftSnapshots() {
  const res = await api.get("/shift_snapshot");
  return res.data;
}