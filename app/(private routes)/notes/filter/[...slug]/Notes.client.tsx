"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import css from "./NotesPage.module.css";
import Link from "next/link";

import { apiGetNotes } from "@/lib/api/clientApi";
import type { Note, NoteTag } from "@/types/note";

import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";

type NotesResult = {
  notes: Note[];
  totalPages?: number;
};

export default function NotesClient({ initialTag }: { initialTag?: NoteTag }) {
  const [page, setPage] = useState(1);
  const perPage = 12;
  const [search, setSearch] = useState("");

  const setSearchDebounced = useDebouncedCallback((value: string) => {
    setPage(1);
    setSearch(value);
  }, 400);

  const { data, isLoading, isError, error, isPlaceholderData } =
    useQuery<NotesResult>({
      queryKey: ["notes", { page, perPage, tag: initialTag ?? "", search }],
      queryFn: async () => {
        const res = await apiGetNotes({
          page,
          perPage,
          tag: initialTag,
          search,
        });

        if (Array.isArray(res)) {
          return { notes: res };
        }

        return res as NotesResult;
      },
      placeholderData: keepPreviousData,
    });

  const totalPages = data?.totalPages ?? 1;
  const notes = data?.notes ?? [];

  return (
    <section className={css.wrapper}>
      <div className={css.toolbar}>
        <input
          type="text"
          className={css.searchInput}
          placeholder="Search…"
          onChange={(e) => setSearchDebounced(e.target.value)}
          aria-label="Search notes"
        />
        <Link href="/notes/action/create" className={css.button}>
          Create note
        </Link>
      </div>

      {isLoading && <p className={css.status}>Loading…</p>}
      {isError && (
        <p className={css.error}>
          {(error as Error)?.message || "Failed to load notes"}
        </p>
      )}

      {!isLoading && !isError && (
        <>
          <NoteList notes={notes} />

          {totalPages > 1 && (
            <div className={css.paginationWrapper}>
              <Pagination
                pageCount={totalPages}
                currentPage={page}
                onPageChange={(next) => {
                  if (!isPlaceholderData) setPage(next);
                }}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}
