"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, Sparkles, Mail } from "lucide-react";
import type { ChatMessage } from "@/types";

// REPLACE_ME if this changes — keep in sync with CONTACT_EMAIL in
// src/app/api/chat/route.ts.
const CONTACT_EMAIL = "support@muzdevx.dedyn.io";

const STARTER_PROMPTS = [
  "What's your latest project?",
  "Do you have any AI tools?",
  "Tell me about your blog",
];

function SendEmailButton() {
  function handleClick() {
    const subject = encodeURIComponent("Message from your portfolio site");
    const gmailAppUrl = `googlegmail:///co?to=${CONTACT_EMAIL}&subject=${subject}`;
    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}&su=${subject}`;

    // Try opening the Gmail app first (mobile deep link). If the app isn't
    // installed, nothing happens and the tab stays visible/focused — so if
    // we're still here after a short wait, fall back to Gmail on the web.
    let appOpened = false;
    const onHide = () => {
      appOpened = true;
    };
    document.addEventListener("visibilitychange", onHide);
    window.location.href = gmailAppUrl;

    setTimeout(() => {
      document.removeEventListener("visibilitychange", onHide);
      if (!appOpened) {
        window.open(gmailWebUrl, "_blank", "noopener,noreferrer");
      }
    }, 1000);
  }

  return (
    <button
      onClick={handleClick}
      className="mt-1.5 inline-flex items-center gap-1.5 self-start rounded-full border border-accent/40 bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:border-accent"
    >
      <Mail size={13} />
      Send Email
    </button>
  );
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI assistant. Ask me about any project, blog post, or news article on this site.", // REPLACE_ME: greeting
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply, showEmailButton: Boolean(data.showEmailButton) },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 left-5 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="glass mb-3 flex h-[28rem] w-[22rem] max-w-[88vw] flex-col overflow-hidden rounded-2xl shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Bot size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-text">AI Assistant</p>
                  <p className="text-[11px] text-muted">Ask about any project</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="text-muted hover:text-text"
              >
                <X size={16} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-sm bg-accent text-[#04140f]"
                        : "rounded-bl-sm bg-surface-2 text-text"
                    }`}
                  >
                    {m.content}
                  </div>
                  {m.role === "assistant" && m.showEmailButton && <SendEmailButton />}
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-surface-2 px-3.5 py-2.5">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
                  </div>
                </div>
              )}

              {messages.length === 1 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {STARTER_PROMPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => send(p)}
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a project..."
                className="flex-1 rounded-full border border-border bg-surface px-3.5 py-2 text-sm text-text outline-none focus:border-accent"
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={loading}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-[#04140f] disabled:opacity-50"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle AI assistant"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-[#04140f] shadow-[0_0_30px_-6px_var(--accent)] transition-transform hover:scale-105"
      >
        {open ? <X size={20} /> : <Sparkles size={20} />}
      </button>
    </div>
  );
}
