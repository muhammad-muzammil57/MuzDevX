"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { adminFetch } from "@/lib/admin-client";
import StatusBanner from "@/components/admin/StatusBanner";
import ProjectForm from "../../ProjectForm";
import type { AdminProject } from "@/types/admin";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<AdminProject | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch<{ project: AdminProject }>(`/api/admin/projects/${id}`)
      .then((res) => setProject(res.project))
      .catch((err) => setError(err.message));
  }, [id]);

  return (
    <section className="px-5 py-10 sm:px-8">
      <p className="font-mono-ui text-xs uppercase tracking-widest text-accent">
        $ admin --projects --edit
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Edit project</h1>

      {error && (
        <div className="mt-6">
          <StatusBanner error={error} />
        </div>
      )}
      {!project && !error && <p className="mt-8 text-sm text-muted">Loading…</p>}
      {project && <ProjectForm initial={project} />}
    </section>
  );
}
