import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";
import { serverGetNote } from "@/lib/api/serverApi";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "https://08-zustand-rho-amber.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await serverGetNote(id);
    const snippet = (note.content ?? "").trim().slice(0, 140) || "Viewing note";
    const title = `${note.title} — NoteHub`;
    const description = snippet;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${BASE_URL}/notes/${id}`,
        images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
      },
    };
  } catch {
    const title = `Note — ${id} — NoteHub`;
    const description = "Viewing note.";
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${BASE_URL}/notes/${id}`,
        images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
      },
    };
  }
}

export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => serverGetNote(id),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
