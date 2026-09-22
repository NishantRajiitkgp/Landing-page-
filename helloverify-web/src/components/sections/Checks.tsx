import type { ReactNode } from "react";
import { Fragment } from "react";

/** The 33-check catalogue, plotted against turnaround time.
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
type Check = { readonly name: ReactNode; readonly at: Stop; readonly time: string };

const CHECKS: Record<string, Check> = {
  identity: { name: "Identity", at: "4%", time: "15 min" },
  pan: { name: "PAN", at: "4%", time: "15 min" },
  passport: { name: "Passport", at: "4%", time: "15 min" },
  age: { name: "Age", at: "4%", time: "15 min" },
  licence: { name: "Driving licence", at: "14%", time: "30 min" },
  rc: { name: "Registration certificate", at: "14%", time: "30 min" },
  digitalEmployment: { name: "Digital employment", at: "26%", time: "60 min" },
  moonlighting: { name: "Moonlighting", at: "26%", time: "60 min" },
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
  entitlement: { name: "Entitlement to work", at: "26%", time: "60 min" },
  employment: { name: "Employment", at: "78%", time: "2 days" },
  education: { name: "Education", at: "92%", time: "3 days" },
  credit: { name: "Credit", at: "4%", time: "15 min" },
  globalDatabase: { name: "Global database", at: "4%", time: "15 min" },
  criminal: { name: "Criminal", at: "14%", time: "30 min" },
  currentAddress: { name: "Current address", at: "14%", time: "30 min" },
  tradeLicence: { name: "Trade licence", at: "78%", time: "2 days" },
  // A `ReactNode`, not a string: the artboard exporter split the title around
  // the `&amp;`, and React emits those five text nodes with `<!-- -->`
  // separators between them. A plain string would collapse them to one -
  // different bytes for the same pixels.
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
  directorsGst: { name: <>Directors{" "}&amp;{" "}GST</>, at: "92%", time: "3 days" },
};

type Lane = { readonly k: ReactNode; readonly t: string; readonly zone?: string; readonly ids: readonly string[] };

const LANES: readonly Lane[] = [
  {
    k: "01 — Identity",
    t: "Who they are",
    zone: "an hour or less",
    ids: ["identity", "pan", "passport", "age", "licence", "rc"],
  },
  {
    k: <>02 — Work{" "}&amp;{" "}education</>,
    t: "What they've done",
    ids: ["digitalEmployment", "moonlighting", "entitlement", "employment", "education"],
  },
  {
    k: <>03 — Records{" "}&amp;{" "}risk</>,
    t: "What's on file",
    ids: ["credit", "globalDatabase", "criminal", "currentAddress", "tradeLicence", "directorsGst"],
  },
];

/** The four labelled stops on the axis, and the four tick marks under each
 *  plot - the same four positions, which is why they are one list. */
const AXIS: readonly (readonly [Stop, string])[] = [
  ["4%", "15 min"],
  ["26%", "1 hour"],
  ["62%", "1 day"],
  ["92%", "3 days"],
];

type Bucket = { readonly big: string; readonly k: string; readonly ids: readonly string[] };

const BUCKETS: readonly Bucket[] = [
  {
    big: "15–30 min",
    k: "Identity, documents, records",
    ids: ["identity", "pan", "passport", "age", "credit", "globalDatabase", "licence", "rc", "criminal", "currentAddress"],
  },
  // Entitlement to work joined this bucket when its turnaround was
  // corrected, so the label had to widen: it is a visa and
  // work-authorisation record, not a provident-fund one, and a bucket
  // labelled only "Provident-fund records" would now be describing two of
  // its three chips.
  {
    big: "60 min",
    k: "Provident-fund and work-authorisation records",
    ids: ["digitalEmployment", "moonlighting", "entitlement"],
  },
  {
    big: "1–3 days",
    k: "Confirmed with a registrar, employer or authority",
    ids: ["employment", "education", "tradeLicence", "directorsGst"],
  },
];

