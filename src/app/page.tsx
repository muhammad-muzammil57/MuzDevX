import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { getFeaturedProjects, getBlogPosts, getNewsArticles } from "@/lib/db";
import { siteStats } from "@/data/sample-data";
import ProjectCard from "@/components/ProjectCard";
import BlogCard from "@/components/BlogCard";
import NewsCard from "@/components/NewsCard";
import Hero from "@/components/Hero";

export default async function Home() {
  const [featured, posts, news] = await Promise.all([
    getFeaturedProjects(),
    getBlogPosts(),
    getNewsArticles(),
  ]);

  return (
    <>
      <Hero />

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {siteStats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-surface px-4 py-6 text-center"
            >
              <p className="font-display text-3xl font-bold text-accent">{s.value}</p>
              <p className="mt-1 font-mono-ui text-xs uppercase tracking-widest text-muted">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured projects */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-mono-ui text-xs uppercase tracking-widest text-accent">
              $ ls ./featured
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Featured Work</h2>
          </div>
          <Link
            href="/projects"
            className="hidden items-center gap-1 text-sm font-medium text-muted hover:text-text sm:flex"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
        <Link
          href="/projects"
          className="mt-6 flex items-center justify-center gap-1 text-sm font-medium text-muted hover:text-text sm:hidden"
        >
          View all projects <ArrowRight size={14} />
        </Link>
      </section>

      {/* Latest blog */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-mono-ui text-xs uppercase tracking-widest text-accent-2">
              $ tail ./blog
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">From the Blog</h2>
          </div>
          <Link
            href="/blog"
            className="hidden items-center gap-1 text-sm font-medium text-muted hover:text-text sm:flex"
          >
            Read more <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {posts.slice(0, 2).map((p) => (
            <BlogCard key={p.id} post={p} />
          ))}
        </div>
      </section>

      {/* Latest news */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-mono-ui text-xs uppercase tracking-widest text-accent-2">
              $ tail ./news
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Latest News</h2>
          </div>
          <Link
            href="/news"
            className="hidden items-center gap-1 text-sm font-medium text-muted hover:text-text sm:flex"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {news.slice(0, 2).map((n) => (
            <NewsCard key={n.id} article={n} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid-backdrop relative overflow-hidden rounded-3xl border border-border bg-surface px-8 py-14 text-center">
          <h2 className="relative font-display text-2xl font-bold sm:text-3xl">
            Have a project in mind?
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-sm text-muted">
            Ask the AI assistant about my work, or reach out directly through the support page.
          </p>
          <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/support"
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-[#04140f]"
            >
              Get in Touch
            </Link>
            <a
              href="https://github.com/muhammad-muzammil57" // REPLACE_ME
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-text"
            >
              <GithubIcon size={15} /> GitHub
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
