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
portfolio / digital hub website. You are a general-purpose, helpful assistant —
answer ANY question the visitor asks (general knowledge, coding help, advice,
math, explanations, casual conversation, anything at all), the same way
ChatGPT would. Never refuse or deflect a question just because it isn't about
this website — general Q&A is a core part of your job here, not a fallback.

You ALSO have a special responsibility: whenever the conversation touches the
site owner's work, skills, portfolio, projects, software, tools, websites, or
anything like "what have you built", "what do you do", "show me your work",
or even a loose/indirect mention of building something — proactively pivot
and bring up the owner's projects yourself, without waiting to be asked
directly. Use your tools to pull real project data and give an enthusiastic,
detailed rundown: what each project does, its category, the tech stack, key
features, and its live URL if it has one. Make the visitor want to click
through and check it out.

Rules:
- For anything project-related, only state facts returned by your tools —
  never invent project names, links, or details. Call a tool before
  answering any project question.
- For everything else, answer directly from your own knowledge like a normal
  AI assistant — no tool needed.
- Keep answers conversational; use short lists when presenting multiple
  projects so they're easy to scan.
- When you mention a project, always include its live URL if one exists.
- NEVER write out tool/function-call syntax as plain text (e.g. things like
  <function=...> or similar). If you need data, call the tool for real
  through the tool-calling mechanism — don't describe or fake a call in your
  written reply.
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
        purpose: p.purpose,
        technologies: p.technologies,
        features: p.features,
        status: p.status,
        url: p.websiteUrl,
        githubUrl: p.githubUrl,
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

const MODEL = "llama-3.3-70b-versatile"; // REPLACE_ME if Groq renames/retires this model
const MAX_TOOL_ROUNDS = 4;

// Some Llama models occasionally print a fake tool-call as plain text
// (e.g. "<function=searchProjects{...}>") instead of using the real
// tool-calling mechanism, usually when they weren't given the tools list
// on a later round. This strips any such leftovers as a last-resort safety
// net so it never reaches the visitor.
function stripLeakedToolSyntax(text: string): string {
  return text
    .replace(/<function=[^>]*>[\s\S]*?<\/function>/gi, "")
    .replace(/<function=[^>]*\/?>/gi, "")
    .trim();
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

    let finalContent = "";

    // Let the model call tools as many times as it needs (up to a cap),
    // always keeping the tools list available so it never has to fake one.
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const completion = await groq.chat.completions.create({
        model: MODEL,
        messages: chatMessages,
        tools,
        tool_choice: "auto",
        temperature: 0.4,
        max_tokens: 900,
      });

      const choice = completion.choices[0].message;

      if (choice.tool_calls && choice.tool_calls.length > 0) {
        chatMessages.push(choice);

        for (const call of choice.tool_calls) {
          let args: Record<string, unknown> = {};
          try {
            args = call.function.arguments ? JSON.parse(call.function.arguments) : {};
          } catch {
            // Malformed arguments from the model — fall back to no args
            // instead of crashing the whole request.
            args = {};
          }

          let result: unknown;
          try {
            result = await runTool(call.function.name, args);
          } catch (toolErr) {
            console.error(`Tool "${call.function.name}" failed:`, toolErr);
            result = { error: "This tool failed to run." };
          }

          chatMessages.push({
            role: "tool",
            tool_call_id: call.id,
            content: JSON.stringify(result),
          });
        }

        continue; // give the model another round with the fresh tool results
      }

      finalContent = choice.content ?? "";
      break;
    }

    if (!finalContent) {
      finalContent = "Sorry, I couldn't put an answer together just now — please try again.";
    }

    const reply = stripLeakedToolSyntax(finalContent) || "Sorry, I couldn't find an answer.";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { reply: "Something went wrong talking to the AI assistant. Please try again." },
      { status: 200 }
    );
  }
}
