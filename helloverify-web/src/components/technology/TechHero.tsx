/** The `/technology` hero: the headline beside its sentence as one small
    object, an exploded stack of three glass planes.

      top     the document handed over
      middle  AI, reading it: the scan passes, each detail is framed
      bottom  the network of authorised sources, a hub among institutions

    One red signal plays the process once, in under five seconds: it drops
    through the stack to the hub, is routed to the institution that issued
    the document, which confirms; the answer climbs back and the document is
    sealed. The drawing carries no text, so it mirrors whole under
    `dir="rtl"`. Decoration, `aria-hidden`. */
import type { CSSProperties, ReactNode } from "react";
import { AppLink } from "@/components/chrome/AppLink";
import { Arrow } from "@/components/brand/Arrow";
import { splitWords } from "@/components/brand/splitWords";
import "@/app/v2/tech.css";
import type { TechArt } from "./TechPillarKit";

const d = (s: number) => ({ "--d": `${s.toFixed(2)}s` }) as CSSProperties;

/** Isometric planes, 160 square, drawn flat and projected. The tops of the
    three planes sit at these heights; a plane's centre is 80 below. */
const CX = 260;
const DOC = 20;
const AI = 125;
const SRC = 230;
const iso = (top: number) => `matrix(.866 .5 -.866 .5 ${CX} ${top})`;
const at = (u: number, v: number, top: number) => [CX + (u - v) * 0.866, top + (u + v) * 0.5] as const;

/** Institutions round the hub; the first is the one that issued the document. */
const NODES = [-20, 60, 130, 200, 250, 300].map((a) => {
  const r = (a * Math.PI) / 180;
  return { u: +(80 + 58 * Math.cos(r)).toFixed(1), v: +(80 + 58 * Math.sin(r)).toFixed(1) };
});
const ISSUER = NODES[0];
const [PX, PY] = at(ISSUER.u, ISSUER.v, SRC);

const CREST = "M3.5 9.5 12 5l8.5 4.5zM5.5 10.5v6M9.8 10.5v6M14.2 10.5v6M18.5 10.5v6M3.5 19h17";
const LINES = [
  { y: 62, w: 96, h: 7, cls: "tk-i-ln-strong" },
  { y: 80, w: 110, h: 5, cls: "tk-i-ln" },
  { y: 94, w: 80, h: 5, cls: "tk-i-ln" },
  { y: 122, w: 40, h: 4, cls: "tk-i-ln" },
];
const SCAN_AT = [1.52, 1.64, 1.72, 1.88];

function Tick({ x, y, r, cls }: { x: number; y: number; r: number; cls: string }) {
  const k = r / 9;
  return (
    <g className={`tk-i-ok ${cls}`}>
      <circle className="tk-i-ok-bg" cx={x} cy={y} r={r} />
      <path className="tk-i-ok-tick" d={`M${x - 3.6 * k} ${y + 0.2 * k}l${2.6 * k} ${2.6 * k} ${4.8 * k} -${5.2 * k}`} pathLength="1" />
    </g>
  );
}

function Layer({ top, from, delay, children, after }: { top: number; from: number; delay: number; children: ReactNode; after?: ReactNode }) {
  return (
    <g className="tk-i-in" style={{ "--from": `${from}px`, ...d(delay) } as CSSProperties}>
      <g className="tk-i-plane">
        <g transform={iso(top)}>{children}</g>
      </g>
      {after}
    </g>
  );
}

const ns = { vectorEffect: "non-scaling-stroke" } as const;

