import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RelatedPosts } from "@/components/blog/related-posts";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/services/rest-api/blog/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getBlogPostBySlug(slug);
    return {
      title: `${post.title} | Blog Mono Studio`,
      description: post.summary ?? "Bài viết từ Mono Studio.",
      alternates: { canonical: `/blog/${slug}` },
      openGraph: {
        type: "article",
        title: post.title,
        description: post.summary,
        images: post.thumbnailUrl ? [post.thumbnailUrl] : [],
        url: `/blog/${slug}`,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.summary,
        images: post.thumbnailUrl ? [post.thumbnailUrl] : [],
      },
    };
  } catch {
    return { title: "Blog | Mono Studio" };
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  let post;
  try {
    post = await getBlogPostBySlug(slug);
  } catch {
    notFound();
  }

  const related = await getRelatedBlogPosts(slug, 6).catch(() => []);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    image: post.thumbnailUrl ? [post.thumbnailUrl] : [],
    author: {
      "@type": "Person",
      name: post.authorName ?? "Mono Studio",
    },
    datePublished: post.publishedAt ?? post.createdAt,
    dateModified: post.updatedAt ?? post.publishedAt ?? post.createdAt,
    mainEntityOfPage: `/blog/${slug}`,
  };

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">{post.title}</h1>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        {post.publishedAt ?? post.createdAt} {post.authorName ? `· ${post.authorName}` : ""}
      </p>
      {post.thumbnailUrl && (
        <img src={post.thumbnailUrl} alt={post.title} className="mt-6 w-full object-cover rounded-lg" />
      )}
      <div 
        className="mt-8 prose prose-neutral dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <div className="mt-12 border-t pt-8">
        <RelatedPosts posts={related} />
      </div>
    </article>
  );
}
