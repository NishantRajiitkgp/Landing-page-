"use client";

/** The interactive part of `sections/OneInEight.tsx`: the evidence table, its
    UV lamp, and the claimed-vs-verified comparison under it. One island
    because all three read the same state — which certificates are checked,
    whether the forgery has been found, and which side of the comparison is
    showing (the canvas's `fraudVals()`).

    - **Checking.** Clicking a genuine certificate stamps it verified; clicking
      the forgery (or "Show me the forgery") refers it, stamps the other seven,
      and turns the comparison to "Verified". The status line is a polite live
      region, so the count is announced as it changes.
    - **The lamp.** Pointer position is written to `--mx`/`--my`/`--uv` through
      CSSOM on the table, as `HeroStage` does, so moving the lamp costs no
      render. It is a pointer flourish; the keyboard path to the same finding
      is the reveal button, and every certificate is a real `<button>`.
    - **No loop.** Nothing here animates for longer than a stamp landing, so
      there is nothing to pause (WCAG 2.2.2). Every resting state is its own
      end state in CSS, so a stamp that never animates still shows.

    The UV rosettes are drawn from their formula here rather than shipped as
    path data, for the reason `HeroPrint` gives. */

import { useCallback, useState, type MouseEvent } from "react";

import { Tick } from "@/components/brand/Tick";
import type { SectionsCopy } from "@/lib/copy/sections";
import { closedPolyline, polarRing } from "@/lib/svgPath";

type T = SectionsCopy["oneInEight"];
type CertId = keyof T["certs"];

const ORDER: CertId[] = ["aldermoor", "kestrel", "meridia", "lindenfield", "harbourline", "westmarch", "crestvale", "aurelian"];
/** Application 06 — the one the comparison under the table is about. */
const FORGED: CertId = "westmarch";

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

function Cross() {
  return (
    <svg className="ff-x" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function OneInEightTable({ t }: { t: T }) {
  const [checked, setChecked] = useState<CertId[]>([]);
  const [found, setFound] = useState(false);
  const [verified, setVerified] = useState(false);

  const pick = (id: CertId) => {
    if (id === FORGED) {
      setFound(true);
      setVerified(true);
    } else if (!checked.includes(id)) {
      setChecked([...checked, id]);
    }
  };
  const reveal = () => {
    if (found) {
      setFound(false);
      setChecked([]);
      setVerified(false);
    } else {
      setFound(true);
      setVerified(true);
    }
  };

  const onLamp = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const table = e.currentTarget;
    const stage = table.querySelector<HTMLElement>(".ff-stage");
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    const k = r.width ? stage.offsetWidth / r.width : 1;
    table.style.setProperty("--mx", `${Math.round((e.clientX - r.left) * k)}px`);
    table.style.setProperty("--my", `${Math.round((e.clientY - r.top) * k)}px`);
    table.style.setProperty("--uv", e.clientY >= r.top && e.clientY <= r.bottom ? "1" : "0");
  }, []);
  const offLamp = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--uv", "0");
  }, []);

  const c = t.compare;

  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
        <defs>
          <path id="ff-r1" d={ring(44, 7, 20)} />
          <path id="ff-r2" d={ring(24, 5, 12)} />
        </defs>
      </svg>

      <div className="ff-table" onMouseMove={onLamp} onMouseLeave={offLamp}>
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

      <div className={found ? "ff-compare ff-found" : "ff-compare"}>
        <div className="ff-cmp-l">
          <div className="ff-big">
            <Face id={FORGED} t={t} />
            <span className="ff-ring ff-ring-name" aria-hidden="true" />
            <span className="ff-ring ff-ring-seal" aria-hidden="true" />
            <span className="ff-note ff-note-1" aria-hidden="true">{c.notes.template}</span>
            <span className="ff-note ff-note-2" aria-hidden="true">{c.notes.seal}</span>
          </div>
        </div>
        <div className="ff-cmp-r">
          <div className="ff-cmp-top">
            <span className="k">{c.app}</span>
            <div className="ff-seg" role="group" aria-label={c.seg}>
              <button type="button" className={verified ? "ff-seg-b" : "ff-seg-b ff-seg-on"} onClick={() => setVerified(false)} aria-pressed={!verified}>
                {c.claimed}
              </button>
              <button type="button" className={verified ? "ff-seg-b ff-seg-on" : "ff-seg-b"} onClick={() => setVerified(true)} aria-pressed={verified}>
                {c.verified}
              </button>
            </div>
          </div>
          <div className="ff-ledger-box">
            {verified ? (
              <div className="ff-ledger ff-ledger-in" key="ver">
                {(["template", "institution", "registrar"] as const).map((k) => (
                  <div className="ff-lr ff-bad" key={k}>
                    <span>{c.result[k].l}</span>
                    <b>{c.result[k].v}</b>
                    <Cross />
                  </div>
                ))}
                <div className="ff-lr">
                  <span>{c.result.identity.l}</span>
                  <b>{c.result.identity.v}</b>
                  <Tick />
                </div>
                <div className="ff-verdict">
                  <span className="ff-refdot" />
                  <span>{c.referredVerdict}</span>
                </div>
              </div>
            ) : (
              <div className="ff-ledger ff-ledger-in" key="claim">
                {(["degree", "institution", "year", "by"] as const).map((k) => (
                  <div className="ff-lr" key={k}>
                    <span>{c.claim[k].l}</span>
                    <b>{c.claim[k].v}</b>
                    <Tick tone="muted" />
                  </div>
                ))}
                <div className="ff-verdict ff-verdict-claim">
                  <span className="dot" />
                  <span>{c.asSubmitted}</span>
                </div>
              </div>
            )}
          </div>
          <p className="ff-mill">{c.mill}</p>
        </div>
      </div>
    </>
  );
}
