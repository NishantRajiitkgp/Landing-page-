/** 03 · AI powered platform — chapter three (`./GovWhy`).

    Same kit and 12 s beat as `./GovWhyTrust`. Rebuilt 9 Oct 2026 as the
    ecosystem ("make it immediately obvious who uses it and what each party
    does"): one platform, every player on it. Above ground, the five who
    use it, each with its name and its one-line role: employer, driver,
    tenant, vendor, supplier. In the layer, HelloVerify and its AI. At the
    bedrock, the government authorities who hold the records.

    The loop: each party in turn sends a check down into HelloVerify, on to
    the government and back, and is connected — lit, ticked. When all five
    are on, HelloVerify pulses once: one platform. Clock: `govwhy.css`
    "03 · PLATFORM". At rest: every party and the government lit. */
import type { ReactNode } from "react";

import { Logo } from "@/components/brand/Logo";
import type { SectionsCopy } from "@/lib/copy/sections";

import { lines, Tick } from "./GovWhyArt";

type E = SectionsCopy["govWhy"]["viz"]["eco"];

/** Each party's token, down to the ground and into HelloVerify. Two
 *  levels of bends so no pipe crosses another. */
const PIPE = [
  "M40 80V104Q40 108 44 108H126Q130 108 130 112V120",
  "M100 80V100Q100 104 104 104H141Q145 104 145 108V120",
  "M160 80V120",
  "M220 80V100Q220 104 216 104H179Q175 104 175 108V120",
  "M280 80V104Q280 108 276 108H194Q190 108 190 112V120",
];
const GOV = "M160 148V172";
/** Per party, in tenths of a second: its check leaves, reaches the
 *  government, comes back to HelloVerify, back up to the party. */
const CHECK = [8, 26, 44, 62, 80].map((t) => ({
  ask: `gwt-d${t}`,
  gov: `gwt-d${t + 4}`,
  back: `gwt-d${t + 8}`,
  up: `gwt-d${t + 12}`,
  lit: `gwt-d${t + 16}`,
}));

const ICO = {
  employer: () => <path d="M-7-2.5h14v9H-7zM-2.8-2.5V-5h5.6v2.5M-7 1.5h14" />,
  driver: () => (
    <>
      <circle r="7" />
      <circle r="2" />
      <path d="M-7 0h5M2 0h5M0 2v5" />
    </>
  ),
  tenant: () => <path d="M-7.5-.5L0-7l7.5 6.5M-5.5-2.2V7h11V-2.2M-1.8 7V2.4h3.6V7" />,
  vendor: () => (
    <path d="M-8-3l1.6-4h12.8L8-3c0 1.5-1.2 2.5-2.7 2.5S2.7-1.5 2.7-3c0 1.5-1.2 2.5-2.7 2.5S-2.7-1.5-2.7-3c0 1.5-1.2 2.5-2.7 2.5S-8-1.5-8-3zM-6.5-.5V7h13V-.5M-2 7V3h4v4" />
  ),
  supplier: () => (
    <>
      <path d="M-8 3.5v-8h9.5v8M1.5-1.5h3.6L8 1.5v2H1.5M-8 3.5h1.7M-2.7 3.5h4.4" />
      <circle cx="-4.5" cy="4.6" r="1.8" />
      <circle cx="4.4" cy="4.6" r="1.8" />
    </>
  ),
  gov: () => <path d="M-8.5-3L0-8l8.5 5zM-6-1v6M-2-1v6M2-1v6M6-1v6M-8.5 7h17" />,
};
const ORDER = ["employer", "driver", "tenant", "vendor", "supplier"] as const;

function Token({ ico, lit }: { ico: () => ReactNode; lit?: boolean }) {
  return (
    <g className={lit ? "gwa-tok-on" : "gwa-tok"}>
      <circle r="12" />
      <g className="gw-ico" transform="scale(.8)">{ico()}</g>
    </g>
  );
}

export function ArtPlatform({ core, eco }: { core: string; eco: E }) {
  return (
    <svg className="gwt gwt-min gwa" viewBox="0 0 320 210" aria-hidden="true" focusable="false">
      <rect className="gwt-rock" x="-200" y="160" width="720" height="240" />
      <rect className="gwt-soil" x="-200" y="100" width="720" height="60" />
      <path className="gwt-strata" d="M-200 160H520" />
      <path className="gwt-ground" d="M-200 100H520" />
      <text className="gwt-mono gwt-mono-hot" x="6" y="137">{eco.layer}</text>

      {[...PIPE, GOV].map((d) => <path key={d} className="gwt-pipe" pathLength={1} d={d} />)}
      {PIPE.map((d, i) => (
        <g key={d} className={`gwa-on-${i}`}>
          <path className="gwt-live" d={d} />
        </g>
      ))}
      <g className="gwa-on-g">
        <path className="gwt-live" d={GOV} />
      </g>

      {CHECK.map((c, i) => (
        <g key={c.ask}>
          <path className={`gwt-pk ${c.ask}`} pathLength={1} d={PIPE[i]} />
          <path className={`gwt-pk ${c.gov}`} pathLength={1} d={GOV} />
          <path className={`gwt-pk gwt-rev ${c.back}`} pathLength={1} d={GOV} />
          <path className={`gwt-pk gwt-rev ${c.up}`} pathLength={1} d={PIPE[i]} />
        </g>
      ))}

      <g className="gwt-core-g">
        <rect className="gwt-core" x="114" y="120" width="92" height="28" rx="14" />
        <g transform="translate(127 124.5)">
          <Logo width={66} height={19} />
        </g>
      </g>
      {[...CHECK.map((c) => c.gov), "gwt-d100"].map((d) => (
        <rect key={d} className={`gwt-ring ${d}`} x="114" y="120" width="92" height="28" rx="14" />
      ))}
      <g className="gwa-ai">
        <title>{core}</title>
        <path className="gwa-hex" d="M226 122l11 6.3v12.4l-11 6.3-11-6.3v-12.4z" />
        <text className="gwa-ai-t" x="226" y="137" textAnchor="middle">{core}</text>
      </g>

      {/* The government at the bedrock, holding the records. */}
      <g transform="translate(160 184)">
        <Token ico={ICO.gov} />
        <g className="gwa-on-g">
          <Token ico={ICO.gov} lit />
        </g>
      </g>
      <text className="gwa-name" x="178" y="183">{eco.gov.n}</text>
      <text className="gwa-role" x="178" y="193">{eco.gov.r}</text>

      {/* The parties: name, what they do, and their token. */}
      {ORDER.map((k, i) => {
        const x = 40 + i * 60;
        const p = eco.players[k];
        return (
          <g key={k}>
            <text className="gwa-name" x={x} y="21" textAnchor="middle">{p.n}</text>
            <text className="gwa-role" textAnchor="middle">
              {lines(p.r, 15).map((l, j) => (
                <tspan key={j} x={x} y={31 + j * 8}>{l}</tspan>
              ))}
            </text>
            <g transform={`translate(${x} 68)`}>
              <Token ico={ICO[k]} />
              <g className={`gwa-on-${i}`}>
                <Token ico={ICO[k]} lit />
                <g className={`gwt-pop ${CHECK[i].lit}`}>
                  <Tick x={10} y={-9} />
                </g>
              </g>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
