export type ProjectCategory =
  | "Website"
  | "Software"
  | "Chrome Extension"
  | "AI Tool"
  | "Landing Page"
  | "Experiment"
  | "Open Source";

export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  purpose: string;
  category: ProjectCategory;
  technologies: string[];
  features: string[];
  websiteUrl?: string;
  githubUrl?: string;
  coverImage: string;
  featured: boolean;
  status: "Live" | "In Progress" | "Archived";
  createdAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  readingTime: string;
  featured: boolean;
  publishedAt: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  sourceName?: string;
  sourceUrl?: string;
  publishedAt: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  showEmailButton?: boolean;
}
