import Link from "next/link";
import { Sparkles } from "lucide-react";
import { GithubIcon, LinkedinIcon, YoutubeIcon, InstagramIcon } from "./icons";

// ⚠️ REPLACE_ME: name + links
const SITE_NAME = "MuzDevX";
const CREATOR_NAME = "Muzammil Coder";
const SOCIALS = [
  { href: "https://github.com/muhammad-muzammil57", icon: GithubIcon, label: "GitHub" },
  { href: "https://linkedin.com/in/muzammilcoder", icon: LinkedinIcon, label: "LinkedIn" },
  { href: "https://facebook.com/muzammilcoder", icon: YoutubeIcon, label: "FaceBook" },
  { href: "https://instagram.com/muzammilcoder", icon: InstagramIcon, label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <Sparkles size={16} />
            </span>
            {SITE_NAME}
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted">
            Building digital experiences, software and ideas — one project at a time.
          </p>
        </div>

        <div>
          <p className="font-mono-ui text-xs uppercase tracking-widest text-muted">Navigation</p>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              ["Home", "/"],
              ["Projects", "/projects"],
              ["Blog", "/blog"],
              ["News", "/news"],
              ["About", "/about"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-muted transition-colors hover:text-text">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono-ui text-xs uppercase tracking-widest text-muted">Resources</p>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              ["Support", "/support"],
              ["Privacy Policy", "/privacy-policy"],
              ["Terms & Conditions", "/terms"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-muted transition-colors hover:text-text">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono-ui text-xs uppercase tracking-widest text-muted">Connect</p>
          <div className="mt-3 flex gap-2">
            {SOCIALS.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-muted sm:flex-row sm:px-8">
          <p>© {new Date().getFullYear()} {CREATOR_NAME}. All rights reserved.</p>
          <p>Built with ❤️ in Pakistan 🇵🇰</p>
        </div>
      </div>
    </footer>
  );
}
