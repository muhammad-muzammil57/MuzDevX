"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ⚠️ REPLACE_ME: swap these with your real brand details
const SITE_NAME = "Muzammil's Hub"; // e.g. "Muzammil's Hub"
const CREATOR_NAME = "Muzammil Coder";
const LOCATION = "Pakistan 🇵🇰";
const TAGLINE = "Built with passion.";

const MAX_DURATION_MS = 5500;

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Skip on repeat visits within the same tab session so it doesn't
    // annoy returning visitors — remove this block if you want it every time.
    const seen = window.sessionStorage.getItem("splash-seen");
    if (seen) {
      setVisible(false);
      return;
    }

    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(100, (elapsed / MAX_DURATION_MS) * 100));
    }, 60);

    const timeout = setTimeout(() => {
      window.sessionStorage.setItem("splash-seen", "1");
      setVisible(false);
    }, MAX_DURATION_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="grid-backdrop absolute inset-0 opacity-60" />

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-surface text-3xl font-display font-bold text-accent shadow-[0_0_40px_-8px_var(--accent)]"
          >
            {SITE_NAME.charAt(0)}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="relative mt-6 font-display text-2xl font-bold tracking-tight text-text sm:text-3xl"
          >
            {SITE_NAME}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="relative mt-2 font-mono-ui text-sm text-muted"
          >
            {TAGLINE}
          </motion.p>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 160 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="relative mt-8 h-px bg-border"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="relative mt-8 h-40 w-56 overflow-hidden rounded-lg"
          >
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
              <motion.div
                className="h-full rounded-full bg-accent"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-center font-mono-ui text-xs text-muted">Loading...</p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.6 }}
              className="mt-6 text-center"
            >
              <p className="font-mono-ui text-[11px] uppercase tracking-widest text-muted">
                Created by
              </p>
              <p className="font-display text-sm font-semibold text-text">{CREATOR_NAME}</p>
              <p className="mt-1 text-xs text-muted">{LOCATION}</p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
