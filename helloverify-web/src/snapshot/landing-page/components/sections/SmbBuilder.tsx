"use client";

/** "Customize Your Package" (`sections/Smb.tsx`): the check list on the left,
    and on the right a receipt printing out of a little printer with a
    running total and a barcode that changes with the order.

    A new line prints in (`smPrint`), the paper jolts down a notch and the
    total drops in, on every toggle. The jolt and the total are two
    identically-keyframed classes swapped A↔B per change, because changing
    `animation-name` restarts an animation and re-setting it does not — the
    same device as the hero seal (`HeroStage.tsx`).

    Hydration: nothing here depends on time or locale. The total is grouped
    by hand (`group`) rather than `toLocaleString('en-IN')`, whose output the
    server's ICU and the browser's are not obliged to agree on. */

import { useState, type ReactNode } from "react";

export type SmbOption = { id: string; name: string; price: number; extra?: string };

/** Indian digit grouping (12,34,567) for the receipt total. */
function group(n: number): string {
  const s = String(Math.round(n));
  if (s.length <= 3) return s;
  const head = s.slice(0, -3);
  return `${head.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${s.slice(-3)}`;
}

/** The barcode as a gradient of 64 bars, seeded by the order so it reads
 *  as a new code each time. Seeded LCG, not `Math.random()`: the first
 *  paint is server-rendered and has to match on hydration. `var(--ink)` so
 *  the stripes are the palette's ink, not a literal. */
function barcode(seed0: number): string {
  let x = 0;
  let seed = seed0;
  const bars: [number, number, number][] = [];
  for (let k = 0; k < 64; k++) {
    seed = (seed * 9301 + 49297) % 233280;
    const w = 1 + (seed % 3);
    const g = 1 + ((seed >> 3) % 3);
    bars.push([x, x + w, x + w + g]);
    x += w + g;
  }
  const pc = (v: number) => `${((v * 100) / x).toFixed(2)}%`;
  const stops = bars.flatMap((b) => [`var(--ink) ${pc(b[0])} ${pc(b[1])}`, `transparent ${pc(b[1])} ${pc(b[2])}`]);
  // A barcode is artwork, not layout: it does not mirror under RTL.
  return `linear-gradient(90deg,${stops.join(",")})`;
}

export function SmbBuilder({
  head,
  quote,
  buyLink,
  options,
  receipt,
  count,
  empty,
  total,
  eduNote,
  eduId,
  rupees,
  printer,
  tick,
}: {
  /** Server-rendered: the kicker and heading above the list, the quote
   *  below it, and the Buy Now `AppLink` (an async Server Component, so it
   *  cannot be rendered from here). */
  head: ReactNode;
  quote: ReactNode;
  buyLink: ReactNode;
  options: SmbOption[];
  receipt: string;
  count: string[];
  empty: string;
  total: string;
  eduNote: string;
  eduId: string;
  /** The currency prefix, `smb.build.rupees("")`: a function cannot cross
   *  the server→client boundary, so the server applies it to nothing and
   *  passes what it prints before the amount. */
  rupees: string;
  printer: string;
  tick: ReactNode;
}) {
  const [sel, setSel] = useState<string[]>([options[0].id]);
  const [n, setN] = useState(0);

  const sum = options.reduce((acc, o) => (sel.includes(o.id) ? acc + o.price : acc), 0);
  const flip = n % 2 === 1;
  const toggle = (id: string) => {
    setSel((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
    setN((k) => k + 1);
  };

  return (
    <div className="sm-build" id="sm-build">
      <div className="sm-build-l">
        {head}
        <div className="sm-opts">
        {options.map((o) => {
          const on = sel.includes(o.id);
          return (
            <button key={o.id} type="button" className={on ? "sm-opt sm-on" : "sm-opt"} aria-pressed={on} onClick={() => toggle(o.id)}>
              <span className="sm-box" aria-hidden="true">
                {tick}
              </span>
              <span className="sm-opt-n">
                {o.name}
                {o.extra ? <i>{o.extra}</i> : null}
              </span>
              <span className="sm-opt-p">{`${rupees}${o.price}`}</span>
            </button>
          );
        })}
        </div>
        {quote}
      </div>
      <div className="sm-build-r">
        <div className="sm-printer" aria-hidden="true">
          <span className="dot live" />
          <span className="sm-slot" />
          <span className="sm-pr-k">{printer}</span>
        </div>
        <div className="sm-paper-wrap">
          <div className={flip ? "sm-paper sm-feedB" : "sm-paper sm-feedA"}>
            <div className="sm-ph">
              <span>{receipt}</span>
              <span>{count[Math.min(sel.length, count.length - 1)]}</span>
            </div>
            <div className="sm-rlines">
              {options
                .filter((o) => sel.includes(o.id))
                .map((o) => (
                  <div key={o.id} className="sm-rl">
                    {tick}
                    <span>{o.name}</span>
                    <b>{`${rupees}${o.price}`}</b>
                  </div>
                ))}
            </div>
            {sel.length === 0 ? <div className="sm-empty">{empty}</div> : null}
            <div className="sm-sep" />
            <div className="sm-tot" aria-live="polite" aria-atomic="true">
              <span>{total}</span>
              <b className={flip ? "sm-totB" : "sm-totA"}>{`${rupees}${group(sum)}`}</b>
            </div>
            {sel.includes(eduId) ? <div className="sm-note">{eduNote}</div> : null}
            <div className="sm-bc" style={{ backgroundImage: barcode(sum + sel.length * 7) }} aria-hidden="true" />
            {buyLink}
          </div>
        </div>
      </div>
    </div>
  );
}
