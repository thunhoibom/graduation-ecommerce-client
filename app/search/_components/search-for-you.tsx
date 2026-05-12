"use client";

import { ForYouRail } from "@/components/product/for-you-rail";

interface Props {
  query: string;
  excludeIds: string[];
}

export function SearchForYouSection({ query, excludeIds }: Props) {
  if (!query.trim()) return null;

  return <ForYouRail variant="search" query={query} excludeIds={excludeIds} />;
}
