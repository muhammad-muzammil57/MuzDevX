"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function ConfirmDeleteButton({
  onConfirm,
  label = "Delete",
}: {
  onConfirm: () => Promise<void> | void;
  label?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <button
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            await onConfirm();
            setBusy(false);
            setConfirming(false);
          }}
          className="rounded-full bg-red-500/90 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
        >
          {busy ? "Deleting…" : "Confirm"}
        </button>
        <button
          disabled={busy}
          onClick={() => setConfirming(false)}
          className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-text"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      aria-label={label}
      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted hover:border-red-400/50 hover:text-red-400"
    >
      <Trash2 size={13} />
      {label}
    </button>
  );
}
