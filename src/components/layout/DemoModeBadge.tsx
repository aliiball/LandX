export function DemoModeBadge() {
  if (!import.meta.env.VITE_DEMO_MODE) return null;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--accent-amber)] bg-[oklch(0.82_0.16_75_/_0.12)] px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider text-[var(--accent-amber)]"
      aria-label="Demo modu aktif"
    >
      <span aria-hidden className="size-1.5 rounded-full bg-[var(--accent-amber)]" />
      Demo Mode
    </span>
  );
}
