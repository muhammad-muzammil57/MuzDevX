import Link from "next/link";
import type { NewsArticle } from "@/types";

export default function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="group flex gap-4 overflow-hidden rounded-2xl border border-border bg-surface p-3 transition-colors hover:border-accent/50 sm:p-4"
    >
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-2 sm:h-24 sm:w-24">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 py-0.5">
        <p className="font-mono-ui text-[10px] uppercase tracking-widest text-accent">
          {article.category}
        </p>
        <h3 className="line-clamp-2 font-display text-sm font-semibold text-text group-hover:text-accent sm:text-base">
          {article.title}
        </h3>
        <p className="mt-auto text-xs text-muted">
          {new Date(article.publishedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    </Link>
  );
}
