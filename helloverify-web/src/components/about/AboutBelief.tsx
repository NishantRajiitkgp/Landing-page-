/** Belief and investor on `/about`.

    The belief is the page's one statement, set large; its words light in
    reading order as it is scrolled through (`BeliefStage`), and the name of
    the company that carries it is the only red in it.

    The investor card says "top 1% of applicants" in a drawing: a hundred
    applicants arrive, ninety-nine step back, and one is lit. Played once,
    in under three seconds. The drawing is decoration (`aria-hidden`). */
import type { CSSProperties, ReactNode } from "react";
import { YCBadge } from "@/components/brand/YCBadge";
import { splitWords } from "@/components/brand/splitWords";
import { BeliefStage, Reveal } from "./AboutMotion";

const SIDE = 10;
const PICK = SIDE - 1;
const DOTS = Array.from({ length: SIDE * SIDE }, (_, i) => {
  const r = Math.floor(i / SIDE);
  const c = i % SIDE;
  return { i, x: 15 + c * 30, y: 15 + r * 30, at: (0.15 + (SIDE - 1 - r + c) * 0.035).toFixed(2) };
});

function OnePercent() {
  return (
    <svg className="ab-pct-svg" viewBox="0 0 300 300" fill="none" aria-hidden="true">
      {DOTS.map((p) => (
        <circle
          key={p.i}
          className={p.i === PICK ? "ab-pd ab-pd-pick" : "ab-pd"}
          cx={p.x}
          cy={p.y}
          r="5.5"
          style={{ "--d": `${p.at}s` } as CSSProperties}
        />
      ))}
      <circle className="ab-pd-ring" cx={15 + PICK * 30} cy="15" r="12" />
      <circle className="ab-pd-rip" cx={15 + PICK * 30} cy="15" r="12" />
    </svg>
  );
}

export function AboutBelief({
  k,
  q,
  inv,
}: {
  k: string;
  q: ReactNode;
  inv: { h: string; sub: string };
}) {
  const n = { i: 0 };
  const words = splitWords(q, "ab-bw", n);
  return (
    <section className="ab-bel">
      <div className="wrap">
        <BeliefStage n={n.i} className="ab-bel-in">
          <h2 className="ab-k">{k}</h2>
          <p className="ab-bel-q">{words}</p>
        </BeliefStage>

        <Reveal className="ab-inv">
          <div className="ab-inv-tx">
            <h2 className="ab-inv-h">{inv.h}</h2>
            <span className="ab-yc" role="img" aria-label="Y Combinator">
              <YCBadge width={164} height={32} />
            </span>
            <p className="ab-inv-p">{inv.sub}</p>
          </div>
          <div className="ab-pct">
            <OnePercent />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
