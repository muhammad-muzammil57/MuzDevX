import { getProjects } from "@/lib/db";
import ProjectsExplorer from "@/components/ProjectsExplorer";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <p className="font-mono-ui text-xs uppercase tracking-widest text-accent">
        $ ls -la ./projects
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Projects</h1>
      <p className="mt-3 max-w-xl text-sm text-muted">
        Websites, software, browser extensions, AI tools and landing pages — everything I&apos;ve
        built, filterable by category.
      </p>

      <ProjectsExplorer projects={projects} />
    </section>
  );
}
