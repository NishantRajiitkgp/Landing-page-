"use client";

/** The trust perimeter (`sections/Enterprises.tsx`): three rings drawn on a
    canvas as braided guilloche rope, the three pills that pick one, and the
    panel each pill shows.

    THE RINGS ARE A CANVAS, NOT SVG. The board tried SVG first (static
    circles with a dash-draw) and replaced it: each ring is five strands of
    600 samples whose width swells under a travelling signal, a pointer lean
    and outgoing ripples, recomputed every frame. As SVG that is 18 paths of
    ~600 points re-serialised 60 times a second; a 640×640 canvas redraws the
    same in well under a millisecond and ships ~3 KB of formula instead of
    path data (the hero's `HeroPrint` made the same trade for the same reason).
    The formula and one frame of drawing are `lib/enWave.ts`; this file is
    the loop, the pointer and the markup.

    COLOUR COMES FROM THE PALETTE AT RUNTIME. Canvas 2D cannot take
    `var(--green)`, so the four tokens it paints with are read once from
    computed style and mixed in JS — no hex in this file, and a re-theme of
    the tokens re-themes the rings.

    THE LOOP ONLY RUNS WHEN IT CAN BE SEEN. An IntersectionObserver stops the
    `rAF` off screen; "Pause motion" (`BizMotion.tsx`) and
    `prefers-reduced-motion: reduce` stop it outright. Stopped, the rings are
    drawn once per change (selection, hover) with every eased value snapped
    to its target, so the picture still answers the pills — it just does not
    move between answers.

    The panels are server-rendered and passed in; all three stay in the HTML
    (`hidden` on two) so the copy is there without JavaScript and for search,
    where the board's `sc-if` rendered only one. Un-hiding a panel restarts
    its CSS entrance, which is the board's per-switch animation for free. */

import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from "react";

import { PILL_TOP, SIZE, drawWave, newSim, parseColour, ringAt, type Palette } from "@/lib/enWave";

import { useMotionPaused } from "./BizMotion";

export function EnterprisePerimeter({
  select,
  core,
  stop,
  rings,
  panels,
}: {
  select: string;
  core: string;
  stop: ReactNode;
  rings: string[];
  panels: ReactNode[];
}) {
  const [ent, setEnt] = useState(0);
  const paused = useMotionPaused();
  const cvRef = useRef<HTMLCanvasElement>(null);
  const sim = useRef(newSim());
  const entRef = useRef(0);
  /** Redraw-once hook for the stopped states, set by the effect below. */
  const still = useRef<() => void>(() => {});
  /** Re-decide run/stop after the pause button; set by the effect below. */
  const syncRef = useRef<() => void>(() => {});
  const pausedRef = useRef(paused);

  useEffect(() => {
    entRef.current = ent;
    still.current();
  }, [ent]);

  useEffect(() => {
    const cv = cvRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = SIZE * dpr;
    cv.height = SIZE * dpr;

    const cs = getComputedStyle(cv);
    const pal: Palette = {
      INK: parseColour(cs.getPropertyValue("--ink")),
      GREEN: parseColour(cs.getPropertyValue("--green")),
      MINT: parseColour(cs.getPropertyValue("--green-light")),
      WHITE: parseColour(cs.getPropertyValue("--white")),
    };

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduce = mq.matches;
    let visible = false;
    let raf = 0;
    const S = sim.current;

    const draw = (ts: number, calm: boolean) => drawWave(ctx, dpr, S, entRef.current, ts, calm, pal);

    const stopped = () => reduce || pausedRef.current || !visible;
    const loop = (t: number) => {
      S.ts = t / 1000;
      draw(S.ts, false);
      raf = requestAnimationFrame(loop);
    };
    const sync = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (stopped()) draw(reduce ? 0 : S.ts, true);
      else raf = requestAnimationFrame(loop);
    };
    still.current = () => {
      if (!raf) draw(reduce ? 0 : S.ts, true);
    };
    syncRef.current = sync;

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) visible = e.isIntersecting;
      sync();
    });
    io.observe(cv);
    const onMq = () => {
      reduce = mq.matches;
      sync();
    };
    mq.addEventListener("change", onMq);
    draw(0, true);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      mq.removeEventListener("change", onMq);
      still.current = () => {};
      syncRef.current = () => {};
    };
  }, []);

  useEffect(() => {
    pausedRef.current = paused;
    syncRef.current();
  }, [paused]);

  const local = (e: PointerEvent | MouseEvent) => {
    const r = cvRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) * SIZE) / (r.width || SIZE),
      y: ((e.clientY - r.top) * SIZE) / (r.height || SIZE),
    };
  };

  const onMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (!cvRef.current) return;
    const p = local(e);
    const S = sim.current;
    const hov = ringAt(p.x, p.y);
    S.P.x = p.x;
    S.P.y = p.y;
    S.P.in = true;
    const changed = hov !== S.hov;
    S.hov = hov;
    const onBtn = (e.target as Element).closest?.("button");
    e.currentTarget.style.cursor = hov >= 0 && hov !== entRef.current && !onBtn ? "pointer" : "";
    if (changed) still.current();
  }, []);

  const onLeave = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const S = sim.current;
    S.P.in = false;
    S.hov = -1;
    e.currentTarget.style.cursor = "";
    still.current();
  }, []);

  /** A click on a ring picks it, as its pill does. Pointer-only by design:
   *  the pills are the keyboard path to the same three choices. */
  const onClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!cvRef.current || (e.target as Element).closest?.("button")) return;
    const p = local(e);
    const hov = ringAt(p.x, p.y);
    if (hov >= 0) setEnt(hov);
  }, []);

  return (
    <div className="en-main">
      <div className="en-left">
        <div className="en-sel k">{select}</div>
        <div className="en-per" onPointerMove={onMove} onPointerLeave={onLeave} onClick={onClick}>
          <canvas ref={cvRef} className="en-wave" width={SIZE} height={SIZE} aria-hidden="true" />
          <div className="en-core" aria-hidden="true">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 21V7l8-4 8 4v14M9 21v-5h6v5M8 10h.01M12 10h.01M16 10h.01M8 13.5h.01M12 13.5h.01M16 13.5h.01"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{core}</span>
          </div>
          {rings.map((label, i) => (
            <button
              key={label}
              type="button"
              className={i === ent ? "en-rb en-rb-on" : "en-rb"}
              style={{ top: PILL_TOP[i] }}
              aria-pressed={i === ent}
              aria-controls={`en-panel-${i}`}
              onClick={() => setEnt(i)}
            >
              <span className="en-rb-n">{String(i + 1).padStart(2, "0")}</span>
              {label}
            </button>
          ))}
        </div>
        <p className="en-stop">{stop}</p>
      </div>
      <div className="en-panels">
        {panels.map((p, i) => (
          <div key={i} id={`en-panel-${i}`} hidden={i !== ent}>
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}
