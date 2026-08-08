"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/admin-client";
import { slugify, csvToArray } from "@/lib/utils";
import FormField, { inputClass } from "@/components/admin/FormField";
import ImageUrlField from "@/components/admin/ImageUrlField";
import StatusBanner from "@/components/admin/StatusBanner";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import type { AdminBlogPost, AdminBlogPostInput } from "@/types/admin";

const empty: AdminBlogPostInput = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  author: "",
  category: "",
  tags: [],
  readingTime: "",
  featured: false,
  status: "draft",
  seoTitle: "",
  seoDescription: "",
  publishedAt: null,
};

export default function BlogForm({ initial }: { initial?: AdminBlogPost }) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [form, setForm] = useState<AdminBlogPostInput>(initial ?? empty);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [tagsText, setTagsText] = useState((initial?.tags ?? []).join(", "));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function set<K extends keyof AdminBlogPostInput>(key: K, value: AdminBlogPostInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function estimateReadingTime(text: string) {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload: AdminBlogPostInput = {
      ...form,
      tags: csvToArray(tagsText),
      readingTime: form.readingTime || estimateReadingTime(form.content),
    };

    try {
      if (isEdit && initial) {
        await adminFetch(`/api/admin/blog/${initial.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setSuccess("Post updated.");
      } else {
        await adminFetch("/api/admin/blog", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setSuccess("Post created.");
      }
      router.push("/admin/blog");
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
      await adminFetch(`/api/admin/blog/${initial.id}`, { method: "DELETE" });
      router.push("/admin/blog");
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
          rows={12}
          value={form.content}
          onChange={(e) => set("content", e.target.value)}
          className={`${inputClass} font-mono-ui`}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Author">
          <input
            value={form.author}
            onChange={(e) => set("author", e.target.value)}
            className={inputClass}
          />
        </FormField>
        <FormField label="Category">
          <input
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            placeholder="Development, AI, ..."
            className={inputClass}
          />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Tags" hint="comma-separated">
          <input
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="nextjs, saas, journey"
            className={inputClass}
          />
        </FormField>
        <FormField label="Reading time" hint="auto-estimated if left blank">
          <input
            value={form.readingTime}
            onChange={(e) => set("readingTime", e.target.value)}
            placeholder="5 min read"
            className={inputClass}
          />
        </FormField>
      </div>

      <FormField label="Cover image">
        <ImageUrlField value={form.coverImage} onChange={(v) => set("coverImage", v)} folder="blog" />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="SEO title">
          <input
            value={form.seoTitle}
            onChange={(e) => set("seoTitle", e.target.value)}
            className={inputClass}
          />
        </FormField>
        <FormField label="SEO description">
          <input
            value={form.seoDescription}
            onChange={(e) => set("seoDescription", e.target.value)}
            className={inputClass}
          />
        </FormField>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="h-4 w-4 rounded border-border accent-[var(--accent)]"
          />
          Featured
        </label>
        <FormField label="Status">
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value as AdminBlogPostInput["status"])}
            className={inputClass}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </FormField>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-5">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-[#04140f] disabled:opacity-60"
        >
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create post"}
        </button>
        {isEdit && <ConfirmDeleteButton onConfirm={handleDelete} label="Delete post" />}
      </div>
    </form>
  );
}
