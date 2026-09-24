import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
import { DayBand, OFFICES } from "@/components/blocks/DayBand";
import { Governments } from "@/components/blocks/Governments";
import "@/app/v2/presence.css";
import { SunStage } from "./SunStage";

/** Where HelloVerify operates, and who vouches for it.
 *
 *  532 lines for 12 office rows and 10 government tiles - six offices and five
 *  governments, each written out once per breakpoint. Two record lists now
 *  (BUILD-SPEC §4 rule 2, §17 condition 22), and since 23 Sep 2026 those two
 *  lists and the blocks that draw them live in `blocks/DayBand.tsx` and
 *  `blocks/Governments.tsx`, with the flag box they share in `blocks/Flag.tsx`.
 *
 *  THAT SPLIT WAS FORCED BY A NUMBER, not by taste: this file landed on
 *  exactly 300 lines of the 300 `eslint.config.mjs` allows, so the next
 *  component in it that joined the copy layer - an import plus an
 *  `await copy(NS)` - had nowhere to go. It is the two-tree shape that makes
 *  the file long, and that shape is what is left here: the desktop and mobile
 *  wrappers disagree on padding, on whether the heading gets a `sec-head`, and
 *  on the copy itself, so they cannot be driven from one record.
 *
 *  REJECTED - one `blocks/PresenceBlocks.tsx` holding both. It would have put
 *  a 230-line module next to a 60-line one and satisfied the same lint rule
 *  while leaving the band and the tiles, which share nothing but the flag box,
 *  in one file. Part 5's rule is that the fix is not "cut the file in half".
 *
 *  DESKTOP IS HOMEPAGE v2 (Sep 2026): "follow the sun" — a live world map
 *  with the day/night line over the six offices, in place of the UTC day
 *  band, and without the "Governments we work with" strip, which v2 gives a
 *  section of its own. The map is the client island `./SunStage`; the phone
 *  keeps the day band and the tiles until it has a v2 artboard.
 */

export async function Presence() {
  const sections = await copy(SECTIONS);
  const t = sections.presence;
  const motion = sections.hero.motion;
  return (
    <>
      <div className="dsk">
        <div className="wrap hair-top" style={{ paddingTop: "120px", paddingBottom: "140px" }}>
          {" "}
          <div className="sec-head">
            <h2 className="h2">
              {t.headingA}
              <br />
              {t.headingB}
            </h2>
            <p className="lede" style={{ marginBottom: "8px" }}>
              {t.lede}
            </p>
          </div>
          {/* The six flags, drawn once and `<use>`d by the map's six cards and
              by every covered hour of the strip (up to ~60 copies): ~80 bytes
              per copy instead of ~400. The board's alternative was a CSS
              data URI per flag, which would have been a second drawing of
              each one to keep in step with `blocks/DayBand.tsx`. */}
          <svg className="su-defs" width="0" height="0" aria-hidden="true" focusable="false">
            <defs>
              {OFFICES.map((o) => (
                <g key={o.k} id={`su-fl-${o.k}`}>{o.flag}</g>
              ))}
            </defs>
          </svg>
          <SunStage sun={t.sun} cities={t.offices} hours={t.hours} motion={motion} />
        </div>
      </div>
      <div className="mob">
        <div className="wrap hair-top" style={{ paddingTop: "72px", paddingBottom: "72px" }}>
          {" "}
          {/* No `sec-head` wrapper here, and no space between the heading and
              the lede. Both measured against the desktop block, not assumed. */}
          <h2 className="h2">{t.headingMob}</h2>
          <p className="lede">{t.ledeMob}</p>
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
