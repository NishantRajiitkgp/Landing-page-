import type { ReactNode } from "react";

/** A section's kicker, heading and lede — the three-part header that opens
 *  almost every band on almost every page.
 *
 *  Written out by hand **49 times across 19 files**, character for character,
 *  before this existed: `<div className="sec-head">`, a nested `<div>` holding
 *  `.k` and an `.h2` at `marginTop: 12`, then a `.lede` at `marginBottom: 8`.
 *  Nine lines each, 441 in total, for one shape (BUILD-SPEC §4 rule 2, §17
 *  condition 22). It is the largest single repetition left in the repo and the
 *  main reason the two 334-line page files are 334 lines.
 *
 *  The 21 other `sec-head` blocks in the repo are NOT this shape — no lede, a
 *  lede carrying a link, different margins — and are deliberately left alone
 *  rather than forced through a prop. Measured: 70 occurrences, 49 identical.
 *
 *  `h` is a `ReactNode` because 43 of the 49 headings carry a `<br />` or an
 *  `<em>`; `k` is a string because none of them do. The lede is `children` so
 *  it reads as prose at the call site, and so its line breaks stay where the
 *  author put them — JSX folds a newline plus indentation to a single space, so
 *  re-indenting it cannot change the emitted text.
 */
export function SecHead({ k, h, children }: { k: string; h: ReactNode; children: ReactNode }) {
  return (
    <div className="sec-head">
      <div>
        <div className="k">{k}</div>
        <h2 className="h2" style={{ marginTop: 12 }}>{h}</h2>
      </div>
      <p className="lede" style={{ marginBottom: 8 }}>{children}</p>
    </div>
  );
}
