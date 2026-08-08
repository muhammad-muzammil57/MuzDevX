export const metadata = { title: "Privacy Policy" };

// ⚠️ REPLACE_ME: this is a starting template, not legal advice — have a
// real privacy policy generator or lawyer review it before going live.
const SECTIONS = [
  {
    title: "Information We Collect",
    body: "When you use the contact form, we collect your name, email address, and message. When you use the AI assistant, your questions may be sent to our AI provider (Groq) to generate a response.",
  },
  {
    title: "Cookies",
    body: "We use a small amount of local storage to remember your theme preference (dark/light) and whether you've seen the splash screen. We do not use tracking cookies.",
  },
  {
    title: "Analytics",
    body: "We may use privacy-respecting analytics (such as Google Analytics or Cloudflare Web Analytics) to understand overall site traffic. This data is aggregated and not tied to your identity.",
  },
  {
    title: "Contact Forms",
    body: "Messages sent through the support page are stored in our database solely to respond to your inquiry.",
  },
  {
    title: "AI Chatbot",
    body: "Conversations with the AI assistant are processed by our AI provider to generate answers. Avoid sharing sensitive personal information in the chat.",
  },
  {
    title: "Third-Party Services",
    body: "This site relies on third-party infrastructure including Supabase (database/hosting), Vercel (hosting) and Groq (AI). Each has its own privacy policy.",
  },
  {
    title: "Data Retention",
    body: "Contact messages and chat logs are retained only as long as needed to respond to inquiries and improve the site.",
  },
  {
    title: "Your Rights",
    body: "You can request that any personal data we hold about you be deleted by contacting us via the support page.",
  },
  {
    title: "Contact",
    body: "Questions about this policy can be sent through the support page.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
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
