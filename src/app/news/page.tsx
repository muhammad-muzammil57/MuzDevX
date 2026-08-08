import { getNewsArticles } from "@/lib/db";
import NewsCard from "@/components/NewsCard";

export const metadata = { title: "News" };

export default async function NewsPage() {
  const news = await getNewsArticles();

  return (
    <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
      <p className="font-mono-ui text-xs uppercase tracking-widest text-accent-2">$ tail -f ./news</p>
      <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">News</h1>
      <p className="mt-3 max-w-xl text-sm text-muted">
        Updates I&apos;m publishing myself — new releases, tools I&apos;m trying, and things worth sharing.
      </p>

      {news.length === 0 ? (
        <p className="mt-16 text-center text-sm text-muted">No news published yet.</p>
      ) : (
        <div className="mt-10 space-y-4">
          {news.map((n) => (
            <NewsCard key={n.id} article={n} />
          ))}
        </div>
      )}
    </section>
  );
}