const ARROW = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Plot({ lane }: { lane: Lane }) {
  return (
    <div className="plot">
      <div className="sweep"></div>
      <div className="zone">{lane.zone !== undefined && <span>{lane.zone}</span>}</div>
      {AXIS.map(([at]) => (
        <i className="tk" key={at} style={{ insetInlineStart: at }}></i>
      ))}
      {lane.ids.map((id) => {
        const c = CHECKS[id];
        const s = STOPS[c.at];
        return (
          <div className="prow" key={id}>
            <i className={s.fast ? "lead fast" : "lead"} style={{ width: c.at, animationDuration: s.dur }}></i>
            <span className={s.fast ? "pin fast" : "pin r"} style={{ insetInlineStart: c.at, animationDelay: s.delay }}>
              <span className="d"></span>
              {c.name}
              <span className="t">{c.time}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function Checks() {
  return (
    <>
      <div className="dsk">
        <div className="wrap hair-top" style={{ paddingTop: "120px", paddingBottom: "140px" }}>
          {" "}
          <div className="sec-head">
            {" "}
            <h2 className="h2">
              33 checks.
              <br />
              Most take minutes.
            </h2>
            {" "}
            <p className="lede" style={{ marginBottom: "8px" }}>
              Each check sits where it finishes. Green is an hour or less. The rest go to a registrar or a court and come back in days.
            </p>
            {" "}
          </div>
          {" "}
          <div style={{ marginTop: "72px" }}>
            {" "}
            <div className="lane">
              {" "}
              <span></span>
              {" "}
              <div className="axis">
                {AXIS.map(([at, label]) => (
                  <span key={at} style={{ insetInlineStart: at }}>
                    {label}
                  </span>
                ))}
              </div>
              {" "}
            </div>
            {LANES.map((lane, i) => (
              <Fragment key={i}>
                {" "}
                {/* The first lane sits directly under the axis and carries no
                    top margin; only the two below it do. */}
                <div className="lane" {...(i > 0 ? { style: { marginTop: "56px" } } : {})}>
                  {" "}
                  <div className="g">
                    <div className="k">{lane.k}</div>
                    <div className="t">{lane.t}</div>
                  </div>
                  {" "}
                  <Plot lane={lane} />
                  {" "}
                </div>
              </Fragment>
            ))}{" "}
            {/* Outside the repeated run: the "plus 16 more" footer, which is a
                fourth `.lane` so it aligns with the plots above it.

                The space that precedes it is OUTSIDE the `.map()` above, and
                that is load-bearing: an array whose last child is a text node
                makes React emit a `<!-- -->` after it for hydration. Measured -
                putting it inside the fragment cost exactly 8 bytes here. */}
            <div className="lane" style={{ marginTop: "48px" }}>
              {" "}
              <span></span>
              {" "}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", paddingTop: "24px", borderTop: "1px solid var(--hair)" }}>
                {" "}
                <span style={{ fontSize: "15px", color: "var(--muted)" }}>
                  Plus 16 more — Cyber Identity, Know Your Contact, Financial Assessment, Promoter Criminal History and others.
                </span>
                {" "}
                <a href="#" className="btn btn-line" style={{ height: "44px", padding: "0 20px", fontSize: "15px" }}>
                  All 33 checks{" "}
                  {ARROW}
                </a>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
        </div>
      </div>
      <div className="mob">
        <div className="wrap sec hair-top">
          {" "}
          <h2 className="h2">33 checks. Most take minutes.</h2>
          {" "}
          <p className="lede">Grouped by how long you wait, from upload to report.</p>
          {" "}
          <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "28px" }}>
            {BUCKETS.map((b, i) => (
              <Fragment key={i}>
                {" "}
                <div className="bucket">
                  <div className="bk">
                    <span className="serif" style={{ fontStyle: "italic", fontSize: "28px", lineHeight: "1" }}>
                      {b.big}
                    </span>
                    <span className="k">{b.k}</span>
                  </div>
                  <div className="cloud">
                    {b.ids.map((id) => (
                      <span className={STOPS[CHECKS[id].at].fast ? "pl fast" : "pl"} key={id}>
                        <span className="d"></span>
                        {CHECKS[id].name}
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
            All 33 checks
          </a>
          {" "}
        </div>
      </div>
    </>
  );
}
