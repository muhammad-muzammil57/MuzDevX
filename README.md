# YourSite — Personal Digital Hub

A Next.js + TypeScript + Tailwind site: portfolio of projects/software, a blog,
a news section, an AI assistant (Groq) that knows every project automatically,
and a starter admin panel — all on free-tier services (Vercel + Supabase + Groq).

---

## 1. Run it locally

```bash
npm install
cp .env.example .env.local   # fill in keys — see step 2 (optional at first)
npm run dev
```

Open http://localhost:3000 — the site works immediately using placeholder
sample data in `src/data/sample-data.ts`, even before you connect Supabase or Groq.

---

## 2. Connect Supabase (free)

1. Create a project at https://supabase.com (free tier: ~500MB DB, 1GB storage).
2. Go to **SQL Editor** → paste the contents of `supabase/schema.sql` → Run.
   This creates the `projects`, `blogs`, `news`, `contact_messages`, `chat_*`
   and `site_settings` tables with Row Level Security already configured.
3. Go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only, never expose)
4. Go to **Authentication → Users** → add yourself as a user (email + password)
   so you can log in at `/admin/login`.
5. In `src/lib/db.ts`, replace each function body with a real Supabase query
   (a commented example is included above each function) — the return shapes
   already match the tables, so no other file needs to change.

## 3. Connect Groq (free)

1. Get a free API key at https://console.groq.com/keys.
2. Put it in `.env.local` as `GROQ_API_KEY`.
3. The chatbot at the bottom-left of the site will now answer using
   `src/app/api/chat/route.ts`, which calls Groq with tool-calling wired to
   `searchProjects`, `getLatestProjects`, `getAllProjects` and
   `searchBlogAndNews`. Any project you add to the database is automatically
   answerable — no retraining needed.
4. If Groq ever renames/retires the `llama-3.3-70b-versatile` model, update
   the two `model:` lines in that file to whatever their current free model is.

## 4. Deploy (free)

1. Push this project to a GitHub repo.
2. Import it at https://vercel.com/new (Hobby plan is free for personal/
   non-commercial use — check Vercel's current terms if this becomes a
   commercial site).
3. Add the same environment variables from `.env.local` in Vercel's
   Project Settings → Environment Variables.
4. Deploy.

---

## 5. Everything you should replace with your own content

Every placeholder below is marked `REPLACE_ME` (or `⚠️ REPLACE_ME`) directly
in the code, so you can also just search the project for that string.

| File | What to change |
|---|---|
| `src/app/layout.tsx` | Site title, description, domain (`metadataBase`) |
| `src/components/SplashScreen.tsx` | `SITE_NAME`, `CREATOR_NAME`, `LOCATION`, `TAGLINE` |
| `src/components/Navbar.tsx` | `SITE_NAME` |
| `src/components/Footer.tsx` | `SITE_NAME`, `CREATOR_NAME`, social links |
| `src/components/Hero.tsx` | Rotating tagline `LINES`, the `muzammil@digital-hub` handle |
| `src/app/page.tsx` | GitHub link in the CTA section |
| `src/components/Chatbot.tsx` | Greeting message |
| `src/app/api/chat/route.ts` | `SYSTEM_PROMPT` (put your real name in), Groq model name if needed |
| `src/app/about/page.tsx` | Bio, skills, timeline — all placeholder |
| `src/app/support/page.tsx` | FAQ answers |
| `src/app/privacy-policy/page.tsx`, `src/app/terms/page.tsx` | Have a real lawyer/generator review before publishing — these are starting templates |
| `src/data/sample-data.ts` | Your real projects, blog posts, news (**or** delete this file once Supabase is wired up in `src/lib/db.ts`) |
| `.env.local` | Supabase + Groq keys (never commit this file) |

## 6. Admin panel

`/admin/login` and `/admin` are wired to Supabase Auth. Once you complete
step 2 above and create an admin user (Supabase Dashboard → Authentication →
Users), the full panel is functional:

- **Dashboard** (`/admin`) — live counts for projects, blog posts, news and
  messages, pulled from Supabase.
- **Projects** (`/admin/projects`) — list, create, edit and delete. Fields
  match the `projects` table exactly, including `featured`, `status` and a
  `published` toggle that controls visibility on the live site.
- **Blog** (`/admin/blog`) — list, create, edit and delete, with a
  draft/published status, SEO title/description fields, and an
  auto-estimated reading time.
- **News** (`/admin/news`) — list, create, edit and delete, with source
  name/URL and a published date.
- **Messages** (`/admin/messages`) — read and delete submissions from the
  Support page contact form.

**How it's wired:**

- `src/lib/admin-db.ts` (server-only) does the actual reads/writes with the
  Supabase **service role** key, so it always bypasses RLS — this is the only
  place with full read/write access to every row, published or not.
- `src/app/api/admin/**` route handlers call `admin-db.ts` and first verify
  the caller via `src/lib/admin-auth.ts`, which checks the Supabase access
  token sent in the `Authorization: Bearer` header.
- `src/lib/admin-client.ts` (`adminFetch`) is the client-side helper every
  admin page uses — it automatically attaches the signed-in admin's access
  token to each request.
- `src/lib/db.ts` (public reads) now queries Supabase directly once it's
  configured, respecting the RLS policies below (so a `published: false`
  project or `draft` post never shows up on the public site, but does show
  up in the admin list).
- Cover images can be pasted as a URL or uploaded directly to the `media`
  Supabase Storage bucket (created automatically by `supabase/schema.sql`).

**Optional next step:** an "Generate with AI" button that calls a small API
route to have Groq draft a description/features list from a title + a few
bullet points, for the admin to review before saving.

## 7. Design notes

- Dark mode is the default; toggle lives in the navbar (persisted to
  `localStorage`, see `src/components/ThemeProvider.tsx`).
- Color tokens and fonts are defined in `src/app/globals.css`. Google Fonts
  couldn't be fetched from this build environment, so the type stack
  currently falls back to system fonts styled to read as a display/mono
  pairing (`--font-display`, `--font-body`, `--font-mono`). If you want the
  real Space Grotesk / Inter / JetBrains Mono, add them via
  `next/font/google` in `src/app/layout.tsx` once you have normal internet
  access, or self-host the font files under `public/fonts`.
- Splash screen shows once per browser tab session (`sessionStorage`) —
  remove that check in `SplashScreen.tsx` if you want it on every load.

## 8. Not included in this version (matches the roadmap's own "V2" list)

Vector/semantic search (pgvector), AI-generated project descriptions in the
admin UI, conversation memory for the chatbot, advanced analytics dashboard,
and a rich-text blog editor are intentionally left for a second pass — the
architecture (Supabase + a single `lib/db.ts` data layer + Groq tool-calling)
is already set up to support all of them without restructuring.
