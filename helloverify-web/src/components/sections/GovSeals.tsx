/** Governments we work with — the seals of state (homepage v2).

    Five embossed seals, each with its own guilloche rim, a turning ring of
    microtext and the authority's flag (or the ministry's logo) inlaid; a record
    of what HelloVerify does for the chosen one; and the closing line. Hand-
    ported from the canvas board `Governments.dc.html` (`assemble_govw.py`); the
    interactive shell is `./GovSealsStage`, the guilloche `./GovArt`.

    REPLACES `blocks/Governments.tsx` on the desktop homepage: the canvas lifted
    the five-tile strip out of "Six offices" and gave it this band. That block
    still renders inside `sections/Presence.tsx`, which this part does not own;
    removing it there is the lead's call (see the report).

    One tree at every width: the board had no 390px artboard, so the phone
    layout (seals three and two at half size, the record in one column) is
    `govseals.css`'s own, below 1081px. */
import { FLAG_EU, FLAG_INDIA, FLAG_KSA, FLAG_UAE } from "@/components/blocks/Flag";
import { copy } from "@/lib/copy/request";
import { SECTIONS, type GovSealId } from "@/lib/copy/sections";
import { threadPath } from "@/lib/govArt";
import "@/app/v2/govseals.css";
import type { SealItem } from "./GovSealParts";
import { GovSealsStage } from "./GovSealsStage";

/** Seal order, with each seal's guilloche lobe count and how far it drops
 *  (px). The drops make a shallow arch — the outer seals low, the centre high —
 *  and the thread between the centres is drawn from the same numbers. */
const SEALS: { id: GovSealId; k: number; lift: number; flag?: React.ReactNode }[] = [
  { id: "mom", k: 26, lift: 44 },
  { id: "india", k: 32, lift: 14, flag: FLAG_INDIA },
  { id: "ksa", k: 36, lift: 0, flag: FLAG_KSA },
  { id: "uae", k: 30, lift: 14, flag: FLAG_UAE },
  { id: "eu", k: 28, lift: 44, flag: FLAG_EU },
];

export async function GovSeals() {
  const all = await copy(SECTIONS);
  const t = all.govSeals;

  const items: SealItem[] = SEALS.map(({ id, k, lift, flag }) => {
    const g = t.items[id];
    return {
      name: g.name,
      where: g.where,
      ledeName: g.ledeName,
      micro: g.micro,
      record: g.record,
      role: g.role,
      h: g.h,
      p: g.p,
      facts: Object.values(g.facts),
      chain: Object.values(g.chain),
      cap: g.cap,
      k,
      lift,
      flag,
    };
  });

  return (
    <section className="wrap sv" aria-labelledby="sv-h">
      <div className="sv-mast">
        <span className="k">{t.kicker}</span>
        <i aria-hidden="true" />
        <span className="sv-mast-r">{t.kickerEnd}</span>
      </div>
      <h2 className="sv-h" id="sv-h">
        {t.heading} <em>{t.headingEm}</em>
      </h2>
      <GovSealsStage
        items={items}
        thread={threadPath(SEALS.map((s) => s.lift))}
        ledeLead={t.ledeLead}
        ledeAnd={t.ledeAnd}
        stamp={t.stamp}
        pauseLabel={all.hero.motion.pause}
        playLabel={all.hero.motion.play}
      >
        <p className="sv-close">
          {t.closeLead}{" "}
          <span className="sv-under">
            {t.closeMark}
            <svg viewBox="0 0 400 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <path d="M3 14 C 110 8, 250 18, 397 9" pathLength="1" />
            </svg>
          </span>{" "}
          {t.closeTail}
        </p>
      </GovSealsStage>
    </section>
  );
}
