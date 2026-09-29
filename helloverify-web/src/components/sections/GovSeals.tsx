/** Governments we work with — the seals of state (homepage v2).

    Four embossed seals, each with its own guilloche rim, a turning ring of
    microtext and the authority's logo inlaid; a record that pitches what
    HelloVerify is to the chosen one — its challenge, what we deliver, the
    impact and why it chose us. (The closing line on national trust
    infrastructure moved to `./GovWhy`, the band after this one.) Hand-
    ported from the canvas board `Governments.dc.html` (`assemble_govw.py`); the
    interactive shell is `./GovSealsStage`, the guilloche `./GovArt`.

    REPLACES `blocks/Governments.tsx` on the desktop homepage: the canvas lifted
    the five-tile strip out of "Six offices" and gave it this band. That block
    still renders inside `sections/Presence.tsx`, which this part does not own;
    removing it there is the lead's call (see the report).

    One tree at every width: the board had no 390px artboard, so the phone
    layout (seals two by two at half size, the record in one column) is
    `govseals.css`'s own, below 1081px. */
import { copy } from "@/lib/copy/request";
import { SECTIONS, type GovSealId } from "@/lib/copy/sections";
import { threadPath } from "@/lib/govArt";
import "@/app/v2/govseals.css";
import type { SealItem } from "./GovSealParts";
import { GovSealsStage } from "./GovSealsStage";

/** Seal order, with each seal's guilloche lobe count, how far it drops (px)
 *  and its official mark. The drops make a shallow arch — the outer seals
 *  low, the centre high — and the thread between the centres is drawn from
 *  the same numbers. The marks: MOM's and MOHESR's emblems and Latvia's arms
 *  are the old site's files; Italy's is the Republic's emblem, cropped from
 *  the embassy lockup (whose script line names Washington, not New Delhi). */
const SEALS: { id: GovSealId; k: number; lift: number; logo: string }[] = [
  { id: "mom", k: 26, lift: 40, logo: "/img/mom.jpg" },
  { id: "latvia", k: 32, lift: 8, logo: "/img/latvia-coat-of-arms.png" },
  { id: "italy", k: 36, lift: 8, logo: "/img/italy-emblem.png" },
  { id: "mohesr", k: 30, lift: 40, logo: "/img/mohesr-emblem.png" },
];

/** The four marks in seal order, for `./GovWhy`'s "Governments we work
 *  with" picture: one list, so the two bands cannot show different ones. */
export const SEAL_LOGOS = SEALS.map((s) => s.logo);

export async function GovSeals() {
  const all = await copy(SECTIONS);
  const t = all.govSeals;

  const items: SealItem[] = SEALS.map(({ id, k, lift, logo }) => {
    const g = t.items[id];
    return {
      name: g.name,
      where: g.where,
      ledeName: g.ledeName,
      micro: g.micro,
      record: g.record,
      role: g.role,
      problem: g.problem,
      h: g.h,
      p: g.p,
      facts: Object.values(g.facts),
      deliver: Object.values(g.deliver),
      impactK: g.impactK,
      impact: Object.values(g.impact),
      why: Object.values(g.why),
      k,
      lift,
      logo,
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
        labels={{ problem: t.problemK, deliver: t.deliverK, why: t.whyK }}
        pauseLabel={all.hero.motion.pause}
        playLabel={all.hero.motion.play}
      />
    </section>
  );
}
