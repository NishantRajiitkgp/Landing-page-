"use client";

import Image from "next/image";
import { Fragment, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

import type { IntlOption } from "@/lib/international/catalog";

/** Searchable country list. Every option stays in the DOM (the menu is only
 *  `hidden`) so the CMS names and flag alts are on the page when it is closed.
 *  Catalog-only names sit on `data-audit-skip`. Options are grouped under
 *  sticky A–Z headings; the arrow keys walk the visible options and Enter in
 *  the search box takes the first match. With `riskTag`, each option shows
 *  its currency code, high-risk countries carry the tag under their name,
 *  and the search also matches the currency code. `note` closes the menu. */
export function IntlSelect({
  label,
  value,
  options,
  search,
  none,
  riskTag,
  note,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly IntlOption[];
  search: string;
  none: string;
  riskTag?: string;
  note?: ReactNode;
  onChange: (code: string) => void;
}) {
  const base = useId();
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const selected = options.find((o) => o.code === value) ?? options[0];
  const query = q.trim().toLowerCase();
  const isMatch = (o: IntlOption) =>
    !query || o.name.toLowerCase().includes(query) || (riskTag !== undefined && o.currency.toLowerCase() === query);
  const matches = options.filter(isMatch);
  const letters = new Set(matches.map((o) => o.letter));

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    list.current?.querySelector<HTMLElement>('[aria-current="true"]')?.scrollIntoView({ block: "center" });
    const close = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  if (!selected) return null;

  const choose = (code: string) => {
    onChange(code);
    setOpen(false);
    setQ("");
    trigger.current?.focus();
  };

  const buttons = () => Array.from(list.current?.querySelectorAll<HTMLButtonElement>("li:not([hidden]) > button") ?? []);

  const onListKey = (e: KeyboardEvent<HTMLUListElement>) => {
    const all = buttons();
    const at = all.indexOf(document.activeElement as HTMLButtonElement);
    let next = -1;
    if (e.key === "ArrowDown") next = Math.min(at + 1, all.length - 1);
    else if (e.key === "ArrowUp") next = at - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = all.length - 1;
    else return;
    e.preventDefault();
    if (next < 0) input.current?.focus();
    else all[next]?.focus();
  };

  const onSearchKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      buttons()[0]?.focus();
    } else if (e.key === "Enter" && matches[0]) {
      e.preventDefault();
      choose(matches[0].code);
    }
  };

  return (
    <div className="intl3-select" ref={root}>
      <div role="group" aria-label={label}>
        <button
          ref={trigger}
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
          <span className="intl3-cn">
            <span>{selected.name}</span>
            {riskTag !== undefined && selected.risk ? <small className="intl3-xc">{riskTag}</small> : null}
          </span>
          {riskTag !== undefined ? <Currency option={selected} /> : null}
          <Caret />
        </button>
      </div>
      <div className="intl3-menu" id={base} hidden={!open} ref={menu}>
        <div className="intl3-search">
          <SearchIcon />
          <input
            ref={input}
            type="search"
            value={q}
            placeholder={search}
            aria-label={search}
            autoComplete="off"
            onChange={(e) => {
              setQ(e.target.value);
              menu.current?.scrollTo({ top: 0 });
            }}
            onKeyDown={onSearchKey}
          />
        </div>
        <ul ref={list} onKeyDown={onListKey}>
          {options.map((o, i) => (
            <Fragment key={o.code}>
              {o.letter !== options[i - 1]?.letter ? (
                <li className="intl3-letter" aria-hidden="true" hidden={!letters.has(o.letter)}>
                  {o.letter}
                </li>
              ) : null}
              <li hidden={!isMatch(o)}>
                <button
                  type="button"
                  aria-current={o.code === selected.code ? "true" : undefined}
                  data-audit-skip={o.cms ? undefined : "yes"}
                  onClick={() => choose(o.code)}
                >
                  <Flag option={o} />
                  <span className="intl3-cn">
                    <span>
                      <Highlight text={o.name} query={query} />
                    </span>
                    {riskTag !== undefined && o.risk ? <small className="intl3-xc">{riskTag}</small> : null}
                  </span>
                  {riskTag !== undefined ? <Currency option={o} /> : null}
                  {o.code === selected.code ? <TickIcon /> : null}
                </button>
              </li>
            </Fragment>
          ))}
        </ul>
        {query && matches.length === 0 ? (
          <p className="intl3-none" role="status">
            {none}
          </p>
        ) : null}
        {note ? <p className="intl3-note">{note}</p> : null}
      </div>
    </div>
  );
}

function Highlight({ text, query }: { text: string; query: string }) {
  const at = query ? text.toLowerCase().indexOf(query) : -1;
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark>{text.slice(at, at + query.length)}</mark>
      {text.slice(at + query.length)}
    </>
  );
}

/** The country's own flag, whole and 4:3. Decorative beside the name unless
 *  the CMS gave it an alt. */
export function Flag({ option }: { option: IntlOption }) {
  return <Image className="intl3-flag" src={option.flagSrc} alt={option.flagAlt ?? ""} width={24} height={18} unoptimized />;
}

function Currency({ option }: { option: IntlOption }) {
  return (
    <small className="intl3-cur" dir="ltr">
      {option.currency}
    </small>
  );
}

function Caret() {
  return (
    <svg className="intl3-caret" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="7" cy="7" r="4.75" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TickIcon() {
  return (
    <svg className="intl3-tick" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
