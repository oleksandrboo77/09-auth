"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiGetNote } from "@/lib/api/clientApi";

export default function NotePreview() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => apiGetNote(String(id)),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading note…</p>;
  if (isError || !data) return <p>Failed to load note</p>;

  return (
    <article style={{ padding: 16 }}>
      <h2 style={{ marginBottom: 8 }}>{data.title}</h2>
      <p style={{ opacity: 0.7, marginBottom: 12 }}>#{data.tag}</p>
      <p>{data.content}</p>
    </article>
  );
}
