/**
 * The check catalogue — the data behind /resources/checks and /checks/[check].
 *
 * IA §7: one route file, many pages, one data source (also feeding sitemap.ts
 * later). The hard quality gate from that section applies — a page here must
 * carry genuinely differentiated content (real time, real source, real caveats),
 * not a templated paragraph with the name swapped. Entries below are written to
 * that standard; the remaining checks stay out of the catalogue until they are.
 */

export type Check = {
  slug: string;
  name: string;
  group: "Identity" | "Work & education" | "Records & risk" | "Business";
  time: string;
  fast: boolean;
  source: string;
  /** One sentence: what this check actually answers. */
  answers: string;
  /** What is returned in the report. */
  fields: string[];
  /** Why this check is harder than it looks — the differentiated bit. */
  caveat: string;
  /** Who typically orders it. */
  usedBy: string[];
  countries: string;
};

export const CHECKS: Check[] = [
  {
    slug: "identity",
    name: "Identity",
    group: "Identity",
    time: "15 min",
    fast: true,
    source: "the issuing registry",
    answers: "Whether the person is who the document says they are — and whether the document itself exists in the issuer's records.",
    fields: ["Full name", "Date of birth", "Document number", "Validity status", "Photo match confidence"],
    caveat:
      "Most 'identity checks' compare a document against a copy of a database. This one asks the registry that issued it. A well-made forgery passes the first and fails the second.",
    usedBy: ["Enterprise hiring", "Customer KYC", "Home & family", "Immigration authorities"],
    countries: "120+ countries",
  },
  {
    slug: "criminal",
    name: "Criminal record",
    group: "Records & risk",
    time: "30 min",
    fast: true,
    source: "court and police records",
    answers: "Whether there are criminal records against the person in the jurisdictions checked.",
    fields: ["Case records found", "Court and jurisdiction", "Case status", "Date range covered"],
    caveat:
      "Coverage is jurisdictional, not global — a clean result means clean in the courts searched, which the report names. Some countries require the individual to request their own certificate, and the report says so rather than returning a misleading pass.",
    usedBy: ["Enterprise hiring", "Home & family", "Tenant screening", "Health authorities"],
    countries: "India + 40 countries directly",
  },
  {
    slug: "education",
    name: "Education",
    group: "Work & education",
    time: "3 days",
    fast: false,
    source: "the university registrar",
    answers: "Whether the degree was actually awarded, by the institution named, in the year claimed.",
    fields: ["Qualification", "Institution", "Year awarded", "Enrolment dates", "Registrar's confirmation"],
    caveat:
      "The slow one, and the one most often faked. It takes days because a human at the registrar's office confirms it — which is precisely why a forged certificate cannot survive it. Closed institutions are traced to successor bodies or state archives.",
    usedBy: ["Enterprise hiring", "Health authorities", "Manpower ministries", "Visa applicants"],
    countries: "120+ countries",
  },
  {
    slug: "employment",
    name: "Employment",
    group: "Work & education",
    time: "2 days",
    fast: false,
    source: "the employer's HR",
    answers: "Whether the person held the role they claim, for the period they claim, and how they left.",
    fields: ["Employer", "Role held", "Tenure dates", "Exit remarks where given", "Confirming contact"],
    caveat:
      "Depends on a former employer replying. Where a company has closed or refuses, we say unverifiable and name the route tried — rather than silently downgrading to a LinkedIn match.",
    usedBy: ["Enterprise hiring", "Employee verification", "Visa applicants"],
    countries: "120+ countries",
  },
  {
    slug: "digital-employment",
    name: "Digital employment",
    group: "Work & education",
    time: "60 min",
    fast: true,
    source: "provident fund records",
    answers: "The person's real work history, reconstructed from statutory contribution records rather than their CV.",
    fields: ["Employers by period", "Overlaps and gaps", "Contribution continuity"],
    caveat:
      "It never contacts a current employer, which makes it the only work-history check safe to run on someone still in a job. It sees employers that made statutory contributions — informal or overseas roles will not appear.",
    usedBy: ["Enterprise hiring", "Employee verification", "Immigration authorities"],
    countries: "India",
  },
  {
    slug: "moonlighting",
    name: "Moonlighting",
    group: "Work & education",
    time: "60 min",
    fast: true,
    source: "provident fund records",
    answers: "Whether a second employer is contributing for the same person over the same period.",
    fields: ["Concurrent employers", "Overlap period", "Contribution evidence"],
    caveat:
      "It reports an overlap, not a verdict. Plenty of overlaps are legitimate — notice periods, consultancy allowed by contract. What the overlap means is a policy decision, and the report deliberately stops short of making it.",
    usedBy: ["Enterprise hiring", "Employee verification"],
    countries: "India",
  },
  {
    slug: "global-database",
    name: "Global database",
    group: "Records & risk",
    time: "15 min",
    fast: true,
    source: "sanctions, watchlist and adverse-media sources",
    answers: "Whether the person or entity appears on sanctions lists, regulatory watchlists or in adverse media.",
    fields: ["Matches found", "List or publication", "Match confidence", "Date of screening"],
    caveat:
      "This is the one check that is genuinely a database search, and we label it as such. Name-based matching produces false positives — common names especially — so every hit is reviewed by a person before it reaches your report.",
    usedBy: ["Customer KYC", "Vendor due diligence", "Immigration authorities"],
    countries: "Global",
  },
  {
    slug: "driving-licence",
    name: "Driving licence",
    group: "Identity",
    time: "30 min",
    fast: true,
    source: "the state transport authority",
    answers: "Whether the licence is real, current, and permits the class of vehicle in question.",
    fields: ["Licence number", "Vehicle classes", "Validity dates", "Endorsements", "Issuing authority"],
    caveat:
      "Class matters more than validity: a licence can be perfectly valid and still not cover the vehicle someone has been hired to drive. The report separates the two rather than returning a single pass.",
    usedBy: ["Fleet and gig hiring", "Home & family", "SMB drivers"],
    countries: "India + selected countries",
  },
  {
    slug: "current-address",
    name: "Current address",
    group: "Identity",
    time: "30 min",
    fast: true,
    source: "address records",
    answers: "Whether the person actually lives where they say they live.",
    fields: ["Address confirmed", "Confirmation method", "Date confirmed"],
    caveat:
      "Useful precisely because it is the detail people falsify last and change most often. It confirms a current residence, not a residence history.",
    usedBy: ["Home & family", "Tenant screening", "Enterprise hiring"],
    countries: "India + selected countries",
  },
  {
    slug: "credit",
    name: "Credit",
    group: "Records & risk",
    time: "15 min",
    fast: true,
    source: "credit bureaus",
    answers: "The person's or company's credit standing, defaults and exposure.",
    fields: ["Score or rating", "Defaults recorded", "Outstanding exposure", "Bureau and date"],
    caveat:
      "Regulated in most jurisdictions and only available with explicit, purpose-specific consent. For individuals it is a financial-risk signal, not a character assessment, and should not be used as one.",
    usedBy: ["Vendor due diligence", "Tenant screening", "Lending platforms"],
    countries: "India + 30 countries",
  },
  {
    slug: "trade-licence",
    name: "Trade licence",
    group: "Business",
    time: "2 days",
    fast: false,
    source: "the licence register",
    answers: "Whether a business holds the licence it claims, and whether that licence is currently valid.",
    fields: ["Licence number", "Issuing authority", "Activities permitted", "Validity and expiry"],
    caveat:
      "Expiry is the point. A licence that was genuine two years ago tells a procurement team nothing — so the profile carries the expiry date and re-checks before it lapses.",
    usedBy: ["Vendor due diligence", "Trade authorities", "Procurement"],
    countries: "120+ countries",
  },
  {
    slug: "directors-gst",
    name: "Directors & GST",
    group: "Business",
    time: "3 days",
    fast: false,
    source: "the company registry",
    answers: "Who actually controls a company, and whether any of them are disqualified or defaulting.",
    fields: ["Directors and officers", "Beneficial ownership", "Disqualifications", "GST registration and behaviour"],
    caveat:
      "Ownership chains cross borders, so a clean local filing can sit under a foreign parent with a different story. The profile follows the chain rather than stopping at the first registry.",
    usedBy: ["Vendor due diligence", "Trade authorities"],
    countries: "India + 40 countries",
  },
];

export const CHECK_GROUPS = ["Identity", "Work & education", "Records & risk", "Business"] as const;

export function getCheck(slug: string) {
  return CHECKS.find((c) => c.slug === slug);
}
