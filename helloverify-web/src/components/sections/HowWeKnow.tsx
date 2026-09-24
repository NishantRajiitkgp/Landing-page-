/** How we know — one upload, then the work (homepage v2, Sep 2026; canvas
    sheet 04, "one machine, two routes").

    Replaces the desktop trees of two bands that told halves of one story:
    `Demo2` (the AI reading a licence) and `HowItWorks` (the four steps on a
    30-minute clock). Here a reader picks a route — a driving licence in
    Bengaluru or a nurse's degree — and watches its case file run: the
    specimen is read field by field, the request goes to the issuer, and the
    chain of custody ticks through eight steps to "Verified". Then the four
    steps, and the evidence strip naming each source.

    Desktop only. The phone keeps `Demo2` and `HowItWorks`' own trees until
    the v2 phone part (see `app/[locale]/page.tsx`). Server-rendered frame;
    the route state and the run are the `./HowWeKnowStage` island, which gets
    the steps grid and the evidence heading as slots so they stay static. */
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
// One sheet per v2 section (see the header of `app/v2/hero.css`).
import "@/app/v2/how.css";
import { HowWeKnowStage } from "./HowWeKnowStage";

const STEP_IDS = ["upload", "read", "confirm", "report"] as const;

export async function HowWeKnow() {
  const all = await copy(SECTIONS);
  const t = all.howItWorks;
  const v2 = t.v2;

  return (
    <div className="dsk">
      <div className="wrap hair-top hw">
        <div className="hw-mast">
          <span className="k">{v2.kicker}</span>
          <span className="hw-sheet">{v2.sheet}</span>
        </div>
        <div className="sec-head" style={{ marginTop: "22px" }}>
          <h2 className="h2">
            {t.headingA}
            <br />
            <em className="hw-it">{t.headingB}</em>
          </h2>
          <p className="lede" style={{ marginBottom: "8px" }}>{v2.lede2}</p>
        </div>
        <HowWeKnowStage
          t={v2}
          labels={{ upload: t.steps.upload.label, read: t.steps.read.label, confirm: t.steps.confirm.label, report: t.steps.report.label }}
          licenceCap={t.lede}
          motion={all.hero.motion}
          caps={
            <div className="hw-caps">
              {STEP_IDS.map((id, i) => (
                <div className="cap" key={id}>
                  <div className="n">{String(i + 1).padStart(2, "0")}</div>
                  <div className="t">{t.steps[id].label}</div>
                  <p className="p">{t.steps[id].cap}</p>
                </div>
              ))}
            </div>
          }
          evLead={
            <div className="hw-ev-l">
              <div className="k">{v2.evKicker}</div>
              <p className="hw-promise">
                {v2.promiseA} <em>{v2.promiseEm}</em>
              </p>
            </div>
          }
        />
      </div>
    </div>
  );
}
