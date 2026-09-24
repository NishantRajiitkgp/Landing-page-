import { Fragment } from "react";

import { Arrow } from "@/components/brand/Arrow";
import { copy } from "@/lib/copy/request";
import { AppLink } from "@/components/chrome/AppLink";
import { SECTIONS, type BucketId, type CheckId, type SectionsCopy } from "@/lib/copy/sections";
// Homepage v2 styles are one sheet per section (see `app/v2/hero.css`).
import "@/app/v2/checks.css";
import { ChecksRace } from "./ChecksRace";

/** The 33-check catalogue, plotted against turnaround time.
 *
 *  DESKTOP IS HOMEPAGE V2 (Sep 2026): the lane timeline became a race — a
 *  chronograph and 17 tiles that tick as its hand passes them
 *  (`./ChecksRace`, `./ChecksDial`). The phone keeps its three buckets. The
 *  `STOPS` table below now only decides the phone's `fast` class; its
 *  durations and delays belonged to the retired desktop lanes and are kept
 *  with the measurements that justified them, not re-derived.
 *
 *  520 lines for 17 checks drawn twice - a timeline of lanes on desktop, three
 *  buckets of chips on mobile. One list of checks now, with each view naming
 *  the ones it shows, so no check's copy is written twice (BUILD-SPEC §4
 *  rule 2, §17 condition 22).
 *
 *  THE TWO VIEWS DO NOT SHARE AN ORDER, and neither can be derived from the
 *  other - checked against all three buckets before the lists were shaped.
 *  Mobile's slow bucket runs Entitlement, Employment, Education, Trade licence,
 *  Directors & GST, which is lane order; its fast bucket runs Identity, PAN,
 *  Passport, Age, Credit, Global database, which is position order and puts two
 *  lane-03 checks fifth and sixth. Neither rule fits both, so both orders are
 *  written out - as `id` references, not as retyped names.
 */

/** A position on the axis, and everything the artboard animates there.
 *
 *  Measured across all 17 rows: the lead duration, the pin delay and the
 *  `fast`/`r` class are functions of the position alone, and no row disagreed.
 *  Kept as a table rather than a formula: `pct * 0.026` does reproduce all six
 *  durations, and the delay is always the duration plus 0.30s, but that is a
 *  guess at the generator's arithmetic and a seventh position would make it a
 *  wrong guess silently. Six measurements, six entries. */
const STOPS = {
  "4%": { dur: "0.10s", delay: "0.40s", fast: true },
  "14%": { dur: "0.36s", delay: "0.66s", fast: true },
  "26%": { dur: "0.68s", delay: "0.98s", fast: true },
  "62%": { dur: "1.61s", delay: "1.91s", fast: false },
  "78%": { dur: "2.03s", delay: "2.33s", fast: false },
  "92%": { dur: "2.39s", delay: "2.69s", fast: false },
} as const;

type Stop = keyof typeof STOPS;

/** Every check, and the only thing about it that is not words: where its
 *  pin lands. The name and the turnaround are `lib/copy/sections`'
 *  `checks.items`, keyed by these same ids - the vocabulary the two views
 *  already referenced each other by, so the migration invented no keys. */
