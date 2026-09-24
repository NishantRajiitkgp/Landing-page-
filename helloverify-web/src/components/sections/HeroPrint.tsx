"use client";

/** The security print under the v2 hero: the turning guilloche, the UV lamp,
    and what the lamp reveals (a green print, a ring of microtext, paper
    fibres). Decorative throughout — every layer is `aria-hidden`.

    WHY A CLIENT COMPONENT, when it has no state and no handlers. A Server
    Component's output is sent twice — once as HTML and once more inside the
    RSC flight payload that hydration reads — and the guilloche is ~18 KB of
    path data. Measured on `/en` with it server-rendered: the hero's desktop
    tree was 42.4 KB raw in the HTML and the flight payload carried the same
    paths again, which put the page at 464.7 KB against `check-budgets.mjs`'s
    460 KB ceiling. Rendered here instead, the paths are computed from the
    ring formulas in `lib/heroArt.ts` (≈1 KB of code) during SSR and again on
    hydration, so the HTML still paints the print before any JS runs but the
    flight payload carries only the one `uvRing` string. The formula is what
    ships, not its output. */

import { FIBRES, GUILLOCHE, RING_IDS, type RingId } from "@/lib/heroArt";

function Copies({ id }: { id: RingId }) {
  return GUILLOCHE[id].rotations.map((r) => <use key={r} href={`#hvg-${id}`} transform={`rotate(${r})`} />);
}

export function HeroPrint({ uvRing }: { uvRing: string }) {
  return (
    <>
      <svg className="hv-guil" viewBox="-600 -600 1200 1200" aria-hidden="true" focusable="false">
        <defs>
          {RING_IDS.map((id) => (
            <path key={id} id={`hvg-${id}`} d={GUILLOCHE[id].d} />
          ))}
          <path id="hv-mt-path" d="M0 -500 A500 500 0 1 1 0 500 A500 500 0 1 1 0 -500" />
        </defs>
        {/* One layer per ring, each a shade of the paper's own ink. Literal
            SVG attributes on purpose: this is the print — artwork, the
            exemption `hv/no-color-literal` gives flags and wordmarks — and a
            re-theme would redraw it rather than re-token it. */}
        <g fill="none" stroke="#D6D0C3" strokeWidth="0.7"><Copies id="gA" /></g>
        <g fill="none" stroke="#DCD6CA" strokeWidth="0.7"><Copies id="gB" /></g>
        <g fill="none" stroke="#D3CDBF" strokeWidth="0.65"><Copies id="gC" /></g>
        <g fill="none" stroke="#CEC8BA" strokeWidth="0.6"><Copies id="gD" /></g>
      </svg>
      <div className="hv-lamp" aria-hidden="true" />
      <div className="hv-uv" aria-hidden="true">
        <svg className="hv-guil hv-guil-uv" viewBox="-600 -600 1200 1200" focusable="false">
          <g fill="none" stroke="#1B6B4A" strokeWidth="1.05" strokeOpacity="0.85">
            {RING_IDS.map((id) => <Copies key={id} id={id} />)}
          </g>
          <text fontFamily="geistMono, SF Mono, Menlo, monospace" fontSize="10" letterSpacing="2" fill="#1B6B4A" fontWeight="500">
            <textPath href="#hv-mt-path" textLength="3080" lengthAdjust="spacing">{uvRing}</textPath>
          </text>
        </svg>
        <svg className="hv-fibres" viewBox="0 0 1440 900" preserveAspectRatio="none" focusable="false">
          <path d={FIBRES} fill="none" stroke="#2E9A6B" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.95" />
        </svg>
      </div>
    </>
  );
}
