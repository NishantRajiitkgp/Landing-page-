/** The eight small illustrations on the v2 "Why governments" deck
 *  (`./Why.tsx`, `./WhyDeck.tsx`). Decorative: the card's own title and line
 *  say what the drawing shows, so the caller renders this inside an
 *  `aria-hidden` box.
 *
 *  Server-rendered markup, no state. Every part that enters is a `.wy-pop`
 *  with its own `--d` delay; the entrance is a CSS transition keyed on the
 *  front card's class (see `app/v2/why.css`), so a drawing is complete with
 *  motion paused and before hydration.
 *
 *  The widths and heights below are the board's skeleton lines — geometry,
 *  not copy — and are set per element because each one is different. */
import type { CSSProperties, ReactNode } from "react";

import { Tick } from "@/components/brand/Tick";
import type { SectionsCopy } from "@/lib/copy/sections";

export type WhyCardId = keyof SectionsCopy["why"]["deck"]["cards"];
type Art = SectionsCopy["why"]["deck"]["art"];

const v = (vars: Record<string, string>) => vars as CSSProperties;

function Pop({ d, children }: { d: number; children: ReactNode }) {
  return (
    <div className="wy-pop" style={v({ "--d": `${d.toFixed(2)}s` })}>
      {children}
    </div>
  );
}

function Tk() {
  return (
    <span className="wy-tk">
      <Tick />
    </span>
  );
}

/** Bar heights of the live chart, as a percentage of its box. */
const CHART = [34, 52, 44, 68, 58, 80, 72, 92, 84, 96];

/** The code card's lines: indent, then a key and a value width (px). The
 *  key's colour class is the syntax colour the board gave that line. */
const CODE: readonly { indent: number; key: number; cls: string; val: number }[] = [
  { indent: 0, key: 44, cls: "wy-ck", val: 90 },
  { indent: 18, key: 60, cls: "wy-cs", val: 70 },
  { indent: 18, key: 38, cls: "wy-cv", val: 110 },
  { indent: 36, key: 52, cls: "wy-cs", val: 60 },
  { indent: 0, key: 20, cls: "wy-ck", val: 0 },
];

const w = (width: string) => ({ width });

export function WhyArt({ id, a }: { id: WhyCardId; a: Art }) {
  switch (id) {
    case "health":
      return (
        <div className="wy-art wy-v1">
          <Pop d={0.08}>
            <div className="wy-prof">
              <span className="wy-av">{a.doctor}</span>
              <span className="wy-bars"><i style={w("120px")} /><i style={w("78px")} /></span>
              <span className="wy-lic">{a.licence}</span>
            </div>
          </Pop>
          {a.rows.map((row, k) => (
            <Pop key={row} d={0.18 + k * 0.09}>
              <div className="wy-row"><Tk /><span>{row}</span><em>{a.verified}</em></div>
            </Pop>
          ))}
        </div>
      );
    case "immigration":
      return (
        <div className="wy-art wy-v2">
          <div className="wy-flow">
            {a.flow.map((step, k) => (
              <Pop key={step} d={0.2 + k * 0.12}>
                <div className="wy-fn"><i /><span>{step}</span></div>
              </Pop>
            ))}
            <span className="wy-fl" />
          </div>
        </div>
      );
    case "manpower":
      return (
        <div className="wy-art wy-v3">
          <Pop d={0.08}>
            <div className="wy-big"><b>{a.countries}</b><span>{a.countriesUnit}</span></div>
          </Pop>
          <Pop d={0.22}>
            <div className="wy-cert">
              <span className="wy-cert-k">{a.degree}</span>
              <i style={w("88%")} /><i style={w("64%")} /><i style={w("72%")} />
              <span className="wy-seal" />
            </div>
          </Pop>
        </div>
      );
    case "trade":
      return (
        <div className="wy-art wy-v4">
          <Pop d={0.08}><div className="wy-o0">{a.registry}</div></Pop>
          <div className="wy-o-l" />
          <div className="wy-o-row">
            {[0, 1, 2].map((k) => (
              <Pop key={k} d={0.22 + k * 0.1}>
                <div className="wy-o1"><Tk />{a.director}</div>
              </Pop>
            ))}
          </div>
          <Pop d={0.55}><div className="wy-o2">{a.workforce}</div></Pop>
        </div>
      );
    case "fraud":
      return (
        <div className="wy-art wy-v5">
          <Pop d={0.08}>
            <div className="wy-doc">
              <i style={w("70%")} /><i style={w("92%")} /><i className="wy-bad" style={w("58%")} />
              <i style={w("84%")} /><i style={w("46%")} />
            </div>
          </Pop>
          <Pop d={0.32}>
            <div className="wy-flag"><span className="wy-flag-d" />{a.risk}</div>
          </Pop>
        </div>
      );
    case "dashboards":
      return (
        <div className="wy-art wy-v6">
          <Pop d={0.08}>
            <div className="wy-dash">
              <div className="wy-dash-k"><span className="wy-live" />{a.live}</div>
              <div className="wy-chart">
                {CHART.map((h, k) => (
                  <i key={k} style={v({ "--h": `${h}%`, "--d2": `${(0.25 + k * 0.05).toFixed(2)}s` })} />
                ))}
              </div>
            </div>
          </Pop>
        </div>
      );
    case "reports":
      return (
        <div className="wy-art wy-v7">
          <Pop d={0.08}>
            <div className="wy-rep">
              <div className="wy-rep-h"><i style={w("46%")} /><i style={w("28%")} /></div>
              {[70, 56, 64, 48].map((width) => (
                <div className="wy-rep-r" key={width}><Tk /><i style={w(`${width}%`)} /></div>
              ))}
              <span className="wy-stamp">{a.audit}</span>
            </div>
          </Pop>
        </div>
      );
    case "integration":
      return (
        <div className="wy-art wy-v8">
          <Pop d={0.08}>
            <div className="wy-code">
              <div className="wy-code-h"><i /><i /><i /><span>{a.api}</span></div>
              {CODE.map((l, k) => (
                <div className="wy-cl" key={k} style={{ paddingInlineStart: `${l.indent}px` }}>
                  <i className={l.cls} style={w(`${l.key}px`)} />
                  <i style={w(`${l.val}px`)} />
                </div>
              ))}
            </div>
          </Pop>
          <div className="wy-sys">
            {a.systems.map((s, k) => (
              <Pop key={s} d={0.3 + k * 0.1}><span>{s}</span></Pop>
            ))}
          </div>
        </div>
      );
  }
}
