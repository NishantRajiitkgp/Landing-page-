"use client";

/** The interactive globe under "Verified in 120 countries." (homepage v2,
    desktop). `sections/Globe.tsx` renders the words; this owns the canvas,
    the pins and the card.

    1. **The orb** is drawn into a 1200×720 canvas by `lib/globeDraw`, and
       turned by `lib/globeEngine` — spin, drag, inertia, the ease toward a
       chosen country — in a loop that runs only while something moves and
       the stage is on screen. The land points load on first approach.
    2. **The pins are HTML buttons**, not canvas marks, so each is a real,
       named, keyboard-operable control. Their positions are written as
       transforms through CSSOM each frame — no React render per frame.
       Focusing one turns the globe to face it, so a pin on the far side is
       never focused while invisible.
    3. **Motion.** The spin slider's "Still" is the pause (WCAG 2.2.2): it stops
       the spin and freezes the pulses. `prefers-reduced-motion: reduce` does
       the same and makes a chosen country snap into view instead of
       swinging there; dragging still works, since the user drives it.

    REJECTED: drawing the pins on the canvas and hit-testing clicks. It
    matches the board pixel for pixel and gives a keyboard user nothing. */

import { useEffect, useId, useRef, useState, type PointerEvent, type ReactNode } from "react";

import { H, W } from "@/lib/globeDraw";
import { GlobeEngine, START, hudText } from "@/lib/globeEngine";

export type GlobePin = {
  id: string;
  name: string;
  /** Flag drawing (the `<svg>`'s children), or `code` when there is none. */
  flag?: ReactNode;
  code?: string;
  lat: number;
  lon: number;
  role: string;
  head: string;
  rows: { k: string; v: string }[];
  coord: string;
};

export type GlobeLabels = {
  canvas: string;
  hud: string;
  compass: { n: string; s: string; e: string; w: string };
  legend: { hq: string; office: string; route: string };
  spin: string;
  speeds: { still: string; slow: string; steady: string; fast: string };
  close: string;
};

function Badge({ pin, lg = false }: { pin: GlobePin; lg?: boolean }) {
  const cls = lg ? "gb-fl gb-fl-lg" : "gb-fl";
  if (!pin.flag) return <span className={`${cls} gb-code`} aria-hidden="true">{pin.code}</span>;
  return (
    <span className={`fl ${cls}`} aria-hidden="true">
      <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice">{pin.flag}</svg>
    </span>
  );
}

export function GlobeStage({ pins, labels, world }: { pins: GlobePin[]; labels: GlobeLabels; world: ReactNode }) {
  const [sel, setSel] = useState(-1);
  const [speed, setSpeed] = useState(35);
  const speedId = useId();
  const panelId = useId();

  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hudRef = useRef<HTMLElement>(null);
  const pinEls = useRef<(HTMLButtonElement | null)[]>([]);
  const eng = useRef<GlobeEngine | null>(null);

  useEffect(() => {
    if (!stageRef.current || !canvasRef.current) return;
    const e = new GlobeEngine(stageRef.current, canvasRef.current, pinEls.current, hudRef.current, pins.map((p) => [p.lat, p.lon]), labels.compass);
    eng.current = e;
    return () => {
      e.destroy();
      eng.current = null;
    };
  }, [pins, labels.compass]);

  const pick = (i: number) => {
    const e = eng.current;
    if (e) { e.sel = i; e.face(i); }
    setSel(i);
  };

  const close = () => {
    const was = sel;
    const e = eng.current;
    if (e) { e.sel = -1; e.release(); }
    setSel(-1);
    // The close button unmounts with the card; hand focus back to the pin.
    if (was >= 0) pinEls.current[was]?.focus();
  };

  const onDown = (ev: PointerEvent<HTMLDivElement>) => {
    if ((ev.target as Element).closest(".gb-pin, .gb-panel, .gb-speed")) return;
    eng.current?.down(ev.clientX, ev.clientY);
    ev.currentTarget.setPointerCapture?.(ev.pointerId);
  };

  const onMove = (ev: PointerEvent<HTMLDivElement>) => {
    const rect = ev.currentTarget.getBoundingClientRect();
    eng.current?.move(ev.clientX, ev.clientY, rect.width ? ev.currentTarget.offsetWidth / rect.width : 1);
  };

  const speedLabel = speed === 0 ? labels.speeds.still : speed < 40 ? labels.speeds.slow : speed < 75 ? labels.speeds.steady : labels.speeds.fast;
  const p = sel >= 0 ? pins[sel] : null;

  return (
    <div
      ref={stageRef}
      className={speed === 0 ? "gb-stage gb-still" : "gb-stage"}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={() => eng.current?.up()}
      onPointerCancel={() => eng.current?.up()}
      onKeyDown={(ev) => { if (ev.key === "Escape" && sel >= 0) close(); }}
    >
      <canvas ref={canvasRef} className="gb-canvas" width={W} height={H} role="img" aria-label={labels.canvas} />
      <div className="gb-pins">
        {pins.map((pin, i) => (
          <button
            key={pin.id}
            ref={(el) => { pinEls.current[i] = el; }}
            type="button"
            className={sel === i ? "gb-pin gb-on" : "gb-pin"}
            aria-label={pin.name}
            aria-pressed={sel === i}
            aria-controls={panelId}
            onClick={() => pick(i)}
            onFocus={() => eng.current?.face(i)}
            onBlur={() => eng.current?.release()}
          >
            <Badge pin={pin} />
            <span className="gb-pin-l" aria-hidden="true">{pin.name}</span>
          </button>
        ))}
      </div>
      <div className="gb-hud" aria-hidden="true">
        <span>{labels.hud}</span>
        <b ref={hudRef}>{hudText(START.lon, START.lat, labels.compass)}</b>
      </div>
      <div className="gb-speed">
        <label htmlFor={speedId}>{labels.spin}</label>
        <input
          id={speedId}
          type="range"
          min={0}
          max={100}
          value={speed}
          aria-valuetext={speedLabel}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10) || 0;
            if (eng.current) { eng.current.speed = v; eng.current.kick(); }
            setSpeed(v);
          }}
        />
        <span aria-hidden="true">{speedLabel}</span>
      </div>
      <div className="gb-legend" aria-hidden="true">
        <span><i className="gb-lg-hq" />{labels.legend.hq}</span>
        <span><i className="gb-lg-off" />{labels.legend.office}</span>
        <span><i className="gb-lg-arc" />{labels.legend.route}</span>
      </div>
      <div className="gb-panel" id={panelId}>
        {p ? (
          <div className="gb-card" key={p.id}>
            <div className="gb-card-top">
              <Badge pin={p} lg />
              <div>
                <div className="gb-role">{p.role}</div>
                <h3 className="gb-cn">{p.name}</h3>
              </div>
              <button type="button" className="gb-x" aria-label={labels.close} onClick={close}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <p className="gb-head">{p.head}</p>
            <dl className="gb-rows">
              {p.rows.map((r) => (
                <div className="gb-row" key={r.k}>
                  <dt>{r.k}</dt>
                  <dd>{r.v}</dd>
                </div>
              ))}
            </dl>
            <div className="gb-coord">{p.coord}</div>
          </div>
        ) : (
          world
        )}
      </div>
    </div>
  );
}
