/** The RECORD ORDERS for `/platform/security-compliance` (BUILD-SPEC §4 rule 2,
 *  §17 condition 22). The words themselves are `platform.security` in
 *  `lib/copy/platform.en.tsx`.
 *
 *  WHY THIS FILE EXISTS, with the numbers, because they are still the reason it
 *  exists. Measured 22 Sep 2026, `page.tsx` was **383 lines** against condition
 *  22's limit of 300, and the `max-lines` rule added to `eslint.config.mjs`
 *  failed on it. A census of those 383 says where the length is: **112** were
 *  these records and the comments that justify them, **234** the component
 *  body, and the only markup written more than once was the residency table's
 *  row, four copies of five lines. So the records moved out and the page kept
 *  its markup.
 *
 *  THE REJECTED ALTERNATIVE WAS SPLITTING THE MARKUP, a component per band.
 *  Part 5 closed condition 22 on ten files and the fix was the same in every
 *  one — extract the repeated unit and drive it from a record list — and this
 *  page has already had that done to it three times: `chrome/SecHead`
 *  (`be88765`, 47 copies), `brand/Arrow` (`1b7331d`, 19) and `chrome/Steps`
 *  (`5c82da2`, 41) were all lifted out of markup this file used to hold. What
 *  is left is five bands that share no shape — a hero, a strip, a card grid, a
 *  table and a prose block — so a `SecurityBand` component would need a prop
 *  per band and would have one call site each: more lines than it removes, and
 *  the page would stop reading as the page.
 *
 *  ## What changed when the copy layer landed, and the ruling behind it
 *
 *  **EVERY STRING IN THIS FILE WAS COPY AND ALL OF IT MOVED.** The seven
 *  credential glosses, the six artefact rows, the four residency rows and the
 *  five `{ q, a }` pairs are prose on ONE route, gated by nothing, each a
 *  paragraph a translator translates. That is exactly the ruling
 *  `app/[locale]/business/enterprise/content.ts` recorded for its own `FAQS`,
 *  and it is the PRECEDENT THAT APPLIES HERE — not the one `lib/content/checks.ts`
 *  and `lib/content/company.ts` set. Those two are the catalogues SEVERAL routes
 *  read and the register of the site's CLAIMS, held to agreement by
 *  `tools/test/credentials.test.ts`: change "20M+" there and you have changed a
 *  fact on nine surfaces. Nothing here is read by a second route, and nothing
 *  here is a claim — the claims on this page are `CREDENTIAL_MARKS`' names and
 *  status words, which this file never held.
 *
 *  This module's own header already drew that line. It argued for living beside
 *  the page rather than in `lib/content/` precisely because "every record below
 *  is copy for one route, and a page-specific list in a shared directory is an
 *  invitation for a second page to import it". The copy layer is where copy for
 *  one route goes; the reasoning simply arrived at its destination.
 *
 *  What is left is the ORDER — the same split `chrome/SiteFooter.tsx` makes,
 *  where the component keeps its ordered columns and the dictionary holds a
 *  label per destination — plus `CERT_IDS`, which is a choice of WHICH
 *  credentials, and `req`, which is a CSS class rather than a word. The file
 *  stays rather than folding back into `page.tsx`: the 383-line measurement
 *  above is what a future edit will run into again, and the cheapest place to
 *  keep the headroom is the file that already has it.
 *
 *  THE GLOSSES' REASONING TRAVELLED WITH THE WORDS, except for the part that is
 *  about the CLAIMS rather than the copy, which is recorded on `CREDENTIALS` in
 *  `lib/content/company.ts` where it already was: why "NSR — empanelled" was a
 *  fifth status word and is gone, why ISO/IEC 27701, SOC 2 and ISO 9001 rest on
 *  weaker evidence than ISO 27001, PBSA and NSR, and why none of the three
 *  appears in `ARTEFACT_ORDER` below — promising a reviewer a document nobody
 *  has seen is exactly the overstatement the certifications standfirst says we
 *  do not make. **If a certificate or a SOC 2 report is produced, cite it on
 *  `CREDENTIALS` and add a row here and in the dictionary.**
 *
 *  `lib/seo/schema/faq.ts` says the FAQ text has "exactly one home: a `Faq[]` in
 *  the page module". That rule is about COPIES, not about which file: one array,
 *  one render site, no second string for Google's same-words policy to catch out
 *  — and it still holds exactly. `<FaqSection>` renders the array built from
 *  `FAQ_ORDER` and emits the matching `FAQPage` node from the same records.
 */
import type { CredentialId } from "@/lib/content/company";
import type { ArtefactKey, ResidencyKey, SecurityFaqKey } from "@/lib/copy/platform";

/** WHICH credentials this page cards, and in which order. A choice of ids, not
 *  copy: the logo, the name and the status word all come from
 *  `CREDENTIAL_MARKS` and are not overridable, for the reason
 *  `chrome/CertCard.tsx` sets out. The seven GLOSSES that sit under them are
 *  `platform.security.glosses`, keyed by these same ids.
 *
 *  Seven of seven are overridden, which is why the override exists — this is
 *  the page a security reviewer is sent, so each card has to say what the
 *  artefact IS and whether it can be ordered. */
export const CERT_IDS: readonly CredentialId[] = [
  "iso27001",
  "iso27701",
  "soc2",
  "iso9001",
  "gdpr",
  "pbsa",
  "nsr",
];

/** The six artefact rows in render order, each with the `.req` flag that
 *  decides whether its status pill is styled as required. `req` is a CSS class
 *  and not a word, which is why it did not travel with the copy — the same
 *  split `business/enterprise/page.tsx` makes for `fast` on its `ROWS`.
 *
 *  `ArtefactKey` rather than a hand-written union so that a seventh artefact
 *  added to the dictionary — or one renamed — is a type error here rather than
 *  a row that silently stops rendering. */
export const ARTEFACT_ORDER: readonly { k: ArtefactKey; req: boolean }[] = [
  { k: "isoCert", req: true },
  { k: "dpa", req: true },
  { k: "whitepaper", req: true },
  { k: "pentest", req: true },
  { k: "accessibility", req: false },
  { k: "subProcessors", req: true },
];

/** The residency table's rows, in render order.
 *
 *  THE ROW WAS WRITTEN OUT FOUR TIMES, and the four were diffed field by field
 *  before any markup was touched (Part 5's method, step 1: parse the fields,
 *  never retype the copy). Blanking the values reduces all four copies to one
 *  skeleton — `.nm` carrying a `<small>`, then `.tm`, then `.src` — so they
 *  differ in nothing but the sixteen strings the dictionary now holds. That
 *  measurement is what makes them one unit; four rows that happened to look
 *  alike would not be.
 *
 *  WHAT SHOULD HAPPEN NEXT is one `.tbl3` component for all three surfaces —
 *  this page, `components/templates/VerticalPage.tsx` and
 *  `chrome/CheckTable.tsx` — the way `Steps` replaced 41 hand-written cards. It
 *  is not done here because it would edit two files this change is scoped out
 *  of, and a fourth implementation consumed by one page would be worse than the
 *  three. */
export const RESIDENCY_ORDER: readonly ResidencyKey[] = [
  "documents",
  "results",
  "confirmation",
  "subProcessors",
];

/** The order the five questions are asked in. */
export const FAQ_ORDER: readonly SecurityFaqKey[] = [
  "questionnaire",
  "jurisdiction",
  "breach",
  "retention",
  "resale",
];
