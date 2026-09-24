import { Arrow } from "@/components/brand/Arrow";
import { copy } from "@/lib/copy/request";
import { AppLink } from "@/components/chrome/AppLink";
import { SECTIONS, type CheckId, type SectionsCopy } from "@/lib/copy/sections";
// Homepage v2 styles are one sheet per section (see `app/v2/hero.css`).
import "@/app/v2/checks.css";
import { ChecksRace } from "./ChecksRace";

/** The 33-check catalogue, plotted against turnaround time.
 *
 *  HOMEPAGE V2, ONE TREE AT EVERY WIDTH (Sep 2026): a race — a chronograph
 *  and 17 tiles that tick as its hand passes them (`./ChecksRace`,
 *  `./ChecksDial`). On a phone the dial stacks over the tiles. The old phone
 *  tree — three buckets of chips — was deleted with its copy
 *  (`checks.headingMob`, `ledeMob`, `buckets`), and with it the `STOPS` and
 *  `CHECKS` tables that only decided its `fast` class.
 *
 *  Two turnarounds here were corrected against the catalogue before v2, and
 *  the race keeps the corrections: Entitlement to work is 60 min (the old
 *  site's per-check catalogue lists it as Mode: Database/Document — no third
 *  party in the loop), and Directors & GST is 3 days, as
 *  `lib/content/checks.ts` and `business/enterprise` say.
 */

type Group = keyof SectionsCopy["checks"]["race"]["groups"];

/** The race, in board order: each check, the group line printed over it, and
 *  the minute its tile flips. The minutes are the turnarounds in `items` —
 *  15/30/60 min, 2 days = 2880, 3 days = 4320 — as numbers the clock can
 *  compare; 13 of the 17 finish within the hour, which is the readout's
 *  resting "13 of 17". */
const RACE: readonly { id: CheckId; group: Group; min: number }[] = [
  { id: "identity", group: "identity", min: 15 },
  { id: "pan", group: "identity", min: 15 },
  { id: "passport", group: "identity", min: 15 },
  { id: "age", group: "identity", min: 15 },
  { id: "credit", group: "records", min: 15 },
  { id: "globalDatabase", group: "records", min: 15 },
  { id: "licence", group: "identity", min: 30 },
  { id: "rc", group: "identity", min: 30 },
  { id: "criminal", group: "records", min: 30 },
  { id: "currentAddress", group: "records", min: 30 },
  { id: "digitalEmployment", group: "work", min: 60 },
  { id: "moonlighting", group: "work", min: 60 },
  { id: "entitlement", group: "work", min: 60 },
  { id: "employment", group: "work", min: 2880 },
  { id: "tradeLicence", group: "records", min: 2880 },
  { id: "education", group: "work", min: 4320 },
  { id: "directorsGst", group: "records", min: 4320 },
];

export async function Checks() {
  const t = (await copy(SECTIONS)).checks;

  return (
    <div className="wrap hair-top cz">
      <div className="sec-head">
        <h2 className="h2">
          {t.headingA}
          <br />
          {t.headingB}
        </h2>
        <p className="lede">{t.lede}</p>
      </div>
      <ChecksRace
        t={{ ...t.race, zone: t.zone }}
        tiles={RACE.map(({ id, group, min }) => ({
          name: t.items[id].name,
          time: t.items[id].time,
          group: t.race.groups[group],
          min,
        }))}
        more={
          <>
            <span>{t.more}</span>
            <AppLink href="/resources/checks" className="cz-all">
              {t.all}
              <Arrow size="14" />
            </AppLink>
          </>
        }
      />
    </div>
  );
}
