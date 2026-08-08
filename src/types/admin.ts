export interface AdminProject {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  purpose: string;
  category: string;
  technologies: string[];
  features: string[];
  websiteUrl: string;
  githubUrl: string;
  coverImage: string;
  featured: boolean;
  status: "Live" | "In Progress" | "Archived";
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AdminProjectInput = Omit<AdminProject, "id" | "createdAt" | "updatedAt">;

export interface AdminBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  readingTime: string;
  featured: boolean;
  status: "draft" | "published";
  seoTitle: string;
  seoDescription: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AdminBlogPostInput = Omit<AdminBlogPost, "id" | "createdAt" | "updatedAt">;

export interface AdminNewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type AdminNewsArticleInput = Omit<AdminNewsArticle, "id" | "createdAt" | "updatedAt">;

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}
