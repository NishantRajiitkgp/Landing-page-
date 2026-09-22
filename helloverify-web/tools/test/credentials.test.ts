/** The credential table — and specifically the two things the unification pass
 *  recorded as NOT gated.
 *
 *  `CREDENTIAL_MARKS` replaced 29 hand-written `.cert` blocks across nine
 *  files, where the same logo had carried up to five different headings
 *  (`gdpr.jpg` five, `pbsa.jpg` three, `iso.jpg` three). One table now states
 *  each claim once, and `CertCard` has no `heading` prop, so a page cannot
 *  assert something the reviewed list does not give it. `tsc` holds that much.
 *
 *  WHAT `tsc` DOES NOT HOLD, which is why this file exists:
 *
 *  1. **The table against `CREDENTIALS`.** These are two hand-written lists of
 *     the same claims — the cards and the `llms.txt`/`/about` prose. The
 *     unification pass measured that 7 of 8 card claims appear verbatim in
 *     exactly one `CREDENTIALS` line and wrote that down as honest prose rather
 *     than asserting it, noting `check:llms` only reads `llms.txt`. A measured
 *     fact with nothing holding it is the state this repo has been bitten by:
 *     it is true on the day it is written and silently false at the first edit.
 *     So it is an assertion now.
 *
 *  2. **The count of four status words.** `/platform/security-compliance`'s
 *     standfirst says "Certified, compliant, aligned, member — four different
 *     claims, and we do not blur them". A fifth word had already survived on
 *     that very page (`NSR — empanelled`) past a note claiming the count was
 *     "checked rather than assumed"; the check had looked at the new row and
 *     not the table. The union type stops a *typo*, but `CredentialStatus`
 *     gaining a fifth member is a one-line edit that would make the standfirst
 *     false with nothing complaining. The number is the claim, so the number
 *     is asserted.
 */
import {
  CREDENTIALS,
  CREDENTIAL_MARKS,
  certHeading,
  type CredentialId,
} from "../../src/lib/content/company.ts";

import { check } from "./harness.ts";

const marks = Object.entries(CREDENTIAL_MARKS) as Array<
  [CredentialId, (typeof CREDENTIAL_MARKS)[CredentialId]]
>;

/** The claim a card makes: the credential and its status word, without the
 *  `scope` tail. `scope` is not part of the claim — "GDPR-aligned" is the
 *  claim and " data handling" is the subject it applies to, which is why the
 *  procurement `dash` form drops it. */
const claimOf = (m: (typeof CREDENTIAL_MARKS)[CredentialId]): string =>
  "status" in m && m.status
    ? `${m.name}${("sep" in m && m.sep) || " "}${m.status}`
    : m.name;

console.log("1. the table is the shape the renderer assumes");

check("eight marks", marks.length === 8, marks.length);
check("every mark has an image", marks.every(([, m]) => m.img.startsWith("/img/")));
check("every mark has a name", marks.every(([, m]) => m.name.trim().length > 0));
check("every mark has a gloss", marks.every(([, m]) => m.gloss.trim().length > 0));
check(
  "no mark carries a heading of its own",
  marks.every(([, m]) => !("heading" in m)),
);

console.log("2. exactly four status words — the procurement standfirst");

const statuses = [...new Set(marks.map(([, m]) => ("status" in m ? m.status : undefined)).filter(Boolean))].sort();

check(
  "four and only four distinct status words",
  statuses.length === 4,
  statuses,
);
check(
  "they are certified / compliant / aligned / member",
  statuses.join(",") === "aligned,certified,compliant,member",
  statuses,
);
// The word that actually got through once, named so a reintroduction reads as
// this test's subject rather than as an off-by-one.
check("no mark is 'empanelled'", !statuses.includes("empanelled" as never));

console.log("3. NSR and MOM state no status, on every surface");

for (const id of ["nsr", "mom"] as const) {
  const m = CREDENTIAL_MARKS[id];
  check(`${id} has no status word`, !("status" in m && m.status));
  check(`${id} plain heading is the bare name`, certHeading(m) === m.name, certHeading(m));
  check(
    `${id} dash heading is the bare name too`,
    certHeading(m, "dash") === m.name,
    certHeading(m, "dash"),
  );
}

console.log("4. certHeading — the two forms the site renders");

check(
  "plain: ISO 27001 certified",
  certHeading(CREDENTIAL_MARKS.iso27001) === "ISO 27001 certified",
  certHeading(CREDENTIAL_MARKS.iso27001),
);
check(
  "dash: ISO 27001 — certified",
  certHeading(CREDENTIAL_MARKS.iso27001, "dash") === "ISO 27001 — certified",
  certHeading(CREDENTIAL_MARKS.iso27001, "dash"),
);
// GDPR is the only mark using `sep` and `scope`, and it is the claim the site
// says it does not blur — "compliant" is what five surfaces wrongly rendered.
check(
  "plain: GDPR-aligned data handling (sep and scope both applied)",
  certHeading(CREDENTIAL_MARKS.gdpr) === "GDPR-aligned data handling",
  certHeading(CREDENTIAL_MARKS.gdpr),
);
check(
  "dash: GDPR — aligned (scope dropped)",
  certHeading(CREDENTIAL_MARKS.gdpr, "dash") === "GDPR — aligned",
  certHeading(CREDENTIAL_MARKS.gdpr, "dash"),
);
check(
  "no heading anywhere says 'GDPR compliant'",
  !marks.some(
    ([, m]) =>
      certHeading(m).includes("GDPR compliant") || certHeading(m, "dash").includes("GDPR compliant"),
  ),
);
check("plain is the default form", certHeading(CREDENTIAL_MARKS.pbsa) === certHeading(CREDENTIAL_MARKS.pbsa, "plain"));

console.log("5. the cards agree with CREDENTIALS — finding 7, now held");

/** `mom`'s card says "In production with a ministry" where `CREDENTIALS` says
 *  "In production with Singapore's Ministry of Manpower for work-pass
 *  credential verification". Both are true and neither is the other's
 *  substring: the card is deliberately unattributed because it renders on
 *  pages where the named ministry is the reader, and `/about`'s line names it
 *  because that page is the record. Excepted by name, with the reason, rather
 *  than by loosening the assertion for all eight. */
const EXEMPT: readonly CredentialId[] = ["mom"];

for (const [id, m] of marks) {
  if (EXEMPT.includes(id)) continue;
  const claim = claimOf(m);
  const hits = CREDENTIALS.filter((line) => line.includes(claim));
  check(
    `${id}: "${claim}" appears in exactly one CREDENTIALS line`,
    hits.length === 1,
    { claim, hits },
  );
}

check(
  "the exemption list has not grown",
  EXEMPT.length === 1 && EXEMPT[0] === "mom",
  EXEMPT,
);
// Guards the exemption itself: if someone rewrites /about's line to match the
// card, the exception is stale and should be deleted, not left as a standing
// licence for the two lists to disagree.
check(
  "mom is still genuinely absent from CREDENTIALS, so the exemption is still needed",
  !CREDENTIALS.some((line) => line.includes(CREDENTIAL_MARKS.mom.name)),
);
