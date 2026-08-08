export const metadata = { title: "About" };

// ⚠️ REPLACE_ME: everything on this page is a placeholder
const SKILLS = [
  { label: "Frontend", value: 90 },
  { label: "Backend", value: 80 },
  { label: "AI Integration", value: 70 },
  { label: "UI / UX", value: 75 },
];

const TIMELINE = [
  { year: "2023", text: "Started learning web development." },
  { year: "2024", text: "Built and shipped my first projects." },
  { year: "2025", text: "Started building SaaS products." },
  { year: "2026", text: "Building AI-powered products and this hub." },
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <p className="font-mono-ui text-xs uppercase tracking-widest text-accent">$ whoami</p>
      <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">About Me</h1>

      <p className="mt-6 text-sm leading-relaxed text-muted">
        I&apos;m a developer who builds websites, software, browser extensions and AI-powered tools.
        This site is where all of that lives — a running log of what I&apos;ve made and why. Replace
        this paragraph with your real bio.
      </p>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {["Web Development", "Software Development", "AI Integration", "Chrome Extensions", "UI/UX"].map(
          (item) => (
            <div key={item} className="rounded-xl border border-border bg-surface px-4 py-3 text-sm">
              {item}
            </div>
          )
        )}
      </div>

      <h2 className="mt-14 font-display text-xl font-bold">Skills</h2>
      <div className="mt-5 space-y-4">
        {SKILLS.map((s) => (
          <div key={s.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-text">{s.label}</span>
              <span className="font-mono-ui text-xs text-muted">{s.value}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-accent" style={{ width: `${s.value}%` }} />
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-14 font-display text-xl font-bold">Journey</h2>
      <div className="mt-6 space-y-6 border-l border-border pl-6">
        {TIMELINE.map((t) => (
          <div key={t.year} className="relative">
            <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-bg bg-accent" />
            <p className="font-mono-ui text-xs text-accent">{t.year}</p>
            <p className="mt-1 text-sm text-muted">{t.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
