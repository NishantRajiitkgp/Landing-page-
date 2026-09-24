"use client";

/** The interactive part of `sections/OneInEight.tsx`: the evidence table and
    its UV lamp. One island because the certificates, the status line and the
    reveal button read the same state — which certificates are checked and
    whether the forgery has been found (the canvas's `fraudVals()`). The
    canvas's claimed-vs-verified card under the table was dropped on review
    (24 Sep 2026): it retold what the table already shows.

    - **Checking.** Clicking a genuine certificate stamps it verified; clicking
      the forgery (or "Show me the forgery") refers it and stamps the other
      seven. The status line is a polite live region, so the count is
      announced as it changes.
    - **The lamp.** Pointer position is written to `--mx`/`--my`/`--uv` through
      CSSOM on the table, as `HeroStage` does, so moving the lamp costs no
      render. It is a pointer flourish; the keyboard path to the same finding
      is the reveal button, and every certificate is a real `<button>`.
    - **Touch.** A finger has no hover, and a lamp dragged by one would fight
      the page scroll, so a tap puts the lamp on the certificate it checks
      (the reveal button, on the forgery) for `HOLD` ms, then lifts it to show
      the stamp beneath. Pointer events rather than mouse events: a tap's
      compatibility `mousemove` would otherwise park the lamp where the finger
      was, with no `mouseleave` to ever put it out.
    - **No loop.** Nothing here animates for longer than a stamp landing, so
      there is nothing to pause (WCAG 2.2.2). Every resting state is its own
      end state in CSS, so a stamp that never animates still shows.

    The UV rosettes are drawn from their formula here rather than shipped as
    path data, for the reason `HeroPrint` gives. */

import { useEffect, useRef, useState, type PointerEvent } from "react";

import type { SectionsCopy } from "@/lib/copy/sections";
import { closedPolyline, polarRing } from "@/lib/svgPath";

type T = SectionsCopy["oneInEight"];
type CertId = keyof T["certs"];

const ORDER: CertId[] = ["aldermoor", "kestrel", "meridia", "lindenfield", "harbourline", "westmarch", "crestvale", "aurelian"];
/** Application 06, the forgery. */
const FORGED: CertId = "westmarch";
/** How long a tap holds the lamp over a certificate: long enough to read
 *  "no UV features" on the forgery, short enough that the stamp follows. */
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

/** A guilloche ring: radius `R` modulated by `A` over `n` lobes, 8 points a lobe
 *  (canvas `ring()`, `scripts/assemble_fraud.py`). */
function ring(R: number, A: number, n: number): string {
  return closedPolyline(polarRing(n * 8, (a) => R + A * Math.sin(n * a)));
}

