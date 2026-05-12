import Link from "next/link";
import type { BlogPost } from "@/types/blog";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="border border-neutral-200 dark:border-neutral-800">
      {post.thumbnailUrl ? (
        <img src={post.thumbnailUrl} alt={post.title} className="h-52 w-full object-cover" />
      ) : (
        <div className="h-52 w-full bg-neutral-100 dark:bg-neutral-900" />
      )}
      <div className="p-4">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {post.publishedAt ?? post.createdAt ?? ""}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-neutral-900 dark:text-white line-clamp-2">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        {post.summary && (
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 line-clamp-3">
            {post.summary}
          </p>
        )}
      </div>
    </article>
  );
}
