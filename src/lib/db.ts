```ts
// This file is the ONE place that decides where public content comes from.
//
// Projects, blogs and news are loaded from Supabase when Supabase is
// configured. If Supabase is not configured, local sample data is used.
//
// Admin writes are handled separately through src/lib/admin-db.ts.

import { projects, blogPosts, newsArticles } from "@/data/sample-data";
import type { Project, BlogPost, NewsArticle } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// ------------------------------------------------------------
// DATABASE ROW -> PROJECT
// ------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProject(r: any): Project {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    shortDescription: r.short_description ?? "",
    description: r.description ?? "",
    purpose: r.purpose ?? "",
    category: r.category ?? "",
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

// ------------------------------------------------------------
// DATABASE ROW -> BLOG
// ------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToBlog(r: any): BlogPost {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    content: r.content ?? "",
    coverImage: r.cover_image ?? "",
    author: r.author ?? "",
    category: r.category ?? "",
    tags: r.tags ?? [],
    readingTime: r.reading_time ?? "",
    featured: r.featured ?? false,
    publishedAt: r.published_at ?? r.created_at,
  };
}

// ------------------------------------------------------------
// DATABASE ROW -> NEWS
// ------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToNews(r: any): NewsArticle {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    content: r.content ?? "",
    image: r.image ?? "",
    category: r.category ?? "",
    sourceName: r.source_name ?? undefined,
    sourceUrl: r.source_url ?? undefined,
    publishedAt: r.published_at ?? r.created_at,
  };
}

// ============================================================
// PROJECTS
// ============================================================

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured) {
    console.warn(
      "Supabase is not configured. Returning local sample projects."
    );

    return projects;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase getProjects error:", error);
    throw new Error(`Failed to load projects: ${error.message}`);
  }

  return (data ?? []).map(rowToProject);
}

// ------------------------------------------------------------
// LATEST PROJECTS
// Used by AI chatbot
// ------------------------------------------------------------

export async function getLatestProjects(
  count = 3
): Promise<Project[]> {
  const all = await getProjects();

  return [...all]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, Math.max(1, count));
}

// ------------------------------------------------------------
// FEATURED PROJECTS
// ------------------------------------------------------------

export async function getFeaturedProjects(): Promise<Project[]> {
  const all = await getProjects();

  return all.filter((project) => project.featured);
}

// ------------------------------------------------------------
// PROJECT BY SLUG
// ------------------------------------------------------------

export async function getProjectBySlug(
  slug: string
): Promise<Project | undefined> {
  if (!isSupabaseConfigured) {
    return projects.find((project) => project.slug === slug);
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("Supabase getProjectBySlug error:", error);
    throw new Error(`Failed to load project: ${error.message}`);
  }

  return data ? rowToProject(data) : undefined;
}

// ------------------------------------------------------------
// PROJECTS BY CATEGORY
// ------------------------------------------------------------

export async function getProjectsByCategory(
  category: string
): Promise<Project[]> {
  const all = await getProjects();

  if (category === "All") {
    return all;
  }

  return all.filter((project) => project.category === category);
}

// ------------------------------------------------------------
// SEARCH PROJECTS
// Used by AI chatbot
// ------------------------------------------------------------

export async function searchProjects(
  query: string
): Promise<Project[]> {
  const q = query.trim().toLowerCase();

  if (!q) {
    return getProjects();
  }

  const all = await getProjects();

  return all.filter(
    (project) =>
      project.title.toLowerCase().includes(q) ||
      project.shortDescription.toLowerCase().includes(q) ||
      project.description.toLowerCase().includes(q) ||
      project.purpose.toLowerCase().includes(q) ||
      project.category.toLowerCase().includes(q) ||
      project.technologies.some((technology) =>
        technology.toLowerCase().includes(q)
      ) ||
      project.features.some((feature) =>
        feature.toLowerCase().includes(q)
      )
  );
}

// ============================================================
// BLOG
// ============================================================

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured) {
    console.warn(
      "Supabase is not configured. Returning local sample blog posts."
    );

    return blogPosts;
  }

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Supabase getBlogPosts error:", error);
    throw new Error(`Failed to load blog posts: ${error.message}`);
  }

  return (data ?? []).map(rowToBlog);
}

// ------------------------------------------------------------
// BLOG BY SLUG
// ------------------------------------------------------------

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | undefined> {
  if (!isSupabaseConfigured) {
    return blogPosts.find((post) => post.slug === slug);
  }

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Supabase getBlogPostBySlug error:", error);
    throw new Error(`Failed to load blog post: ${error.message}`);
  }

  return data ? rowToBlog(data) : undefined;
}

// ------------------------------------------------------------
// SEARCH BLOG POSTS
// ------------------------------------------------------------

export async function searchBlogPosts(
  query: string
): Promise<BlogPost[]> {
  const q = query.trim().toLowerCase();

  const all = await getBlogPosts();

  if (!q) {
    return all;
  }

  return all.filter(
    (post) =>
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.content.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(q)
      )
  );
}

// ============================================================
// NEWS
// ============================================================

export async function getNewsArticles(): Promise<NewsArticle[]> {
  if (!isSupabaseConfigured) {
    console.warn(
      "Supabase is not configured. Returning local sample news."
    );

    return newsArticles;
  }

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Supabase getNewsArticles error:", error);
    throw new Error(`Failed to load news: ${error.message}`);
  }

  return (data ?? []).map(rowToNews);
}

// ------------------------------------------------------------
// NEWS BY SLUG
// ------------------------------------------------------------

export async function getNewsArticleBySlug(
  slug: string
): Promise<NewsArticle | undefined> {
  if (!isSupabaseConfigured) {
    return newsArticles.find((article) => article.slug === slug);
  }

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Supabase getNewsArticleBySlug error:", error);
    throw new Error(`Failed to load news article: ${error.message}`);
  }

  return data ? rowToNews(data) : undefined;
}

// ------------------------------------------------------------
// SEARCH NEWS
// ------------------------------------------------------------

export async function searchNews(
  query: string
): Promise<NewsArticle[]> {
  const q = query.trim().toLowerCase();

  const all = await getNewsArticles();

  if (!q) {
    return all;
  }

  return all.filter(
    (article) =>
      article.title.toLowerCase().includes(q) ||
      article.excerpt.toLowerCase().includes(q) ||
      article.content.toLowerCase().includes(q) ||
      article.category.toLowerCase().includes(q)
  );
}
```
