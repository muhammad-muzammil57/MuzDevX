import ProjectForm from "../ProjectForm";

export default function NewProjectPage() {
  return (
    <section className="px-5 py-10 sm:px-8">
      <p className="font-mono-ui text-xs uppercase tracking-widest text-accent">
        $ admin --projects --new
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">New project</h1>
      <ProjectForm />
    </section>
  );
}
