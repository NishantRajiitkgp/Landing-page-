/** "Built on trust, Proven by numbers" on `/about`: three figures as one
    ruled row, each over a small drawing of what it counts, then the wall of
    companies that trust it.

      checks     a year-by-year bar for each year since 2018, the latest red
      clients    one square per client filling in, the newest red
      countries  a globe, with places lit on it

    The figures count up from zero the first time they are seen (`Count`);
    screen readers get the copy's own text. Drawings are `aria-hidden`. */
import type { CSSProperties } from "react";
import Image from "next/image";
import { Count, Reveal } from "./AboutMotion";

const PARTNERS = [
  { src: "/img/clients/accenture.png", alt: "Accenture", w: 300, h: 79 },
  { src: "/img/clients/wipro.png", alt: "Wipro", w: 102, h: 80 },
  { src: "/img/clients/indigo.png", alt: "IndiGo", w: 384, h: 120 },
  { src: "/img/clients/cognizant.png", alt: "Cognizant", w: 300, h: 54 },
  { src: "/img/clients/hcl.png", alt: "HCL", w: 300, h: 43 },
  { src: "/img/clients/infosys.png", alt: "Infosys", w: 204, h: 80 },
] as const;

const d = (s: number) => ({ "--d": `${s.toFixed(2)}s` }) as CSSProperties;

const BARS = Array.from({ length: 8 }, (_, i) => {
  const h = Math.round(8 + 44 * (i / 7) ** 1.7);
  return { i, x: 1 + i * 15, y: 54 - h, h };
});
const SQUARES = Array.from({ length: 48 }, (_, i) => ({ i, c: Math.floor(i / 4), r: i % 4 }));

function Bars() {
  return (
    <svg className="ab-sa" viewBox="0 0 120 56" fill="none" aria-hidden="true">
      <path className="ab-sa-base" d="M0 55.5H120" />
      {BARS.map((b) => (
        <rect
          key={b.i}
          className={b.i === BARS.length - 1 ? "ab-sa-bar ab-sa-red" : "ab-sa-bar"}
          x={b.x}
          y={b.y}
          width="8"
          height={b.h}
          rx="2"
          style={d(0.2 + b.i * 0.08)}
        />
      ))}
    </svg>
  );
}

function Squares() {
  return (
    <svg className="ab-sa" viewBox="0 0 120 56" fill="none" aria-hidden="true">
      {SQUARES.map((s) => (
        <rect
          key={s.i}
          className={s.i === SQUARES.length - 1 ? "ab-sa-sq ab-sa-red" : "ab-sa-sq"}
          x={1 + s.c * 10}
          y={16 + s.r * 10}
          width="6"
          height="6"
          rx="1.5"
          style={d(0.2 + s.i * 0.014)}
        />
      ))}
    </svg>
  );
}

function Globe() {
  return (
    <svg className="ab-sa" viewBox="0 0 120 56" fill="none" aria-hidden="true">
      <circle className="ab-sa-line ab-sa-draw" cx="28" cy="28" r="26" pathLength="1" style={d(0.2)} />
      <ellipse className="ab-sa-faint ab-sa-fade" cx="28" cy="28" rx="26" ry="8" style={d(0.6)} />
      <ellipse className="ab-sa-faint ab-sa-fade" cx="28" cy="28" rx="11" ry="26" style={d(0.7)} />
      <path className="ab-sa-faint ab-sa-fade" d="M28 2V54" style={d(0.8)} />
      {[
        [15, 19, 0.95],
        [38, 33, 1.1],
        [22, 41, 1.25],
        [42, 16, 1.4],
      ].map(([x, y, at]) => (
        <circle key={at} className="ab-sa-pin" cx={x} cy={y} r="2.6" style={d(at)} />
      ))}
    </svg>
  );
}

const ART = { checks: Bars, clients: Squares, countries: Globe } as const;

export function AboutNumbers({
  h,
  stats,
}: {
  h: string;
  stats: Record<keyof typeof ART, { v: string; l: string }>;
}) {
  return (
    <section className="wrap ab-num">
      <div className="ab-head">
        <h2 className="h2">{h}</h2>
      </div>
      <Reveal as="ul" className="ab-stats">
        {(Object.keys(ART) as (keyof typeof ART)[]).map((key, i) => {
          const Art = ART[key];
          const s = stats[key];
          return (
            <li key={key} className="ab-stat" style={{ "--o": `${(i * 0.15).toFixed(2)}s` } as CSSProperties}>
              <Art />
              <p className="ab-stat-v">
                <Count v={s.v} />
                <span className="sr-only">{s.v}</span>
              </p>
              <p className="ab-stat-l">{s.l}</p>
            </li>
          );
        })}
      </Reveal>
      <Reveal as="ul" className="ab-logos">
        {PARTNERS.map((l, i) => (
          <li key={l.alt} className="ab-logo" style={d(0.1 + i * 0.07)}>
            <Image src={l.src} alt={l.alt} width={l.w} height={l.h} sizes="130px" />
          </li>
        ))}
      </Reveal>
    </section>
  );
}
