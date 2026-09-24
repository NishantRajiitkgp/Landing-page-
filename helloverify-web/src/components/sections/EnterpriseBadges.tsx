"use client";

/** The Employees panel's two workforces as two ID badges on lanyards
    (`sections/Enterprises.tsx`). Replaced two columns of chips on review
    (24 Sep 2026: "this sucks … make it unique"): the checks are the same six
    per workforce, word for word, but they now read as what they are — the
    things that have to clear before someone is issued a badge.

    - **Entrance.** When the panel comes into view the badges drop from the
      rail, the checks tick in order, and a foil seal lands when the last one
      clears, knocking the badge into a swing. Leaving the view re-arms it, so
      picking "Employees" again replays it.
    - **The swing** is a damped pendulum per badge, integrated in one `rAF`
      and written to `style.transform` directly, so it costs no React render.
      Drag a badge to swing it; brushing past with the pointer nudges it.
      On touch only a sideways drag swings it: a vertical one scrolls the
      page (`touch-action: pan-y`), so two badges that fill a phone's width
      do not trap the scroll.
    - **Turning over.** A click that is not a drag turns the badge to its
      back, which carries the workforce's description; the "Turn over" button
      does the same from the keyboard.
    - **Stopping.** The loop runs only while the badges are on screen, and
      "Pause motion" (`BizMotion`) and `prefers-reduced-motion` stop it and
      the entrance outright: the badges then hang still with every check
      ticked, which is also the server-rendered state (no JS, no motion).

    REJECTED: a physics library for two rigid pendulums — ~20 lines of
    semi-implicit Euler does it, and the page-weight budget is tight. */

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";

import { tint } from "@/lib/img";
import { useReducedMotion } from "@/lib/useReducedMotion";

import { useMotionPaused } from "./BizMotion";

/** The badge photo box: 244px wide at the 1440 board, 17vw; on a 390px
 *  phone the same badge is 63vw. */
const SIZES_EN_BADGE = "(max-width: 1080px) 63vw, 17vw";

/** Pendulum constants: ~1.1 Hz natural swing, settling in about 3 s. */
const K = 48;
const DAMP = 1.7;
/** The drop: a stiffer spring on the vertical, from above the rail. */
const KY = 90;
const DAMPY = 11;
const DROP = -420;
/** Keeps a dragged badge inside the panel (the zone clips 40px out). */
const MAX_TILT = 22;
/** Tick cadence (matches the CSS `--i` delays in `enterprises.css`). */
const FIRST_TICK = 0.55;
const TICK_GAP = 0.26;

export type BadgeCol = { t: string; p: string; chips: Record<string, string>; photo: string; tone: "green" | "hivis" };

type Body = { th: number; om: number; y: number; vy: number; drag: boolean; phase: number };

type Phase = "rest" | "armed" | "run";


