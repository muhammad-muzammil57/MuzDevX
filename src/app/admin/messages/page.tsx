"use client";

import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { adminFetch } from "@/lib/admin-client";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import StatusBanner from "@/components/admin/StatusBanner";
import type { ContactMessage } from "@/types/admin";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  function load() {
    adminFetch<{ messages: ContactMessage[] }>("/api/admin/messages")
      .then((res) => setMessages(res.messages))
      .catch((err) => setError(err.message));
  }

  useEffect(load, []);

  async function handleDelete(id: string) {
    await adminFetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    setMessages((prev) => prev?.filter((m) => m.id !== id) ?? null);
  }

  return (
    <section className="px-5 py-10 sm:px-8">
      <p className="font-mono-ui text-xs uppercase tracking-widest text-accent">$ admin --messages</p>
      <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Messages</h1>
      <p className="mt-2 text-sm text-muted">Submissions from the Support page contact form.</p>

      <div className="mt-6">
        <StatusBanner error={error} />
      </div>

      {messages === null && !error && (
        <div className="mt-6 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl skeleton" />
          ))}
        </div>
      )}

      {messages?.length === 0 && (
        <div className="mt-10 flex flex-col items-center gap-2 py-10 text-center text-sm text-muted">
          <Mail size={24} className="text-muted" />
          No messages yet.
        </div>
      )}

      {messages && messages.length > 0 && (
        <div className="mt-6 space-y-3">
          {messages.map((m) => {
            const open = openId === m.id;
            return (
              <div key={m.id} className="rounded-2xl border border-border bg-surface p-4">
                <button
                  onClick={() => setOpenId(open ? null : m.id)}
                  className="flex w-full items-start justify-between gap-4 text-left"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{m.name}</p>
                      <span className="text-xs text-muted">&lt;{m.email}&gt;</span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted">
                      {m.subject || "(no subject)"} — {m.message}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </span>
                </button>

                {open && (
                  <div className="mt-3 space-y-3 border-t border-border pt-3">
                    {m.subject && (
                      <p className="text-sm">
                        <span className="text-muted">Subject: </span>
                        {m.subject}
                      </p>
                    )}
                    <p className="whitespace-pre-wrap text-sm text-muted">{m.message}</p>
                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${m.email}`}
                        className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-text"
                      >
                        Reply by email
                      </a>
                      <ConfirmDeleteButton onConfirm={() => handleDelete(m.id)} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
