import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { CERT_BOX } from "@/lib/img";
import {
  CREDENTIAL_MARKS,
  certHeading,
  type CredentialId,
  type CredentialMark,
} from "@/lib/content/company";

/** A `.cert` card — logo, heading, one line — driven from `CREDENTIAL_MARKS` in
 *  `lib/content/company.ts` (BUILD-SPEC §11a.3, §4 rule 2).
 *
 *  WHY: hand-written **29 times across 9 files**, and by 22 Sep 2026 the copies
 *  had stopped agreeing. The homepage listed four credentials where `/about` and
 *  `/platform/security-compliance` listed seven; it said "GDPR compliant" where
 *  the procurement page says "GDPR — aligned" under a standfirst that calls
 *  those two different claims; PBSA had two headings and the homepage's own
 *  `.dsk` and `.mob` blocks each had a different one. The full measurement is on
 *  `CREDENTIAL_MARKS`. Nine files cannot disagree about a string none of them
 *  holds, so the heading and the status word are not reachable from a call site
 *  at all — there is no `heading` prop, deliberately.
 *
 *  WHY THE GLOSS *IS* OVERRIDABLE, which is the one real judgement here. The
 *  precedent is `chrome/SecHead.tsx`: 49 identical blocks shared, 21 left alone
 *  because they were not the same shape. Measured across the 40 cards the nine
 *  surfaces rendered, the gloss is genuinely not the same shape everywhere:
 *
 *  - `/platform/security-compliance` runs 1.5 to 3 sentences per card, because
 *    it is the page a security reviewer is sent and each card has to say what
 *    the artefact IS and whether it can be ordered ("Certificate and scope
 *    statement available on request", "DPA available"). Forcing the homepage's
 *    one line on it would delete reviewed procurement copy.
 *  - `/business` adds "Reports available under NDA" — true of that buyer and
 *    not of a consumer page.
 *  - The homepage's `.mob` column is narrower than its `.dsk` column and
 *    already carried shortened glosses before this component existed. Part 5
 *    measured this exact question per file and found both answers real
 *    (PeopleStrip's two breakpoints genuinely differ; Packages' do not), so it
 *    is a measurement rather than a rule.
 *
 *  A default that no surface may vary would therefore have to be either the
 *  procurement paragraph or the phone-width fragment, and neither reads right
 *  in the other place. The name and the status word are different: those are
 *  claims about the company, they are identical on every surface by definition,
 *  and a page that needs its own version of one is a page making a claim the
 *  reviewed list does not. Hence the split — facts fixed, length editorial.
 *
 *  `gloss` is a `ReactNode` because two surfaces end the MOM card with a link
 *  into the case study, and their link text differs ("the story →" on `/about`,
 *  "read the story →" on `/governments`).
 *
 *  NOT USED FOR THREE CARDS ON `/business/customer-kyc` AND `/individuals`, and
 *  that is the SecHead judgement applied: three of the 40 are `.cert` markup
 *  around a STANCE rather than a credential — "Consent first, always", "They
 *  consent, then we check", "Documents deleted on schedule" — reusing `gdpr.jpg` and
 *  `iso.jpg` as illustration. They name no credential and carry no status word,
 *  so they are not this component's shape and were left hand-written, with a
 *  comment at each site saying so. The one card on those pages that IS a
 *  credential card (customer-kyc's "ISO 27001 certified") does come from here.
 */
export function CertCard({
  id,
  form = "plain",
  gloss,
  style,
}: {
  id: CredentialId;
  /** `"dash"` renders "ISO 27001 — certified". Only
   *  `/platform/security-compliance` uses it; the reason is on `certHeading`. */
  form?: "plain" | "dash";
  gloss?: ReactNode;
  /** The homepage's first desktop card suppresses its own top hairline, since
   *  the band above it already draws one. */
  style?: CSSProperties;
}) {
  // Widened to `CredentialMark` on the way in, deliberately. `CREDENTIAL_MARKS`
  // is `as const`, so each record keeps its literal type and the ones that set
  // no `alt`/`sep`/`scope` do not have those properties AT ALL — reading
  // `m.alt` off the raw union is TS2339, which is how this line got its
  // annotation. The `as const` stays because it is what makes `CredentialId` a
  // union of the real ids rather than `string`, and that union is what makes a
  // mistyped id at a call site a compile error instead of a blank card.
  const m: CredentialMark = CREDENTIAL_MARKS[id];
  return (
    <div className="cert" style={style}>
      <Image src={m.img} alt={m.alt ?? m.name} width={CERT_BOX} height={CERT_BOX} />
      <div>
        <div className="h">{certHeading(m, form)}</div>
        <p className="p">{gloss ?? m.gloss}</p>
      </div>
    </div>
  );
}

/** Several cards, in the order the call site names them.
 *
 *  Each surface lists its own ids rather than taking "all of them", because a
 *  SUBSET is a legitimate editorial choice and forcing all eight everywhere
 *  would be wrong: `/governments` leads with the artefacts a ministry asks for
 *  and does not show India's National Skills Registry, and `/business` shows
 *  the two an enterprise buyer screens on. Naming the ids makes each page's
 *  choice explicit and reviewable, which 29 copies of markup did not — the same
 *  reasoning as `sections/Checks.tsx`, where each view names the check ids it
 *  shows so neither order is derived from the other (Part 5).
 *
 *  It emits no wrapper: the containers really do differ — `body3 certs3` on the
 *  section pages, `certs3 hair-top` on `/business`, a bare `<div>` inside the
 *  homepage's two-column grid — and wrapping them here would mean a prop per
 *  page for markup that is about the band, not about the cards.
 */
export function CertCards({
  ids,
  form,
  glosses,
}: {
  ids: readonly CredentialId[];
  form?: "plain" | "dash";
  /** Per-surface gloss, keyed by id. Anything absent takes the default. */
  glosses?: Partial<Record<CredentialId, ReactNode>>;
}) {
  return (
    <>
      {ids.map((id) => (
        <CertCard key={id} id={id} form={form} gloss={glosses?.[id]} />
      ))}
    </>
  );
}
