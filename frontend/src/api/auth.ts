import { api } from "./backend";

export async function login(username: string, password: string) {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);
  const res = await api.post("/token", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  localStorage.setItem("token", res.data.access_token);
  return res.data;
}

export async function register(login: string, password: string, avatar_url?: string) {
  const res = await api.post("/register", {
    login,
    password,
    avatar_url,
    role: "user",
  });
  return res.data;
}

export async function getMe() {
  const res = await api.get("/me");
  return res.data;
}

export function logout() {
  localStorage.removeItem("token");
}