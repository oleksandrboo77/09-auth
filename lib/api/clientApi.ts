import { nextServer } from "./api";
import type { User } from "@/types/user";

export async function apiRegister(data: {
  email: string;
  password: string;
  userName?: string;
}) {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
}

export async function apiLogin(data: { email: string; password: string }) {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
}

export async function apiLogout() {
  await nextServer.post("/auth/logout");
}

export async function apiCheckSession(): Promise<User | null> {
  try {
    const res = await nextServer.get<User | undefined>("/auth/session");

    return res.data ?? null;
  } catch {
    return null;
  }
}

export async function apiGetMe() {
  const res = await nextServer.get<User>("/users/me");
  return res.data;
}

export async function apiUpdateMe(payload: Partial<User>) {
  const res = await nextServer.patch<User>("/users/me", payload);
  return res.data;
}

export async function apiGetNotes(params: {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}) {
  const res = await nextServer.get("/notes", { params });
  return res.data;
}
export async function apiGetNote(id: string) {
  const res = await nextServer.get(`/notes/${id}`);
  return res.data;
}
export async function apiCreateNote(payload: {
  title: string;
  content: string;
  tag: string;
}) {
  const res = await nextServer.post("/notes", payload);
  return res.data;
}
export async function apiDeleteNote(id: string) {
  const res = await nextServer.delete(`/notes/${id}`);
  return res.data;
}
