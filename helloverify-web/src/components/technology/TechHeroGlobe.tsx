"use client";

/** The `/technology` hero's globe (`./TechHero`): HelloVerify's AI routing
    one case through four authorities in four countries, on a loop.

    This island renders the words (the case card, the hub, an authority
    card per stop) and the pause control. `./techGlobe`, fetched as the hero
    nears the viewport, draws the globe and the routes and moves the words
    over them. Until it arrives the case card shows on its own.

    The board is decoration, `aria-hidden`; only the control is read out.
    It pauses everything, the CSS spinners included (WCAG 2.2.2). */
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { whenNear } from "@/lib/whenNear";
import { CAP, DOC, OFFICE, SHIELD, type TechArt } from "./TechPillarKit";
import type { TechGlobe } from "./techGlobe";

type G = TechArt["globe"];
const CROSS = "M9.5 4.5h5v5h5v5h-5v5h-5v-5h-5v-5h5z";
/** The case's specimen reference. A code, not a word, so not in the copy. */
const CASE_NO = "HV-24817";

/** The four stops, in the order `./techGlobe` visits them. */
const STOPS = [
  { check: "employment", kind: "corporate", city: "singapore", flag: "/flags/sg.svg", g: OFFICE },
  { check: "standing", kind: "regulator", city: "dubai", flag: "/flags/ae.svg", g: SHIELD },
  { check: "licence", kind: "medical", city: "london", flag: "/flags/gb.svg", g: CROSS },
  { check: "degree", kind: "education", city: "boston", flag: "/flags/us.svg", g: CAP },
] as const;

function Ico({ g }: { g: string }) {
  return (
    <svg className="tk-gl-ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d={g} />
    </svg>
  );
}

/** Waiting, a spinner while it is checked, a tick once confirmed. */
function Mark() {
  return (
    <span className="tk-gl-mark">
      <i />
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="8" />
        <path d="M4.4 8.3 6.9 10.8 11.6 5.6" />
      </svg>
    </span>
  );
}

function Flag({ src }: { src: string }) {
  return <Image className="tk-gl-flag" src={src} alt="" width={16} height={11} unoptimized />;
}

export function TechHeroGlobe({ art }: { art: TechArt }) {
  const g: G = art.globe;
  const boardRef = useRef<HTMLDivElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const engine = useRef<TechGlobe | null>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);

  useEffect(() => {
    const board = boardRef.current;
    const canvas = cvRef.current;
    if (!board || !canvas) return;
    const all = (s: string) => [...board.querySelectorAll<HTMLElement>(s)];
    return whenNear(
      board,
      () => import("./techGlobe"),
      ({ TechGlobe }) => {
        const hub = board.querySelector<HTMLElement>(".tk-gl-hub");
        const card = board.querySelector<HTMLElement>(".tk-gl-case");
        if (!hub || !card) return;
        const e = new TechGlobe(board, canvas, { hub, card, pins: all(".tk-gl-pin"), rows: all(".tk-gl-row") });
        e.setPaused(pausedRef.current);
        engine.current = e;
        board.dataset.live = "";
        return () => {
          e.destroy();
          engine.current = null;
        };
      },
      "300px 0px",
    );
  }, []);

  useEffect(() => {
    pausedRef.current = paused;
    engine.current?.setPaused(paused);
  }, [paused]);

  return (
    <div ref={boardRef} className="tk-proof tk-gl" data-paused={paused ? "" : undefined}>
      <div className="tk-gl-art" aria-hidden="true">
        <canvas ref={cvRef} className="tk-gl-cv" />

        <div className="tk-gl-hub">
          <span className="tk-gl-hub-in">
            <Logo width={80} height={23} />
            <b>{art.ai}</b>
          </span>
          <small>{g.trained}</small>
        </div>

        {STOPS.map((s) => (
          <div key={s.city} className="tk-gl-pin" data-s="check">
            <span className="tk-gl-tile">
              <Ico g={s.g} />
            </span>
            <span className="tk-gl-tx">
              <b>{g[s.kind]}</b>
              <small>
                <Flag src={s.flag} />
                {g[s.city]}
              </small>
            </span>
            <span className="tk-gl-pill">
              <span>{g.checking}</span>
              <span>{g.verified}</span>
            </span>
          </div>
        ))}

        <div className="tk-gl-case" data-s="in">
          <span className="tk-gl-case-h">
            <span className="tk-gl-tile">
              <Ico g={DOC} />
            </span>
            <span className="tk-gl-tx">
              <b>{g.case}</b>
              <small>{CASE_NO}</small>
            </span>
          </span>
          <span className="tk-gl-case-s">
            <span>{g.routing}</span>
            <span>{g.done}</span>
          </span>
          <ul>
            {STOPS.map((s) => (
              <li key={s.check} className="tk-gl-row" data-s="wait">
                <Ico g={s.g} />
                <span>{g[s.check]}</span>
                <Flag src={s.flag} />
                <Mark />
              </li>
            ))}
          </ul>
        </div>

        <p className="tk-gl-cap">
          {art.sources} · {g.more}
        </p>
      </div>

      <button type="button" className="tk-gl-pause" aria-label={paused ? g.play : g.pause} onClick={() => setPaused((p) => !p)}>
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d={paused ? "M5 3.5v9l7-4.5z" : "M5 3.5h2v9H5zM9 3.5h2v9H9z"} />
        </svg>
      </button>
    </div>
  );
}
