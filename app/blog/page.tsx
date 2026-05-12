import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/components/blog/blog-card";
import { getBlogPosts } from "@/services/rest-api/blog/blog";

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Blog: ${q} | Mono Studio` : "Blog | Mono Studio",
    description: "Bài viết về thời trang, phong cách và tin tức mới từ Mono Studio.",
    alternates: { canonical: "/blog" },
    openGraph: { title: "Blog | Mono Studio", type: "website", url: "/blog" },
  };
}

export default async function BlogPage({ searchParams }: Props) {
  const { q, page } = await searchParams;
  const pageNumber = page ? parseInt(page, 10) : 1;
  const data = await getBlogPosts({ query: q, page: pageNumber, pageSize: 12 });
  const posts = data.items ?? [];
  const current = (data.pageIndex ?? 0) + 1;
  const totalPages = Math.max(1, Math.ceil((data.totalCount ?? 0) / (data.pageSize || 12)));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">Blog</h1>
      <form className="mt-5 flex gap-2" action="/blog" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="Tìm bài viết..."
          className="w-full border border-neutral-300 px-4 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
        <button className="border border-neutral-900 px-4 py-2 text-sm text-neutral-900 dark:border-white dark:text-white">
          Tìm
        </button>
      </form>

      {posts.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-600 dark:text-neutral-300">Chưa có bài viết phù hợp.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-3 text-sm">
        <Link
          href={`/blog?page=${Math.max(1, current - 1)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
          className={current <= 1 ? "pointer-events-none opacity-40" : ""}
        >
          Trang trước
        </Link>
        <span>{current} / {totalPages}</span>
        <Link
          href={`/blog?page=${Math.min(totalPages, current + 1)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
          className={current >= totalPages ? "pointer-events-none opacity-40" : ""}
        >
          Trang sau
        </Link>
      </div>
    </div>
  );
}
