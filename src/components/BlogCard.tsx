import Link from "next/link";
import type { BlogPost } from "@/types";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/50"
    >
      <div className="aspect-[16/9] overflow-hidden bg-surface-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.coverImage}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="font-mono-ui text-[11px] uppercase tracking-widest text-accent">
          {post.category}
        </p>
        <h3 className="font-display text-base font-semibold text-text group-hover:text-accent">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted">{post.excerpt}</p>
        <div className="mt-auto flex items-center gap-2 pt-3 text-xs text-muted">
          <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          <span>•</span>
          <span>{post.readingTime}</span>
        </div>
      </div>
    </Link>
  );
}
