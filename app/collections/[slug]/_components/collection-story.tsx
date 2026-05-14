"use client";

import { useMemo, useState } from "react";
import { CaretDown } from "@phosphor-icons/react";

function sanitizeRichText(html: string): string {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/\s(on\w+|javascript:|data:)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
}

interface CollectionStoryProps {
  descriptionHtml?: string;
}

export function CollectionStory({ descriptionHtml }: CollectionStoryProps) {
  const [expanded, setExpanded] = useState(false);

  const safeHtml = useMemo(() => {
    if (!descriptionHtml?.trim()) return null;
    return sanitizeRichText(descriptionHtml);
  }, [descriptionHtml]);

  if (!safeHtml) return null;

  return (
    <section className="mb-8 border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950 md:p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        Giới thiệu chi tiết
      </h2>

      <div className="mt-4">
        <div
          className={[
            "prose prose-sm prose-neutral max-w-none dark:prose-invert",
            expanded ? "" : "relative max-h-[7.5rem] overflow-hidden",
          ].join(" ")}
        >
          <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
          {!expanded ? (
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-white to-transparent dark:from-neutral-950"
              aria-hidden
            />
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-neutral-800 hover:text-neutral-600 dark:text-neutral-200 dark:hover:text-white"
        >
          {expanded ? "Thu gọn" : "Xem thêm"}
          <CaretDown
            className={["size-4 transition-transform", expanded ? "rotate-180" : ""].join(" ")}
          />
        </button>
      </div>
    </section>
  );
}
