import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import {
  searchProjects,
  getLatestProjects,
  getProjects,
  getBlogPosts,
  getNewsArticles,
} from "@/lib/db";

// ⚠️ REPLACE_ME: get a free Groq API key at https://console.groq.com
// and put it in .env.local as GROQ_API_KEY. NEVER put it in NEXT_PUBLIC_*
// or in client code — this route is the only place that should touch it.
const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

const SYSTEM_PROMPT = `You are the AI assistant embedded on a developer's personal
portfolio / digital hub website. You help visitors learn about the projects,
software, websites, blog posts and news articles the owner has published.

Rules:
- Only answer using information returned by your tools — never invent project
  names, links, or details.
- When you mention a project, include its live URL if one exists.
- Keep answers short and conversational (2-5 sentences), then optionally list items.
- If nothing matches, say so honestly and suggest browsing the Projects page.
- Replace "the owner" with the real site owner's name once you customize this prompt.`; // REPLACE_ME

const tools: Groq.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "searchProjects",
      description:
        "Search projects/software/websites by keyword (name, description, category or technology).",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Keyword to search for" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getLatestProjects",
      description: "Get the most recently added projects, newest first.",
      parameters: {
        type: "object",
        properties: {
          count: { type: "number", description: "How many to return, default 3" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getAllProjects",
      description: "List every published project with its category.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "searchBlogAndNews",
      description: "Search blog posts and news articles by keyword.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Keyword to search for" },
        },
        required: ["query"],
      },
    },
  },
];

async function runTool(name: string, args: Record<string, unknown>) {
  switch (name) {
    case "searchProjects":
      return searchProjects(String(args.query ?? ""));
    case "getLatestProjects":
      return getLatestProjects(Number(args.count ?? 3));
    case "getAllProjects":
      return (await getProjects()).map((p) => ({
        title: p.title,
        category: p.category,
        shortDescription: p.shortDescription,
        url: p.websiteUrl,
      }));
    case "searchBlogAndNews": {
      const q = String(args.query ?? "").toLowerCase();
      const posts = (await getBlogPosts()).filter(
        (p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
      );
      const news = (await getNewsArticles()).filter(
        (n) => n.title.toLowerCase().includes(q) || n.excerpt.toLowerCase().includes(q)
      );
      return { posts, news };
    }
    default:
      return { error: "Unknown tool" };
  }
}

export async function POST(req: NextRequest) {
  if (!groq) {
    return NextResponse.json(
      {
        reply:
          "The AI assistant isn't configured yet — add GROQ_API_KEY to your .env.local to turn it on.",
      },
      { status: 200 }
    );
  }

  try {
    const { messages } = (await req.json()) as {
      messages: { role: "user" | "assistant"; content: string }[];
    };

    const chatMessages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ];

    // First pass: let the model decide whether to call a tool
    const first = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // REPLACE_ME if Groq renames/retires this model
      messages: chatMessages,
      tools,
      tool_choice: "auto",
      max_tokens: 700,
    });

    const choice = first.choices[0].message;

    if (choice.tool_calls && choice.tool_calls.length > 0) {
      chatMessages.push(choice);

      for (const call of choice.tool_calls) {
        const args = JSON.parse(call.function.arguments || "{}");
        const result = await runTool(call.function.name, args);
        chatMessages.push({
          role: "tool",
          tool_call_id: call.id,
          content: JSON.stringify(result),
        });
      }

      const second = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: chatMessages,
        max_tokens: 700,
      });

      return NextResponse.json({
        reply: second.choices[0].message.content ?? "Sorry, I couldn't find an answer.",
      });
    }

    return NextResponse.json({
      reply: choice.content ?? "Sorry, I couldn't find an answer.",
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { reply: "Something went wrong talking to the AI assistant. Please try again." },
      { status: 200 }
    );
  }
}
