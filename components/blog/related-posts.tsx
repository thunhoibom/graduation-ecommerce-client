import { BlogCard } from "./blog-card";
import type { BlogPost } from "@/types/blog";

export function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null;
  return (
    <section className="mt-14">
      <h2 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-white">Bài viết liên quan</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
