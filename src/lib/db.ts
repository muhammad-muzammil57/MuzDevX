// This file is the ONE place that decides where content comes from.
// When Supabase is configured (see .env.local / .env.example) every function
// below queries the real `projects` / `blogs` / `news` tables (respecting the
// RLS policies in supabase/schema.sql, so only published content is public).
// Until then, it falls back to the local sample data so the site still
// renders out of the box.
//
// Admin writes go through src/lib/admin-db.ts (service role, used only by
// /api/admin/* routes) — this file stays read-only and public-safe.

import { projects, blogPosts, newsArticles } from "@/data/sample-data";
import type { Project, BlogPost, NewsArticle } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProject(r: any): Project {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    shortDescription: r.short_description,
    description: r.description,
    purpose: r.purpose ?? "",
    category: r.category,
    technologies: r.technologies ?? [],
    features: r.features ?? [],
    websiteUrl: r.website_url ?? undefined,
    githubUrl: r.github_url ?? undefined,
    coverImage: r.cover_image ?? "",
    featured: r.featured ?? false,
    status: r.status ?? "Live",
    createdAt: r.created_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToBlog(r: any): BlogPost {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    content: r.content,
    coverImage: r.cover_image ?? "",
    author: r.author ?? "",
    category: r.category ?? "",
    tags: r.tags ?? [],
    readingTime: r.reading_time ?? "",
    featured: r.featured ?? false,
    publishedAt: r.published_at ?? r.created_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToNews(r: any): NewsArticle {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    content: r.content,
    image: r.image ?? "",
    category: r.category ?? "",
    sourceName: r.source_name ?? undefined,
    sourceUrl: r.source_url ?? undefined,
    publishedAt: r.published_at,
  };
}

export async function getProjects(): Promise<Project[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (!error && data) return data.map(rowToProject);
  }
  return projects;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.featured);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (!error) return data ? rowToProject(data) : undefined;
  }
  return projects.find((p) => p.slug === slug);
}

export async function getProjectsByCategory(category: string): Promise<Project[]> {
  if (category === "All") return getProjects();
  return (await getProjects()).filter((p) => p.category === category);
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (!error && data) return data.map(rowToBlog);
  }
  return blogPosts;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (!error) return data ? rowToBlog(data) : undefined;
  }
  return blogPosts.find((p) => p.slug === slug);
}

export async function getNewsArticles(): Promise<NewsArticle[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false });
    if (!error && data) return data.map(rowToNews);
  }
  return newsArticles;
}

export async function getNewsArticleBySlug(slug: string): Promise<NewsArticle | undefined> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from("news").select("*").eq("slug", slug).maybeSingle();
    if (!error) return data ? rowToNews(data) : undefined;
  }
  return newsArticles.find((n) => n.slug === slug);
}

// Used by the AI chatbot's tool-calling layer (see src/app/api/chat/route.ts)
export async function searchProjects(query: string): Promise<Project[]> {
  const q = query.toLowerCase();
  const all = await getProjects();
  return all.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.technologies.some((t) => t.toLowerCase().includes(q))
  );
}

export async function getLatestProjects(count = 3): Promise<Project[]> {
  const all = await getProjects();
  return [...all]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count);
}
