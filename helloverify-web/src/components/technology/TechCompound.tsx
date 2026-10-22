/** "A platform that gets stronger with every verification" on `/technology`:
    the three compounding claims beside a drawing of the difference. In the
    corner, a static system: a closed circle that never grows. Ours is a
    spiral round the Trust core, one turn per claim:

      turn 1  every completed check (a red dot) feeds the core's intelligence
      turn 2  institutions join as permanent nodes, wired to the core
      turn 3  customers join and bring more checks; the dots get denser with
              every turn, and that density is the compounding

    The orbit words sit in the gaps between the turns. Hovering a claim or a
    word lights the part of the spiral it is about.

    The drawing is `aria-hidden`: its words repeat `compound.orbit`, and the
    claims beside it carry the meaning. */
import type { CSSProperties, ReactNode } from "react";
import "@/app/v2/tech.css";
import { TechCompoundStage } from "./TechCompoundStage";
import { Glyph, INST, Label, PERSON, type TechArt } from "./TechPillarKit";

const ORBIT = ["verifications", "intelligence", "institutions", "customers", "ecosystem"] as const;
type OrbitKey = (typeof ORBIT)[number];

const C = 280;
const TURN = Math.PI * 2;
const R0 = 58;
const R1 = 214;
const rad = (t: number) => R0 + (t * (R1 - R0)) / (3 * TURN);
const at = (t: number) => ({ x: +(C + rad(t) * Math.cos(t - Math.PI / 2)).toFixed(1), y: +(C + rad(t) * Math.sin(t - Math.PI / 2)).toFixed(1) });
/** Each turn starts drawing here (s) and takes 1.1s; a point on it lands in step. */
const TURN_AT = [0.6, 1.9, 3.2];
const when = (t: number) => TURN_AT[Math.min(2, Math.floor(t / TURN))] + ((t % TURN) / TURN) * 1.1;

const SPIRAL = TURN_AT.map((_, k) => {
  const pts: string[] = [];
  for (let t = k * TURN; t <= (k + 1) * TURN + 1e-6; t += 0.06) pts.push(`${at(t).x} ${at(t).y}`);
  return `M${pts.join("L")}`;
});

/** Where each orbit word sits, between two turns at the top or bottom. */
const PILLS: Record<OrbitKey, number> = { customers: 92, institutions: 145, intelligence: 197, verifications: 388, ecosystem: 505 };
const NODE_CARDS: Record<OrbitKey, string> = { verifications: "c0", intelligence: "c0", institutions: "c1", customers: "c2", ecosystem: "c2" };
/** Each word arrives with the turn it names. */
const PILL_AT: Record<OrbitKey, number> = { intelligence: 0.5, verifications: 1.1, institutions: 2.3, customers: 3.6, ecosystem: 4.4 };

const INSTS = [0.8, 2.2, 4.1, 5.5].map((o) => TURN + o).concat([0.5, 2.6, 3.8].map((o) => 2 * TURN + o));
const CUSTS = [1.25, 2.05, 4.4, 5.2, 5.85].map((o) => 2 * TURN + o);
const clear = (p: { x: number; y: number }) =>
  Object.values(PILLS).every((y) => Math.abs(p.x - C) > 66 || Math.abs(p.y - y) > 21) &&
  [...INSTS, ...CUSTS].every((t) => Math.hypot(at(t).x - p.x, at(t).y - p.y) > 16);
const DOTS = (() => {
  const out: { x: number; y: number; t: number }[] = [];
  for (let t = 0.35; t < 3 * TURN; t += 21 / rad(t)) if (clear(at(t))) out.push({ ...at(t), t });
  return out;
})();

const pct = (v: number) => `${((v / (C * 2)) * 100).toFixed(3)}%`;
const delay = (s: number) => ({ "--d": `${s.toFixed(2)}s` }) as CSSProperties;

export function TechCompound({
  h,
  sub,
  cards,
  trust,
  orbit,
  art,
}: {
  h: ReactNode;
  sub: string;
  cards: { t: string; p: string }[];
  trust: string;
  orbit: Record<OrbitKey, string>;
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
              {/* Static: a closed loop that never grows */}
              <g className="tk-st" style={delay(0.2)}>
                <circle className="tk-st-c" cx="66" cy="66" r="34" />
                {[-90, 30, 150].map((a) => (
                  <circle key={a} className="tk-st-n" cx={+(66 + 34 * Math.cos((a * Math.PI) / 180)).toFixed(1)} cy={+(66 + 34 * Math.sin((a * Math.PI) / 180)).toFixed(1)} r="5" />
                ))}
              </g>
              <Label x={66} y={122} at={0.3}>{art.static}</Label>

              {/* Ours: three turns, each wider than the last */}
              <circle className="tk-sp-core on-p1 on-c0" cx={C} cy={C} r="54" />
              {INSTS.map((t) => (
                <line key={`l${t}`} className="tk-sp-link on-p2 on-c1" x1={C} y1={C} x2={at(t).x} y2={at(t).y} pathLength="1" style={delay(when(t) + 0.1)} />
              ))}
              {SPIRAL.map((p, k) => (
                <path key={k} className={k === 2 ? "tk-sp tk-sp-out on-p4 on-c2" : "tk-sp on-p4"} d={p} pathLength="1" style={delay(TURN_AT[k])} />
              ))}
              <path className="tk-sp-tip" d="M291 66l-11-6v12z" style={delay(4.3)} />
              <Label x={350} y={48} at={4.3} red>{art.compounding}</Label>
              {DOTS.map((p) => (
                <circle key={p.t} className="tk-sp-dot on-p0 on-c0" cx={p.x} cy={p.y} r="3" style={delay(when(p.t))} />
              ))}
              {INSTS.map((t) => (
                <g key={t} className="tk-sp-node on-p2 on-c1" style={delay(when(t))}>
                  <circle className="tk-node" cx={at(t).x} cy={at(t).y} r="13" />
                  <Glyph g={INST} x={at(t).x} y={at(t).y} s={0.5} />
                </g>
              ))}
              {CUSTS.map((t) => (
                <g key={t} className="tk-sp-node on-p3 on-c2" style={delay(when(t))}>
                  <circle className="tk-node tk-node-r" cx={at(t).x} cy={at(t).y} r="13" />
                  <Glyph g={PERSON} x={at(t).x} y={at(t).y} s={0.5} cls="tk-ic tk-ic-r" />
                </g>
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
                className={`tk-pill on-p${k} on-${NODE_CARDS[key]}`}
                data-k={`p${k}`}
                style={{ insetInlineStart: pct(C), top: pct(PILLS[key]), ...delay(PILL_AT[key]) }}
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
