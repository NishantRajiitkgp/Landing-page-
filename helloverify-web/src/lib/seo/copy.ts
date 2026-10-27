/** Every page's reviewed title and description, in one table (BUILD-SPEC §8.1,
 *  §11a.4).
 *
 *  §8.1's correction called this "the right end state" and deferred it:
 *
 *      "Centralising 32 pairs into a table is the right end state … but it is a
 *       copy review, so it belongs with the locale work (§7), not with a
 *       canonical tag."
 *
 *  Item 7 forces it, because §11a.4 requires `llms.txt` to carry a one-line
 *  description per route and to be "regenerated from the same route manifest
 *  that feeds `sitemap.ts` — it can never drift". The manifest
 *  (`lib/seo/routes.ts`) holds paths, change frequencies and priorities, and no
 *  copy at all. The three options were a `description` field on `RouteEntry` (a
 *  second copy of reviewed strings one import away from the first — the exact
 *  drift this codebase exists to prevent), a separate set of navigational
 *  one-liners (a third place copy lives), or this: collapse the duplication so
 *  that the canonical tag, the `<title>`, the Service node and `llms.txt` all
 *  read the same string.
 *
 *  None of the copy here was rewritten. Every literal was lifted verbatim out
 *  of the page file that already carried it, by a script, precisely so that
 *  centralising it is not a copy review by the back door.
 *
 *  THE DYNAMIC HALF IS DERIVED, NOT LISTED. The 28 programmatic routes take
 *  their copy from the same content records their pages render — `CHECKS`,
 *  `COUNTRIES`, `POSTS`, `LEGAL` — so adding a check or a policy needs no edit
 *  here, exactly as it needs none in `routes.ts`.
 *
 *  COMPLETENESS IS A BUILD GATE, not a review item — the §7 rule applied to
 *  copy. The loop at the bottom resolves every route in the manifest through
 *  `copyFor` at module load, so a page that exists without copy is a failed
 *  `next build` rather than an empty `<title>` discovered in production.
 *
 *  KEYED BY LOCALE since 4 Oct 2026. English is still the reviewed table;
 *  `hi` and `ar` are the same paths with translated titles and descriptions.
 *  Dynamic routes keep catalogue names (check, country, post, legal) in
 *  English — those records are not in this table — and wrap them in a
 *  per-locale sentence. `llms.txt` stays English (one file, at the root).
 */
import { CHECKS } from "@/lib/content/checks";
import { COUNTRIES } from "@/lib/content/countries";
import { LEGAL } from "@/lib/content/legal";
import { POSTS } from "@/lib/content/posts";
import { routing } from "@/lib/i18n/routing";
import { allRoutes } from "@/lib/seo/routes";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/seo/site";

import { STATIC_AR } from "./copy.ar";
import { STATIC_HI } from "./copy.hi";

/** The reviewed copy for one page. Deliberately just these two: `<meta
 *  name="keywords">` is dropped (§8.1), and OG title/description are derived
 *  rather than written twice. */
export type PageCopy = {
  readonly title: string;
  readonly description: string;
};

/** The 28 hand-written English routes. Unannotated so the keys are the
 *  path literals — `copy.hi.ts` / `copy.ar.ts` are checked against them. */
