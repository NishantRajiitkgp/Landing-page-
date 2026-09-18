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
 *  This is also what unblocks §7: translating the site is now a matter of
 *  keying this table by locale, not of finding 32 literals scattered across the
 *  app directory.
 */
import { CHECKS } from "@/lib/content/checks";
import { COUNTRIES } from "@/lib/content/countries";
import { LEGAL } from "@/lib/content/legal";
import { POSTS } from "@/lib/content/posts";
import { allRoutes } from "@/lib/seo/routes";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/seo/site";

/** The reviewed copy for one page. Deliberately just these two: `<meta
 *  name="keywords">` is dropped (§8.1), and OG title/description are derived
 *  rather than written twice. */
export type PageCopy = {
  readonly title: string;
  readonly description: string;
};

/** The 28 hand-written routes, in route-manifest order so the table reads like
 *  the site rather than like an alphabet. */
const STATIC_COPY: Record<string, PageCopy> = {
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
  "/business/enterprise": {
    title: "Enterprise background verification — HelloVerify",
    description:
      "High-volume background checks with an SLA. AI reads the documents, our team confirms with the issuer, your ATS gets the answer back — from 15 minutes.",
  },
  "/business/smb": {
    title: "Background check packages for small business — HelloVerify",
    description:
      "Pick a package, see the price, upload documents, get answers — no sales call. Blue-collar and driver packages ready in 30 minutes.",
  },
  "/business/employee-verification": {
    title: "Employee verification — HelloVerify",
    description:
      "Existing staff, contractors and gig workforces — verified at joining and re-verified when it matters. EPFO-backed employment history in 60 minutes.",
  },
  "/business/customer-kyc": {
    title: "Customer KYC & trust and safety — HelloVerify",
    description:
      "Verify customers the moment they sign up — identity in 15 minutes, screened against courts and global databases, over API or a hosted flow.",
  },
  "/business/certifier": {
    title: "Vendor due diligence — Certifier by HelloVerify",
    description:
      "Trade licences, directors, credit and criminal records — verified at the registry before you sign a supplier. Certified vendor profiles in 2 days.",
  },
  "/governments/health": {
    title: "Verification for health authorities — HelloVerify",
    description:
      "Medical degrees, council registrations and practice history confirmed with the issuing institution — before a clinician touches a patient.",
  },
  "/governments/immigration": {
    title: "Verification for immigration authorities — HelloVerify",
    description:
      "Applicant documents screened at the source, in the country that issued them — identity, education, employment and records, before the visa decision.",
  },
  "/governments/manpower-education": {
    title: "Verification for manpower & education authorities — HelloVerify",
    description:
      "Foreign-worker credentials verified for work-pass decisions — the workflow running in production with Singapore's Ministry of Manpower.",
  },
  "/governments/manpower-education/ministry-of-manpower": {
    title: "Ministry of Manpower, Singapore — HelloVerify",
    description:
      "How work-pass credential verification runs with Singapore's Ministry of Manpower: foreign qualifications confirmed with the issuing institution, before arrival.",
  },
  "/governments/trade": {
    title: "Verification for trade & business authorities — HelloVerify",
    description:
      "Company registrations, trade licences and the people behind them — verified at the registry for licensing and enforcement decisions.",
  },
  "/individuals/hellov": {
    title: "Verify anyone from your phone — HelloV by HelloVerify",
    description:
      "Send a photo of the document over WhatsApp and get a verified report in about 30 minutes. Drivers, maids, tenants, dates — consent-first, from ₹499.",
  },
  "/individuals/immigration": {
    title: "Visa & immigration document screening — HelloVerify",
    description:
      "Screen your own documents before an embassy does. Degrees, employment and records checked at the source, so a visa application isn't refused over a paper problem.",
  },
  "/individuals/home-family": {
    title: "Home & family background checks — HelloVerify",
    description:
      "Nannies, drivers, cooks, carers and tutors — identity, criminal record and address confirmed at the source in about 30 minutes, with their consent.",
  },
  "/platform/technology": {
    title: "Technology & APIs — HelloVerify",
    description:
      "How HelloVerify reads a document in about a second, reaches the issuing authority, and returns a defensible result over REST and webhooks.",
  },
  "/platform/coverage": {
    title: "Global coverage — 120+ countries — HelloVerify",
    description:
      "Where a document can be confirmed with the authority that issued it, how long it takes there, and the six offices that keep the queue moving.",
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
      "We verify claims at their source — 20M+ checks since 2018, for enterprises, governments and families across 120+ countries.",
  },
  "/contact": {
    title: "Talk to sales — HelloVerify",
    description:
      "Tell us what you need verified, for whom, and at what volume. Enterprise, government and individual enquiries, answered by a person.",
  },
};

/** The programmatic routes (IA §7), derived from the same records their pages
 *  render. Each branch is the exact expression the page's `generateMetadata`
 *  used to inline — moved, not rewritten.
 *
 *  Returns `null` rather than throwing on an unknown slug: the page component
 *  answers that case with `notFound()`, and a copy lookup is not the right
 *  place to decide a URL does not exist.
 */
function dynamicCopy(path: string): PageCopy | null {
  let m: RegExpExecArray | null;

  if ((m = /^\/checks\/(.+)$/.exec(path))) {
    const c = CHECKS.find((x) => x.slug === m![1]);
    return c
      ? {
          title: `${c.name} verification — HelloVerify`,
          description: `${c.answers} Confirmed with ${c.source}, typically in ${c.time}.`,
        }
      : null;
  }

  if ((m = /^\/countries\/(.+)$/.exec(path))) {
    const c = COUNTRIES.find((x) => x.slug === m![1]);
    return c
      ? {
          title: `Background verification in ${c.name} — HelloVerify`,
          description: `${c.summary} Source-confirmed checks typically in ${c.turnaround}.`,
        }
      : null;
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

/** `copyFor("/about")` -> that page's reviewed title and description.
 *
 *  Throws on a route with no copy. That is a build error by design — see the
 *  completeness loop below.
 */
export function copyFor(path: string): PageCopy {
  const copy = STATIC_COPY[path] ?? dynamicCopy(path);
  if (!copy) {
    throw new Error(
      `copyFor: no copy for ${JSON.stringify(path)}. Every route in ` +
        `lib/seo/routes.ts must have a title and description — a page without ` +
        `them ships an empty <title> and an empty llms.txt line.`,
    );
  }
  return copy;
}

/** §7's "translation completeness is a build gate", applied to the copy table.
 *
 *  Runs once at module load, which is during `next build` because every page's
 *  `generateMetadata` imports this transitively. A route added to the manifest
 *  without copy therefore fails the build at the point it is added, rather than
 *  emitting a blank title on one page that nobody opens for a month.
 *
 *  Cheap enough not to guard: 56 lookups over two `Record` hits and four regex
 *  branches, once per build.
 */
for (const route of allRoutes()) copyFor(route.path);
