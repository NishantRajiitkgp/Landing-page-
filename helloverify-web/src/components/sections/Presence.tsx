import type { ReactNode } from "react";
import Image from "next/image";

import { AVATAR_GT } from "@/lib/img";

/** Where HelloVerify operates, and who vouches for it.
 *
 *  532 lines for 12 office rows and 10 government tiles - six offices and five
 *  governments, each written out once per breakpoint. Two record lists now
 *  (BUILD-SPEC §4 rule 2, §17 condition 22).
 *
 *  Both lists are shared across the breakpoints, measured field by field: same
 *  cities in the same order with the same UTC offsets, same governments, every
 *  flag equal character for character. What differs is the flag box (24px
 *  desktop, 22px mobile), the "09-18 local" label (DESKTOP ONLY - the mobile
 *  row is flag and city alone), and the `.gov` grid, which mobile collapses to
 *  one column.
 *
 *  THE FLAGS ARE NOT SHAREABLE WITH `International.tsx`, checked rather than
 *  assumed: its Singapore crescent sits at cx 9.5/10.6 where this file's is at
 *  6.2/7.3, and its Philippines triangle is drawn from a different origin -
 *  different boxes, different drawings. Only Egypt happens to match, so a
 *  shared registry would carry two variants of most countries and be no
 *  simpler. Within this file India genuinely is drawn twice, byte-identically,
 *  for the Noida row and the Government of India tile: hence `FLAG_INDIA`.
 *
 *  Flag hex stays literal - facts about the world, not palette, which is the
 *  exemption `check:tokens` was given in Part 3.
 */

const FLAG_INDIA = (
  <>
    <rect width="30" height="20" fill="#FFFFFF" />
    <rect width="30" height="6.7" fill="#FF9933" />
    <rect y="13.3" width="30" height="6.7" fill="#138808" />
    <circle cx="15" cy="10" r="2.3" fill="none" stroke="#000080" strokeWidth="0.8" />
  </>
);

type Office = {
  readonly city: string;
  /** Where the working day starts, as a percentage of the 24-hour band. */
  readonly start: string;
  readonly flag: ReactNode;
};

/** In band order, west to east as the day runs. The stagger delay is derived
 *  from the position rather than stored: it was 0.0s to 0.5s in exactly this
 *  order, so a stored field would only be somewhere for the two to disagree. */
