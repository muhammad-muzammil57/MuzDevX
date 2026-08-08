"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ⚠️ REPLACE_ME: rotate in phrases that describe what you actually build
const LINES = [
  "building websites",
  "shipping software",
  "designing landing pages",
  "writing about code",
  "training an AI on all of it",
];

export default function Hero() {
  const [lineIndex, setLineIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = LINES[lineIndex];
    const speed = deleting ? 35 : 55;

    const timeout = setTimeout(() => {
      if (!deleting) {
        if (display.length < current.length) {
          setDisplay(current.slice(0, display.length + 1));
        } else {
          setTimeout(() => setDeleting(true), 1200);
        }
      } else {
        if (display.length > 0) {
          setDisplay(current.slice(0, display.length - 1));
        } else {
          setDeleting(false);
          setLineIndex((i) => (i + 1) % LINES.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [display, deleting, lineIndex]);

  return (
    <section className="relative overflow-hidden">
      <div className="grid-backdrop absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 font-mono-ui text-xs text-muted">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            status: online — currently accepting projects
          </div>

          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-text sm:text-6xl">
            Building Ideas Into
            <br />
            Digital Products
          </h1>

          <div className="mx-auto mt-6 flex h-7 items-center justify-center font-mono-ui text-sm text-muted sm:text-base">
            {/* REPLACE_ME: swap "muzammil" / "digital-hub" for your own name + site */}
            <span className="text-accent">muzammil@digital-hub:~$</span>
            <span className="ml-2 caret">{display}</span>
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/projects"
              className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#04140f] transition-transform hover:scale-[1.03]"
            >
              Explore My Work <ArrowRight size={15} />
            </Link>
            <Link
              href="/blog"
              className="rounded-full border border-border px-6 py-3 text-sm font-medium text-text transition-colors hover:border-accent"
            >
              Read My Blog
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
