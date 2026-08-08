import "server-only";

import { projects, blogPosts, newsArticles } from "@/data/sample-data";
import type { Project, BlogPost, NewsArticle } from "@/types";
import { getServiceClient } from "@/lib/supabase";

// ------------------------------------------------------------
// Database row -> application types
// ------------------------------------------------------------

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
    publishedAt: r.published_at ?? r.created_at,
  };
}

// ------------------------------------------------------------
// Get server-side Supabase client
// ------------------------------------------------------------

function getDb() {
  const client = getServiceClient();

  if (!client) {
    throw new Error(
      "Supabase is not configured. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set."
    );
  }

  return client;
}

// ------------------------------------------------------------
// PROJECTS
// ------------------------------------------------------------

export async function getProjects(): Promise<Project[]> {
  const db = getDb();

  const { data, error } = await db
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getProjects Supabase error:", error);
    throw new Error(`Failed to load projects: ${error.message}`);
  }

  return (data ?? []).map(rowToProject);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.featured);
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | undefined> {
  const db = getDb();

  const { data, error } = await db
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("getProjectBySlug Supabase error:", error);
    throw new Error(`Failed to load project: ${error.message}`);
  }

  return data ? rowToProject(data) : undefined;
}

export async function getProjectsByCategory(
  category: string
): Promise<Project[]> {
  const all = await getProjects();

  if (category === "All") {
    return all;
  }

  return all.filter((p) => p.category === category);
}

// ------------------------------------------------------------
// BLOG
// ------------------------------------------------------------

export async function getBlogPosts(): Promise<BlogPost[]> {
  const db = getDb();

  const { data, error } = await db
    .from("blogs")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("getBlogPosts Supabase error:", error);
    throw new Error(`Failed to load blog posts: ${error.message}`);
  }

  return (data ?? []).map(rowToBlog);
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | undefined> {
  const db = getDb();

  const { data, error } = await db
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("getBlogPostBySlug Supabase error:", error);
    throw new Error(`Failed to load blog post: ${error.message}`);
  }

  return data ? rowToBlog(data) : undefined;
}

// ------------------------------------------------------------
// NEWS
// ------------------------------------------------------------

export async function getNewsArticles(): Promise<NewsArticle[]> {
  const db = getDb();

  const { data, error } = await db
    .from("news")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("getNewsArticles Supabase error:", error);
    throw new Error(`Failed to load news: ${error.message}`);
  }

  return (data ?? []).map(rowToNews);
}

export async function getNewsArticleBySlug(
  slug: string
): Promise<NewsArticle | undefined> {
  const db = getDb();

  const { data, error } = await db
    .from("news")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("getNewsArticleBySlug Supabase error:", error);
    throw new Error(`Failed to load news article: ${error.message}`);
  }

  return data ? rowToNews(data) : undefined;
}

// ------------------------------------------------------------
// AI CHATBOT SEARCH
// ------------------------------------------------------------

export async function searchProjects(query: string): Promise<Project[]> {
  const q = query.toLowerCase();
  const all = await getProjects();

  return all.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.technologies.some((t) => t.toLowerCase().includes(q))
  );
}

export async function searchBlogPosts(
  query: string
): Promise<BlogPost[]> {
  const q = query.toLowerCase();
  const all = await getBlogPosts();

  return all.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export async function searchNews(
  query: string
): Promise<NewsArticle[]> {
  const q = query.toLowerCase();
  const all = await getNewsArticles();

  return all.filter(
    (n) =>
      n.title.toLowerCase().includes(q) ||
      n.excerpt.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q)
  );
}
