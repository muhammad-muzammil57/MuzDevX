export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/db";



export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <p className="font-mono-ui text-xs uppercase tracking-widest text-accent-2">
        {post.category}
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{post.title}</h1>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted">
        <span>{post.author}</span>
        <span>•</span>
        <span>
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span>•</span>
        <span>{post.readingTime}</span>
      </div>

      <div className="mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-surface-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
      </div>

      <div className="prose prose-invert mt-8 max-w-none text-sm leading-relaxed text-muted">
        <p>{post.content}</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-1.5">
        {post.tags.map((t) => (
          <span key={t} className="rounded-full bg-surface-2 px-2.5 py-1 font-mono-ui text-[11px] text-muted">
            #{t}
          </span>
        ))}
      </div>

      <div className="mt-14 border-t border-border pt-8">
        <Link href="/blog" className="text-sm text-muted hover:text-text">
          ← Back to blog
        </Link>
      </div>
    </article>
  );
}
