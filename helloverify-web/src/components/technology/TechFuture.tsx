/** "Building the Future of Digital Trust" on `/technology`: the three
    future layers as an isometric stack beside their copy. Top to bottom:
    the persistent layer (credentials held and watched), trusted access
    (one lock, many parties), and the infrastructure under both (a circuit
    slab). The stack parts as the section scrolls in; hovering a row lifts
    its layer. The stack is decoration (`aria-hidden`). */
import type { CSSProperties } from "react";
import "@/app/v2/tech.css";
import { TechFutureStage } from "./TechFutureStage";

const HELD = new Set([1, 6, 8, 11, 13]);
const CORNERS = [
  [44, 44], [256, 44], [44, 256], [256, 256],
] as const;
const TRACES = [
  "M24 70 H110 V128 H150",
  "M276 92 H206 V150 H150",
  "M70 276 V206 H128 V150",
  "M232 276 V214 H172 V150",
  "M24 196 H84 V236",
  "M196 24 V64 H252",
];
const d = (s: number) => ({ "--d": `${s.toFixed(2)}s` }) as CSSProperties;

function Persistent() {
  return (
    <div className="tk-face tk-face0">
      <div className="tk-f-grid">
        {Array.from({ length: 16 }, (_, i) => (
          <i key={i} className={HELD.has(i) ? "on" : undefined} style={d(1 + i * 0.05)}>
            {HELD.has(i) && <b />}
          </i>
        ))}
      </div>
      <span className="tk-f-scan" />
    </div>
  );
}

function Access() {
  return (
    <div className="tk-face tk-face1">
      <svg className="tk-f-svg" viewBox="0 0 300 300" fill="none">
        <circle className="tk-acc-ring" cx="150" cy="150" r="62" />
        <circle className="tk-acc-ring tk-acc-ring2" cx="150" cy="150" r="100" />
        {CORNERS.map(([x, y], i) => (
          <line key={i} className="tk-acc-l" x1="150" y1="150" x2={x} y2={y} pathLength="1" style={d(1.1 + i * 0.12)} />
        ))}
        {CORNERS.map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <circle className="tk-node" r="19" />
            <circle className="tk-dot-ink" r="4" />
          </g>
        ))}
        <rect className="tk-acc-lock" x="116" y="116" width="68" height="68" rx="18" />
        <path className="tk-acc-key" d="M140 148v-6a10 10 0 0 1 20 0v6M136 148h28v20h-28zM150 155v6" />
      </svg>
    </div>
  );
}

function Infrastructure() {
  return (
    <div className="tk-face tk-face2">
      <svg className="tk-f-svg" viewBox="0 0 300 300" fill="none">
        {TRACES.map((t, i) => (
          <path key={i} className={i < 4 ? "tk-trace tk-trace-on" : "tk-trace"} d={t} pathLength="1" style={d(1.3 + i * 0.15)} />
        ))}
        {TRACES.map((t, i) => {
          const m = /^M(\d+) (\d+)/.exec(t);
          return m && <rect key={i} className="tk-pad" x={Number(m[1]) - 5} y={Number(m[2]) - 5} width="10" height="10" rx="2.5" />;
        })}
        <rect className="tk-chip" x="122" y="122" width="56" height="56" rx="12" />
        <circle className="tk-dot-red" cx="150" cy="150" r="7" />
      </svg>
    </div>
  );
}

const FACES = [Persistent, Access, Infrastructure];

export function TechFuture({ h, cards }: { h: string; cards: { t: string; p: string }[] }) {
  return (
    <TechFutureStage>
      <div className="tk-fut-grid">
        <div className="tk-stack" aria-hidden="true">
          {[0, 1].map((side) => (
            <span key={side} className={`tk-conn tk-conn${side}`} />
          ))}
          {FACES.map((Face, k) => (
            <div key={k} className={`tk-plate tk-plate${k}`} style={{ "--k": k, ...d(0.15 + (2 - k) * 0.18) } as CSSProperties}>
              <Face />
            </div>
          ))}
        </div>

        <div className="tk-fut-tx">
          <h2 className="h2 tk-rv">{h}</h2>
          <ol className="tk-fut-list">
            {cards.map((c, i) => (
              <li key={c.t} className="tk-fut-r" data-k={i} style={d(0.3 + i * 0.14)}>
                <span className="tk-fut-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{c.t}</h3>
                  <p>{c.p}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </TechFutureStage>
  );
}
