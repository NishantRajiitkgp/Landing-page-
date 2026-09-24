"use client";

/** The interactive part of `sections/HowWeKnow.tsx`: the two routes, the case
    file that runs for the chosen one, and the evidence strip that names its
    sources.

    - **Routes.** Two `aria-pressed` buttons pick the licence or the degree.
      The case file is keyed by route, so switching remounts it and its 16s
      run starts from the upload, as the canvas's `sc-if` did.
    - **The run** (`.hw-run`, see `app/v2/how.css`). On only while the case is
      on screen, motion is allowed and the reader has not paused it. Off, the
      CSS resting state is the finished case — every step ticked, "Verified" —
      so nothing is ever hidden by a stopped animation. The pause button uses
      the hero's words; this is the page's second long loop, and it is far
      enough from the hero's control to need its own (WCAG 2.2.2).
    - **The specimens** are drawn here, not shipped as markup: the guilloche
      waves are one SVG pattern tile and the rosettes are computed from their
      ring formula, for the reason `HeroPrint` gives — the formula ships, not
      a few kilobytes of path data twice (HTML and flight payload). */

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { Tick } from "@/components/brand/Tick";
import type { SectionsCopy } from "@/lib/copy/sections";
import { tint } from "@/lib/img";

import { Degree, Licence, Seal } from "./HowWeKnowDocs";

type V2 = SectionsCopy["howItWorks"]["v2"];
type RouteId = keyof V2["routes"];
type Labels = { upload: string; read: string; confirm: string; report: string };

/** The route avatar is a fixed 64px box. */
const SIZES_HW_AV = "64px";

const AVATAR: Record<RouteId, string> = {
  licence: "/img/01-rider-bengaluru.jpg",
  degree: "/img/02-nurse-abudhabi.jpg",
};

/** Where each field box sits over its specimen, in the SVG's 470×300 units
 *  (canvas `BOX_L` / `BOX_D`). Converted to percentages of the document. */
const BOXES: Record<RouteId, readonly [number, number, number, number][]> = {
  licence: [[154, 92, 170, 18], [154, 134, 170, 18], [154, 176, 130, 18], [154, 218, 150, 18]],
  degree: [[160, 120, 150, 26], [110, 152, 250, 18], [185, 176, 100, 14], [150, 194, 170, 14]],
};

/** Where the four stage names sit along the case's progress track. */
const STAGES: readonly [keyof Labels, string][] = [["upload", "0%"], ["read", "14%"], ["confirm", "38%"], ["report", "86%"]];
const LOGS = ["l0", "l1", "l2", "l3", "l4", "l5", "l6", "l7"] as const;
const TILES = ["t0", "t1", "t2"] as const;
/** The tiles' meters fill to these; all three reach 100% but the licence's face match. */
const METER: Record<RouteId, readonly string[]> = { licence: ["100%", "98%", "100%"], degree: ["100%", "100%", "100%"] };

function OkMark() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.6 8.4l2.9 2.9 5.9-6.6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** `children` is the run indicator and its pause button, which sit in the
 *  specimen's caption row but belong to the stage, not to one route. */
