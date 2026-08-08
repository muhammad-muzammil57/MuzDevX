"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { adminFetch } from "@/lib/admin-client";
import StatusBanner from "@/components/admin/StatusBanner";
import NewsForm from "../../NewsForm";
import type { AdminNewsArticle } from "@/types/admin";

export default function EditNewsArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [article, setArticle] = useState<AdminNewsArticle | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch<{ article: AdminNewsArticle }>(`/api/admin/news/${id}`)
      .then((res) => setArticle(res.article))
      .catch((err) => setError(err.message));
  }, [id]);

  return (
    <section className="px-5 py-10 sm:px-8">
      <p className="font-mono-ui text-xs uppercase tracking-widest text-accent">
        $ admin --news --edit
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Edit news article</h1>

      {error && (
        <div className="mt-6">
          <StatusBanner error={error} />
        </div>
      )}
      {!article && !error && <p className="mt-8 text-sm text-muted">Loading…</p>}
      {article && <NewsForm initial={article} />}
    </section>
  );
}
