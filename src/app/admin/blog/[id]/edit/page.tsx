"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { adminFetch } from "@/lib/admin-client";
import StatusBanner from "@/components/admin/StatusBanner";
import BlogForm from "../../BlogForm";
import type { AdminBlogPost } from "@/types/admin";

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<AdminBlogPost | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch<{ post: AdminBlogPost }>(`/api/admin/blog/${id}`)
      .then((res) => setPost(res.post))
      .catch((err) => setError(err.message));
  }, [id]);

  return (
    <section className="px-5 py-10 sm:px-8">
      <p className="font-mono-ui text-xs uppercase tracking-widest text-accent">
        $ admin --blog --edit
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Edit blog post</h1>

      {error && (
        <div className="mt-6">
          <StatusBanner error={error} />
        </div>
      )}
      {!post && !error && <p className="mt-8 text-sm text-muted">Loading…</p>}
      {post && <BlogForm initial={post} />}
    </section>
  );
}
