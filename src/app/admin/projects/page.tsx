"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ExternalLink } from "lucide-react";
import { adminFetch } from "@/lib/admin-client";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import StatusBanner from "@/components/admin/StatusBanner";
import type { AdminProject } from "@/types/admin";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<AdminProject[] | null>(null);
  const [error, setError] = useState("");

  function load() {
    adminFetch<{ projects: AdminProject[] }>("/api/admin/projects")
      .then((res) => setProjects(res.projects))
      .catch((err) => setError(err.message));
  }

  useEffect(load, []);

  async function handleDelete(id: string) {
    await adminFetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev?.filter((p) => p.id !== id) ?? null);
  }

  return (
    <section className="px-5 py-10 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono-ui text-xs uppercase tracking-widest text-accent">
            $ admin --projects
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Projects</h1>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-xs font-semibold text-[#04140f]"
        >
          <Plus size={14} /> New project
        </Link>
      </div>

      <div className="mt-6">
        <StatusBanner error={error} />
      </div>

      {projects === null && !error && (
        <div className="mt-6 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl skeleton" />
          ))}
        </div>
      )}

      {projects?.length === 0 && (
        <p className="mt-10 text-sm text-muted">
          No projects yet. Click &quot;New project&quot; to add your first one.
        </p>
      )}

      {projects && projects.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-surface-2 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Visibility</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
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
                  <td className="px-4 py-3 text-muted">{p.category}</td>
                  <td className="px-4 py-3 text-muted">{p.status}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        p.published
                          ? "rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent"
                          : "rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted"
                      }
                    >
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {p.websiteUrl && (
                        <a
                          href={p.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted hover:text-text"
                          aria-label="Open live site"
                        >
                          <ExternalLink size={13} />
                        </a>
                      )}
                      <Link
                        href={`/admin/projects/${p.id}/edit`}
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
