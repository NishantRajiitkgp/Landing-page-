import type { ReactNode } from "react";
import { Fragment } from "react";
import Image from "next/image";

import { SIZES_CCARD, noteInk, tint } from "@/lib/img";
import { copy } from "@/lib/copy/request";
import { SECTIONS, type CountrySrc, type StatId } from "@/lib/copy/sections";
import { Globe } from "./Globe";

/** International coverage.
 *
 *  DESKTOP IS NOW HOMEPAGE V2's GLOBE (`./Globe`, Sep 2026); everything below
 *  describes the card grid, which the phone still renders.
 *
 *  778 lines for ten cards — the same five countries written out once per
 *  breakpoint. One component over one record list now (BUILD-SPEC §4 rule 2,
 *  §17 condition 22).
 *
 *  ONE LIST FOR BOTH BREAKPOINTS, measured rather than assumed, as in
 *  `Packages.tsx` and unlike `PeopleStrip.tsx`: same five countries, same
 *  order, and every field — image, flag, name, the three `cst` values, the
 *  `cby` time — compared equal character for character across the two copies.
 *
 *  Three things are breakpoint facts, so they are branches here and not fields:
 *  the `note` caption over the photograph (DESKTOP ONLY — the mobile card never
 *  had one, which is the regression `PeopleStrip.tsx` shipped the other way
 *  round); six whitespace text nodes, which React emits as real text nodes; and
 *  the last mobile card spanning both columns at 230px, which is about the
 *  fifth slot of a two-column grid rather than about Egypt.
 *
 *  The flag hex stays literal: flags are facts about the world, not palette —
 *  the exemption `check:tokens` was given in Part 3, and the reason
 *  `components/brand/Tick.tsx` could collapse and these cannot.
 */

type Country = {
  readonly src: CountrySrc;
  /** The flag's children only; the `<svg>` wrapper is identical on all five. */
  readonly flag: ReactNode;
};

const COUNTRIES: readonly Country[] = [
  {
    src: "/img/16-united-kingdom.jpg",
    flag: (
      <>
        <rect width="30" height="20" fill="#012169" />
        <path d="M0 0L30 20M30 0L0 20" stroke="#FFFFFF" strokeWidth="4" />
        <path d="M0 0L30 20M30 0L0 20" stroke="#C8102E" strokeWidth="1.5" />
        <rect x="12.5" width="5" height="20" fill="#FFFFFF" />
        <rect y="7.5" width="30" height="5" fill="#FFFFFF" />
        <rect x="13.5" width="3" height="20" fill="#C8102E" />
        <rect y="8.5" width="30" height="3" fill="#C8102E" />
      </>
    ),
  },
  {
    src: "/img/17-philippines.jpg",
    flag: (
      <>
        <rect width="30" height="10" fill="#0038A8" />
        <rect y="10" width="30" height="10" fill="#CE1126" />
        <polygon points="3,0 16,10 3,20" fill="#FFFFFF" />
        <circle cx="8" cy="10" r="1.7" fill="#FCD116" />
      </>
    ),
  },
  {
    src: "/img/18-uae.jpg",
    flag: (
      <>
        <rect width="30" height="6.7" fill="#00732F" />
        <rect y="6.7" width="30" height="6.6" fill="#FFFFFF" />
        <rect y="13.3" width="30" height="6.7" fill="#15140F" />
        <rect x="3" width="8" height="20" fill="#FF0000" />
      </>
    ),
  },
  {
    src: "/img/19-singapore.jpg",
    flag: (
      <>
        <rect width="30" height="10" fill="#EF3340" />
        <rect y="10" width="30" height="10" fill="#FFFFFF" />
        <circle cx="9.5" cy="5" r="2.8" fill="#FFFFFF" />
        <circle cx="10.6" cy="5" r="2.4" fill="#EF3340" />
      </>
    ),
  },
  {
    src: "/img/20-egypt.jpg",
    flag: (
      <>
        <rect width="30" height="6.7" fill="#CE1126" />
        <rect y="6.7" width="30" height="6.6" fill="#FFFFFF" />
        <rect y="13.3" width="30" height="6.7" fill="#15140F" />
        <circle cx="15" cy="10" r="1.8" fill="#C09300" />
      </>
    ),
  },
];

