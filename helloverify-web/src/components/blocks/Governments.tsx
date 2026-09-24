import type { ReactNode } from "react";
import Image from "next/image";

import { AVATAR_GT } from "@/lib/img";
import { copy } from "@/lib/copy/request";
import { SECTIONS, type GovId } from "@/lib/copy/sections";
import { Flag, FLAG_EU, FLAG_INDIA, FLAG_KSA, FLAG_UAE } from "@/components/blocks/Flag";

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
  { k: "ksa", flag: FLAG_KSA },
  { k: "uae", flag: FLAG_UAE },
  { k: "eu", flag: FLAG_EU },
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
