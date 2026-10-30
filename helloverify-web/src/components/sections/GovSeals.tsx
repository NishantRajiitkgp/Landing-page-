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
import { getLocale } from "next-intl/server";

import { copy } from "@/lib/copy/request";
import { SECTIONS, type GovSealId, type SectionsCopy } from "@/lib/copy/sections";
import { threadPath } from "@/lib/govArt";
import { localise } from "@/lib/i18n/href";
import { ITALY_JOIN_PATH } from "@/lib/italy/paths";
import "@/app/v2/govseals.css";
import type { SealItem } from "./GovSealParts";
import { GovSealsStage } from "./GovSealsStage";

/** Seal order, with each seal's guilloche lobe count, how far it drops (px),
 *  its official mark and its authority's own page. The drops make a shallow
 *  arch — the outer seals low, the centre high — and the thread between the
 *  centres is drawn from the same numbers. The marks: MOM's and MOHESR's
 *  emblems and Latvia's arms are the old site's files; Italy's is the
 *  Republic's emblem, cropped from the embassy lockup (whose script line names
 *  Washington, not New Delhi). A seal opens its record under the row; `href`
 *  is the authority's own page, which renders the same record.
 *
 *  `ctas` is each record's call-to-action cards, in the order of its copy's
 *  `ctas`: the buttons on each card (the first is the main one), named by
 *  `govSeals.acts`. Where a button goes is `ACT_HREF`, except `apply`, the
 *  authority's own applicant route (`apply` below). NO APPLICANT PORTAL IS
 *  LINKED YET (1 Oct 2026): MOM's applicants go to its case page, which
 *  carries the COMPASS pricing; MOHESR's to the contact page; visa
 *  applicants to the visa-screening page. Swap in the portals when known. */
type Act = keyof SectionsCopy["govSeals"]["acts"];
export const SEALS: { id: GovSealId; k: number; lift: number; logo: string; href: string; apply: string; partner?: string; ctas: Act[][] }[] = [
  { id: "mom", k: 26, lift: 40, logo: "/img/mom.jpg", href: "/solutions/manpower-and-education-authorities/ministry-of-manpower", apply: "/solutions/manpower-and-education-authorities/ministry-of-manpower", ctas: [["apply"], ["sales"]] },
  { id: "latvia", k: 32, lift: 8, logo: "/img/latvia-coat-of-arms.png", href: "/solutions/immigration-authorities", apply: "/products/immigration", ctas: [["visa"], ["partner"]] },
  { id: "italy", k: 36, lift: 8, logo: "/img/italy-emblem.png", href: "/solutions/immigration-authorities", apply: "/products/immigration", partner: ITALY_JOIN_PATH, ctas: [["visa"], ["partner"]] },
  { id: "mohesr", k: 30, lift: 40, logo: "/img/mohesr-emblem.png", href: "/solutions/manpower-and-education-authorities/mohesr", apply: "/solutions/manpower-and-education-authorities/mohesr", ctas: [["apply"], ["sales"]] },
];

function actHref(s: (typeof SEALS)[number], a: Act): string {
  if (a === "apply") return s.apply;
  if (a === "partner" && s.partner) return s.partner;
  return ACT_HREF[a];
}

/** Where the shared buttons go; `apply` is per authority (`SEALS`). Italy's
 *  partner button opens its own programme; the others stay on contact. */
const ACT_HREF: Record<Exclude<Act, "apply">, string> = {
  visa: "/products/immigration",
  partner: "/contact",
  sales: "/contact",
};

/** The four marks in seal order, for `./GovWhy`'s "Governments we work
 *  with" picture: one list, so the two bands cannot show different ones. */
export const SEAL_LOGOS = SEALS.map((s) => s.logo);

/** One authority's words and marks, as the seal and its page both need them. */
export async function sealItem(id: GovSealId): Promise<SealItem> {
  const t = (await copy(SECTIONS)).govSeals;
  const s = SEALS.find((x) => x.id === id)!;
  const g = t.items[id];
  const locale = await getLocale();
  const ctas = Object.values(g.ctas).map((c, j) => ({
    k: c.k,
    p: c.p,
    acts: s.ctas[j].map((a) => ({ t: t.acts[a], href: localise(actHref(s, a), locale) })),
  }));
  return {
    name: g.name,
    ledeName: g.ledeName,
    micro: g.micro,
    record: g.record,
    role: g.role,
    problem: g.problem,
    h: g.h,
    p: "p" in g ? g.p : undefined,
    facts: Object.values(g.facts),
    ctas,
    k: s.k,
    lift: s.lift,
    logo: s.logo,
  };
}

export async function GovSeals() {
  const all = await copy(SECTIONS);
  const t = all.govSeals;
  // Clicking a seal opens its record card under the row again (restored
  // 30 Sep 2026); the authority pages stay, reachable from elsewhere.
  const items = await Promise.all(SEALS.map((s) => sealItem(s.id)));

  return (
    <section className="wrap sv" aria-labelledby="sv-h">
      <h2 className="sv-h" id="sv-h">
        {t.heading} <em>{t.headingEm}</em>
      </h2>
      <GovSealsStage
        items={items}
        thread={threadPath(SEALS.map((s) => s.lift))}
        ledeLead={t.ledeLead}
        ledeAnd={t.ledeAnd}
        stamp={t.stamp}
        labels={{ problem: t.problemK, start: t.startK }}
        pauseLabel={all.hero.motion.pause}
        playLabel={all.hero.motion.play}
      />
    </section>
  );
}
