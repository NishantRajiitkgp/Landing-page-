/** 04 · Governments We Work With — chapter four (`./GovWhy`).

    Same kit and 12 s beat as `./GovWhyTrust`. 01 laid the layer, 02 was
    the first door, 03 took organisations onto it. 04 is who is already
    there — and it cannot be a row of crests. A crest is one client; the
    sentence is a growing set of authorities and enterprises. Seats are
    the two marks from 03 (a hall, an office), identical, unnamed. They
    join from the middle outward onto one bus through HelloVerify, and
    the row is cut off at both edges of the frame: it does not end at
    the ones you can see. Clock: `govwhy.css` "04 · GOVS". At rest: every
    seat lit, the bus live. */
import { Logo } from "@/components/brand/Logo";
import type { SectionsCopy } from "@/lib/copy/sections";

type W = SectionsCopy["govWhy"]["viz"]["who"];

/** Centre 160, step 40. The first and last sit on the frame edge, so
 *  the viz clips them: the row continues past the card. */
const XS = [0, 40, 80, 120, 160, 200, 240, 280, 320];
/** Outward from the middle, so a pair shares one arrival. */
const RING = ["gwb-r4", "gwb-r3", "gwb-r2", "gwb-r1", "gwb-r0", "gwb-r1", "gwb-r2", "gwb-r3", "gwb-r4"];
const HALL = new Set([0, 2, 4, 6, 8]);

function Hall() {
  return <path d="M-8.5-3L0-8l8.5 5zM-6-1v6M-2-1v6M2-1v6M6-1v6M-8.5 7h17" />;
}
function Office() {
  return <path d="M-5.5 7V-7h8v14M2.5-2h4V7M-8 7h16M-3-4h3M-3-1h3M-3 2h3" />;
}

export function ArtGovs({ layer, who }: { layer: string; who: W }) {
  return (
    <svg className="gwt gwb" viewBox="0 0 320 210" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="gwb-soil" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path className="gwt-hatch" d="M0 0V7" />
        </pattern>
        <radialGradient id="gwb-glow">
          <stop offset="0" className="gwt-glow-a" />
          <stop offset="1" className="gwt-glow-b" />
        </radialGradient>
      </defs>

      <rect className="gwt-rock" x="-200" y="168" width="720" height="240" />
      <rect className="gwt-soil" x="-200" y="100" width="720" height="68" />
      <rect x="-200" y="100" width="720" height="68" fill="url(#gwb-soil)" />
      <path className="gwt-strata" d="M-200 168H520" />
      <path className="gwt-ground" d="M-200 100H520" />
      <circle cx="160" cy="134" r="78" fill="url(#gwb-glow)" />
      <text className="gwt-mono gwt-mono-hot" x="6" y="137">{layer}</text>

      <g transform="translate(92 18)">
        <g className="gw-ico" transform="scale(.55)"><Hall /></g>
        <text className="gwb-leg" x="12" y="3">{who.a}</text>
      </g>
      <g transform="translate(188 18)">
        <g className="gw-ico" transform="scale(.55)"><Office /></g>
        <text className="gwb-leg" x="12" y="3">{who.e}</text>
      </g>

      <path className="gwt-pipe" pathLength={1} d="M-40 112H360" />
      <path className="gwt-pipe-in" pathLength={1} d="M-40 112H360" />
      <g className="gwb-flow">
        <path className="gwt-live" d="M-40 112H360" />
      </g>
      <g className="gwb-fin">
        <path className="gwt-rush" d="M-40 112H360" />
        <path className="gwt-glowline" d="M-200 100H520" />
      </g>

      <g className="gwt-core-g">
        <rect className="gwt-core" x="114" y="120" width="92" height="28" rx="14" />
        <g transform="translate(127 124.5)">
          <Logo width={66} height={19} />
        </g>
      </g>

      {XS.map((x, i) => (
        <g key={x} className={`gwb-j ${RING[i]}`}>
          <path className="gwt-live gwb-stem" d={`M${x} 91V112`} />
          <g className="gwb-on" transform={`translate(${x} 78)`}>
            <circle r="13" />
            <g className="gw-ico" transform="scale(.7)">{HALL.has(i) ? <Hall /> : <Office />}</g>
          </g>
        </g>
      ))}
    </svg>
  );
}
