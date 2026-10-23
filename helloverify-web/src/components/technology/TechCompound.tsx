/** "A platform that gets stronger with every verification" on `/technology`:
    the three compounding claims beside the flywheel that makes them true.

    Four stations on one wheel, each with the figure that proves it:
    verifications (every case starts here), intelligence (each one teaches
    the fraud engine), institutions (each authority reached joins the
    network) and customers (each brings more verifications), and round again.
    A pulse runs the loop; every lap draws a ring outside the last, adds the
    nodes it earned and goes round faster, and Trust at the centre grows. In
    the corner, the static system it is set against: a loop that never grows.
    The claims light in step with the wheel. `./TechCompoundStage` runs it.

    The board is `aria-hidden`: its figures are the site's own (`/about`,
    the homepage fraud band), and the claims beside it carry the meaning. */
import type { CSSProperties, ReactNode } from "react";
import "@/app/v2/tech.css";
import { TechCompoundStage } from "./TechCompoundStage";
import { DOC, Glyph, INST, OFFICE, PERSON, SPARK, type TechArt } from "./TechPillarKit";

type Station = "verifications" | "intelligence" | "institutions" | "customers";
type Stat = { v: string; l: string };

const C = 300;
const RING = 168;
const STATIONS: { k: Station; a: number; g: string }[] = [
  { k: "verifications", a: 0, g: DOC },
  { k: "intelligence", a: 90, g: SPARK },
  { k: "institutions", a: 180, g: INST },
  { k: "customers", a: 270, g: OFFICE },
];
/** A clock angle (0 at the top, clockwise) and radius, on the 600 board. */
const pt = (a: number, r: number) => {
  const t = (a * Math.PI) / 180;
  return { x: +(C + r * Math.sin(t)).toFixed(1), y: +(C - r * Math.cos(t)).toFixed(1) };
};
const pct = (v: number) => `${((v / (C * 2)) * 100).toFixed(3)}%`;
const v = (o: Record<string, number | string>) => o as CSSProperties;

/** What the engine has learned: a cloud that thickens every lap. One dot in
    eight is a fraud pattern, which is the 12–14% the station states. */
const DOTS = Array.from({ length: 24 }, (_, i) => ({ ...pt((i * 137.508) % 360, 78 + ((i * 29) % 38)), bad: i % 8 === 3 }));
/** Two institutions and two customers join per lap, in this order. */
const INSTS = [130, 230, 145, 215, 118, 242, 158, 202].map((a) => ({ a, ...pt(a, 246) }));
const CUSTS = [310, 50, 325, 35, 298, 62, 338, 22].map((a) => ({ a, ...pt(a, 246) }));

function Node({ a, x, y, i, g, cls }: { a: number; x: number; y: number; i: number; g: string; cls: string }) {
  const end = pt(a, 184);
  return (
    <g className={`tk-fw-node ${cls}`} style={v({ "--i": i })}>
      <line className="tk-fw-link" x1={end.x} y1={end.y} x2={x} y2={y} />
      <circle className="tk-node" cx={x} cy={y} r="15" />
      <Glyph g={g} x={x} y={y} s={0.56} cls={cls === "tk-fw-cust" ? "tk-ic tk-ic-r" : "tk-ic"} />
    </g>
  );
}

export function TechCompound({
  h,
  sub,
  cards,
  trust,
  orbit,
  stats,
  motion,
  art,
}: {
  h: ReactNode;
  sub: string;
  cards: { t: string; p: string }[];
  trust: string;
  orbit: Record<Station | "ecosystem", string>;
  stats: Record<Station, Stat>;
  motion: { pause: string; play: string };
  art: TechArt;
}) {
  return (
    <TechCompoundStage>
      <div className="sec-head tk-head">
        <h2 className="h2 tk-rv tk-cmp-h">{h}</h2>
        <p className="lede tk-rv tk-rv2">{sub}</p>
      </div>

      <div className="tk-cmp-grid">
        <ol className="tk-cmp-list">
          {cards.map((c, i) => (
            <li key={c.t} className="tk-cmp-c" data-k={`c${i}`} style={v({ "--d": `${(0.35 + i * 0.15).toFixed(2)}s` })}>
              <span className="tk-cmp-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{c.t}</h3>
                <p>{c.p}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="tk-net-box tk-fw-box">
          <div className="tk-fw" aria-hidden="true">
            <svg className="tk-fw-svg tk-mirror" viewBox="0 0 600 600" fill="none">
              <circle className="tk-fw-glow" cx={C} cy={C} r={RING + 40} />
              <circle className="tk-fw-track" cx={C} cy={C} r={RING} />
              {[0, 1, 2, 3].map((k) => (
                <circle key={k} className="tk-fw-lap" cx={C} cy={C} r={RING + k * 10} pathLength="1" style={v({ "--k": k })} />
              ))}
              {DOTS.map((d, i) => (
                <circle key={i} className={d.bad ? "tk-fw-dot tk-fw-bad" : "tk-fw-dot"} cx={d.x} cy={d.y} r="4.2" style={v({ "--i": i })} />
              ))}
              {INSTS.map((n, i) => (
                <Node key={n.a} {...n} i={i} g={INST} cls="tk-fw-inst" />
              ))}
              {CUSTS.map((n, i) => (
                <Node key={n.a} {...n} i={i} g={PERSON} cls="tk-fw-cust" />
              ))}
              <g className="tk-fw-pulse">
                <circle className="tk-fw-pulse-glow" cx={C} cy={C - RING} r="16" />
                <circle className="tk-fw-pulse-dot" cx={C} cy={C - RING} r="6" />
              </g>
            </svg>

            <div className="tk-core">
              <span className="tk-core-rip" />
              <span className="tk-core-in">{trust}</span>
            </div>

            {STATIONS.map((s, i) => {
              const p = pt(s.a, RING);
              return (
                <div key={s.k} className="tk-fw-st" data-s={i} style={{ insetInlineStart: pct(p.x), top: pct(p.y) }}>
                  <span className="tk-fw-st-k">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d={s.g} />
                    </svg>
                    {orbit[s.k]}
                  </span>
                  <b>{stats[s.k].v}</b>
                  <small>{stats[s.k].l}</small>
                </div>
              );
            })}

            <div className="tk-fw-leg">
              <span>
                <i className="tk-fw-leg-st" />
                {art.static}
              </span>
              <span>
                <i className="tk-fw-leg-cp" />
                {art.compounding}
              </span>
            </div>
            <span className="tk-fw-eco">{orbit.ecosystem}</span>
          </div>

          <button type="button" className="tk-gl-pause tk-fw-pause" data-fw-pause="" data-pause={motion.pause} data-play={motion.play} aria-label={motion.pause}>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M5 3.5h2v9H5zM9 3.5h2v9H9z" />
            </svg>
          </button>
        </div>
      </div>
    </TechCompoundStage>
  );
}
