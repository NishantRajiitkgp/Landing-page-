/** The HelloVerify entity, stated once (BUILD-SPEC §8.2, §11a.3).
 *
 *  §11a.3 sets the hard requirement this file exists to satisfy:
 *
 *      "the `Organization` block must be byte-identical across every page and
 *       match external profiles exactly … Inconsistent entity data is the most
 *       common reason an engine attributes a claim to the wrong company."
 *
 *  Byte-identity is structural here rather than reviewed: these are two module
 *  constants, built once per build and rendered by `app/[locale]/layout.tsx`,
 *  so every page emits the same serialised bytes by construction. Nothing is
 *  parameterised — in particular nothing is parameterised by locale, which is
 *  the one thing that would quietly break it (see the known gap at the bottom).
 *  `tools/seo/check-schema.mjs` string-compares the emitted block across all 56
 *  pages anyway, because "by construction" is a claim about code and the
 *  requirement is about output.
 *
 *  §8.2 says "port from `StructuredData.tsx`", and it was — the old site is at
 *  `D:\Projects\Application Frontend HV`. (Item 6 shipped before that repo was
 *  available and re-derived what it could from `app/[locale]/about/page.tsx`,
 *  which states in its own header that it carries the "REAL" list; item 7
 *  completed the port.)
 *
 *  PORTING FACTS, NOT FILES, and the head office is why. The old schema names
 *  Mumbai (`StructuredData.tsx:45`) while its own `seo.ts:50` says "Founded in
 *  Noida" and its contact page says "India, New Delhi" — three answers in one
 *  repo, four counting this one. Confirmed as **Noida**, which means the JSON-LD
 *  running in production today is wrong. Same shape for the office count (six,
 *  not the four its contact page lists) and the LinkedIn URL (the `/company/`
 *  page, not the `/in/…` personal profile its footer links). Every value below
 *  is sourced in `lib/content/company.ts`, which records each conflict and how
 *  it was settled.
 *
 *  WHAT THE OLD REPO UNBLOCKED. Item 6 shipped this node without `sameAs`,
 *  `telephone` or `email`, because nothing in this tree evidenced them. The old
 *  site publishes all three, so they are ported rather than guessed — see
 *  `lib/content/company.ts` for the source of each and for the four-way
 *  disagreement about the head office that had to be settled first.
 *
 *  WHAT IS STILL DELIBERATELY ABSENT, and why absence beats a guess:
 *
 *  - A street address and postcode. `PostalAddress` carries locality and
 *    country only. The old repo does not close this one: its live schema says
 *    Mumbai, its contact page says New Delhi, and the confirmed answer is
 *    Noida — so the city is now right, and no street line exists anywhere to
 *    port. A `streetAddress` that does not match the Google Business Profile is
 *    the exact inconsistency §11a.3 warns about.
 *
 *  KNOWN GAP, same shape as the `og:locale` one in README: these constants are
 *  English and point at `/en`. Correct while `en` is the only served locale,
 *  and the moment `hi` or `ar` ships the right answer is still ONE entity with
 *  one `@id` and one `url` — not a per-locale entity — but `description` would
 *  want translating. Making that per-locale is precisely what would break the
 *  byte-identity rule, so it needs the copy decision first.
 */
import type { Organization, WebSite, WithContext } from "schema-dts";

import { CONTACT, SAME_AS } from "@/lib/content/company";
import { routing } from "@/lib/i18n/routing";
import { localePath } from "@/lib/seo/routes";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo/site";

/** Stable node identifiers. Every other node in the graph refers to the
 *  organisation by `{ "@id": ORG_ID }` rather than by restating its name —
 *  `WebSite.publisher`, `Service.provider`, `BlogPosting.author` and
 *  `.publisher` all do. That is what turns a set of disconnected per-page
 *  blocks into one entity graph, and it is the cheap half of §11a.3.
 *
 *  The fragment form (`…/#organization`) is the schema.org convention for "a
 *  thing described by this site" as distinct from the site itself. It is never
 *  fetched, so it does not have to be a route.
 */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** The locale home, not the bare origin. `SITE_URL` alone is
 *  `https://www.helloverify.com`, which 308s to `/en` (§6.1) — and §11a.1 notes
 *  AI crawlers handle redirects worse than Googlebot does, so naming a
 *  redirect as the entity's canonical URL is the same mistake as putting one in
 *  the sitemap. `absoluteUrl(localePath(…))` is the same pair of calls
 *  `app/sitemap.ts` and `lib/seo/metadata.ts` make, so this string is
 *  byte-identical to the homepage's own canonical.
 */
