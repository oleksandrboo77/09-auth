import { cookies } from "next/headers";
import { nextServer } from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

export async function checkServerSession() {
  const cookieStore = await cookies();
  return nextServer.get<User | undefined>("/auth/session", {
    headers: { Cookie: cookieStore.toString() },
  });
}

export async function serverGetMe() {
  const cookieStore = await cookies();
  const { data } = await nextServer.get<User>("/users/me", {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
}

export async function serverGetNote(id: string) {
  const cookieStore = await cookies();
  const { data } = await nextServer.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
}

export async function serverGetNotes(params: {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}) {
  const cookieStore = await cookies();
  const { data } = await nextServer.get(`/notes`, {
    params,
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
}
