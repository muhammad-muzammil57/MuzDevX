"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { adminFetch } from "@/lib/admin-client";

interface Stats {
  projects: number;
  blogs: number;
  news: number;
  messages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch<{ stats: Stats }>("/api/admin/stats")
      .then((res) => setStats(res.stats))
      .catch((err) => setError(err.message));
  }, []);

  const cards = [
    { label: "Projects", value: stats?.projects, href: "/admin/projects" },
    { label: "Blog Posts", value: stats?.blogs, href: "/admin/blog" },
    { label: "News", value: stats?.news, href: "/admin/news" },
    { label: "Messages", value: stats?.messages, href: "/admin/messages" },
  ];

  return (
    <section className="px-5 py-10 sm:px-8">
      <p className="font-mono-ui text-xs uppercase tracking-widest text-accent">
        $ admin --dashboard
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Welcome back</h1>
      <p className="mt-2 text-sm text-muted">
        Manage every piece of content on your site from here.
      </p>

      {error && (
        <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-border bg-surface px-4 py-6 text-center transition-colors hover:border-accent/50"
          >
            <p className="font-display text-2xl font-bold text-accent">
              {s.value === undefined ? (
                <span className="inline-block h-7 w-8 animate-pulse rounded skeleton align-middle" />
              ) : (
                s.value
              )}
            </p>
            <p className="mt-1 font-mono-ui text-xs uppercase tracking-widest text-muted">
              {s.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-lg font-semibold">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-[#04140f]"
          >
            <Plus size={14} /> New project
          </Link>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium text-muted hover:text-text"
          >
            <Plus size={14} /> New blog post
          </Link>
          <Link
            href="/admin/news/new"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium text-muted hover:text-text"
          >
            <Plus size={14} /> New news article
          </Link>
        </div>
      </div>
    </section>
  );
}
