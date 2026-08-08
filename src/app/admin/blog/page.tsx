"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { adminFetch } from "@/lib/admin-client";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import StatusBanner from "@/components/admin/StatusBanner";
import type { AdminBlogPost } from "@/types/admin";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<AdminBlogPost[] | null>(null);
  const [error, setError] = useState("");

  function load() {
    adminFetch<{ posts: AdminBlogPost[] }>("/api/admin/blog")
      .then((res) => setPosts(res.posts))
      .catch((err) => setError(err.message));
  }

  useEffect(load, []);

  async function handleDelete(id: string) {
    await adminFetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    setPosts((prev) => prev?.filter((p) => p.id !== id) ?? null);
  }

  return (
    <section className="px-5 py-10 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono-ui text-xs uppercase tracking-widest text-accent">
            $ admin --blog
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Blog Posts</h1>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-xs font-semibold text-[#04140f]"
        >
          <Plus size={14} /> New post
        </Link>
      </div>

      <div className="mt-6">
        <StatusBanner error={error} />
      </div>

      {posts === null && !error && (
        <div className="mt-6 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl skeleton" />
          ))}
        </div>
      )}

      {posts?.length === 0 && (
        <p className="mt-10 text-sm text-muted">
          No blog posts yet. Click &quot;New post&quot; to write your first one.
        </p>
      )}

      {posts && posts.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-surface-2 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-medium">
                      {p.title}
                      {p.featured && (
                        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted">/{p.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">{p.category || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        p.status === "published"
                          ? "rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent"
                          : "rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted"
                      }
                    >
                      {p.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blog/${p.id}/edit`}
                        className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-text"
                      >
                        Edit
                      </Link>
                      <ConfirmDeleteButton onConfirm={() => handleDelete(p.id)} />
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
