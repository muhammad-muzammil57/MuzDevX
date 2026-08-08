"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/admin-client";
import { slugify, csvToArray } from "@/lib/utils";
import FormField, { inputClass } from "@/components/admin/FormField";
import ImageUrlField from "@/components/admin/ImageUrlField";
import StatusBanner from "@/components/admin/StatusBanner";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import type { AdminProject, AdminProjectInput } from "@/types/admin";

const CATEGORIES = [
  "Website",
  "Software",
  "Chrome Extension",
  "AI Tool",
  "Landing Page",
  "Experiment",
  "Open Source",
];
const STATUSES = ["Live", "In Progress", "Archived"];

const empty: AdminProjectInput = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  purpose: "",
  category: "Website",
  technologies: [],
  features: [],
  websiteUrl: "",
  githubUrl: "",
  coverImage: "",
  featured: false,
  status: "Live",
  published: true,
};

export default function ProjectForm({ initial }: { initial?: AdminProject }) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [form, setForm] = useState<AdminProjectInput>(initial ?? empty);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [technologiesText, setTechnologiesText] = useState((initial?.technologies ?? []).join(", "));
  const [featuresText, setFeaturesText] = useState((initial?.features ?? []).join(", "));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function set<K extends keyof AdminProjectInput>(key: K, value: AdminProjectInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload: AdminProjectInput = {
      ...form,
      technologies: csvToArray(technologiesText),
      features: csvToArray(featuresText),
    };

    try {
      if (isEdit && initial) {
        await adminFetch(`/api/admin/projects/${initial.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setSuccess("Project updated.");
      } else {
        await adminFetch("/api/admin/projects", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setSuccess("Project created.");
      }
      router.push("/admin/projects");
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
      await adminFetch(`/api/admin/projects/${initial.id}`, { method: "DELETE" });
      router.push("/admin/projects");
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

      <FormField label="Short description" required hint="shown on cards, ~1 sentence">
        <input
          required
          value={form.shortDescription}
          onChange={(e) => set("shortDescription", e.target.value)}
          className={inputClass}
        />
      </FormField>

      <FormField label="Full description" required>
        <textarea
          required
          rows={5}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          className={inputClass}
        />
      </FormField>

      <FormField label="Purpose" hint="why you built it">
        <textarea
          rows={2}
          value={form.purpose}
          onChange={(e) => set("purpose", e.target.value)}
          className={inputClass}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Category" required>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Status">
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value as AdminProjectInput["status"])}
            className={inputClass}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Technologies" hint="comma-separated">
          <input
            value={technologiesText}
            onChange={(e) => setTechnologiesText(e.target.value)}
            placeholder="Next.js, TypeScript, Tailwind CSS"
            className={inputClass}
          />
        </FormField>
        <FormField label="Features" hint="comma-separated">
          <input
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
            placeholder="Live pricing, Exportable reports"
            className={inputClass}
          />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Website URL">
          <input
            type="url"
            value={form.websiteUrl}
            onChange={(e) => set("websiteUrl", e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </FormField>
        <FormField label="GitHub URL">
          <input
            type="url"
            value={form.githubUrl}
            onChange={(e) => set("githubUrl", e.target.value)}
            placeholder="https://github.com/..."
            className={inputClass}
          />
        </FormField>
      </div>

      <FormField label="Cover image">
        <ImageUrlField value={form.coverImage} onChange={(v) => set("coverImage", v)} folder="projects" />
      </FormField>

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
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => set("published", e.target.checked)}
            className="h-4 w-4 rounded border-border accent-[var(--accent)]"
          />
          Published (visible on the live site)
        </label>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-5">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-[#04140f] disabled:opacity-60"
        >
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create project"}
        </button>
        {isEdit && <ConfirmDeleteButton onConfirm={handleDelete} label="Delete project" />}
      </div>
    </form>
  );
}
