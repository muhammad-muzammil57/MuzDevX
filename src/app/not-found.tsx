import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-5 text-center">
      <div className="grid-backdrop absolute inset-0" />
      <p className="relative font-display text-7xl font-bold text-accent sm:text-8xl">404</p>
      <h1 className="relative mt-4 font-display text-xl font-semibold sm:text-2xl">
        Looks like you&apos;ve gone off the roadmap.
      </h1>
      <p className="relative mt-2 max-w-sm text-sm text-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="relative mt-8 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-[#04140f]"
      >
        Go Home
      </Link>
    </section>
  );
}
