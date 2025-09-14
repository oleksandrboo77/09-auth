import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { serverGetNote } from "@/lib/api/serverApi";
import NotePreview from "./NotePreview.client";

export default async function NotePreviewPage({
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
      <NotePreview />
    </HydrationBoundary>
  );
}
