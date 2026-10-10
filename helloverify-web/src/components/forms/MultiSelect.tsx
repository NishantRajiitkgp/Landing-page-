"use client";

import { useEffect, useId, useRef, useState } from "react";

/** A dropdown of checkboxes. Each ticked box posts its own `name=value`, so
 *  the form submits every choice with no hidden field to keep in sync. The
 *  panel is `hidden` when closed; hidden checkboxes still submit. */
export function MultiSelect({
  id,
  name,
  label,
  options,
  placeholder,
  countLabel,
  defaultValue,
  invalid,
  describedBy,
}: {
  id: string;
  name: string;
  /** The field's visible label, repeated as the panel's group name. */
  label: string;
  options: readonly { value: string; label: string }[];
  placeholder: string;
  /** `{n}` is replaced with how many are ticked. */
  countLabel: string;
  defaultValue: readonly string[];
  invalid?: boolean;
  describedBy?: string;
}) {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<string[]>(() =>
    defaultValue.filter((value) => options.some((o) => o.value === value)),
  );
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent | FocusEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("focusin", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("focusin", close);
    };
  }, [open]);

  const chosen = options.filter((o) => picked.includes(o.value));
  const summary =
    chosen.length === 0
      ? placeholder
      : chosen.length <= 2
        ? chosen.map((o) => o.label).join(", ")
        : countLabel.replace("{n}", String(chosen.length));

  const toggle = (value: string) =>
    setPicked((current) =>
      current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
    );

  return (
    <div
      className="msel"
      ref={root}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.preventDefault();
          setOpen(false);
          button.current?.focus();
        }
      }}
    >
      <button
        ref={button}
        type="button"
        id={id}
        className="inp msel-btn"
        aria-expanded={open}
        aria-controls={panelId}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        data-empty={chosen.length === 0 || undefined}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="msel-text">{summary}</span>
        <svg className="msel-chevron" width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
          <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div id={panelId} className="msel-panel" role="group" aria-label={label} hidden={!open}>
        {options.map((o) => (
          <label key={o.value} className="msel-opt">
            <input
              type="checkbox"
              name={name}
              value={o.value}
              checked={picked.includes(o.value)}
              onChange={() => toggle(o.value)}
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