/** The three fixed labels, in the order every card renders them. The words
 *  are `lib/copy/sections`' `international.statLabels` and each country's
 *  three values are keyed by these SAME ids, so a label and its value
 *  cannot come apart - which a positional tuple could not promise. */
const STATS: readonly StatId[] = ["audience", "count", "ready"];

async function CountryCard({ c, mob = false, wide = false }: { c: Country; mob?: boolean; wide?: boolean }) {
  const t = (await copy(SECTIONS)).international;
  const country = t.countries[c.src];
  // Six whitespace text nodes the desktop card has and the mobile one does not.
  // See the header note: these are output, not formatting.
  const gap = mob ? null : " ";
  return (
    <div className="cc" {...(wide ? { style: { gridColumn: "span 2" } } : {})}>
      {" "}
      <div
        className="ccard ph"
        style={wide ? { background: tint(c.src), height: "230px" } : { background: tint(c.src) }}
      >
        {gap}
        <div className="light"></div>
        <Image className="pimg" src={c.src} alt="" fill sizes={SIZES_CCARD} />
        {/* All five country tints are dark (relative luminance 0.140-0.243), so
            all five captions invert. Keyed by image in `lib/img.ts` beside the
            tint that causes it; it was an `rgba()` literal here, invisible to
            `hv/no-color-literal` until 22 Sep 2026. */}
        {!mob && (
          <div className="note" style={{ top: "22%", color: noteInk(c.src) }}>
            {country.note}
          </div>
        )}
        {gap}
        <div className="shade"></div>
        {" "}
        <div className="ccin">
          {gap}
          <div className="flag">
            <span className="fl" style={{ width: "30px", height: "30px" }}>
              <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                {c.flag}
              </svg>
            </span>
          </div>
          {gap}
          <div className="cn">{country.name}</div>
          {gap}
          <div className="crule"></div>
          {gap}
          <div className="cst">
            {STATS.map((k, i) => (
              <div key={i}>
                <span>{t.statLabels[k]}</span>
                <b>{country.stats[k]}</b>
              </div>
            ))}
          </div>
          {gap}
        </div>
        {" "}
      </div>
      {" "}
      <div className="cby">
        <span>{t.readyBy}</span>
        <b>{country.by}</b>
      </div>
      {" "}
    </div>
  );
}

/** The grid. Each card is preceded by a space and the run ends with one,
 *  exactly as the hand-written markup did. */
function Grid({
  mob,
  wideLast,
  style,
}: {
  mob?: boolean;
  wideLast?: boolean;
  style: React.CSSProperties;
}) {
  return (
    <div style={style}>
      {COUNTRIES.map((c, i) => (
        <Fragment key={i}>
          {" "}
          <CountryCard c={c} mob={mob} wide={wideLast && i === COUNTRIES.length - 1} />
        </Fragment>
      ))}{" "}
    </div>
  );
}

export async function International() {
  const t = (await copy(SECTIONS)).international;

  return (
    <>
      {/* Homepage v2: the globe replaces the five cards on desktop. The
          phone keeps the grid below until the v2 boards have a 390px
          artboard to port from. */}
      <div className="dsk">
        <Globe />
      </div>
      <div className="mob">
        <div className="wrap sec hair-top">
          {" "}
          {/* No `lede` here. The desktop block carries one and this one never
              has — accounted for rather than assumed symmetrical. */}
          <h2 className="h2">
            {t.headingMob}
          </h2>
          {" "}
          <Grid
            mob
            wideLast
            style={{
              marginTop: "28px",
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "14px",
            }}
          />
          {" "}
        </div>
      </div>
    </>
  );
}