export function EnterpriseBadges({ cols, turn }: { cols: BadgeCol[]; turn: string }) {
  const paused = useMotionPaused();
  const zone = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const bodies = useRef<Body[]>(cols.map((_, i) => ({ th: 0, om: 0, y: 0, vy: 0, drag: false, phase: i * 2.1 })));
  const [seen, setSeen] = useState<Exclude<Phase, "rest">>("armed");
  const [flipped, setFlipped] = useState<boolean[]>(cols.map(() => false));
  const kick = useRef<number[]>([]);
  // True on the server and through hydration, so the HTML that hydrates is
  // the rest state — every check ticked, badges hanging still.
  const reduce = useReducedMotion();
  const moving = !paused && !reduce;
  const phase: Phase = moving ? seen : "rest";

  // Run in view, re-arm on leaving, so picking "Employees" again replays it.
  useEffect(() => {
    const el = zone.current;
    if (!el || !moving) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio > 0.35) setSeen("run");
        else if (!e.isIntersecting) setSeen("armed");
      },
      { threshold: [0, 0.35] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [moving]);

  // Enter the phase: park the badges above the rail, or drop them and
  // schedule the seal's knock.
  useEffect(() => {
    kick.current.forEach(clearTimeout);
    kick.current = [];
    const top0 = els.current[0]?.offsetTop ?? 0;
    bodies.current.forEach((b, i) => {
      // On a phone the badges wrap one above the other, each on its own
      // rail; the lower one parks as far above the top rail as the first
      // (its offset added), so the zone's clip hides it too and it drops
      // in from behind the first rather than hanging over it.
      const off = (els.current[i]?.offsetTop ?? top0) - top0;
      if (phase === "armed") Object.assign(b, { y: DROP - i * 40 - off, vy: 0, th: (i ? -1 : 1) * 9, om: 0 });
      if (phase === "run") {
        const at = (FIRST_TICK + (cols[i] ? Object.keys(cols[i].chips).length : 6) * TICK_GAP + 0.25 + i * 0.13) * 1000;
        kick.current.push(window.setTimeout(() => (b.om += i ? -46 : 46), at));
      }
    });
    if (phase === "rest") bodies.current.forEach((b) => Object.assign(b, { th: 0, om: 0, y: 0, vy: 0 }));
    return () => kick.current.forEach(clearTimeout);
  }, [phase, cols]);

  // The loop: only while motion is allowed and the badges are on screen.
  useEffect(() => {
    const draw = () =>
      bodies.current.forEach((b, i) => {
        const el = els.current[i];
        if (el) el.style.transform = b.y || b.th ? `translateY(${b.y.toFixed(1)}px) rotate(${b.th.toFixed(2)}deg)` : "";
      });
    const list = bodies.current;
    if (!moving) {
      draw();
      return;
    }
    let raf = 0;
    let last = performance.now();
    let seen = true;
    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
      if (seen && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      for (const b of bodies.current) {
        if (!b.drag) {
          // A breath of air so a settled badge is never quite dead still.
          const breeze = 0.7 * Math.sin(t * 0.9 + b.phase);
          b.om += (-K * (b.th - breeze) - DAMP * b.om) * dt;
          b.th += b.om * dt;
        }
        b.vy += (-KY * b.y - DAMPY * b.vy) * dt;
        b.y += b.vy * dt;
      }
      draw();
      raf = seen ? requestAnimationFrame(tick) : 0;
    };
    if (zone.current) io.observe(zone.current);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      list.forEach((b) => Object.assign(b, { th: 0, om: 0, y: 0, vy: 0, drag: false }));
      draw();
    };
  }, [moving]);

  // Drag to swing; a press that never travels is a click, which turns it.
  const start = useRef<{ x: number; y: number; px: number; py: number; moved: boolean; lastTh: number; lastT: number } | null>(null);
  const onDown = useCallback(
    (i: number) => (e: PointerEvent<HTMLDivElement>) => {
      if ((e.target as Element).closest(".en-bd-turn")) return;
      const el = els.current[i];
      if (!el) return;
      const r = el.getBoundingClientRect();
      start.current = { x: e.clientX, y: e.clientY, px: r.left + r.width / 2, py: r.top, moved: false, lastTh: bodies.current[i].th, lastT: performance.now() };
      el.setPointerCapture(e.pointerId);
    },
    [],
  );
  const onMove = useCallback(
    (i: number) => (e: PointerEvent<HTMLDivElement>) => {
      const s = start.current;
      const b = bodies.current[i];
      if (!s) {
        // Brushing past: the pointer's sideways speed nudges the badge (a
        // positive CSS rotation swings the foot left, hence the minus).
        if (moving && e.pointerType === "mouse") b.om -= Math.max(-30, Math.min(30, e.movementX)) * 0.9;
        return;
      }
      if (!s.moved && Math.hypot(e.clientX - s.x, e.clientY - s.y) < 5) return;
      s.moved = true;
      if (!moving) return;
      b.drag = true;
      const th = Math.max(-MAX_TILT, Math.min(MAX_TILT, (-Math.atan2(e.clientX - s.px, Math.max(40, e.clientY - s.py)) * 180) / Math.PI));
      const now = performance.now();
      b.om = ((th - s.lastTh) / Math.max(1, now - s.lastT)) * 1000 * 0.6;
      b.th = th;
      s.lastTh = th;
      s.lastT = now;
    },
    [moving],
  );
  /** `cancel`: the browser took the touch for a page scroll (the badge is
   *  `touch-action: pan-y`), so a press that never travelled is not a tap. */
  const onUp = useCallback(
    (i: number, cancel = false) => () => {
      const s = start.current;
      start.current = null;
      bodies.current[i].drag = false;
      if (s && !s.moved && !cancel) setFlipped((f) => f.map((v, j) => (j === i ? !v : v)));
    },
    [],
  );

  return (
    <div ref={zone} className={`en-bds en-bds-${phase}`}>
      <span className="en-bds-rail" aria-hidden="true" />
      {cols.map((c, i) => {
        const chips = Object.entries(c.chips);
        return (
          <div
            key={c.t}
            ref={(el) => {
              els.current[i] = el;
            }}
            className={`en-bd en-bd-${c.tone}`}
            onPointerDown={onDown(i)}
            onPointerMove={onMove(i)}
            onPointerUp={onUp(i)}
            onPointerCancel={onUp(i, true)}
          >
            <span className="en-bd-strap" aria-hidden="true" />
            <span className="en-bd-clip" aria-hidden="true" />
            <div className={flipped[i] ? "en-bd-card en-bd-flip" : "en-bd-card"}>
              <div className="en-bd-face en-bd-front">
                <span className="en-bd-slot" aria-hidden="true" />
                <span className="en-bd-ph" style={{ background: tint(c.photo) }}>
                  <Image className="pimg" src={c.photo} alt="" fill sizes={SIZES_EN_BADGE} draggable={false} />
                </span>
                <h4 className="en-bd-t">{c.t}</h4>
                <ul className="en-bd-cks">
                  {chips.map(([k, v], j) => (
                    <li key={k} style={{ ["--i" as string]: j + i * 0.5 }}>
                      <span className="en-bd-ck" aria-hidden="true">
                        <svg viewBox="0 0 14 14">
                          <path d="M3.6 7.3l2.3 2.3 4.6-4.9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {v}
                    </li>
                  ))}
                </ul>
                <span className="en-bd-foot" aria-hidden="true">
                  <span className="en-bd-code" />
                  <span className="en-bd-foil" style={{ ["--i" as string]: chips.length + i * 0.5 }} />
                </span>
              </div>
              <div className="en-bd-face en-bd-back">
                <span className="en-bd-slot" aria-hidden="true" />
                <h4 className="en-bd-bt">{c.t}</h4>
                <p className="en-bd-p">{c.p}</p>
                <span className="en-bd-code en-bd-code-back" aria-hidden="true" />
              </div>
            </div>
            <button
              type="button"
              className={flipped[i] ? "en-bd-turn en-bd-turn-back" : "en-bd-turn"}
              aria-pressed={flipped[i]}
              onClick={() => setFlipped((f) => f.map((v, j) => (j === i ? !v : v)))}
            >
              <svg viewBox="0 0 12 12" aria-hidden="true">
                <path d="M9.8 4.6A4 4 0 1 0 10 7.4M9.8 1.8v2.8H7" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {turn}
            </button>
          </div>
        );
      })}
    </div>
  );
}
