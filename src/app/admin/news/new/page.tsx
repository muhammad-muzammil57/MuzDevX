import NewsForm from "../NewsForm";

export default function NewNewsArticlePage() {
  return (
    <section className="px-5 py-10 sm:px-8">
      <p className="font-mono-ui text-xs uppercase tracking-widest text-accent">
        $ admin --news --new
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">New news article</h1>
      <NewsForm />
    </section>
  );
}
