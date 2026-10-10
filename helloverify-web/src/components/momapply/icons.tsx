/** Stroked 16×16 glyphs, `currentColor`, decorative. */
const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function TickIcon({ className = "tick" }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <path d="M3.2 8.4l3 3 6.6-6.8" />
    </svg>
  );
}

export function ArrowIcon() {
  return (
    <svg {...base} className="ma-arrow">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function EyeIcon({ off }: { off?: boolean }) {
  return (
    <svg {...base}>
      <path d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8s-2.4 4.5-6.5 4.5S1.5 8 1.5 8z" />
      <circle cx="8" cy="8" r="2" />
      {off ? <path d="M2.5 13.5l11-11" /> : null}
    </svg>
  );
}

export function AlertIcon() {
  return (
    <svg {...base} className="ma-alert-i">
      <circle cx="8" cy="8" r="6.2" />
      <path d="M8 4.8v3.6M8 10.9v.1" />
    </svg>
  );
}

export function FileIcon() {
  return (
    <svg {...base}>
      <path d="M9.2 1.8H4.6a1.4 1.4 0 0 0-1.4 1.4v9.6a1.4 1.4 0 0 0 1.4 1.4h6.8a1.4 1.4 0 0 0 1.4-1.4V5.4z" />
      <path d="M9.2 1.8v3.6h3.6M8 7.6v4M6.2 9.4L8 7.6l1.8 1.8" />
    </svg>
  );
}

export function CrossIcon() {
  return (
    <svg {...base}>
      <path d="M4.2 4.2l7.6 7.6M11.8 4.2l-7.6 7.6" />
    </svg>
  );
}

export function PlusIcon() {
  return (
    <svg {...base}>
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}

export function DashIcon() {
  return (
    <svg {...base}>
      <path d="M4.5 8h7" />
    </svg>
  );
}

export function DownloadIcon() {
  return (
    <svg {...base}>
      <path d="M8 2.5v8M4.6 7.2L8 10.6l3.4-3.4M2.8 13.5h10.4" />
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg {...base}>
      <rect x="3.2" y="7" width="9.6" height="6.6" rx="1.6" />
      <path d="M5.4 7V5.2a2.6 2.6 0 0 1 5.2 0V7" />
    </svg>
  );
}