export const STATIC_EN = {
  "/": {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  "/business": {
    title: "Background verification for business — HelloVerify",
    description:
      "One pipeline for every role you hire — riders to directors. Enterprise BGV, SMB packages, employee verification, customer KYC and vendor due diligence.",
  },
  "/governments": {
    title: "Verification for governments & authorities — HelloVerify",
    description:
      "Primary-source verification at national scale — work passes, medical credentials, visas and trade licences. Trusted by ministries across India, KSA, UAE, Singapore and Europe.",
  },
  "/individuals": {
    title: "Background checks for individuals & families — HelloVerify",
    description:
      "Verify a driver, a nanny, a tenant or your own documents for a visa. Send a photo over WhatsApp, get the report in 30 minutes.",
  },
  "/platform": {
    title: "The HelloVerify platform — technology, security, coverage",
    description:
      "The proof layer: how verification runs, how data is protected, and where in the world a document can be confirmed at its source.",
  },
  "/resources": {
    title: "Resources — HelloVerify",
    description:
      "The check library, country guides, a glossary of verification terms, and writing about how verification actually works.",
  },
  "/products/bgv-enterprise": {
    title: "AI-Powered Background Screening Trusted by India’s Leading Enterprises Stop Bad Hires Before They Happen — HelloVerify",
    description:
      "Our combination of AI-powered automation and dedicated in-house verification experts helps detect fraud while delivering a seamless experience for genuine applicants.",
  },
  "/products/bgv-smb": {
    title: "Background Checks For Small & Medium Businesses — HelloVerify",
    description:
      "Our AI-powered screening platform provides startups and small & medium businesses with a fast, reliable, and scalable background verification solution.",
  },
  "/employee-verification": {
    title: "All-in-One Background Verification for Every Workforce Segment — HelloVerify",
    description:
      "As a global provider of background screening solutions, we help organizations of all sizes hire the right people for the right opportunities. Join us to Modernize the way you hire & scale heights.",
  },
  "/products/customer-kyc": {
    title: "KYC Platform — HelloVerify",
    description:
      "Onboard faster. Detect fraud earlier. Our comprehensive KYC solution brings every step of the digital onboarding process together creating a seamless experience that keeps fraudsters out and genuine customers moving forward.",
  },
  "/products/certifier": {
    title: "Certifier — HelloVerify",
    description:
      "We are redefining third-party verification for B2B businesses delivering fast, reliable authentication of identities and documents that modern enterprises demand.",
  },
  "/solutions/health-authorities": {
    title: "Primary Source Verification for Healthcare Workforce — HelloVerify",
    description:
      "Ensure credential accuracy and regulatory compliance by verifying doctors, nurses, and allied professionals directly from issuing authorities.",
  },
  "/solutions/immigration-authorities": {
    title: "Immigration Solutions Authorities — HelloVerify",
    description:
      "AI-Powered Verification for Faster, Safer Immigration Decisions. Enable secure, compliant applicant screening with advanced fraud detection and real-time verification.",
  },
  "/solutions/manpower-and-education-authorities": {
    title: "AI-Powered Education Equivalency & Qualification Checks — HelloVerify",
    description:
      "1 in 8 applicants misrepresent their academic credentials, creating risks that undermine organizational integrity. Our AI-driven onboarding and automated workflows support faster, more informed hiring decisions.",
  },
  "/solutions/manpower-and-education-authorities/mohesr": {
    title: "Ministry of Higher Education and Scientific Research (MOHESR) — HelloVerify",
    description:
      "HelloVerify is the verification partner for the UAE Ministry of Higher Education and Scientific Research. Degree verification is AED 350, with standard delivery in 18 calendar days.",
  },
  "/governments/manpower-education/mohesr": {
    title: "UAE Ministry of Higher Education & Scientific Research — HelloVerify",
    description:
      "HelloVerify is an authorized verification partner for the UAE's MOHESR: degrees earned outside the UAE confirmed with the issuing university before recognition.",
  },
  "/governments/immigration/embassy-of-latvia": {
    title: "Embassy of the Republic of Latvia — HelloVerify",
    description:
      "How HelloVerify screens student and work visa applicants for the Embassy of Latvia: identity, education or employment and financial records verified before the visa.",
  },
  "/governments/immigration/embassy-of-italy": {
    title: "Embassy of Italy, New Delhi — HelloVerify",
    description:
      "Visa support document verification for Italian National Visa applicants in the New Delhi jurisdiction: identity, education, employment, bank and company records.",
  },
  "/solutions/manpower-and-education-authorities/ministry-of-manpower": {
    title: "Verify Your Qualifications. Get Your Work Pass. — HelloVerify",
    description:
      "HelloVerify is officially empanelled by Singapore’s Ministry of Manpower (MOM) to provide Primary Source Verification (PSV) for educational qualifications under the COMPASS framework.",
  },
  "/solutions/trade-authorities": {
    title: "Business & Trade Authorities — HelloVerify",
    description:
      "Empowering Business & Trade Authorities with comprehensive verification solutions that support visa compliance through accurate validation of identity, education, employment, and criminal records—helping reduce fraud and operational risk.",
  },
  "/products/hellov": {
    title: "Make Sure You and Your Family Are Safe! — HelloVerify",
    description:
      "Verification made easy on WhatsApp by HelloVerify.",
  },
  "/products/immigration": {
    title: "Pre Screening Of Applicant — HelloVerify",
    description:
      "We Help Make Your Entire Visa Application Process Smooth, Secure, and Free from Delays",
  },
  "/individuals/home-family": {
    title: "Make sure you and your family are safe — HelloV by HelloVerify",
    description:
      "HelloV household packages on WhatsApp: driver ₹499, home staff ₹599, nanny and tenant ₹549. Single checks from ₹199, with consent first.",
  },
  "/ai": {
    title: "HelloVerify AI — see how our AI checks work",
    description:
      "Follow one address check step by step: our AI flags what doesn't add up, a local expert visits in person, and the evidence becomes a full report.",
  },
  "/technology": {
    title: "The Trust Technology Platform — HelloVerify",
    description:
      "HelloVerify's Trust Technology Platform performs Primary Source Verification directly from authorised sources, orchestrating complex workflows across countries, institutions, and regulatory ecosystems. Powered by AI and trained on millions of verifications.",
  },
  "/international": {
    title: "International Background Verification — HelloVerify",
    description:
      "HelloVerify provides accurate and timely international background verification across 120+ countries and territories worldwide.",
  },
  "/platform/security-compliance": {
    title: "Security & compliance — HelloVerify",
    description:
      "Certifications, data residency, sub-processors, accessibility conformance and the artefacts a security review needs — in one place.",
  },
  "/resources/blog": {
    title: "Blog — HelloVerify",
    description:
      "Writing about how verification actually works, by the people who run the checks.",
  },
  "/resources/checks": {
    title: "The check library — HelloVerify",
    description:
      "Every verification check: what it answers, who confirms it, how long it takes, and what it cannot tell you.",
  },
  "/resources/countries": {
    title: "Country guides — HelloVerify",
    description:
      "What verification is actually like country by country: the registries, the timelines, and the local trap that catches people out.",
  },
  "/resources/glossary": {
    title: "Glossary of verification terms — HelloVerify",
    description:
      "Primary source, attestation, screening, adverse media, BGV — the words vendors use interchangeably, defined precisely.",
  },
  "/about": {
    title: "About HelloVerify",
    description:
      "Trust is becoming the world's next critical digital infrastructure. HelloVerify is building the platform through which trust will move.",
  },
  "/partner-with-us": {
    title: "HelloVerify Partner Programme · Earn up to 15% commission",
    description:
      "Join the HelloVerify Partner Programme and earn up to 15% commission on every background verification service your clients use. Free to join, completely digital.",
  },
  "/contact": {
    title: "Lets Build the Business Together — HelloVerify",
    description:
      "See how HelloVerify can help your business. Schedule a demo with our background screening expert",
  },
};

export type StaticSeoPath = keyof typeof STATIC_EN;

const STATIC: Record<string, Record<string, PageCopy>> = {
  en: STATIC_EN,
  hi: STATIC_HI,
  ar: STATIC_AR,
};

/** The programmatic routes (IA §7), derived from the same records their pages
 *  render. Each branch is the exact expression the page's `generateMetadata`
 *  used to inline — moved, not rewritten.
 *
 *  Returns `null` rather than throwing on an unknown slug: the page component
 *  answers that case with `notFound()`, and a copy lookup is not the right
 *  place to decide a URL does not exist.
 */
function dynamicCopy(path: string, locale: string): PageCopy | null {
  let m: RegExpExecArray | null;

  if ((m = /^\/checks\/(.+)$/.exec(path))) {
    const c = CHECKS.find((x) => x.slug === m![1]);
    if (!c) return null;
    if (locale === "hi") {
      return {
        title: `${c.name} सत्यापन — HelloVerify`,
        description: `${c.answers} ${c.source} से पुष्टि, आमतौर पर ${c.time} में।`,
      };
    }
    if (locale === "ar") {
      return {
        title: `تحقق ${c.name} — HelloVerify`,
        description: `${c.answers} يُؤكَّد لدى ${c.source}، عادة خلال ${c.time}.`,
      };
    }
    return {
      title: `${c.name} verification — HelloVerify`,
      description: `${c.answers} Confirmed with ${c.source}, typically in ${c.time}.`,
    };
  }

  if ((m = /^\/countries\/(.+)$/.exec(path))) {
    const c = COUNTRIES.find((x) => x.slug === m![1]);
    if (!c) return null;
    if (locale === "hi") {
      return {
        title: `${c.name} में पृष्ठभूमि सत्यापन — HelloVerify`,
        description: `${c.summary} स्रोत-पुष्ट जाँच आमतौर पर ${c.turnaround} में।`,
      };
    }
    if (locale === "ar") {
      return {
        title: `التحقق من الخلفية في ${c.name} — HelloVerify`,
        description: `${c.summary} فحوصات مؤكَّدة من المصدر عادة خلال ${c.turnaround}.`,
      };
    }
    return {
      title: `Background verification in ${c.name} — HelloVerify`,
      description: `${c.summary} Source-confirmed checks typically in ${c.turnaround}.`,
    };
  }

  if ((m = /^\/resources\/blog\/(.+)$/.exec(path))) {
    const p = POSTS.find((x) => x.slug === m![1]);
    return p ? { title: `${p.title} — HelloVerify`, description: p.standfirst } : null;
  }

  if ((m = /^\/legal\/(.+)$/.exec(path))) {
    const d = LEGAL.find((x) => x.slug === m![1]);
    return d ? { title: `${d.title} — HelloVerify`, description: d.summary } : null;
  }

  return null;
}

/** `copyFor("/about", "hi")` -> that page's title and description in Hindi.
 *
 *  Locale defaults to English so `llms.txt` (one English file at the root)
 *  and any caller that has not been updated keep the reviewed table.
 *  Throws on a route with no copy. That is a build error by design — see the
 *  completeness loop below.
 */
export function copyFor(path: string, locale: string = routing.defaultLocale): PageCopy {
  const loc = locale in STATIC ? locale : routing.defaultLocale;
  const copy = STATIC[loc]![path] ?? dynamicCopy(path, loc);
  if (!copy) {
    throw new Error(
      `copyFor: no copy for ${JSON.stringify(path)} (${loc}). Every route in ` +
        `lib/seo/routes.ts must have a title and description — a page without ` +
        `them ships an empty <title> and an empty llms.txt line.`,
    );
  }
  return copy;
}

/** §7's "translation completeness is a build gate", applied to every served
 *  locale. A route missing from `hi` or `ar` fails `next build` the same way
 *  a missing English row always has.
 */
for (const locale of routing.locales) {
  for (const route of allRoutes()) copyFor(route.path, locale);
}
