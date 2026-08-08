import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getNewsArticleBySlug, getNewsArticles } from "@/lib/db";

export async function generateStaticParams() {
  const news = await getNewsArticles();
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);
  if (!article) return {};
  return { title: article.title, description: article.excerpt };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <p className="font-mono-ui text-xs uppercase tracking-widest text-accent-2">
        {article.category}
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{article.title}</h1>
      <p className="mt-3 text-xs text-muted">
        Published{" "}
        {new Date(article.publishedAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>

      <div className="mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-surface-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
      </div>

      <div className="prose prose-invert mt-8 max-w-none text-sm leading-relaxed text-muted">
        <p>{article.content}</p>
      </div>

      {article.sourceName && (
        <div className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
          Source:{" "}
          {article.sourceUrl ? (
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-accent hover:underline"
            >
              {article.sourceName} <ArrowUpRight size={12} />
            </a>
          ) : (
            article.sourceName
          )}
        </div>
      )}

      <div className="mt-14 border-t border-border pt-8">
        <Link href="/news" className="text-sm text-muted hover:text-text">
          ← Back to news
        </Link>
      </div>
    </article>
  );
}
