"use client";

/** One desktop mega-menu trigger and its panel (`chrome/SiteNav.tsx`).

    The panel's contents are server-rendered and passed in as `children`;
    this component owns only the open state, so the client payload is the
    state machine and not the menu.

    - A mouse opens it by hovering (`pages.css`, `@media (hover: hover)`),
      with no script involved. A click, a tap or Enter/Space on the button
      toggles it as well, which is the only way in on a touch screen wider
      than the 1080px burger breakpoint (a landscape tablet).
    - Escape closes it and returns focus to the button. It also sets
      `is-shut`, which stops a pointer still resting on the menu from
      holding it open by hover; the pointer leaving clears it.
    - Focus leaving the menu, or a press anywhere outside it, closes it.
    - `aria-expanded` reports the scripted state. Hover is a pointer
      convenience that screen readers never see, which is the usual
      disclosure-navigation pattern (APG "Disclosure Navigation Menu") and
      why the panel is a plain list of links, not `role="menu"`. */

import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent, type ReactNode } from "react";

export function NavDropdown({
  label,
  size,
  children,
}: {
  label: string;
  /** `wide` spans the bar's content box; `mid` and `narrow` hang from the trigger. */
  size: "wide" | "mid" | "narrow";
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [shut, setShut] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Escape") return;
    setOpen(false);
    setShut(true);
    btn.current?.focus();
  };

  const onBlur = (e: FocusEvent) => {
    if (!root.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
  };

  return (
    <div
      ref={root}
      className={`nv-dd nv-${size}${open ? " is-open" : ""}${shut ? " is-shut" : ""}`}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        setShut(false);
        setOpen(false);
      }}
    >
      <button
        ref={btn}
        type="button"
        className="nv-btn"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          setShut(open);
          setOpen(!open);
        }}
      >
        {label}
        <svg className="nv-car" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M2 3.75L5 6.75l3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="nv-pan" id={id}>
        <div className="nv-card">{children}</div>
      </div>
    </div>
  );
}
