import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { getProjectBySlug, getProjects } from "@/lib/db";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return { title: project.title, description: project.shortDescription };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
      <p className="font-mono-ui text-xs uppercase tracking-widest text-accent">
        {project.category} · {project.status}
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{project.title}</h1>
      <p className="mt-3 text-base text-muted">{project.shortDescription}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {project.websiteUrl && (
          <a
            href={project.websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-[#04140f]"
          >
            Visit Website <ArrowUpRight size={15} />
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-text"
          >
            <GithubIcon size={15} /> View Source
          </a>
        )}
      </div>

      <div className="mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-surface-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={project.coverImage} alt={project.title} className="h-full w-full object-cover" />
      </div>

      <div className="mt-10 grid gap-10 sm:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <section>
            <h2 className="font-display text-lg font-semibold">Overview</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{project.description}</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">Why I Built It</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{project.purpose}</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">Features</h2>
            <ul className="mt-3 space-y-2">
              {project.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted">
                  <Check size={15} className="mt-0.5 shrink-0 text-accent" /> {f}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-surface p-5">
          <h3 className="font-mono-ui text-xs uppercase tracking-widest text-muted">
            Technologies
          </h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.technologies.map((t) => (
              <span
                key={t}
                className="rounded-full bg-surface-2 px-2.5 py-1 font-mono-ui text-[11px] text-muted"
              >
                {t}
              </span>
            ))}
          </div>

          <h3 className="mt-6 font-mono-ui text-xs uppercase tracking-widest text-muted">
            Status
          </h3>
          <p className="mt-2 text-sm text-text">{project.status}</p>

          <h3 className="mt-6 font-mono-ui text-xs uppercase tracking-widest text-muted">
            Added
          </h3>
          <p className="mt-2 text-sm text-text">
            {new Date(project.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </aside>
      </div>

      <div className="mt-14 border-t border-border pt-8">
        <Link href="/projects" className="text-sm text-muted hover:text-text">
          ← Back to all projects
        </Link>
      </div>
    </article>
  );
}
