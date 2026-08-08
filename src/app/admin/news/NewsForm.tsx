"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/admin-client";
import { slugify } from "@/lib/utils";
import FormField, { inputClass } from "@/components/admin/FormField";
import ImageUrlField from "@/components/admin/ImageUrlField";
import StatusBanner from "@/components/admin/StatusBanner";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import type { AdminNewsArticle, AdminNewsArticleInput } from "@/types/admin";

function toDateInputValue(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

const empty: AdminNewsArticleInput = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image: "",
  category: "",
  sourceName: "",
  sourceUrl: "",
  publishedAt: new Date().toISOString(),
};

export default function NewsForm({ initial }: { initial?: AdminNewsArticle }) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [form, setForm] = useState<AdminNewsArticleInput>(initial ?? empty);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function set<K extends keyof AdminNewsArticleInput>(key: K, value: AdminNewsArticleInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (isEdit && initial) {
        await adminFetch(`/api/admin/news/${initial.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        setSuccess("Article updated.");
      } else {
        await adminFetch("/api/admin/news", {
          method: "POST",
          body: JSON.stringify(form),
        });
        setSuccess("Article created.");
      }
      router.push("/admin/news");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!initial) return;
    try {
      await adminFetch(`/api/admin/news/${initial.id}`, { method: "DELETE" });
      router.push("/admin/news");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <StatusBanner error={error} success={success} />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Title" required>
          <input
            required
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              set("title", title);
              if (!slugTouched) set("slug", slugify(title));
            }}
            className={inputClass}
          />
        </FormField>
        <FormField label="Slug" required hint="used in the URL">
          <input
            required
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", slugify(e.target.value));
            }}
            className={inputClass}
          />
        </FormField>
      </div>

      <FormField label="Excerpt" hint="short summary shown on cards">
        <textarea
          rows={2}
          value={form.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          className={inputClass}
        />
      </FormField>

      <FormField label="Content" required hint="Markdown or HTML">
        <textarea
          required
          rows={10}
          value={form.content}
          onChange={(e) => set("content", e.target.value)}
          className={`${inputClass} font-mono-ui`}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Category">
          <input
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            placeholder="AI, Web Dev, ..."
            className={inputClass}
          />
        </FormField>
        <FormField label="Published date">
          <input
            type="date"
            value={toDateInputValue(form.publishedAt)}
            onChange={(e) =>
              set("publishedAt", e.target.value ? new Date(e.target.value).toISOString() : "")
            }
            className={inputClass}
          />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Source name">
          <input
            value={form.sourceName}
            onChange={(e) => set("sourceName", e.target.value)}
            placeholder="Groq Blog, Vercel, ..."
            className={inputClass}
          />
        </FormField>
        <FormField label="Source URL">
          <input
            type="url"
            value={form.sourceUrl}
            onChange={(e) => set("sourceUrl", e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </FormField>
      </div>

      <FormField label="Image">
        <ImageUrlField value={form.image} onChange={(v) => set("image", v)} folder="news" />
      </FormField>

      <div className="flex items-center justify-between border-t border-border pt-5">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-[#04140f] disabled:opacity-60"
        >
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create article"}
        </button>
        {isEdit && <ConfirmDeleteButton onConfirm={handleDelete} label="Delete article" />}
      </div>
    </form>
  );
}
