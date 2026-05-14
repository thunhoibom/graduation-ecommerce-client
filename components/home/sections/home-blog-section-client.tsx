"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CaretLeft, CaretRight, Article } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { HomeSectionHeader } from "@/components/home/sections/home-section-header";
import type { BlogPost } from "@/types/blog";

function formatPostDate(iso?: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

interface Props {
  posts: BlogPost[];
}

export function HomeBlogSectionClient({ posts }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const item = scrollRef.current.querySelector("article");
    const itemWidth = item?.offsetWidth ?? 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -(itemWidth * 2) : itemWidth * 2,
      behavior: "smooth",
    });
  };

  return (
    <section className="home-surface-muted home-section border-t border-neutral-200/80 dark:border-neutral-800">
      <div className="section-shell">
        <HomeSectionHeader
          eyebrow="Đọc thêm"
          title="Từ blog"
          description="Tin thời trang, phong cách và cập nhật từ Mono Studio"
          action={
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll("left")}
                aria-label="Cuộn sang trái"
                className="size-9 rounded-none"
              >
                <CaretLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll("right")}
                aria-label="Cuộn sang phải"
                className="size-9 rounded-none"
              >
                <CaretRight className="size-4" />
              </Button>
              <Button variant="outline" size="sm" asChild className="gap-1.5 rounded-none">
                <Link href="/blog">
                  Xem tất cả
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </>
          }
        />

        <div
          ref={scrollRef}
          className="flex snap-x snap-proximity gap-4 overflow-x-auto scroll-smooth pb-2 pl-1 pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {posts.map((post) => (
            <article
              key={post.id}
              className="group w-[280px] flex-none snap-start overflow-hidden rounded-none border border-neutral-200/80 bg-white shadow-[0_18px_40px_-32px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-0.5 hover:border-neutral-400 md:w-[300px] dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-600"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                  {post.thumbnailUrl ? (
                    <Image
                      src={post.thumbnailUrl}
                      alt={post.title}
                      fill
                      loading="lazy"
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 280px, 300px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Article className="size-10 text-neutral-400" weight="duotone" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {formatPostDate(post.publishedAt ?? post.createdAt)}
                  </p>
                  <h3 className="mt-1 line-clamp-2 text-base font-semibold text-neutral-900 dark:text-white">
                    {post.title}
                  </h3>
                  {post.summary && (
                    <p className="mt-2 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-300">
                      {post.summary}
                    </p>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
