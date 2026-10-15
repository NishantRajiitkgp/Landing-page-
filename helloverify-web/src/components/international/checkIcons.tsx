/** The check builder's small strokes. `.ic svg` sets fill and stroke. */

export function SortArrow({ dir }: { dir?: "asc" | "desc" }) {
  return (
    <svg className={`ic-arrow${dir ? ` ${dir}` : ""}`} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M6 2.5v7M3 6.5l3 3 3-3" />
    </svg>
  );
}

export function TickIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" pathLength={1} />
    </svg>
  );
}

export function ClockIcon() {
  return (
    <svg className="ic-clock" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" />
      <path d="M8 4.75V8l2.25 1.5" />
    </svg>
  );
}

export function InfoIcon() {
  return (
    <svg className="ic-info-ic" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" />
      <path d="M8 7.25v4M8 4.9h.01" />
    </svg>
  );
}

export function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9M12 3c-2.6 2.6-3.9 5.6-3.9 9s1.3 6.4 3.9 9" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <path d="M3 3l6 6M9 3l-6 6" />
    </svg>
  );
}

export function ArrowIcon() {
  return (
    <svg className="ic-go" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}
