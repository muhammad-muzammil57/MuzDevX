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

// REPLACE_ME if the contact address changes — keep this in sync with the
// address used by the "Send Email" button in src/components/Chatbot.tsx.
const CONTACT_EMAIL = "support@muzdevx.dedyn.io";

const SYSTEM_PROMPT = `You are the AI assistant embedded on a developer's personal
portfolio / digital hub website. You are a general-purpose, helpful assistant —
answer ANY question the visitor asks (general knowledge, coding help, advice,
math, explanations, casual conversation, anything at all), the same way
ChatGPT would. Never refuse or deflect a question just because it isn't about
this website — general Q&A is a core part of your job here, not a fallback.

Identity: if asked who made you, who built you, what company created you, what
AI model you are, or anything similar, always answer that you were built by
Muzammilcoder for this site — never mention OpenAI, Meta, Groq, or any
underlying AI provider/model name. You don't need to explain the technical
stack behind you; just say Muzammilcoder built/trained you for this website.

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
- Keep every answer SHORT and to the point by default — 1 to 3 sentences, or
  a short plain list of at most 3 items. Do not use markdown tables. Do not
  dump a project's full tech stack, purpose, and every feature unless the
  visitor explicitly asks for more detail — start with just the name, a
  one-line description, and the link, then offer to share more.
- NEVER use markdown symbols like **bold**, <angle brackets>, or backticks in
  your reply — plain text only.
- When listing one or more projects, format EACH project as its own block,
  in exactly this shape (one blank line between projects):
  Project Name: <name>
  Description: <one-line description>
  Project Link: <url>
  Do not merge the name and link into one line, and do not add any other
  symbols around them.
- For anything project-related, only state facts returned by your tools —
  never invent project names, links, or details. Call a tool before
  answering any project question.
- For everything else, answer directly from your own knowledge like a normal
  AI assistant — no tool needed, but still keep it brief.
- When you mention a project, always include its live URL if one exists.
- If the visitor asks for contact info, an email address, or a phone/contact
  number, tell them they can email ${CONTACT_EMAIL} and mention that there's
  a "Send Email" button right below this message they can tap to do that
  directly — don't make up a phone number, only this email exists.
- NEVER write out tool/function-call syntax as plain text (e.g. things like
  <function=...> or similar). If you need data, call the tool for real
  through the tool-calling mechanism — don't describe or fake a call in your
  written reply.`; // REPLACE_ME "Muzammilcoder" with the real site owner's name if it changes

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

const MODEL = "openai/gpt-oss-120b"; // REPLACE_ME if Groq renames/retires this model — see https://console.groq.com/docs/deprecations
const MAX_TOOL_ROUNDS = 4;

// Simple, deterministic (non-AI) check on the visitor's own message so the
// "Send Email" button only shows up when it's actually relevant — asking
// for contact info, an email address, or a phone/contact number.
const CONTACT_INTENT_REGEX =
  /\b(contact|email|e-mail|your number|phone number|get in touch|reach (you|out)|rabta|number chahiye)\b/i;

function wantsContactInfo(text: string): boolean {
  return CONTACT_INTENT_REGEX.test(text);
}

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
      // Only forward role + content to Groq — the frontend also stores
      // UI-only fields (like showEmailButton) on each message, and sending
      // those extra fields back causes the API to reject the whole request.
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    const showEmailButton = lastUserMessage ? wantsContactInfo(lastUserMessage.content) : false;

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
        max_tokens: 350,
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
    return NextResponse.json({ reply, showEmailButton });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { reply: "Something went wrong talking to the AI assistant. Please try again." },
      { status: 200 }
    );
  }
}