const HOME = absoluteUrl(localePath("/", routing.defaultLocale));

export const ORGANIZATION: WithContext<Organization> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  url: HOME,
  description: SITE_DESCRIPTION,

  /** Raster, not the inline SVG. Google's Organization guidance wants a
   *  bitmap of at least 112px on its short side; this is 1064x388, generated
   *  from `tools/brand/logo.svg` by `npm run build:logo` so the file is
   *  reproducible from text rather than committed as a mystery binary.
   *
   *  Items 6 and 7 both shipped without this: the mark lived only as inline
   *  JSX (`components/brand/Logo.tsx`) and the old site's `logo` pointed at
   *  an SVG that does not exist here. Rejected alternative, same as in
   *  `lib/seo/metadata.ts`: pointing it at `/en/opengraph-image`, which
   *  hardcodes a file-convention route into a second place and is a social
   *  card rather than a mark. */
  logo: absoluteUrl("/logo.png"),

  /** From `about/page.tsx`: "2018 founded". Year-only is a valid schema.org
   *  `Date` (ISO 8601 allows a reduced precision date) and is the precision
   *  this repo actually has — no founding month is stated anywhere. */
  foundingDate: "2018",

  address: {
    "@type": "PostalAddress",
    addressLocality: "Noida",
    addressCountry: "IN",
  },

  /** UNBLOCKED BY THE OLD REPO. Item 6 shipped this node with `url` only,
   *  because nothing in THIS repo carried a public phone number or a sales
   *  address — `sales@helloverify.com` was a fallback default in
   *  `lib/leads/env.ts`, not reviewed copy. The old site publishes both
   *  (`public/cms/en/contactUs.base.json`, `src/components/StructuredData.tsx`),
   *  so the guess never had to be made.
   *
   *  Two points rather than one: the old schema had a single "customer service"
   *  entry, but the old contact page routes sales and support to different
   *  addresses, and an engine asked "how do I contact HelloVerify about buying"
   *  should not be handed the support queue. `areaServed` on the second is the
   *  Dubai number's actual remit, not a claim about where the company operates
   *  — that lives on `Service.areaServed`. */
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: CONTACT.salesEmail,
      telephone: CONTACT.indiaPhone,
      url: absoluteUrl(localePath("/contact", routing.defaultLocale)),
      availableLanguage: ["English", "Hindi", "Arabic"],
    },
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: CONTACT.supportEmail,
      telephone: CONTACT.uaePhone,
      areaServed: "AE",
      availableLanguage: ["English", "Arabic"],
    },
  ],

  /** §11a.3's entity-disambiguation lever, and the field item 6 most wanted and
   *  could not fill: this repo's footer renders LinkedIn, Facebook and
   *  Instagram as `href="#"`. All three real URLs are published by the old
   *  site. The LinkedIn one is the `/company/` page, not the
   *  `/in/hello-verify-trust-line-…` personal profile its own footer links —
   *  confirmed, because a `sameAs` pointing at the wrong profile ties every
   *  claim on this site to a different entity. */
  sameAs: [...SAME_AS],

  /** "PBSA member — the global standards body for the screening industry"
   *  (`about/page.tsx`). `memberOf` rather than `hasCertification`, because
   *  membership of a standards body is not a certification and conflating the
   *  two is the kind of overstatement a compliance vendor cannot afford. */
  memberOf: {
    "@type": "Organization",
    name: "Professional Background Screening Association",
    alternateName: "PBSA",
  },

  /** The claims on `/about` that are audited certifications rather than
   *  memberships or client relationships. NSR is a registry HelloVerify
   *  participates in and MOM is a customer, so neither belongs here.
   *  `certificationIdentification` is omitted on all three: the certificate
   *  numbers are not stated anywhere in this repo, and inventing one would make
   *  the claim checkable and wrong.
   *
   *  ISO/IEC 27701 joined this node on 22 Sep 2026, with `/about` and
   *  `lib/content/company.ts`, because §11a.3 requires the entity to say what
   *  the page says — a certification card on `/about` that the `Organization`
   *  node omits is the same inconsistency as the reverse, just quieter. Its
   *  evidence is stated in full on `CREDENTIALS` in `lib/content/company.ts`
   *  and is weaker than 27001's: published on the existing site at
   *  `public/llms.txt:67`, confirmed by the owner 22 Sep 2026, with no
   *  certificate on file. If one is produced, cite it there and consider
   *  `certificationIdentification` here.
   *
   *  SOC 2 is deliberately NOT here even though it is now on `/about`. A SOC 2
   *  engagement ends in an auditor's attestation report, not a certificate
   *  issued by a standards body, and there is no issuer to name in `issuedBy`
   *  — modelling it as a `Certification` would be a machine-readable
   *  overstatement of exactly the kind this node's `memberOf`/`hasCertification`
   *  split exists to avoid. It reaches crawlers through `llms.txt`'s prose,
   *  where the word "compliant" travels with it.
   *
   *  ISO 9001 IS HERE, and the reasoning that kept SOC 2 out does not reach it.
   *  SOC 2 was excluded for a structural reason and not a documentary one: an
   *  attestation report has no issuing body, so `issuedBy` would have to be
   *  invented or dropped. ISO 9001 is a certification against a published ISO
   *  standard, audited by a certification body, exactly like 27001 and 27701 —
   *  the `Certification` type fits it, and the weakness in our evidence is about
   *  WHETHER we hold it, which is a `CREDENTIALS` question for the reviewed list
   *  and not a question about which schema.org type models it. Excluding it
   *  would say "this is not the kind of thing that gets certified", which is
   *  false, while saying nothing at all about the evidence.
   *
   *  `issuedBy` is "International Organization for Standardization" on all
   *  three, which is CONSISTENT rather than correct, and the difference is worth
   *  stating. ISO writes the standards; it does not issue certificates —
   *  accredited bodies do. For 27001 there is now a hint of who: the old repo
   *  holds `public/assets/aboutus/ISO_27001_1.png`, a TÜV SÜD mark reading
   *  "ISO 27001", which it references nowhere. That is the only trace of a
   *  certification body in either repo, it covers one of the three, and it is a
   *  logo rather than a certificate. Naming TÜV SÜD on 27001 alone would leave
   *  three entries with two different answers to the same field on the strength
   *  of an unreferenced image, so all three keep the standards body until a
   *  certificate names the auditor — at which point `issuedBy` should become
   *  the accredited body, per standard, and this paragraph should go. */
  hasCertification: [
    {
      "@type": "Certification",
      name: "ISO/IEC 27001",
      issuedBy: {
        "@type": "Organization",
        name: "International Organization for Standardization",
      },
    },
    {
      "@type": "Certification",
      name: "ISO/IEC 27701",
      issuedBy: {
        "@type": "Organization",
        name: "International Organization for Standardization",
      },
    },
    {
      /** "ISO 9001", not "ISO/IEC 9001" — the quality-management standard is
       *  ISO's alone, unlike 27001 and 27701 which are joint ISO/IEC. Also the
       *  spelling the old site publishes, so the two agree by luck rather than
       *  by compromise. */
      "@type": "Certification",
      name: "ISO 9001",
      issuedBy: {
        "@type": "Organization",
        name: "International Organization for Standardization",
      },
    },
  ],
};

export const WEBSITE: WithContext<WebSite> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: SITE_NAME,
  url: HOME,
  inLanguage: routing.defaultLocale,
  publisher: { "@id": ORG_ID },

  /** NO `potentialAction: { "@type": "SearchAction" }`, and this is the
   *  deprecation §8.2 calls out by name rather than an oversight. Google
   *  retired the Sitelinks Search Box in January 2026; the markup is now inert
   *  at best. This site also has no search endpoint to point one at, so
   *  emitting it would have been a fabricated URL as well as a dead feature.
   *  `tools/seo/check-schema.mjs` fails the build if `SearchAction` or `QAPage`
   *  ever appears in any emitted graph — the deprecation is enforced, not
   *  remembered. */
};
