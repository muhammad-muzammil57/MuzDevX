export default function StatusBanner({ error, success }: { error?: string; success?: string }) {
  if (!error && !success) return null;
  return (
    <p
      className={
        error
          ? "rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400"
          : "rounded-lg border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent"
      }
    >
      {error || success}
    </p>
  );
}
