/** "Building the Future of Digital Trust" on `/technology`: the three future
    layers as three bands of one board, beside their copy.

      0.3s  persistent: a verified credential with a live pulse along its
            lifecycle — verified, then refreshed, and refreshed again
      1.4s  trusted access: one validated credential in a vault, reached with
            keys by a government, an enterprise, a bank and a regulator,
            whose own repeat checks are crossed out
      2.6s  infrastructure: all of it plugs into one slab underneath

    Hovering a row lights its band. The board is decoration (`aria-hidden`). */
import type { CSSProperties } from "react";
import "@/app/v2/tech.css";
import { TechFutureStage } from "./TechFutureStage";
import { CARD, CASE, GLOBE, Glyph, ID, INST, KEY, LOCK, Label, Ok, REFRESH, SHIELD, d, type TechArt } from "./TechPillarKit";

const VAULT = { x: 280, y: 200 };
const ORGS = [
  { x: 110, y: 164, g: INST },
  { x: 110, y: 236, g: CASE },
  { x: 450, y: 164, g: CARD },
  { x: 450, y: 236, g: GLOBE },
];
const LIFE = [
  { x: 252, g: SHIELD },
  { x: 364, g: REFRESH },
  { x: 476, g: REFRESH },
];
const PULSE = "M122 69H188l8-18 10 36 8-18H300l8-18 10 36 8-18H412l8-18 10 36 8-18H534";
const TRACE = "M44 322H96V312H170V328H250V318H330V330H404V314H480V322H516";

function Board({ l }: { l: TechArt }) {
  return (
    <svg className="tk-fb-svg tk-mirror" viewBox="0 0 560 360" fill="none">
      {/* 01 · Persistent: a living, monitored credential */}
      <g className="tk-fb tk-fb0">
        <g className="tk-a-in" style={d(0.3)}>
          <rect className="tk-sheet" x="26" y="34" width="96" height="70" rx="10" />
          <circle className="tk-paperfill" cx="46" cy="56" r="10" />
          <Glyph g={ID} x={46} y={56} s={0.5} cls="tk-ic tk-ic-m" />
          <rect className="tk-inkbar" x="62" y="51" width="46" height="6" rx="3" />
          <rect className="tk-bar" x="38" y="76" width="70" height="5" rx="2.5" />
          <rect className="tk-bar" x="38" y="88" width="50" height="5" rx="2.5" />
        </g>
        <path className="tk-hair" d="M122 69H534" />
        <path className="tk-pulse tk-a-draw" d={PULSE} pathLength="1" style={d(0.5, { "--t": "1.2s" })} />
        {LIFE.map((n, i) => (
          <g key={n.x} className="tk-a-pop" style={d(0.75 + i * 0.3)}>
            <circle className="tk-node" cx={n.x} cy="69" r="14" />
            <Glyph g={n.g} x={n.x} y={69} s={0.55} cls={i ? "tk-ic tk-ic-r" : "tk-ic"} />
          </g>
        ))}
        <Ok x={263} y={58} r={5} at={0.9} />
        <Label x={420} y={112} at={1.3}>{l.monitored}</Label>
      </g>

      {/* 02 · Trusted access: verified once, opened with keys */}
      <g className="tk-fb tk-fb1">
        {ORGS.map((o, i) => {
          const away = o.x < VAULT.x ? -44 : 44;
          return (
            <g key={o.x + o.y}>
              <path className="tk-p-link tk-a-draw" d={`M${VAULT.x} ${VAULT.y}L${o.x} ${o.y}`} pathLength="1" style={d(1.7 + i * 0.1)} />
              <g className="tk-a-pop" style={d(1.9 + i * 0.1)}>
                <circle className="tk-node" cx={(VAULT.x + o.x) / 2} cy={(VAULT.y + o.y) / 2} r="10" />
                <Glyph g={KEY} x={(VAULT.x + o.x) / 2} y={(VAULT.y + o.y) / 2} s={0.42} cls="tk-ic tk-ic-r" />
              </g>
              <g className="tk-a-pop" style={d(1.5 + i * 0.08)}>
                <circle className="tk-node" cx={o.x} cy={o.y} r="20" />
                <Glyph g={o.g} x={o.x} y={o.y} s={0.75} />
              </g>
              <g className="tk-fb-gone tk-a-fade" style={d(2.2)}>
                <circle className="tk-node" cx={o.x + away} cy={o.y} r="10" />
                <Glyph g={REFRESH} x={o.x + away} y={o.y} s={0.42} cls="tk-ic tk-ic-m" />
              </g>
              <path className="tk-strike tk-a-draw" d={`M${o.x + away - 8} ${o.y - 8}l16 16`} pathLength="1" style={d(2.4 + i * 0.06, { "--t": ".2s" })} />
            </g>
          );
        })}
        <g className="tk-a-pop" style={d(1.4)}>
          <rect className="tk-vault-k" x={VAULT.x - 28} y={VAULT.y - 28} width="56" height="56" rx="16" />
          <Glyph g={LOCK} x={VAULT.x} y={VAULT.y} s={1} cls="tk-ic tk-ic-w" />
        </g>
        <Label x={VAULT.x} y={VAULT.y + 48} at={2}>{l.once}</Label>
      </g>

      {/* 03 · The infrastructure under both */}
      <g className="tk-fb tk-fb2">
        {[ORGS[1].x, VAULT.x, ORGS[3].x].map((x) => (
          <path key={x} className="tk-plug tk-a-fade" d={`M${x} ${x === VAULT.x ? 262 : 256}V296`} style={d(2.9)} />
        ))}
        <g className="tk-a-in" style={d(2.6)}>
          <rect className="tk-slab" x="26" y="296" width="508" height="52" rx="14" />
          {[ORGS[1].x, VAULT.x, ORGS[3].x].map((x) => (
            <rect key={x} className="tk-slab-port" x={x - 9} y="292" width="18" height="10" rx="3" />
          ))}
        </g>
        <path className="tk-trace-on tk-a-draw" d={TRACE} pathLength="1" style={d(3, { "--t": ".9s" })} />
      </g>
    </svg>
  );
}

export function TechFuture({ h, cards, art }: { h: string; cards: { t: string; p: string }[]; art: TechArt }) {
  return (
    <TechFutureStage>
      <div className="tk-fut-grid">
        <div className="tk-fut-board" aria-hidden="true">
          <Board l={art} />
        </div>

        <div className="tk-fut-tx">
          <h2 className="h2 tk-rv">{h}</h2>
          <ol className="tk-fut-list">
            {cards.map((c, i) => (
              <li key={c.t} className="tk-fut-r" data-k={i} style={{ "--d": `${(0.3 + i * 0.14).toFixed(2)}s` } as CSSProperties}>
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
