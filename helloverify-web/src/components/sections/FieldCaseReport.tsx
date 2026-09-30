/** The field case's report pages (`./FieldCaseStage`): seven sheets that
 *  rise off the map in the last act, each holding a few lines of what it
 *  covers, drawn small. Split out to keep the stage under the 300-line cap. */
import type { SectionsCopy } from "@/lib/copy/sections";

type T = SectionsCopy["fieldCase"];

export const ACTS = ["a0", "a1", "a2", "a3", "a4", "a5"] as const;
/** The chain of custody lists the case's own steps, not the pull-out. */
const CUSTODY = ["a0", "a1", "a2", "a3", "a4"] as const;
/** The report's pages, left to right; the summary sits in the middle. */
export const PAGES = ["location", "visit", "statements", "summary", "ai", "custody", "compliance"] as const;

/** One page of the report: a few lines of what it holds, drawn small. */
export function Page({ id, t }: { id: (typeof PAGES)[number]; t: T }) {
  const r = t.report;
  switch (id) {
    case "summary":
      return (
        <div className="fc-pg">
          <span className="fc-pg-k">{r.k}</span>
          <span className="fc-stamp"><b>{r.verdict}</b><i>{r.verdictSub}</i></span>
          <ul className="fc-pg-rows">
            {Object.values(r.rows).map((x) => <li key={x}>{x}</li>)}
          </ul>
        </div>
      );
    case "location":
      return (
        <div className="fc-pg">
          <canvas className="fc-cap fc-pg-cap" data-cap="b" width={300} height={200} />
          <span className="fc-pg-mono" data-ll="shared" />
          <span className="fc-pg-mono" data-plus="shared" />
        </div>
      );
    case "visit":
      return (
        <div className="fc-pg">
          <canvas className="fc-cap fc-pg-cap" data-cap="a" width={300} height={200} />
          <span className="fc-pg-mono">{t.evidence.a.k}</span>
          <span className="fc-pg-mono">{t.evidence.b.k}</span>
        </div>
      );
    case "statements":
      return (
        <div className="fc-pg">
          <q className="fc-pg-q">{t.evidence.a.quote}</q>
          <span className="fc-pg-s">{t.evidence.a.en}</span>
          <q className="fc-pg-q">{t.evidence.b.quote}</q>
          <span className="fc-pg-s">{t.evidence.b.en}</span>
        </div>
      );
    case "ai":
      return (
        <ul className="fc-pg fc-pg-rows fc-pg-ai">
          {Object.values(t.anomalies).map((x) => <li key={x}>{x}<i>{r.resolved}</i></li>)}
        </ul>
      );
    case "custody":
      return (
        <ol className="fc-pg fc-pg-tl">
          {CUSTODY.map((a) => <li key={a}><b>{t.acts[a].clock}</b>{t.acts[a].k}</li>)}
        </ol>
      );
    case "compliance":
      return (
        <ul className="fc-pg fc-pg-rows">
          {Object.values(t.chips).map((x) => <li key={x}>{x}</li>)}
        </ul>
      );
  }
}
