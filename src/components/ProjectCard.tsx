import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "./icons";
import type { Project } from "@/types";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/50">
      <Link href={`/projects/${project.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-surface-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.coverImage}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full border border-border bg-bg/80 px-2.5 py-1 font-mono-ui text-[10px] uppercase tracking-wide text-muted backdrop-blur">
          {project.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <Link href={`/projects/${project.slug}`}>
          <h3 className="font-display text-base font-semibold text-text transition-colors group-hover:text-accent">
            {project.title}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm text-muted">{project.shortDescription}</p>

        <div className="mt-1 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full bg-surface-2 px-2 py-0.5 font-mono-ui text-[10px] text-muted"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-3 pt-3">
          <Link
            href={`/projects/${project.slug}`}
            className="text-xs font-medium text-accent hover:underline"
          >
            View Project
          </Link>
          {project.websiteUrl && (
            <a
              href={project.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs text-muted hover:text-text"
            >
              Live Demo <ArrowUpRight size={12} />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
              className="ml-auto text-muted hover:text-text"
            >
              <GithubIcon size={15} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
