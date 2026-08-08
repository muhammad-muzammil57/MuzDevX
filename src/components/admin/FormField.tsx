import type { ReactNode } from "react";

export default function FormField({
  label,
  hint,
  children,
  required,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-baseline justify-between">
        <span className="text-xs font-medium text-muted">
          {label}
          {required && <span className="text-accent-2"> *</span>}
        </span>
        {hint && <span className="text-[11px] text-muted/70">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

export const inputClass =
  "w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-accent";
