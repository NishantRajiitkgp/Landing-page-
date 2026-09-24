"use client";

/** The interactive shell of the government dossiers (`sections/GovDossiers.tsx`):
    the folder tabs, the pager, and which sheet is on top. The sheets are
    server-rendered and passed in; this only chooses one.

    All four are in the DOM and three are `hidden` — the board mounted only the
    open one. Unhiding replays a sheet's entrance (slide, rows, chain, stamp)
    exactly as a remount would, the tabs' `aria-controls` always resolve, and
    all four dossiers are in the prerendered HTML.

    Keyboard: the WAI-ARIA tabs pattern with automatic activation — one tab
    stop, arrows move and select, Home/End jump. The arrows follow reading
    order, so they swap under `dir="rtl"`. */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export function GovDossierTabs({
  tabs,
  counts,
  panels,
  label,
  prevLabel,
  nextLabel,
}: {
  tabs: string[];
  /** "01 / 04" … — the pager's label for each sheet. */
  counts: string[];
  panels: ReactNode[];
  label: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const [on, setOn] = useState(0);
  const list = useRef<HTMLDivElement>(null);
  const stack = useRef<HTMLDivElement>(null);
  const n = tabs.length;

  // The first sheet's entrance is one-shot and sits well below the fold:
  // held until the stack is on screen. Added from here so it never holds
  // without script.
  useEffect(() => {
    const el = stack.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    el.classList.add("gv-wait");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.remove("gv-wait");
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = useCallback((i: number, focus?: boolean) => {
    const next = (i + n) % n;
    setOn(next);
    if (focus) list.current?.querySelectorAll<HTMLElement>("[role=tab]")[next]?.focus();
  }, [n]);

  const onKey = useCallback((e: KeyboardEvent) => {
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const fwd = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    if (e.key === fwd) go(on + 1, true);
    else if (e.key === back) go(on - 1, true);
    else if (e.key === "Home") go(0, true);
    else if (e.key === "End") go(n - 1, true);
    else return;
    e.preventDefault();
  }, [go, on, n]);

  return (
    <div className="gv-dossier">
      <div className="gv-tabs-row">
        <div className="gv-tabs" role="tablist" aria-label={label} ref={list} onKeyDown={onKey}>
          {tabs.map((t, i) => (
            <button
              key={t}
              type="button"
              role="tab"
              id={`gv-tab-${i}`}
              className={on === i ? "gv-tab gv-tab-on" : "gv-tab"}
              aria-selected={on === i}
              aria-controls={`gv-panel-${i}`}
              tabIndex={on === i ? 0 : -1}
              onClick={() => go(i)}
            >
              <span className="gv-tab-n">{`0${i + 1}`}</span>
              <span className="gv-tab-l">{t}</span>
            </button>
          ))}
        </div>
        <div className="gv-pager">
          <span className="gv-count">{counts[on]}</span>
          <button type="button" className="gv-arrow" onClick={() => go(on - 1)} aria-label={prevLabel}>
            <svg className="gv-flip" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="gv-arrow" onClick={() => go(on + 1)} aria-label={nextLabel}>
            <svg className="gv-flip" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      <div className="gv-stack" ref={stack}>
        <span className="gv-back gv-back-2" aria-hidden="true" />
        <span className="gv-back gv-back-1" aria-hidden="true" />
        <div className="gv-sheet-card">
          {panels.map((p, i) => (
            <div key={i} className="gv-sheet-in" id={`gv-panel-${i}`} role="tabpanel" aria-labelledby={`gv-tab-${i}`} hidden={on !== i}>
              {p}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** The immigration dossier's "Select Authority" — the old site's dropdown,
 *  a real disclosure menu now. The links are server-rendered and passed in.
 *  Closes on Escape (returning focus to the button) and on any click
 *  outside it. */
export function GovAuthorityMenu({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  const onKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      setOpen(false);
      btn.current?.focus();
    }
  }, [open]);

  return (
    <div className="gv-sel" ref={box} onKeyDown={onKey}>
      <button
        ref={btn}
        type="button"
        className="gv-sel-btn"
        aria-expanded={open}
        aria-controls="gv-sel-menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="gv-sel-ic" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 6.5L8 3l6 3.5M3 7v5M6.3 7v5M9.7 7v5M13 7v5M2 13.5h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>{label}</span>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div id="gv-sel-menu" className={open ? "gv-sel-menu gv-sel-open" : "gv-sel-menu"}>
        {children}
      </div>
    </div>
  );
}