const OFFICES: readonly Office[] = [
  {
    city: "Manila",
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
    city: "Singapore",
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
  { city: "Noida", start: "14.58%", flag: FLAG_INDIA },
  {
    // Not the UAE government tile's drawing: this red hoist band starts at
    // x=0, that one at x=3. Checked, not assumed.
    city: "Dubai",
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
    city: "Cairo",
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
    city: "New York",
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

/** The axis labels, and the three gridlines under them. */
const HOURS = ["00:00", "06:00", "12:00", "18:00", "24:00 UTC"];

type Gov = {
  readonly name: string;
  readonly sub: string;
  /** Singapore's ministry is a photograph; the rest are flags. */
  readonly img?: string;
  readonly flag?: ReactNode;
};

const GOVS: readonly Gov[] = [
  { name: "Ministry of Manpower", sub: "Singapore", img: "/img/mom.jpg" },
  { name: "Government of India", sub: "Authorities", flag: FLAG_INDIA },
  {
    name: "Kingdom of Saudi Arabia",
    sub: "Authorities",
    flag: (
      <>
        <rect width="30" height="20" fill="#006C35" />
        <rect x="7" y="7.2" width="16" height="1.3" fill="#FFFFFF" rx="0.6" />
        <rect x="9" y="11" width="12" height="1.1" fill="#FFFFFF" rx="0.5" />
      </>
    ),
  },
  {
    name: "United Arab Emirates",
    sub: "Authorities",
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
    name: "European authorities",
    sub: "Verification workflows",
    flag: (
      <>
        <rect width="30" height="20" fill="#003399" />
        <circle cx="21.00" cy="10.00" r="1" fill="#FFCC00" />
        <circle cx="20.20" cy="13.00" r="1" fill="#FFCC00" />
        <circle cx="18.00" cy="15.20" r="1" fill="#FFCC00" />
        <circle cx="15.00" cy="16.00" r="1" fill="#FFCC00" />
        <circle cx="12.00" cy="15.20" r="1" fill="#FFCC00" />
        <circle cx="9.80" cy="13.00" r="1" fill="#FFCC00" />
        <circle cx="9.00" cy="10.00" r="1" fill="#FFCC00" />
        <circle cx="9.80" cy="7.00" r="1" fill="#FFCC00" />
        <circle cx="12.00" cy="4.80" r="1" fill="#FFCC00" />
        <circle cx="15.00" cy="4.00" r="1" fill="#FFCC00" />
        <circle cx="18.00" cy="4.80" r="1" fill="#FFCC00" />
        <circle cx="20.20" cy="7.00" r="1" fill="#FFCC00" />
      </>
    ),
  },
];

function Flag({ children, size }: { children: ReactNode; size: string }) {
  return (
    <span className="fl" style={{ width: size, height: size }}>
      <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true">{children}</svg>
    </span>
  );
}

function DayBand({ mob }: { mob?: boolean }) {
  return (
    <div className="dayband">
      {" "}
      <div className="dayaxis">
        {HOURS.map((h, i) => (
          <span key={i} style={{ insetInlineStart: `${i * 25}%` }}>
            {h}
          </span>
        ))}
      </div>
      {" "}
      <div className="daygrid">
        <div className="cov" style={{ insetInlineStart: "4.17%", width: "87.5%" }}>
          <span>Someone at a desk · 21 of 24 hours</span>
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
              <span className="bc">{o.city}</span>
              {/* Desktop only. The mobile row is the flag and the city, which
                  is the kind of omission a symmetrical rewrite invents. */}
              {!mob && <span className="bt">09–18 local</span>}
            </div>
          </div>
        ))}
      </div>
      {" "}
    </div>
  );
}

/** The "Governments we work with" rule, and the tiles under it. */
function Governments({ mob }: { mob?: boolean }) {
  return (
    <>
      <div style={{ marginTop: mob ? "40px" : "64px", display: "flex", alignItems: "center", gap: "24px" }}>
        <span className="k" style={{ whiteSpace: "nowrap" }}>
          Governments we work with
        </span>
        <div style={{ flex: "1", height: "1px", background: "var(--hair)" }}></div>
      </div>
      {" "}
      <div className="gov" {...(mob ? { style: { gridTemplateColumns: "1fr", gap: "10px" } } : {})}>
        {GOVS.map((g, i) => (
          <div className="gt" key={i}>
            {g.img !== undefined ? (
              <Image src={g.img} alt="" width={AVATAR_GT} height={AVATAR_GT} />
            ) : (
              <Flag size="36px">{g.flag}</Flag>
            )}
            <div>
              <b>{g.name}</b>
              <span>{g.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function Presence() {
  return (
    <>
      <div className="dsk">
        <div className="wrap hair-top" style={{ paddingTop: "120px", paddingBottom: "140px" }}>
          {" "}
          <div className="sec-head">
            <h2 className="h2">
              Six offices.
              <br />
              Twelve hours apart.
            </h2>
            <p className="lede" style={{ marginBottom: "8px" }}>
              From Manila to New York, office hours overlap so a request filed at night in one place is picked up in the morning somewhere else. Working hours shown in UTC; the green line is now.
            </p>
          </div>
          {" "}
          <DayBand />
          {" "}
          <Governments />
          {" "}
        </div>
      </div>
      <div className="mob">
        <div className="wrap hair-top" style={{ paddingTop: "72px", paddingBottom: "72px" }}>
          {" "}
          {/* No `sec-head` wrapper here, and no space between the heading and
              the lede. Both measured against the desktop block, not assumed. */}
          <h2 className="h2">Six offices. Twelve hours apart.</h2>
          <p className="lede">Working hours in UTC. The line is now.</p>
          {" "}
          <DayBand mob />
          {" "}
          <Governments mob />
          {" "}
        </div>
      </div>
    </>
  );
}