const CHECKS: Record<CheckId, Stop> = {
  identity: "4%",
  pan: "4%",
  passport: "4%",
  age: "4%",
  licence: "14%",
  rc: "14%",
  digitalEmployment: "26%",
  moonlighting: "26%",
  // 60 min and fast, not 24 hrs and slow. This page was the only surface
  // saying 24 hrs; `business/enterprise` says 60 min and fast.
  //
  // The tie-break is the old site's own per-check catalogue
  // (`public/cms/en/bgvSmb.base.json` in the previous repo), which states a
  // Mode for all 32 of its checks - and that taxonomy maps onto speed
  // consistently across every one of them. Database, Document, Digital and
  // Online checks answer in 15-60 min (Address "Digital" 30 min, Credit and
  // Global Database "Database" 15 min); anything needing a third party to
  // reply takes days (Employment "Email/Database" 2 days, Education
  // "Database/Email" 3 days).
  //
  // "Right/Eligibility to work" is listed there as Mode: Database/Document -
  // no third party in the loop - so it belongs with the fast checks. 26% is
  // the 60-min stop, and `STOPS` supplies the duration, the delay and the
  // `fast` class from the position alone.
  entitlement: "26%",
  employment: "78%",
  education: "92%",
  credit: "4%",
  globalDatabase: "4%",
  criminal: "14%",
  currentAddress: "14%",
  tradeLicence: "78%",
  // Its name is a `ReactNode` and not a string, and it stayed one when it
  // moved: the artboard exporter split the title around the `&amp;`, and
  // React emits those five text nodes with `<!-- -->` separators between
  // them. A plain string would collapse them to one - different bytes for
  // the same pixels. See `checks.items.directorsGst` in `lib/copy/sections`.
  // 3 days and 92%, not 2 days and 78%. The homepage was the only surface
  // saying 2 days: `lib/content/checks.ts` - which its own header calls the
  // canonical catalogue behind `/checks/[check]` - says 3 days, and
  // `business/enterprise` says 3 days. A page contradicting the catalogue it
  // is meant to summarise is a bug by construction, so the outlier moved.
  //
  // `at` has to move with the time or the pin lands on the wrong axis mark:
  // 78% is the 2-day stop and 92% is the 3-day one, and `STOPS` supplies the
  // matching duration and delay, so this is the only field to change. It
  // stays in the 1-3 days bucket on mobile, so no bucket membership changes.
  directorsGst: "92%",
};

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

type Bucket = { readonly k: BucketId; readonly ids: readonly CheckId[] };

/** The three mobile buckets in order. Both strings each one shows - the
 *  big italic time and the `k` line under it - are in `lib/copy/sections`. */
const BUCKETS: readonly Bucket[] = [
  {
    k: "fast",
    ids: ["identity", "pan", "passport", "age", "credit", "globalDatabase", "licence", "rc", "criminal", "currentAddress"],
  },
  // Entitlement to work joined this bucket when its turnaround was
  // corrected, so the label had to widen: it is a visa and
  // work-authorisation record, not a provident-fund one, and a bucket
  // labelled only "Provident-fund records" would now be describing two of
  // its three chips.
  { k: "hour", ids: ["digitalEmployment", "moonlighting", "entitlement"] },
  { k: "slow", ids: ["employment", "education", "tradeLicence", "directorsGst"] },
];

export async function Checks() {
  const t = (await copy(SECTIONS)).checks;

  return (
    <>
      <div className="dsk">
        <div className="wrap hair-top cz" style={{ paddingTop: "120px", paddingBottom: "140px" }}>
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
      </div>
      <div className="mob">
        <div className="wrap sec hair-top">
          {" "}
          <h2 className="h2">{t.headingMob}</h2>
          {" "}
          <p className="lede">{t.ledeMob}</p>
          {" "}
          <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "28px" }}>
            {BUCKETS.map((b, i) => (
              <Fragment key={i}>
                {" "}
                <div className="bucket">
                  <div className="bk">
                    <span className="serif" style={{ fontStyle: "italic", fontSize: "28px", lineHeight: "1" }}>
                      {t.buckets[b.k].big}
                    </span>
                    <span className="k">{t.buckets[b.k].k}</span>
                  </div>
                  <div className="cloud">
                    {b.ids.map((id) => (
                      <span className={STOPS[CHECKS[id]].fast ? "pl fast" : "pl"} key={id}>
                        <span className="d"></span>
                        {t.items[id].name}
                      </span>
                    ))}
                  </div>
                </div>
              </Fragment>
            ))}{" "}
          </div>
          {" "}
          {/* Desktop's footer is a sentence and a bordered rule; mobile's is a
              full-width button and no sentence. Measured, not assumed. */}
          <a href="#" className="btn btn-line full" style={{ marginTop: "28px" }}>
            {t.all}
          </a>
          {" "}
        </div>
      </div>
    </>
  );
}