function CaseFile({ route, t, labels, children }: { route: RouteId; t: V2; labels: Labels; children: ReactNode }) {
  const r = t.routes[route];
  const tags = [r.doc.f1.tag, r.doc.f2.tag, r.doc.f3.tag, r.doc.f4.tag];
  return (
    <div className={`hw2 hw2-${route === "licence" ? "a" : "b"}`}>
      <div className="hw2-bar">
        <span className="hw2-case">{r.caseNo}</span>
        <div className="hw2-track" aria-hidden="true">
          <i className="hw2-fill" />
          {STAGES.map(([k, at], i) => (
            <span key={k} className={`hw2-st hw2-st${i}`} style={{ "--at": at } as React.CSSProperties}>{labels[k]}</span>
          ))}
        </div>
        <span className="hw2-clock"><b>{r.from}</b> → <b>{r.to}</b></span>
      </div>
      <div className="hw2-body">
        <div className="hw2-table">
          <div className="hw2-doc">
            {route === "licence" ? <Licence d={t.routes.licence.doc} /> : <Degree d={t.routes.degree.doc} />}
            {BOXES[route].map(([x, y, w, h], k) => (
              <span
                key={k}
                className={`hw2-box hw2-box${k}`}
                aria-hidden="true"
                style={{ "--x": `${(x / 4.7).toFixed(3)}%`, "--y": `${(y / 3).toFixed(3)}%`, "--w": `${(w / 4.7).toFixed(3)}%`, "--h": `${(h / 3).toFixed(3)}%` } as React.CSSProperties}
              >
                <i>{tags[k]} ✓</i>
              </span>
            ))}
            <span className="hw2-scan" aria-hidden="true" />
            <span className="hw2-br hw2-br1" aria-hidden="true" />
            <span className="hw2-br hw2-br2" aria-hidden="true" />
            <span className="hw2-br hw2-br3" aria-hidden="true" />
            <span className="hw2-br hw2-br4" aria-hidden="true" />
            <Seal id={`hws-${route}`} ring={t.sealRing} />
          </div>
          <div className="hw2-route" aria-hidden="true">
            <span className="hw2-route-l" />
            <span className="hw2-route-dot" />
            <span className="hw2-route-k">→ {r.source}</span>
          </div>
          <div className="hw2-tiles">
            {TILES.map((k, i) => (
              <div key={k} className={`hw2-tile hw2-tile${i}`}>
                <span className="hw2-tile-k">{r.tiles[k].k}</span>
                <b>{r.tiles[k].v}</b>
                <i className="hw2-tile-m" aria-hidden="true"><em style={{ width: METER[route][i] }} /></i>
              </div>
            ))}
          </div>
          <div className="hw2-doc-k">
            <span>{t.specimen}</span>
            {children}
          </div>
        </div>
        <div className="hw2-ledger">
          <div className="hw3-head">
            <span className="hw3-h">{t.custody}</span>
            <span className="hw3-state" aria-hidden="true">
              <span className="hw3-st-run"><span className="hw3-mini" />{t.verifying}</span>
              <span className="hw3-st-done"><OkMark />{t.verified}</span>
            </span>
          </div>
          <ol className="hw3-steps">
            {LOGS.map((k, i) => {
              const l = r.logs[k];
              return (
                <li key={k} className={`hw3-row hw3-r${i}`}>
                  <span className="hw3-orb" aria-hidden="true">
                    <span className="hw3-spin"><i /></span>
                    <span className="hw3-ok"><OkMark /></span>
                  </span>
                  <div className="hw3-tx">
                    <div className="hw3-top">
                      <b>{l.kind}</b>
                      <span className="hw3-who">{l.who}</span>
                      <span className="hw3-time">{l.t}</span>
                    </div>
                    <div className="hw3-what">{l.what}</div>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="hw2-verdict">
            <span className="hw2-v-seal" aria-hidden="true">{t.verified}</span>
            <span className="hw2-v-t">{r.verdict}</span>
            <span className="hw2-v-h">{r.hash}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HowWeKnowStage({
  t,
  labels,
  licenceCap,
  motion,
  caps,
  evLead,
}: {
  t: V2;
  labels: Labels;
  /** The licence route's caption is this band's existing `lede`. */
  licenceCap: string;
  motion: { pause: string; play: string };
  caps: ReactNode;
  evLead: ReactNode;
}) {
  const [route, setRoute] = useState<RouteId>("licence");
  const [paused, setPaused] = useState(false);
  const [live, setLive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // `live` = on screen and motion allowed. It starts false so the server
  // HTML is the finished case; the run begins when the case scrolls in.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let seen = false;
    const sync = () => setLive(seen && !reduce.matches);
    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
      sync();
    }, { threshold: 0.25 });
    io.observe(el);
    reduce.addEventListener("change", sync);
    return () => {
      io.disconnect();
      reduce.removeEventListener("change", sync);
    };
  }, []);

  const run = live && !paused;
  const r = t.routes[route];

  return (
    <div ref={ref} className={run ? "hw-shell hw-run" : "hw-shell"}>
      <div className="hw-switch" role="group" aria-label={t.switchLabel}>
        {(["licence", "degree"] as const).map((id) => {
          const x = t.routes[id];
          return (
            <button key={id} type="button" className={route === id ? "hw-route hw-on" : "hw-route"} onClick={() => setRoute(id)} aria-pressed={route === id}>
              <span className="hw-av ph" style={{ background: tint(AVATAR[id]) }}>
                <Image className="pimg" src={AVATAR[id]} alt="" fill sizes={SIZES_HW_AV} />
              </span>
              <span className="hw-rt">
                <span className="hw-chip"><span className="dot" />{x.chip}</span>
                <span className="hw-who"><b>{x.role}</b><i>{x.city}</i></span>
              </span>
              <span className="hw-play" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 2l7 4-7 4z" fill="currentColor" /></svg>
              </span>
            </button>
          );
        })}
        <div className="hw-cap">
          <p className="hw-cap-p" key={route}>{route === "licence" ? licenceCap : t.routes.degree.cap}</p>
        </div>
      </div>

      <CaseFile key={route} route={route} t={t} labels={labels}>
        <span className="hw2-doc-acts">
          <span className="hw2-live"><i />{t.run}</span>
          <button type="button" className="hw2-motion" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              {paused ? (
                <path d="M2.5 1.5v7l6-3.5z" fill="currentColor" />
              ) : (
                <path d="M2.5 1.5v7M7.5 1.5v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
            <span>{paused ? motion.play : motion.pause}</span>
          </button>
        </span>
      </CaseFile>

      {caps}

      <div className="hw-ev">
        {evLead}
        <div className="hw-ev-r">
          <div className="hw-ev-in" key={route}>
            <div className="hw-ev-t"><Tick /><span>{r.evTitle}</span></div>
            <div className="hw-ev-grid">
              <div className="hw-ev-c"><span>{t.ev.read}</span><b>{r.evRead}</b></div>
              <div className="hw-ev-c"><span>{t.ev.confirmed}</span><b>{r.evConfirmed}</b></div>
              <div className="hw-ev-c"><span>{t.ev.artefact}</span><b>{r.evArtefact}</b></div>
              <div className="hw-ev-c"><span>{t.ev.reviewed}</span><b>{r.evReviewed}</b></div>
            </div>
          </div>
          <div className="hw-seal" aria-hidden="true"><span>{t.verified}</span></div>
        </div>
      </div>
    </div>
  );
}
