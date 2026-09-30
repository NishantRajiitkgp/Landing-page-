import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
import "@/app/v2/presence.css";
import { RelayStage } from "./RelayStage";

/** Where HelloVerify operates, and what that does for a hirer: homepage v2's
 *  relay (29 Sep 2026). It replaced "Six offices. Twelve hours apart." — a
 *  map of who was at a desk — with what the desks do: the visitor picks
 *  where their candidate's papers are and watches that request go to the
 *  source and come back verified, while the world turns under it. The map
 *  is the client island `./RelayStage`; this server half is the heading.
 *  The flags are the countries' own (`public/flags`, flag-icons, MIT).
 *
 *  ONE TREE AT EVERY WIDTH; `presence.css` reflows it for the phone. */

export async function Presence() {
  const sections = await copy(SECTIONS);
  const t = sections.presence;
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
      <RelayStage r={t.relay} cities={t.offices} />
    </div>
  );
}
