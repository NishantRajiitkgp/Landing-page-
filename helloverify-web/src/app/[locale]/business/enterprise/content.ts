/** The FAQ ORDER for `/business/enterprise` (BUILD-SPEC §8.2, §17 condition
 *  22). The five questions themselves are `business.enterprise.faqs` in
 *  `lib/copy/business.en.tsx`.
 *
 *  WHY THE FILE EXISTED, with the numbers, because they are still the reason
 *  it exists. Measured 22 Sep 2026: `page.tsx` was **336 lines** against
 *  condition 22's limit of 300, and the `max-lines` rule in
 *  `eslint.config.mjs` failed on it. Part 5's fix for the other ten files was
 *  applied first — extract the repeated unit and drive it from a record list —
 *  and this page had two, the `.lanes3` cloud and the `.tbl3` table, both now
 *  `chrome/Lanes.tsx` and `chrome/CheckTable.tsx`. That took it to **311**,
 *  eleven over, and every piece of markup left is written once. These lines
 *  are what moved to close the gap.
 *
 *  `LANES` AND `ROWS` DELIBERATELY DID NOT MOVE WITH IT, which is the decision
 *  here worth arguing rather than the file. Both are quoted by the answer
 *  blocks directly above them (§11a.2): the "What we verify" block's three
 *  questions are the LANES records' own lane headings and four of its times
 *  are their pills, and the "Turnaround & coverage" block's five times are
 *  ROWS' six records in the order the table renders them. The comments there
 *  say so, and a sentence written to be read away from its page is the last
 *  thing that should have its source one import away. The FAQ is quoted by
 *  nothing.
 *
 *  WHAT CHANGED WHEN THE COPY LAYER LANDED, and the ruling behind it. The
 *  five `{ q, a }` pairs were prose, so they are copy and they went to
 *  `lib/copy/business` with the rest of this subtree. They are NOT the case
 *  `lib/content/checks.ts` and `lib/content/company.ts` make for data that is
 *  deliberately not copy: those two are the catalogues SEVERAL routes read and
 *  the register of the site's CLAIMS, held to agreement by
 *  `tools/test/credentials.test.ts` — change "20M+" there and you have changed
 *  a fact on nine surfaces. An FAQ answer is a paragraph a translator
 *  translates, on one page, gated by nothing. This module's own header already
 *  drew that line: it argued for living beside the page rather than in
 *  `lib/content/` precisely because "this is copy for one route".
 *
 *  What is left is the ORDER, which is structure and stays — the same split
 *  `chrome/SiteFooter.tsx` makes, where the component keeps its ordered
 *  columns and the dictionary holds a label per destination. The file is now
 *  small enough to fold back into `page.tsx`, and was deliberately not: the
 *  336-line measurement above is what a future edit will run into again, and
 *  the cheapest place to keep the headroom is the file that already has it.
 *
 *  `lib/seo/schema/faq.ts` says the FAQ text has "exactly one home: a `Faq[]`
 *  in the page module". That rule is about COPIES, not about which file: one
 *  array, one render site, no second string for Google's same-words policy to
 *  catch out — and it still holds exactly. `<FaqSection>` renders the array
 *  built from this order and emits the matching `FAQPage` node from the same
 *  records.
 */
import type { BusinessCopy } from "@/lib/copy/business";

/** The order the five questions are asked in. `keyof` rather than a hand-
 *  written union so that a sixth question added to the dictionary — or one
 *  renamed — is a type error here rather than a question that silently stops
 *  rendering. */
export const FAQ_ORDER: readonly (keyof BusinessCopy["enterprise"]["faqs"])[] = [
  "volume",
  "source",
  "submit",
  "ats",
  "failure",
];