function Stack() {
  return (
    <svg className="tk-i-svg tk-mirror" viewBox="96 0 328 404" fill="none">
      <defs>
        <pattern id="tk-i-dots" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="1" fill="currentColor" />
        </pattern>
      </defs>

      <path className="tk-i-guide" d={`M${CX - 138.6} ${DOC + 80}V${SRC + 80}M${CX + 138.6} ${DOC + 80}V${SRC + 80}`} />

      {/* The authorised sources */}
      <Layer
        top={SRC}
        from={34}
        delay={0.15}
        after={
          <>
            <path className="tk-i-stem" d={`M${PX} ${PY}V${PY - 26}`} pathLength="1" />
            <g className="tk-i-pin">
              <circle className="tk-i-badge" cx={PX} cy={PY - 39} r="13" />
              <path className="tk-i-glyph" d={CREST} transform={`translate(${PX - 7.5} ${PY - 46.5}) scale(.625)`} />
            </g>
            <Tick x={PX + 10} y={PY - 49} r={6} cls="tk-i-ok-pin" />
          </>
        }
      >
        <rect className="tk-i-face tk-i-face-src" width="160" height="160" rx="14" {...ns} />
        {[24, 41, 58].map((r, i) => (
          <circle key={r} className="tk-i-ring" cx="80" cy="80" r={r} pathLength="1" style={d(0.5 + i * 0.12)} {...ns} />
        ))}
        {NODES.map((n, i) => (
          <path key={i} className="tk-i-spoke" d={`M80 80L${n.u} ${n.v}`} pathLength="1" style={d(0.8 + i * 0.06)} {...ns} />
        ))}
        <path className="tk-i-route" d={`M80 80L${ISSUER.u} ${ISSUER.v}`} pathLength="1" {...ns} />
        <path className="tk-i-comet tk-i-c3" d={`M80 80L${ISSUER.u} ${ISSUER.v}`} pathLength="1" {...ns} />
        <path className="tk-i-comet tk-i-c3b" d={`M80 80L${ISSUER.u} ${ISSUER.v}`} pathLength="1" {...ns} />
        {NODES.map((n, i) => (
          <circle key={i} className={i ? "tk-i-node" : "tk-i-node tk-i-issuer"} cx={n.u} cy={n.v} r="3.4" style={d(0.95 + i * 0.06)} />
        ))}
        <circle className="tk-i-rip tk-i-rip-src" cx={ISSUER.u} cy={ISSUER.v} r="9" {...ns} />
        <circle className="tk-i-rip tk-i-rip-hub" cx="80" cy="80" r="9" {...ns} />
        <circle className="tk-i-hub" cx="80" cy="80" r="6.5" {...ns} />
      </Layer>

      <path className="tk-i-beam tk-i-b2" d={`M${CX} ${AI + 80}V${SRC + 80}`} pathLength="1" />
      <path className="tk-i-comet tk-i-c2" d={`M${CX} ${AI + 80}V${SRC + 80}`} pathLength="1" />
      <path className="tk-i-comet tk-i-c2b" d={`M${CX} ${AI + 80}V${SRC + 80}`} pathLength="1" />

      {/* AI, reading the document */}
      <Layer top={AI} from={0} delay={0.3}>
        <rect className="tk-i-face tk-i-face-ai" width="160" height="160" rx="14" {...ns} />
        <rect className="tk-i-dots" x="6" y="6" width="148" height="148" rx="9" fill="url(#tk-i-dots)" />
        <path className="tk-i-corner" d="M14 30V14H30M130 14H146V30M146 130V146H130M30 146H14V130" {...ns} />
        {LINES.map((l, i) => (
          <rect key={i} className="tk-i-frame" x="21" y={l.y - 5} width={l.w + 10} height={l.h + 10} rx="3" pathLength="1" style={d(SCAN_AT[i])} {...ns} />
        ))}
        <path className="tk-i-scan" d="M8 0H152" {...ns} />
      </Layer>

      <path className="tk-i-beam tk-i-b1" d={`M${CX} ${DOC + 80}V${AI + 80}`} pathLength="1" />
      <path className="tk-i-comet tk-i-c1" d={`M${CX} ${DOC + 80}V${AI + 80}`} pathLength="1" />
      <path className="tk-i-comet tk-i-c1b" d={`M${CX} ${DOC + 80}V${AI + 80}`} pathLength="1" />

      {/* The document */}
      <Layer
        top={DOC}
        from={-34}
        delay={0.45}
        after={
          <g className="tk-i-seal">
            <circle className="tk-i-seal-ring" cx={CX} cy={DOC + 128} r="20" />
            <Tick x={CX} y={DOC + 128} r={13} cls="tk-i-ok-seal" />
          </g>
        }
      >
        <rect className="tk-i-face tk-i-face-doc" width="160" height="160" rx="14" {...ns} />
        <rect className="tk-i-border" x="9" y="9" width="142" height="142" rx="8" {...ns} />
        <circle className="tk-i-crest" cx="36" cy="34" r="11" {...ns} />
        {LINES.map((l, i) => (
          <rect key={i} className={l.cls} x="26" y={l.y} width={l.w} height={l.h} rx={l.h / 2} />
        ))}
      </Layer>
    </svg>
  );
}

export function TechHero({
  kicker,
  h1,
  sub,
  cta,
  href,
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
          <Stack />
        </div>
      </div>
    </section>
  );
}
