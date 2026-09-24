import type { ReactNode } from "react";

import type { OfficeId } from "@/lib/copy/sections";

/** Flag drawings shared across the homepage, one drawing per country.
 *
 *  The six office flags are `<use>`d by the v2 Presence map (its cards and
 *  its hour strip, `sections/Presence.tsx`); Saudi Arabia, the UAE and the EU
 *  are inlaid by the v2 seals (`sections/GovSeals.tsx`); India is used by both.
 *
 *  THE PHONE PASS (Sep 2026) DELETED THE BLOCKS THIS FILE WAS CUT FROM:
 *  `blocks/DayBand.tsx` and `blocks/Governments.tsx` drew only the old phone
 *  Presence band, and with them went the `<Flag>` box component, which had no
 *  other caller. The office drawings moved here from `DayBand.tsx` unchanged.
 *
 *  STILL NOT SHAREABLE WITH `sections/International.tsx`, checked rather than
 *  assumed: its Singapore crescent sits at cx 9.5/10.6 where this one is at
 *  6.2/7.3, and its Philippines triangle is drawn from a different origin.
 *
 *  Flag hex stays literal - facts about the world, not palette, which is the
 *  exemption `check:tokens` was given in Part 3.
 */

export const FLAG_INDIA = (
  <>
    <rect width="30" height="20" fill="#FFFFFF" />
    <rect width="30" height="6.7" fill="#FF9933" />
    <rect y="13.3" width="30" height="6.7" fill="#138808" />
    <circle cx="15" cy="10" r="2.3" fill="none" stroke="#000080" strokeWidth="0.8" />
  </>
);

/** Saudi Arabia, the UAE and the EU, as the v2 seals inlay them. */
export const FLAG_KSA = (
  <>
    <rect width="30" height="20" fill="#006C35" />
    <rect x="7" y="7.2" width="16" height="1.3" fill="#FFFFFF" rx="0.6" />
    <rect x="9" y="11" width="12" height="1.1" fill="#FFFFFF" rx="0.5" />
  </>
);

export const FLAG_UAE = (
  <>
    <rect width="30" height="6.7" fill="#00732F" />
    <rect y="6.7" width="30" height="6.6" fill="#FFFFFF" />
    <rect y="13.3" width="30" height="6.7" fill="#15140F" />
    <rect x="3" width="8" height="20" fill="#FF0000" />
  </>
);

/** The twelve stars, clockwise from three o'clock on a radius of 6. */
const EU_STARS = [
  ["21.00", "10.00"], ["20.20", "13.00"], ["18.00", "15.20"], ["15.00", "16.00"],
  ["12.00", "15.20"], ["9.80", "13.00"], ["9.00", "10.00"], ["9.80", "7.00"],
  ["12.00", "4.80"], ["15.00", "4.00"], ["18.00", "4.80"], ["20.20", "7.00"],
];

export const FLAG_EU = (
  <>
    <rect width="30" height="20" fill="#003399" />
    {EU_STARS.map(([cx, cy]) => (
      <circle key={`${cx},${cy}`} cx={cx} cy={cy} r="1" fill="#FFCC00" />
    ))}
  </>
);

/** The six offices, in the order the working day reaches them, Manila first.
 *  The UAE's red hoist band starts at x=0 here and at x=3 in `FLAG_UAE` (the
 *  seals' drawing): two drawings on the boards, kept as drawn. */
export const OFFICE_FLAGS: readonly { k: OfficeId; flag: ReactNode }[] = [
  {
    k: "manila",
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
    flag: (
      <>
        <rect width="30" height="10" fill="#EF3340" />
        <rect y="10" width="30" height="10" fill="#FFFFFF" />
        <circle cx="6.2" cy="5" r="2.8" fill="#FFFFFF" />
        <circle cx="7.3" cy="5" r="2.4" fill="#EF3340" />
      </>
    ),
  },
  { k: "noida", flag: FLAG_INDIA },
  {
    k: "dubai",
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
