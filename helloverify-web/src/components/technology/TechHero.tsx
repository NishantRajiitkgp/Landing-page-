/** The `/technology` hero: the headline beside its sentence, drawn top to
    bottom as one small board.

      0.1s  the document is handed over
      0.4s  AI, inside a field of past verifications, reads it: each detail
            on the document is framed
      0.7s  below, three countries, each with its own authorised sources
      2.0s  the AI routes straight to the institution that issued the
            document, which confirms; the answer climbs back
      3.4s  the document is sealed, and the field of past verifications —
            the millions it was trained on — lights up

    Every sideways measure mirrors under `dir="rtl"`, labels counter-flip.
    Decoration, `aria-hidden`. */
import type { CSSProperties, ReactNode } from "react";
import { AppLink } from "@/components/chrome/AppLink";
import { Arrow } from "@/components/brand/Arrow";
import { splitWords } from "@/components/brand/splitWords";
import "@/app/v2/tech.css";
import { Logo } from "@/components/brand/Logo";
import { CAP, CASE, GLOBE, Glyph, ID, INST, Label, OFFICE, Ok, d, type TechArt } from "./TechPillarKit";

const C = { x: 200, y: 236 };
const DOTS = (() => {
  const out: { x: number; y: number; early: boolean }[] = [];
  let i = 0;
  for (let x = 44; x <= 356; x += 12)
    for (let y = 152; y <= 316; y += 12) {
      const r = Math.hypot(x - C.x, y - C.y);
      if (r > 66 && r < 156) out.push({ x, y, early: i % 6 === 0 });
      i++;
    }
  return out;
})();

/** Three countries, each with two authorised sources. The middle country's
    first source issued the document. */
const REGIONS = [
  { x: 16, a: INST, z: CASE },
  { x: 144, a: CAP, z: INST },
  { x: 272, a: ID, z: OFFICE },
];
const ISSUER = { x: 178, y: 404 };
const ROUTE = `M200 252V340C200 370 ${ISSUER.x} 370 ${ISSUER.x} ${ISSUER.y - 17}`;

