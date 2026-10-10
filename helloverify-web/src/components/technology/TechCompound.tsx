/** "A platform that gets stronger with every verification" on `/technology`:
    the three compounding claims beside the Trust network. On arrival the core
    grows its rings, the five orbit words take their places, and every node
    is joined to every other — ten connections, drawn one after another.
    Hovering a claim lights the part of the network it is about.

    The drawing is `aria-hidden`: its words repeat `compound.orbit`, and the
    claims beside it carry the meaning. */
import type { CSSProperties, ReactNode } from "react";
import "@/app/v2/tech.css";
import { TechCompoundStage } from "./TechCompoundStage";

const ORBIT = ["verifications", "intelligence", "institutions", "customers", "ecosystem"] as const;
type OrbitKey = (typeof ORBIT)[number];

const C = 280;
const R = 206;
const NODES = ORBIT.map((_, k) => {
  const a = ((-90 + k * 72) * Math.PI) / 180;
  return { x: C + Math.cos(a) * R, y: C + Math.sin(a) * R };
});

/** The ring first, then the star: neighbours before the long way round. */
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 0],
  [0, 2], [1, 3], [2, 4], [3, 0], [4, 1],
];

/** What each claim lights: the verification↔intelligence loop; every link
    of the institutions node; every link of the customers node. */
function cardKeys(a: number, b: number): string[] {
  const keys: string[] = [];
  if (a + b === 1) keys.push("c0");
  if (a === 2 || b === 2) keys.push("c1");
  if (a === 3 || b === 3) keys.push("c2");
  return keys;
}
const NODE_CARDS = [["c0"], ["c0"], ["c1"], ["c2"], ["c2"]];

const pct = (v: number) => `${((v / (C * 2)) * 100).toFixed(3)}%`;
const delay = (s: number) => ({ "--d": `${s.toFixed(2)}s` }) as CSSProperties;

export function TechCompound({
  h,
  sub,
  cards,
  trust,
  orbit,
}: {
  h: ReactNode;
  sub: string;
  cards: { t: string; p: string }[];
  trust: string;
  orbit: Record<OrbitKey, string>;
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
            <li key={c.t} className="tk-cmp-c" data-k={`c${i}`} style={delay(0.35 + i * 0.15)}>
              <span className="tk-cmp-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{c.t}</h3>
                <p>{c.p}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="tk-net-box" aria-hidden="true">
          <div className="tk-net">
            <svg className="tk-net-svg tk-mirror" viewBox="0 0 560 560" fill="none">
              {[96, 116, 136, 156].map((r, k) => (
                <circle key={r} className={`tk-grow tk-grow${k}`} cx={C} cy={C} r={r} style={delay(0.5 + k * 0.7)} />
              ))}
              <circle className="tk-net-orbit" cx={C} cy={C} r={R} pathLength="1" style={delay(0.2)} />
              {NODES.map((n, k) => (
                <line
                  key={`s${k}`}
                  className={`tk-spoke on-p${k} ${NODE_CARDS[k].map((c) => `on-${c}`).join(" ")}`}
                  x1={C} y1={C} x2={n.x} y2={n.y}
                  pathLength="1"
                  style={delay(0.45 + k * 0.15)}
                />
              ))}
              {EDGES.map(([a, b], e) => (
                <line
                  key={`e${e}`}
                  className={`tk-link on-p${a} on-p${b} ${cardKeys(a, b).map((c) => `on-${c}`).join(" ")}`}
                  x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
                  pathLength="1"
                  style={delay((e < 5 ? 1.3 : 1.55) + e * 0.2)}
                />
              ))}
            </svg>

            <div className="tk-core" style={delay(0.1)}>
              <span className="tk-core-rip" />
              <span className="tk-core-rip tk-core-rip2" />
              <span className="tk-core-in">{trust}</span>
            </div>

            {ORBIT.map((key, k) => (
              <span
                key={key}
                className={`tk-pill on-p${k} ${NODE_CARDS[k].map((c) => `on-${c}`).join(" ")}`}
                data-k={`p${k}`}
                style={{ insetInlineStart: pct(NODES[k].x), top: pct(NODES[k].y), ...delay(0.55 + k * 0.15) }}
              >
                <span className="tk-pill-in">
                  <i />
                  {orbit[key]}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </TechCompoundStage>
  );
}
