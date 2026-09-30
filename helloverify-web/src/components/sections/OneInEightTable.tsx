"use client";

/** The interactive part of `sections/OneInEight.tsx`: the evidence table and
    its UV lamp. One island because the documents, the status line, the
    reveal button and the case file read the same state — which documents
    are checked, and whose case file is open.

    - **Checking.** Every document on the table is forged, one trick each.
      Clicking one flags it and opens its case file below; "Show me every
      forgery" flags all eight and opens the first. The status line is a
      polite live region, so the count is announced as it changes.
    - **The lamp.** Pointer position is written to `--mx`/`--my`/`--uv` through
      CSSOM on the table, as `HeroStage` does, so moving the lamp costs no
      render. It is a pointer flourish; the keyboard path to the same finding
      is the case file, and every document is a real `<button>`.
    - **Touch.** A finger has no hover, and a lamp dragged by one would fight
      the page scroll, so a tap puts the lamp on the document it checks for
      `HOLD` ms, then lifts it to show the stamp beneath. Pointer events
      rather than mouse events: a tap's compatibility `mousemove` would
      otherwise park the lamp where the finger was, with no `mouseleave` to
      ever put it out.
    - **No loop.** Nothing here animates for longer than a stamp landing, so
      there is nothing to pause (WCAG 2.2.2). Every resting state is its own
      end state in CSS, so a stamp that never animates still shows.

    The documents are synthetic scans, each with a UV photograph of the same
    sheet at the same size (`./OneInEightDocs`). The UV layer mirrors the
    table cell for cell and is magnified about the pointer (`--ff-z`, 1.5×
    under a mouse), so the lamp shows the sheet under it, closer, with its
    callouts. */

import { useEffect, useRef, useState, type PointerEvent } from "react";

import type { SectionsCopy } from "@/lib/copy/sections";

import { OneInEightCase } from "./OneInEightCase";
import { Caption, Doc, ORDER, Uv, type CertId } from "./OneInEightDocs";

type T = SectionsCopy["oneInEight"];

/** How long a tap holds the lamp over a document: long enough to read its
 *  callouts, short enough that the stamp follows. */
const HOLD = 1800;

/** Puts the lamp at a viewport point, in the stage's unscaled pixels. */
function lampAt(table: HTMLElement, x: number, y: number) {
  const stage = table.querySelector<HTMLElement>(".ff-stage");
  if (!stage) return;
  const r = stage.getBoundingClientRect();
  const k = r.width ? stage.offsetWidth / r.width : 1;
  table.style.setProperty("--mx", `${Math.round((x - r.left) * k)}px`);
  table.style.setProperty("--my", `${Math.round((y - r.top) * k)}px`);
  table.style.setProperty("--uv", y >= r.top && y <= r.bottom ? "1" : "0");
}

export function OneInEightTable({ t }: { t: T }) {
  const [checked, setChecked] = useState<CertId[]>([]);
  const [open, setOpen] = useState<CertId | null>(null);
  const all = checked.length === ORDER.length;
  const table = useRef<HTMLDivElement>(null);
  /** Whether the last press was a finger (set on pointerdown, before click). */
  const touch = useRef(false);
  const lift = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(lift.current), []);
  /** The case file opens below the table; bring its top into view when it
   *  opens or changes, so the finding is not left off-screen. */
  const caseFile = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    caseFile.current?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "nearest" });
  }, [open]);

  const shine = (id: CertId) => {
    const el = table.current;
    const cert = el?.querySelectorAll<HTMLElement>(".ff-cert")[ORDER.indexOf(id)];
    if (!el || !cert || !touch.current) return;
    const c = cert.getBoundingClientRect();
    lampAt(el, c.left + c.width / 2, c.top + c.height / 2);
    clearTimeout(lift.current);
    lift.current = setTimeout(() => el.style.setProperty("--uv", "0"), HOLD);
  };
  /** Flags a document and opens its case file — from the table or from the
   *  case file's own previous / next. */
  const pick = (id: CertId) => {
    shine(id);
    setChecked((c) => (c.includes(id) ? c : [...c, id]));
    setOpen(id);
  };
  const reveal = () => {
    if (all) {
      clearTimeout(lift.current);
      table.current?.style.setProperty("--uv", "0");
      setChecked([]);
      setOpen(null);
    } else {
      setChecked(ORDER);
      setOpen(open ?? ORDER[0]);
    }
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    touch.current = e.pointerType === "touch";
  };
  const onLamp = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "touch") lampAt(e.currentTarget, e.clientX, e.clientY);
  };
  const offLamp = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "touch") e.currentTarget.style.setProperty("--uv", "0");
  };

  return (
    <div ref={table} className="ff-table" onPointerDown={onDown} onPointerMove={onLamp} onPointerLeave={offLamp}>
      <div className="ff-bar">
        <span className="ff-bar-k">
          <span className="ff-uvdot" />
          {t.bar}
        </span>
        <span className="ff-status" aria-live="polite">
          {all ? t.found : `${checked.length} ${t.checked} · ${checked.length} ${t.flagged}`}
        </span>
      </div>
      <div className="ff-stage">
        <div className="ff-grid">
          {ORDER.map((id, i) => (
            <button
              key={id}
              type="button"
              className={checked.includes(id) ? "ff-cert is-ref" : "ff-cert"}
              onClick={() => pick(id)}
              aria-pressed={open === id}
              aria-label={`${t.checkCert} ${t.certs[id].kind}, ${t.certs[id].where}`}
            >
              <Doc id={id}>
                <span className="ff-ref" aria-hidden="true">
                  <span>{t.referred}</span>
                  <i>{t.notVerified}</i>
                </span>
              </Doc>
              <Caption id={id} i={i} t={t} />
            </button>
          ))}
        </div>
        <div className="ff-uvlayer" aria-hidden="true">
          <div className="ff-uvzoom">
            <div className="ff-grid ff-grid-uv">
              {ORDER.map((id, i) => (
                <Uv key={id} id={id} i={i} t={t} />
              ))}
            </div>
          </div>
        </div>
        <div className="ff-loupe" aria-hidden="true">
          <span className="ff-loupe-k">{t.uv.loupe}</span>
        </div>
      </div>
      <div ref={caseFile}>
        {open && <OneInEightCase key={open} id={open} c={t.case} caption={`${t.certs[open].kind}, ${t.certs[open].where}`} onPick={pick} />}
      </div>
      <div className="ff-foot-bar">
        <p className="ff-naked">
          {t.nakedA} <em>{t.nakedEm}</em>
        </p>
        <div className="ff-foot-acts">
          <span className="ff-hint">{t.hint}</span>
          <button type="button" className="btn btn-line btn-sm ff-reveal" onClick={reveal}>
            {all ? t.reset : t.reveal}
          </button>
        </div>
      </div>
    </div>
  );
}
