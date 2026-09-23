/** The turnaround table — check, turnaround, and the authority it was
 *  confirmed with — under the "Turnaround & coverage" heading on the solution
 *  pages (BUILD-SPEC §4 rule 2, §17 condition 22).
 *
 *  MEASURED 22 SEP 2026, BY SCRIPT. Four files render a `.tbl3`, and only two
 *  of them render THIS table: `templates/VerticalPage.tsx` and
 *  `app/[locale]/business/enterprise/page.tsx`, whose fifteen lines differ in
 *  exactly two places — the name of the array being mapped, and whether the
 *  footnote is a literal or a guarded prop.
 *
 *  THE OTHER TWO `.tbl3` SITES ARE NOT THIS UNIT, and that is the whole reason
 *  the column headings below are literals instead of a `cols` prop. Part 5's
 *  rule — whether two blocks share one shape is a per-file measurement, not an
 *  assumption — holds here: `/countries/[country]` heads its third column
 *  "Local note", maps a `{ check, time, note }` record, has no `<small>` and
 *  no `fast` class; `/platform/security-compliance` heads all three columns
 *  differently ("Data / Residency / Notes") and writes four rows out longhand.
 *  Forcing either through this component would need a heading triple, an
 *  optional sub-label and an optional fast flag — at which point the type no
 *  longer says "a check and how long it takes", which is the only thing that
 *  made the two real copies identical.
 *
 *  ONE CALLER TODAY: extracted under a change licensed to touch a single page
 *  file, so `VerticalPage` still holds its copy. `note` is optional and
 *  guarded because that copy renders the footnote conditionally
 *  (`{c.tableNote && …}`) while the enterprise page always passes one, so both
 *  emit the same HTML through one branch and adopting it there is a deletion.
 *
 *  `note` IS A `ReactNode` rather than a string because the one in use ends in
 *  an `<AppLink>` into `/platform/coverage`, and `Row.src` is a string because
 *  none of the sources are marked up — the same split `chrome/SecHead.tsx`
 *  measured between its `h` and its `k`.
 */
import type { ReactNode } from "react";

import { CHROME } from "@/lib/copy/chrome";
import { copy } from "@/lib/copy/request";

export type Row = { nm: string; sub: string; tm: string; fast?: boolean; src: string };

/** The three column headings moved to `lib/copy/chrome` and are STILL not a
 *  `cols` prop. The argument above is about which call sites may vary them
 *  (none — the other two `.tbl3` sites are a different unit); the copy layer
 *  is about which language they are in. A translator gets them; a page does
 *  not. */
export async function CheckTable({ rows, note }: { rows: readonly Row[]; note?: ReactNode }) {
  const t = (await copy(CHROME)).checkTable;

  return (
    <div className="body3 tbl3">
      <div className="hd">
        <span>{t.check}</span>
        <span>{t.turnaround}</span>
        <span>{t.confirmedWith}</span>
      </div>
      {rows.map((r) => (
        <div className="r" key={r.nm}>
          <span className="nm">{r.nm}<small>{r.sub}</small></span>
          <span className={`tm${r.fast ? " fast" : ""}`}>{r.tm}</span>
          <span className="src">{r.src}</span>
        </div>
      ))}
      {note && <div className="note">{note}</div>}
    </div>
  );
}
