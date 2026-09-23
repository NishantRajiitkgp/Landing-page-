import type { ReactNode } from "react";
import Image from "next/image";

import { AVATAR_GT } from "@/lib/img";
import { copy } from "@/lib/copy/request";
import { SECTIONS, type GovId } from "@/lib/copy/sections";
import { Flag, FLAG_INDIA } from "@/components/blocks/Flag";

/** The governments HelloVerify works with, as a rule and five tiles.
 *
 *  MOVED OUT OF `sections/Presence.tsx` VERBATIM, 23 Sep 2026, for the reason
 *  `blocks/DayBand.tsx` records: that file was at exactly 300 of the 300 lines
 *  `eslint.config.mjs` allows and had nowhere to put the copy layer's next
 *  three lines. Both halves moved by line range rather than being retyped, and
 *  the mover asserts it.
 *
 *  STILL `async` for the same reason as `DayBand` - see its header. The one
 *  detail specific to this component: it returns a FRAGMENT, which is the
 *  shape `tools/test/copy.test.ts` §12 watches, and it is safe because the
 *  fragment's last child is `</div>` rather than a text node. Keep it that
 *  way; an extra `{" "}` after the `.gov` grid would be a new separator.
 *
 *  The list is shared across the breakpoints: same governments, every flag
 *  equal character for character. What differs is the `.gov` grid, which
 *  mobile collapses to one column, and the rule's margin above it.
 */

type Gov = {
  readonly k: GovId;
  /** Singapore's ministry is a photograph; the rest are flags. */
  readonly img?: string;
  readonly flag?: ReactNode;
};

const GOVS: readonly Gov[] = [
  { k: "mom", img: "/img/mom.jpg" },
  { k: "india", flag: FLAG_INDIA },
  {
    k: "ksa",
    flag: (
      <>
        <rect width="30" height="20" fill="#006C35" />
        <rect x="7" y="7.2" width="16" height="1.3" fill="#FFFFFF" rx="0.6" />
        <rect x="9" y="11" width="12" height="1.1" fill="#FFFFFF" rx="0.5" />
      </>
    ),
  },
  {
    k: "uae",
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
    k: "eu",
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

/** The "Governments we work with" rule, and the tiles under it. */
export async function Governments({ mob }: { mob?: boolean }) {
  const t = (await copy(SECTIONS)).presence;
  return (
    <>
      <div style={{ marginTop: mob ? "40px" : "64px", display: "flex", alignItems: "center", gap: "24px" }}>
        <span className="k" style={{ whiteSpace: "nowrap" }}>
          {t.govsHeading}
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
              <b>{t.govs[g.k].name}</b>
              <span>{t.govs[g.k].sub}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
