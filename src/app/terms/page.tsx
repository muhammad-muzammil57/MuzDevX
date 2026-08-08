export const metadata = { title: "Terms & Conditions" };

// ⚠️ REPLACE_ME: starting template, not legal advice — have this reviewed
// before relying on it.
const SECTIONS = [
  {
    title: "Website Usage",
    body: "By using this site you agree to use it for lawful purposes only and not to attempt to disrupt or misuse it, including the AI assistant or admin systems.",
  },
  {
    title: "Intellectual Property",
    body: "All original content, code snippets, and project write-ups on this site are owned by the site owner unless otherwise noted. Linked open-source projects retain their own licenses.",
  },
  {
    title: "Project Information",
    body: "Project descriptions, statuses and links are kept as up to date as reasonably possible but are provided for informational purposes and may change without notice.",
  },
  {
    title: "External Links",
    body: "This site links to external websites (live demos, GitHub repos, sources). We are not responsible for the content or practices of third-party sites.",
  },
  {
    title: "AI Assistant Limitations",
    body: "The AI assistant answers using information stored in this site's database. It may occasionally be incomplete or out of date and should not be treated as a substitute for verified information.",
  },
  {
    title: "User-Generated Content",
    body: "Messages submitted through contact forms are reviewed by the site owner and are not published publicly.",
  },
  {
    title: "Disclaimer",
    body: "This site and its content are provided \"as is\" without warranties of any kind.",
  },
  {
    title: "Changes to These Terms",
    body: "These terms may be updated from time to time. Continued use of the site after changes means you accept the updated terms.",
  },
  {
    title: "Contact",
    body: "Questions about these terms can be sent through the support page.",
  },
];

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Terms &amp; Conditions</h1>
      <p className="mt-3 text-xs text-muted">Last updated: August 2026</p>

      <div className="mt-10 space-y-8">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <h2 className="font-display text-lg font-semibold">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
