import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
import { OFFICE_FLAGS } from "@/components/blocks/Flag";
import "@/app/v2/presence.css";
import { SunStage } from "./SunStage";

/** Where HelloVerify operates: homepage v2's "follow the sun" — a live world
 *  map with the day/night line over the six offices. The map is the client
 *  island `./SunStage`; this server half is the heading and the flag defs.
 *
 *  ONE TREE AT EVERY WIDTH since the phone pass (Sep 2026). The old phone
 *  band (a UTC day band and the "Governments we work with" tiles,
 *  `blocks/DayBand.tsx` and `blocks/Governments.tsx`) is gone: v2 gives the
 *  governments a section of their own, and below 1081px `presence.css` crops
 *  the map to the offices and lists the office cards under it.
 */

export async function Presence() {
  const sections = await copy(SECTIONS);
  const t = sections.presence;
  const motion = sections.hero.motion;
  return (
    <div className="wrap hair-top su-band">
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
          per copy instead of ~400. The board's alternative was a CSS data
          URI per flag, a second drawing of each one to keep in step. */}
      <svg className="su-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          {OFFICE_FLAGS.map((o) => (
            <g key={o.k} id={`su-fl-${o.k}`}>{o.flag}</g>
          ))}
        </defs>
      </svg>
      <SunStage sun={t.sun} cities={t.offices} hours={t.hours} motion={motion} />
    </div>
  );
}
