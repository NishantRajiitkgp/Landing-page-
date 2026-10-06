"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

import type { IntlOption } from "@/lib/international/catalog";

/** Searchable country list. Every option stays in the DOM (the menu is only
 *  `hidden`) so the CMS names and flag alts are on the page when it is closed.
 *  Catalog-only names sit on `data-audit-skip`. */
export function IntlSelect({
  label,
  value,
  options,
  search,
  none,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly IntlOption[];
  search: string;
  none: string;
  onChange: (code: string) => void;
}) {
  const base = useId();
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const selected = options.find((o) => o.code === value) ?? options[0];
  const query = q.trim().toLowerCase();
  const matches = query ? options.filter((o) => o.name.toLowerCase().includes(query)) : options;

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const close = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  if (!selected) return null;

  return (
    <div className="intl3-select" ref={root}>
      <div role="group" aria-label={label}>
        <button
          type="button"
          className="intl3-trigger"
          aria-expanded={open}
          aria-controls={base}
          data-audit-skip={selected.cms ? undefined : "yes"}
          onClick={() => {
            setOpen((v) => !v);
            setQ("");
          }}
        >
          <Flag option={selected} />
          <span>{selected.name}</span>
          <Caret />
        </button>
      </div>
      <div className="intl3-menu" id={base} hidden={!open}>
        <input
          ref={input}
          type="search"
          value={q}
          placeholder={search}
          aria-label={search}
          autoComplete="off"
          onChange={(e) => setQ(e.target.value)}
        />
        <ul>
          {options.map((o) => (
            <li key={o.code} hidden={query !== "" && !o.name.toLowerCase().includes(query)}>
              <button
                type="button"
                aria-current={o.code === selected.code ? "true" : undefined}
                data-audit-skip={o.cms ? undefined : "yes"}
                onClick={() => {
                  onChange(o.code);
                  setOpen(false);
                  setQ("");
                }}
              >
                <Flag option={o} />
                <span>{o.name}</span>
              </button>
            </li>
          ))}
        </ul>
        {query && matches.length === 0 ? (
          <p className="intl3-none" role="status">
            {none}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Flag({ option }: { option: IntlOption }) {
  if (option.flagSrc && option.flagAlt) {
    return <Image className="intl3-flag" src={option.flagSrc} alt={option.flagAlt} width={22} height={15} />;
  }
  return (
    <span className="intl3-badge" aria-hidden="true">
      {option.code}
    </span>
  );
}

function Caret() {
  return (
    <svg className="intl3-caret" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
