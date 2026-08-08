// Server-only. Full read/write access to every row (published or not),
// used exclusively by the /api/admin/* route handlers. Never import this
// into a Client Component — it uses the service role key.

import { getServiceClient } from "@/lib/supabase";
import type {
  AdminProject,
  AdminProjectInput,
  AdminBlogPost,
  AdminBlogPostInput,
  AdminNewsArticle,
  AdminNewsArticleInput,
  ContactMessage,
} from "@/types/admin";

function requireClient() {
  const client = getServiceClient();
  if (!client) {
    throw new Error(
      "Supabase isn't configured on the server. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  return client;
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProject(r: any): AdminProject {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    shortDescription: r.short_description,
    description: r.description,
    purpose: r.purpose ?? "",
    category: r.category,
    technologies: r.technologies ?? [],
    features: r.features ?? [],
    websiteUrl: r.website_url ?? "",
    githubUrl: r.github_url ?? "",
    coverImage: r.cover_image ?? "",
    featured: r.featured ?? false,
    status: r.status ?? "Live",
    published: r.published ?? true,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function projectToRow(p: AdminProjectInput) {
  return {
    title: p.title,
    slug: p.slug,
    short_description: p.shortDescription,
    description: p.description,
    purpose: p.purpose || null,
    category: p.category,
    technologies: p.technologies,
    features: p.features,
    website_url: p.websiteUrl || null,
    github_url: p.githubUrl || null,
    cover_image: p.coverImage || null,
    featured: p.featured,
    status: p.status,
    published: p.published,
    updated_at: new Date().toISOString(),
  };
}

export async function adminListProjects(): Promise<AdminProject[]> {
  const { data, error } = await requireClient()
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToProject);
}

export async function adminGetProject(id: string): Promise<AdminProject | null> {
  const { data, error } = await requireClient().from("projects").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? rowToProject(data) : null;
}

export async function adminCreateProject(input: AdminProjectInput): Promise<AdminProject> {
  const { data, error } = await requireClient()
    .from("projects")
    .insert(projectToRow(input))
    .select("*")
    .single();
  if (error) throw error;
  return rowToProject(data);
}

export async function adminUpdateProject(
  id: string,
  input: AdminProjectInput
): Promise<AdminProject> {
  const { data, error } = await requireClient()
    .from("projects")
    .update(projectToRow(input))
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return rowToProject(data);
}

export async function adminDeleteProject(id: string): Promise<void> {
  const { error } = await requireClient().from("projects").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Blog posts
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToBlog(r: any): AdminBlogPost {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    excerpt: r.excerpt ?? "",
    content: r.content,
    coverImage: r.cover_image ?? "",
    author: r.author ?? "",
    category: r.category ?? "",
    tags: r.tags ?? [],
    readingTime: r.reading_time ?? "",
    featured: r.featured ?? false,
    status: r.status ?? "draft",
    seoTitle: r.seo_title ?? "",
    seoDescription: r.seo_description ?? "",
    publishedAt: r.published_at,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function blogToRow(p: AdminBlogPostInput) {
  return {
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt || null,
    content: p.content,
    cover_image: p.coverImage || null,
    author: p.author || null,
    category: p.category || null,
    tags: p.tags,
    reading_time: p.readingTime || null,
    featured: p.featured,
    status: p.status,
    seo_title: p.seoTitle || null,
    seo_description: p.seoDescription || null,
    // Stamp published_at the first time a post goes live; keep it stable
    // afterwards unless the caller explicitly supplied one.
    published_at: p.publishedAt ?? (p.status === "published" ? new Date().toISOString() : null),
    updated_at: new Date().toISOString(),
  };
}

export async function adminListBlogPosts(): Promise<AdminBlogPost[]> {
  const { data, error } = await requireClient()
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToBlog);
}

export async function adminGetBlogPost(id: string): Promise<AdminBlogPost | null> {
  const { data, error } = await requireClient().from("blogs").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? rowToBlog(data) : null;
}

export async function adminCreateBlogPost(input: AdminBlogPostInput): Promise<AdminBlogPost> {
  const { data, error } = await requireClient()
    .from("blogs")
    .insert(blogToRow(input))
    .select("*")
    .single();
  if (error) throw error;
  return rowToBlog(data);
}

export async function adminUpdateBlogPost(
  id: string,
  input: AdminBlogPostInput
): Promise<AdminBlogPost> {
  const { data, error } = await requireClient()
    .from("blogs")
    .update(blogToRow(input))
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return rowToBlog(data);
}

export async function adminDeleteBlogPost(id: string): Promise<void> {
  const { error } = await requireClient().from("blogs").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToNews(r: any): AdminNewsArticle {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    excerpt: r.excerpt ?? "",
    content: r.content,
    image: r.image ?? "",
    category: r.category ?? "",
    sourceName: r.source_name ?? "",
    sourceUrl: r.source_url ?? "",
    publishedAt: r.published_at,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function newsToRow(p: AdminNewsArticleInput) {
  return {
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt || null,
    content: p.content,
    image: p.image || null,
    category: p.category || null,
    source_name: p.sourceName || null,
    source_url: p.sourceUrl || null,
    published_at: p.publishedAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function adminListNews(): Promise<AdminNewsArticle[]> {
  const { data, error } = await requireClient()
    .from("news")
    .select("*")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToNews);
}

export async function adminGetNews(id: string): Promise<AdminNewsArticle | null> {
  const { data, error } = await requireClient().from("news").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? rowToNews(data) : null;
}

export async function adminCreateNews(input: AdminNewsArticleInput): Promise<AdminNewsArticle> {
  const { data, error } = await requireClient()
    .from("news")
    .insert(newsToRow(input))
    .select("*")
    .single();
  if (error) throw error;
  return rowToNews(data);
}

export async function adminUpdateNews(
  id: string,
  input: AdminNewsArticleInput
): Promise<AdminNewsArticle> {
  const { data, error } = await requireClient()
    .from("news")
    .update(newsToRow(input))
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return rowToNews(data);
}

export async function adminDeleteNews(id: string): Promise<void> {
  const { error } = await requireClient().from("news").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Contact messages (read-only + delete from the admin side)
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToMessage(r: any): ContactMessage {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    subject: r.subject ?? "",
    message: r.message,
    createdAt: r.created_at,
  };
}

export async function adminListMessages(): Promise<ContactMessage[]> {
  const { data, error } = await requireClient()
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToMessage);
}

export async function adminDeleteMessage(id: string): Promise<void> {
  const { error } = await requireClient().from("contact_messages").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Dashboard stats
// ---------------------------------------------------------------------------

export async function adminGetStats() {
  const client = requireClient();
  const [projects, blogs, news, messages] = await Promise.all([
    client.from("projects").select("id", { count: "exact", head: true }),
    client.from("blogs").select("id", { count: "exact", head: true }),
    client.from("news").select("id", { count: "exact", head: true }),
    client.from("contact_messages").select("id", { count: "exact", head: true }),
  ]);
  return {
    projects: projects.count ?? 0,
    blogs: blogs.count ?? 0,
    news: news.count ?? 0,
    messages: messages.count ?? 0,
  };
}