function Proof({ l }: { l: TechArt }) {
  return (
    <svg className="tk-h-svg tk-mirror" viewBox="0 0 400 476" fill="none">
      {DOTS.filter((p) => p.early).map((p) => (
        <circle key={`${p.x}-${p.y}`} className="tk-h-dot tk-a-fade" cx={p.x} cy={p.y} r="1.5" style={d(0.6)} />
      ))}
      {DOTS.map((p) => (
        <circle key={`${p.x}-${p.y}`} className="tk-h-dot-on tk-a-fade" cx={p.x} cy={p.y} r="1.6" style={d(3.6 + (p.x % 5) * 0.06)} />
      ))}

      {/* The document */}
      <g className="tk-a-drop" style={d(0.1)}>
        <rect className="tk-sheet" x="128" y="18" width="144" height="112" rx="12" />
        <circle className="tk-paperfill" cx="152" cy="44" r="12" />
        <Glyph g={CAP} x={152} y={44} s={0.6} />
        <rect className="tk-inkbar" x="172" y="38" width="64" height="6" rx="3" />
        <rect className="tk-soft" x="172" y="50" width="40" height="5" rx="2.5" />
        <rect className="tk-bar" x="142" y="74" width="116" height="5" rx="2.5" />
        <rect className="tk-bar" x="142" y="90" width="96" height="5" rx="2.5" />
        <rect className="tk-bar" x="142" y="106" width="70" height="5" rx="2.5" />
      </g>
      {[
        [166, 32, 76, 28],
        [137, 69, 126, 15],
        [137, 101, 80, 15],
      ].map(([x, y, w, h], i) => (
        <rect key={y} className="tk-fbox tk-a-draw" x={x} y={y} width={w} height={h} rx="4" pathLength="1" style={d(1.2 + i * 0.16, { "--t": ".3s" })} />
      ))}

      {/* The wordmark reads the document, then routes it on */}
      <path className="tk-p-link tk-a-draw" d="M200 130V220" pathLength="1" style={d(1, { "--t": ".3s" })} />
      <path className="tk-comet tk-a-comet" d="M200 130V220" pathLength="1" style={d(1, { "--t": ".3s" })} />
      <circle className="tk-h-ring tk-a-fade" cx={C.x} cy={C.y} r="56" style={d(0.5)} />
      <g className="tk-a-pop" style={d(0.4)} transform="translate(200 236)">
        <g className="tk-uf">
          <rect className="tk-sheet" x="-40" y="-16" width="80" height="32" rx="10" />
          <g transform="translate(-36 -10.5)">
            <Logo width={72} height={21} />
          </g>
        </g>
      </g>

      {/* Three countries' authorised sources */}
      {REGIONS.map((r, i) => {
        const cx = r.x + 56;
        return (
          <g key={r.x}>
            <path className="tk-edge2 tk-a-draw" d={`M200 252C200 300 ${cx} 300 ${cx} 336`} pathLength="1" style={d(0.9 + i * 0.08)} />
            <g className="tk-a-in" style={d(0.7 + i * 0.1)}>
              <rect className="tk-sheet" x={r.x} y="336" width="112" height="96" rx="14" />
              <circle className="tk-node" cx={r.x + 18} cy="354" r="10" />
              <Glyph g={GLOBE} x={r.x + 18} y={354} s={0.42} cls="tk-ic tk-ic-m" />
              <path className="tk-hair" d={`M${cx - 22} 404H${cx + 22}`} />
              <circle className="tk-node" cx={cx - 22} cy="404" r="17" />
              <Glyph g={r.a} x={cx - 22} y={404} s={0.62} />
              <circle className="tk-node" cx={cx + 22} cy="404" r="17" />
              <Glyph g={r.z} x={cx + 22} y={404} s={0.62} />
            </g>
          </g>
        );
      })}
      <Label x={200} y={466} at={1}>{l.sources}</Label>

      {/* Routed to the issuer, who confirms; the document is sealed */}
      <path className="tk-p-link tk-a-draw" d={ROUTE} pathLength="1" style={d(2, { "--t": ".5s" })} />
      <path className="tk-comet tk-a-back" d={ROUTE} pathLength="1" style={d(3, { "--t": ".4s" })} />
      <path className="tk-comet tk-a-back" d="M200 130V220" pathLength="1" style={d(3.3, { "--t": ".25s" })} />
      <circle className="tk-hi-ring tk-a-pop" cx={ISSUER.x} cy={ISSUER.y} r="21" style={d(2.5)} />
      <Ok x={ISSUER.x + 14} y={ISSUER.y - 15} r={7} at={2.7} />
      <circle className="tk-pale tk-a-pop" cx="250" cy="112" r="19" style={d(3.4)} />
      <Ok x={250} y={112} r={13} at={3.5} />
    </svg>
  );
}

export function TechHero({
  kicker,
  h1,
  sub,
  cta,
  href,
  art,
}: {
  kicker: string;
  h1: ReactNode;
  sub: string;
  cta: string;
  href: string;
  art: TechArt;
}) {
  const count = { i: 0 };
  const headline = splitWords(h1, "tk-w", count);

  return (
    <section className="tk-hero">
      <div className="wrap tk-hero-in">
        <div className="tk-copy" style={{ "--n": count.i } as CSSProperties}>
          <p className="tk-kick">
            <span className="tk-kick-dot" aria-hidden="true" />
            {kicker}
          </p>
          <h1 className="tk-h1">{headline}</h1>
          <p className="tk-sub">{sub}</p>
          <div className="tk-acts">
            <AppLink href={href} className="btn btn-ink tk-cta">
              <span>{cta}</span>
              <Arrow />
            </AppLink>
          </div>
        </div>

        <div className="tk-proof" aria-hidden="true">
          <Proof l={art} />
        </div>
      </div>
    </section>
  );
}
