"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Newspaper,
  Rss,
  Mail,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/blog", label: "Blog", icon: Rss },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  const skipGuard = isLoginPage || !isSupabaseConfigured;
  const [user, setUser] = useState<User | null>(null);
  const [checked, setChecked] = useState(skipGuard);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (skipGuard) return;

    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      if (!data.user) {
        router.push("/admin/login");
      } else {
        setUser(data.user);
      }
      setChecked(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user && !isLoginPage) router.push("/admin/login");
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [skipGuard, isLoginPage, router]);

  // Login page renders on its own, no sidebar/guard.
  if (isLoginPage) return <>{children}</>;

  if (!isSupabaseConfigured) {
    return (
      <section className="mx-auto max-w-2xl px-5 py-14 text-center">
        <h1 className="font-display text-2xl font-bold">Admin Panel</h1>
        <p className="mt-3 text-sm text-muted">
          Supabase isn&apos;t connected yet. Add your project URL, anon key and service role key to
          .env.local, run the SQL in supabase/schema.sql, then reload this page.
        </p>
      </section>
    );
  }

  if (!checked) return null;
  if (!user) return null; // redirect in-flight

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl">
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-14 z-40 flex items-center justify-between border-b border-border bg-surface px-5 py-3 md:hidden">
        <p className="font-mono-ui text-xs uppercase tracking-widest text-accent">$ admin</p>
        <button
          onClick={() => setMobileNavOpen((v) => !v)}
          aria-label="Toggle admin menu"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted"
        >
          {mobileNavOpen ? <X size={15} /> : <Menu size={15} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "w-56 shrink-0 border-r border-border px-4 py-8 md:sticky md:top-16 md:block md:h-[calc(100vh-4rem)]",
          mobileNavOpen
            ? "fixed inset-x-0 top-[6.5rem] z-40 h-auto border-b bg-surface"
            : "hidden"
        )}
      >
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-text",
                  active && "bg-accent-soft text-accent"
                )}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 border-t border-border pt-4">
          <p className="truncate px-3 text-xs text-muted">{user.email}</p>
          <button
            onClick={handleSignOut}
            className="mt-2 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-text"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="min-w-0 flex-1 pt-16 md:pt-0">{children}</main>
    </div>
  );
}
