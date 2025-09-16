"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiGetNote } from "@/lib/api/clientApi";
import Modal from "@/components/Modal/Modal";

export default function NotePreview() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => apiGetNote(String(id)),
    enabled: typeof id === "string" && id.length > 0,
    refetchOnMount: false,
  });

  const handleClose = () => router.back();

  return (
    <Modal onClose={handleClose}>
      {isLoading && <p>Loading note…</p>}
      {(isError || !data) && !isLoading && <p>Failed to load note</p>}

      {!isLoading && !isError && data && (
        <article style={{ padding: 16, position: "relative" }}>
          <button type="button" onClick={handleClose} aria-label="Close">
            ✕
          </button>

          <h2>{data.title}</h2>
          <p>#{data.tag}</p>
          <p>{data.content}</p>
        </article>
      )}
    </Modal>
  );
}
