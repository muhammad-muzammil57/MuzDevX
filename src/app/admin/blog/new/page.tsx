import BlogForm from "../BlogForm";

export default function NewBlogPostPage() {
  return (
    <section className="px-5 py-10 sm:px-8">
      <p className="font-mono-ui text-xs uppercase tracking-widest text-accent">
        $ admin --blog --new
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">New blog post</h1>
      <BlogForm />
    </section>
  );
}