function Crest() {
  return (
    <svg className="ff-crest" viewBox="0 0 40 44" aria-hidden="true" focusable="false">
      <path d="M20 2 L36 8 V22 C36 32 28 39 20 42 C12 39 4 32 4 22 V8 Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M20 9 V35 M10 18 H30" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="20" cy="18" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function Face({ id, t }: { id: CertId; t: T }) {
  const c = t.certs[id];
  return (
    <span className={id === FORGED ? "ff-face ff-forged" : "ff-face"}>
      <span className="ff-inner" />
      <Crest />
      <span className="ff-inst">{c.inst}</span>
      <span className="ff-cer">{t.certify}</span>
      <span className="ff-name">{c.name}</span>
      <span className="ff-deg">{c.deg}</span>
      <span className="ff-foot">
        <svg className="ff-sig" viewBox="0 0 80 22" aria-hidden="true" focusable="false">
          <path d="M2 16 C10 4, 14 20, 22 10 S34 4, 38 14 S52 20, 58 8 S70 12, 78 6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <span className="ff-seal" />
        <span className="ff-yr">{c.yr}</span>
      </span>
    </span>
  );
}

function Uv({ id, t }: { id: CertId; t: T }) {
  if (id === FORGED) {
    return (
      <span className="ff-uvc ff-uvc-bad">
        <span className="ff-uv-blank">{t.uv.none}</span>
      </span>
    );
  }
  return (
    <span className="ff-uvc">
      <svg className="ff-uv-ros" viewBox="-60 -60 120 120" aria-hidden="true" focusable="false">
        <use href="#ff-r1" />
        <use href="#ff-r1" transform="rotate(6.7)" />
        <use href="#ff-r1" transform="rotate(13.4)" />
        <use href="#ff-r2" />
      </svg>
      <span className="ff-uv-mt ff-uv-mt-t">{`${t.uv.top} ${t.certs[id].inst.toUpperCase()} ·`}</span>
      <span className="ff-uv-mt ff-uv-mt-b">{t.uv.bottom}</span>
      <svg className="ff-uv-seal" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
        <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 20.5l5.5 5.5 11-12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg className="ff-uv-fib" viewBox="0 0 100 70" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M8 12 q4 -3 9 1 M70 9 q3 4 8 2 M40 58 q5 -2 7 3 M86 50 q-3 4 -1 8 M20 44 q4 3 2 7 M58 30 q4 -3 8 0" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function OneInEightTable({ t }: { t: T }) {
  const [checked, setChecked] = useState<CertId[]>([]);
  const [found, setFound] = useState(false);
  const table = useRef<HTMLDivElement>(null);
  /** Whether the last press was a finger (set on pointerdown, before click). */
  const touch = useRef(false);
  const lift = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(lift.current), []);

  const shine = (id: CertId) => {
    const el = table.current;
    const cert = el?.querySelectorAll<HTMLElement>(".ff-cert")[ORDER.indexOf(id)];
    if (!el || !cert || !touch.current) return;
    const c = cert.getBoundingClientRect();
    lampAt(el, c.left + c.width / 2, c.top + c.height / 2);
    clearTimeout(lift.current);
    lift.current = setTimeout(() => el.style.setProperty("--uv", "0"), HOLD);
  };
  const pick = (id: CertId) => {
    shine(id);
    if (id === FORGED) {
      setFound(true);
    } else if (!checked.includes(id)) {
      setChecked([...checked, id]);
    }
  };
  const reveal = () => {
    if (found) {
      clearTimeout(lift.current);
      table.current?.style.setProperty("--uv", "0");
      setFound(false);
      setChecked([]);
    } else {
      shine(FORGED);
      setFound(true);
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
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
        <defs>
          <path id="ff-r1" d={ring(44, 7, 20)} />
          <path id="ff-r2" d={ring(24, 5, 12)} />
        </defs>
      </svg>

      <div ref={table} className="ff-table" onPointerDown={onDown} onPointerMove={onLamp} onPointerLeave={offLamp}>
        <div className="ff-bar">
          <span className="ff-bar-k">
            <span className="ff-uvdot" />
            {t.bar}
          </span>
          <span className="ff-status" aria-live="polite">
            {found ? t.found : `${checked.length} ${t.checked}`}
          </span>
        </div>
        <div className="ff-stage">
          <div className="ff-grid">
            {ORDER.map((id) => {
              const state = id === FORGED ? (found ? " is-ref" : "") : found || checked.includes(id) ? " is-ok" : "";
              return (
                <button
                  key={id}
                  type="button"
                  className={`ff-cert${state}`}
                  onClick={() => pick(id)}
                  aria-label={`${t.checkCert} ${t.certs[id].inst}`}
                >
                  <Face id={id} t={t} />
                  <span className="ff-ok" aria-hidden="true">
                    <svg viewBox="0 0 60 60">
                      <circle cx="30" cy="30" r="26" fill="none" stroke="#1B6B4A" strokeWidth="2.4" />
                      <circle cx="30" cy="30" r="21" fill="none" stroke="#1B6B4A" strokeWidth="1" />
                      <path d="M19 30.5l7.5 7.5 15-16" fill="none" stroke="#1B6B4A" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {id === FORGED && (
                    <span className="ff-ref" aria-hidden="true">
                      <span>{t.referred}</span>
                      <i>{t.notVerified}</i>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="ff-uvlayer" aria-hidden="true">
            <div className="ff-grid ff-grid-uv">
              {ORDER.map((id) => (
                <Uv key={id} id={id} t={t} />
              ))}
            </div>
          </div>
          <div className="ff-loupe" aria-hidden="true">
            <span className="ff-loupe-k">{t.uv.loupe}</span>
          </div>
        </div>
        <div className="ff-foot-bar">
          <p className="ff-naked">
            {t.nakedA} <em>{t.nakedEm}</em>
          </p>
          <div className="ff-foot-acts">
            <span className="ff-hint">{t.hint}</span>
            <button type="button" className="btn btn-line btn-sm ff-reveal" onClick={reveal}>
              {found ? t.reset : t.reveal}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
