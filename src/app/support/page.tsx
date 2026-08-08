import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Support" };

const FAQS = [
  {
    q: "Can I hire you for a project?",
    a: "Yes — use the form below with a short description of what you need, and I'll reply by email.", // REPLACE_ME
  },
  {
    q: "Do you share source code for your projects?",
    a: "Most projects link to a public GitHub repository from their project page when available.",
  },
  {
    q: "How does the AI assistant work?",
    a: "It searches this site's project, blog and news database and answers using only what it finds — it won't make things up.",
  },
];

export default function SupportPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <p className="font-mono-ui text-xs uppercase tracking-widest text-accent">$ help</p>
      <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">How can we help?</h1>

      <div className="mt-10 space-y-3">
        {FAQS.map((f) => (
          <details key={f.q} className="group rounded-xl border border-border bg-surface p-4">
            <summary className="cursor-pointer list-none text-sm font-medium text-text">
              {f.q}
            </summary>
            <p className="mt-2 text-sm text-muted">{f.a}</p>
          </details>
        ))}
      </div>

      <h2 className="mt-14 font-display text-xl font-bold">Contact / Project Inquiry</h2>
      <ContactForm />
    </section>
  );
}
