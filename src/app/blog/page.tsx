import { getBlogPosts } from "@/lib/db";
import BlogCard from "@/components/BlogCard";

export const metadata = { title: "Blog" };

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <p className="font-mono-ui text-xs uppercase tracking-widest text-accent-2">$ cat ./blog</p>
      <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Blog</h1>
      <p className="mt-3 max-w-xl text-sm text-muted">
        Notes on building products, lessons learned, and the occasional deep dive.
      </p>

      {posts.length === 0 ? (
        <p className="mt-16 text-center text-sm text-muted">No posts published yet.</p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <BlogCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </section>
  );
}
