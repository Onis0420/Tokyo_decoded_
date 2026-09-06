import type { Metadata } from "next";
import PostsListTD from "@/components/redesign/PostsListTD";
import { metadataForPage } from "@/lib/i18n";

export const revalidate = 3600;
export function generateMetadata(): Metadata {
  return metadataForPage("posts", "en");
}

export default async function EnPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; sort?: string; q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  return <PostsListTD locale="en" params={sp} />;
}
