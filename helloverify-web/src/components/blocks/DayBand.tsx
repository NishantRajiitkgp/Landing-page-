import type { ReactNode } from "react";

import { copy } from "@/lib/copy/request";
import { SECTIONS, type HourId, type OfficeId } from "@/lib/copy/sections";
import { Flag, FLAG_INDIA } from "@/components/blocks/Flag";

/** The 24-hour band and the six office rows that run across it.
 *
 *  MOVED OUT OF `sections/Presence.tsx` VERBATIM, 23 Sep 2026 - by line range,
 *  with the mover asserting the bytes are unchanged, because the bar for this
 *  change is byte-identical HTML on all 62 pages. That file was at exactly
 *  300 of the 300 lines `eslint.config.mjs` allows; it is now well under, and
 *  this module and `blocks/Governments.tsx` are where the length went.
 *
 *  STILL `async`, DELIBERATELY. `lib/copy/index.ts`'s fourth corollary is that
 *  `async` decides where a flight row starts and so where React writes a
 *  `<!-- -->`; the recorded deviation under it is eight bytes nobody could
 *  attribute after four full builds. This component was already async in the
 *  tree that was snapshotted, so leaving it async moves no row. Passing the
 *  resolved strings down from `Presence` instead - the shape `PeopleStrip`'s
 *  `Track` uses, and the right shape for a NEW child - would have DELETED a
 *  flight row at each of this component's two call sites, which is a change
 *  to the thing the snapshot measures and not a way of avoiding one.
 *
 *  The list is shared across the breakpoints, measured field by field: same
 *  cities in the same order with the same UTC offsets. What differs is the
 *  flag box (24px desktop, 22px mobile) and the "09-18 local" label, which is
 *  desktop only.
 */

type Office = {
  readonly k: OfficeId;
  /** Where the working day starts, as a percentage of the 24-hour band. */
  readonly start: string;
  readonly flag: ReactNode;
};

/** In band order, west to east as the day runs. The stagger delay is derived
 *  from the position rather than stored: it was 0.0s to 0.5s in exactly this
 *  order, so a stored field would only be somewhere for the two to disagree. */
const OFFICES: readonly Office[] = [
  {
    k: "manila",
    start: "4.17%",
    flag: (
      <>
        <rect width="30" height="10" fill="#0038A8" />
        <rect y="10" width="30" height="10" fill="#CE1126" />
        <polygon points="0,0 13,10 0,20" fill="#FFFFFF" />
        <circle cx="4.6" cy="10" r="1.7" fill="#FCD116" />
      </>
    ),
  },
  {
    k: "singapore",
    start: "4.17%",
    flag: (
      <>
        <rect width="30" height="10" fill="#EF3340" />
        <rect y="10" width="30" height="10" fill="#FFFFFF" />
        <circle cx="6.2" cy="5" r="2.8" fill="#FFFFFF" />
        <circle cx="7.3" cy="5" r="2.4" fill="#EF3340" />
      </>
    ),
  },
  { k: "noida", start: "14.58%", flag: FLAG_INDIA },
  {
    // Not the UAE government tile's drawing: this red hoist band starts at
    // x=0, that one at x=3. Checked, not assumed.
    k: "dubai",
    start: "20.83%",
    flag: (
      <>
        <rect width="30" height="6.7" fill="#00732F" />
        <rect y="6.7" width="30" height="6.6" fill="#FFFFFF" />
        <rect y="13.3" width="30" height="6.7" fill="#15140F" />
        <rect width="8" height="20" fill="#FF0000" />
      </>
    ),
  },
  {
    k: "cairo",
    start: "25.0%",
    flag: (
      <>
        <rect width="30" height="6.7" fill="#CE1126" />
        <rect y="6.7" width="30" height="6.6" fill="#FFFFFF" />
        <rect y="13.3" width="30" height="6.7" fill="#15140F" />
        <circle cx="15" cy="10" r="1.8" fill="#C09300" />
      </>
    ),
  },
  {
    k: "newYork",
    start: "54.17%",
    flag: (
      <>
        <rect width="30" height="20" fill="#FFFFFF" />
        <rect y="0.00" width="30" height="1.54" fill="#B22234" />
        <rect y="3.08" width="30" height="1.54" fill="#B22234" />
        <rect y="6.15" width="30" height="1.54" fill="#B22234" />
        <rect y="9.23" width="30" height="1.54" fill="#B22234" />
        <rect y="12.31" width="30" height="1.54" fill="#B22234" />
        <rect y="15.38" width="30" height="1.54" fill="#B22234" />
        <rect y="18.46" width="30" height="1.54" fill="#B22234" />
        <rect width="12" height="10.8" fill="#3C3B6E" />
      </>
    ),
  },
];

/** The axis labels, and the three gridlines under them. Keyed, not an array:
 *  they sit at `i * 25%`, and `string[]` would let a locale ship four. */
const HOURS: readonly HourId[] = ["h00", "h06", "h12", "h18", "h24"];

export async function DayBand({ mob }: { mob?: boolean }) {
  const t = (await copy(SECTIONS)).presence;
  return (
    <div className="dayband">
      {" "}
      <div className="dayaxis">
        {HOURS.map((h, i) => (
          <span key={i} style={{ insetInlineStart: `${i * 25}%` }}>
            {t.hours[h]}
          </span>
        ))}
      </div>
      {" "}
      <div className="daygrid">
        <div className="cov" style={{ insetInlineStart: "4.17%", width: "87.5%" }}>
          <span>{t.coverage}</span>
        </div>
        {[25, 50, 75].map((p) => (
          <i key={p} style={{ insetInlineStart: `${p}%` }}></i>
        ))}
        <div className="nowl"></div>
      </div>
      {" "}
      <div className="drows">
        {OFFICES.map((o, i) => (
          <div className="drow" key={i}>
            <div className="bar2" style={{ insetInlineStart: o.start, width: "37.5%", animationDelay: `${(i / 10).toFixed(1)}s` }}>
              <Flag size={mob ? "22px" : "24px"}>{o.flag}</Flag>
              <span className="bc">{t.offices[o.k]}</span>
              {/* Desktop only. The mobile row is the flag and the city, which
                  is the kind of omission a symmetrical rewrite invents. */}
              {!mob && <span className="bt">{t.local}</span>}
            </div>
          </div>
        ))}
      </div>
      {" "}
    </div>
  );
}
