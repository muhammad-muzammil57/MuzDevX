"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ExternalLink } from "lucide-react";
import { adminFetch } from "@/lib/admin-client";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import StatusBanner from "@/components/admin/StatusBanner";
import type { AdminNewsArticle } from "@/types/admin";

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<AdminNewsArticle[] | null>(null);
  const [error, setError] = useState("");

  function load() {
    adminFetch<{ articles: AdminNewsArticle[] }>("/api/admin/news")
      .then((res) => setArticles(res.articles))
      .catch((err) => setError(err.message));
  }

  useEffect(load, []);

  async function handleDelete(id: string) {
    await adminFetch(`/api/admin/news/${id}`, { method: "DELETE" });
    setArticles((prev) => prev?.filter((a) => a.id !== id) ?? null);
  }

  return (
    <section className="px-5 py-10 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono-ui text-xs uppercase tracking-widest text-accent">
            $ admin --news
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">News</h1>
        </div>
        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-xs font-semibold text-[#04140f]"
        >
          <Plus size={14} /> New article
        </Link>
      </div>

      <div className="mt-6">
        <StatusBanner error={error} />
      </div>

      {articles === null && !error && (
        <div className="mt-6 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl skeleton" />
          ))}
        </div>
      )}

      {articles?.length === 0 && (
        <p className="mt-10 text-sm text-muted">
          No news articles yet. Click &quot;New article&quot; to add one.
        </p>
      )}

      {articles && articles.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-surface-2 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium">{a.title}</div>
                    <p className="text-xs text-muted">/{a.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">{a.category || "—"}</td>
                  <td className="px-4 py-3 text-muted">{a.sourceName || "—"}</td>
                  <td className="px-4 py-3 text-muted">
                    {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {a.sourceUrl && (
                        <a
                          href={a.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted hover:text-text"
                          aria-label="Open source"
                        >
                          <ExternalLink size={13} />
                        </a>
                      )}
                      <Link
                        href={`/admin/news/${a.id}/edit`}
                        className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-text"
                      >
                        Edit
                      </Link>
                      <ConfirmDeleteButton onConfirm={() => handleDelete(a.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
