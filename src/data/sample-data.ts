// ⚠️ REPLACE_ME: This file holds placeholder/sample data so the site renders
// out of the box. Once Supabase is connected, delete this file and fetch
// real rows from the `projects`, `blogs` and `news` tables instead
// (see src/lib/db.ts for the functions to wire up).

import type { Project, BlogPost, NewsArticle } from "@/types";

export const projects: Project[] = [
  {
    id: "1",
    slug: "sellertoolkit",
    title: "SellerToolkit", // REPLACE_ME: your real project name
    shortDescription: "eBay seller analytics and pricing tool.",
    description:
      "SellerToolkit helps eBay sellers track competitor pricing, listing performance and inventory trends in one dashboard. Replace this paragraph with the real story of how and why you built it.",
    purpose:
      "Built to save sellers hours of manual spreadsheet work by pulling live marketplace data into one place.",
    category: "Software",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
    features: [
      "Live competitor price tracking",
      "Listing performance analytics",
      "Inventory alerts",
      "Exportable reports",
    ],
    websiteUrl: "https://example.com",
    githubUrl: "https://github.com/your-username/sellertoolkit",
    coverImage: "/images/projects/placeholder-1.svg",
    featured: true,
    status: "Live",
    createdAt: "2025-11-02",
  },
  {
    id: "2",
    slug: "ai-writing-assistant",
    title: "AI Writing Assistant",
    shortDescription: "A Groq-powered writing helper Chrome extension.",
    description:
      "A lightweight Chrome extension that rewrites, summarizes and proofreads text on any page using a fast open-weight model via Groq.",
    purpose: "Explore Groq's low-latency inference for everyday writing tasks.",
    category: "Chrome Extension",
    technologies: ["React", "Groq API", "Manifest V3"],
    features: ["Inline rewrite", "Tone switch", "Summarize selection"],
    websiteUrl: "https://example.com",
    githubUrl: "https://github.com/your-username/ai-writer",
    coverImage: "/images/projects/placeholder-2.svg",
    featured: true,
    status: "Live",
    createdAt: "2026-01-14",
  },
  {
    id: "3",
    slug: "portfolio-landing",
    title: "Studio Landing Page",
    shortDescription: "A one-page landing site for a design studio client.",
    description:
      "A fast, animated marketing landing page built with Next.js and Framer Motion, focused on conversion and load speed.",
    purpose: "Freelance client project — replace with your own case study.",
    category: "Landing Page",
    technologies: ["Next.js", "Framer Motion", "Tailwind CSS"],
    features: ["Scroll-reveal sections", "Contact form", "Perfect Lighthouse score"],
    websiteUrl: "https://example.com",
    coverImage: "/images/projects/placeholder-3.svg",
    featured: false,
    status: "Live",
    createdAt: "2025-08-20",
  },
  {
    id: "4",
    slug: "docsense-ai",
    title: "DocSense AI",
    shortDescription: "Chat with your PDFs using retrieval-augmented search.",
    description:
      "DocSense lets users upload a PDF and ask questions about it. Chunks are embedded and searched, then answered by an LLM.",
    purpose: "Learn RAG pipelines end-to-end and ship something people actually use.",
    category: "AI Tool",
    technologies: ["Next.js", "Supabase pgvector", "Groq API"],
    features: ["PDF upload", "Semantic search", "Source-cited answers"],
    websiteUrl: "https://example.com",
    coverImage: "/images/projects/placeholder-4.svg",
    featured: true,
    status: "In Progress",
    createdAt: "2026-05-30",
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "how-i-built-my-saas",
    title: "How I Built My First SaaS in 30 Days", // REPLACE_ME
    excerpt:
      "A behind-the-scenes look at going from idea to paying customers in a month.",
    content:
      "Replace this with your real article content. You can write in Markdown or HTML once the blog editor is connected to Supabase...",
    coverImage: "/images/blog/placeholder-1.svg",
    author: "Muzammil Coder", // REPLACE_ME: your name
    category: "Development",
    tags: ["saas", "nextjs", "journey"],
    readingTime: "5 min read",
    featured: true,
    publishedAt: "2026-08-01",
  },
  {
    id: "2",
    slug: "why-i-switched-to-groq",
    title: "Why I Switched My AI Features to Groq",
    excerpt: "Latency mattered more than I expected — here's what changed.",
    content: "Replace this with your real article content...",
    coverImage: "/images/blog/placeholder-2.svg",
    author: "Muzammil Coder",
    category: "AI",
    tags: ["groq", "ai", "performance"],
    readingTime: "4 min read",
    featured: false,
    publishedAt: "2026-07-18",
  },
];

export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    slug: "groq-new-model-release",
    title: "Groq Releases a Faster Model on Its Free Tier",
    excerpt: "A quick look at what changed and what it means for indie builders.",
    content: "Replace this with the real article body...",
    image: "/images/news/placeholder-1.svg",
    category: "AI",
    sourceName: "Groq Blog",
    sourceUrl: "https://groq.com",
    publishedAt: "2026-08-05",
  },
  {
    id: "2",
    slug: "nextjs-15-update",
    title: "Next.js Ships a Minor Update With Faster Builds",
    excerpt: "Notes on the latest release and whether you should upgrade now.",
    content: "Replace this with the real article body...",
    image: "/images/news/placeholder-2.svg",
    category: "Web Dev",
    sourceName: "Vercel",
    sourceUrl: "https://vercel.com",
    publishedAt: "2026-07-29",
  },
];

export const siteStats = [
  { label: "Projects", value: "20+" },
  { label: "Websites", value: "10+" },
  { label: "Software", value: "5+" },
  { label: "Ideas", value: "∞" },
];
