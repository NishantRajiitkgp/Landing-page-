/**
 * Country guides — the data behind /resources/countries and /countries/[country].
 *
 * Same quality gate as checks.ts (IA §7): each entry must say something true and
 * specific about verifying documents in that country. A country with nothing
 * particular to say does not get a page.
 */

export type Country = {
  slug: string;
  name: string;
  region: "South & Southeast Asia" | "Middle East & Africa" | "Europe & the Americas";
  /** Indicative source-confirmation turnaround shown on the coverage page. */
  turnaround: string;
  office: string | null;
  img?: string;
  /** What is distinctive about verifying here. */
  summary: string;
  /** Per-check availability notes that actually differ by country. */
  notes: { check: string; time: string; note: string }[];
  /** The thing that trips people up locally. */
  watchOut: string;
};

export const COUNTRIES: Country[] = [
  {
    slug: "india",
    name: "India",
    region: "South & Southeast Asia",
    turnaround: "15 min – 3 days",
    office: "Noida",
    img: "/img/01-rider-bengaluru.jpg",
    summary:
      "The most digitally verifiable country we operate in. Identity, licence and provident-fund records answer in minutes; universities and courts still set the pace for everything else.",
    notes: [
      { check: "Identity & PAN", time: "15 min", note: "Digital registry response." },
      { check: "Driving licence", time: "30 min", note: "State transport authority; class and endorsements returned separately." },
      { check: "Criminal record", time: "30 min", note: "Court and police databases, jurisdiction named in the report." },
      { check: "Digital employment", time: "60 min", note: "EPFO contribution history — no contact with the current employer." },
      { check: "Education", time: "3 days", note: "University registrar confirmation; state boards vary." },
    ],
    watchOut:
      "Degree verification varies enormously by institution. Central universities answer quickly; some state and private institutions still confirm by post, which is why the estimate is three days rather than one.",
  },
  {
    slug: "philippines",
    name: "Philippines",
    region: "South & Southeast Asia",
    turnaround: "1 – 3 days",
    office: "Manila",
    img: "/img/17-philippines.jpg",
    summary:
      "A major origin country for healthcare and maritime workers, which makes qualification verification the main event — usually for an employer or authority somewhere else.",
    notes: [
      { check: "Identity", time: "1 day", note: "Government ID confirmation." },
      { check: "Education", time: "2 – 3 days", note: "Confirmed with the school registrar directly." },
      { check: "Employment", time: "2 days", note: "Employer HR confirmation." },
      { check: "Criminal record", time: "3 – 5 days", note: "NBI clearance route; applicant participation may be required." },
    ],
    watchOut:
      "Nursing and caregiving credentials are the most commonly misrepresented, and also the most consequential. We confirm with the school itself rather than accepting a board listing as proof of the underlying degree.",
  },
  {
    slug: "singapore",
    name: "Singapore",
    region: "South & Southeast Asia",
    turnaround: "1 – 2 days",
    office: "Singapore",
    img: "/img/19-singapore.jpg",
    summary:
      "Highly structured records and a strict work-pass regime. Verification here is usually about credentials earned elsewhere being accepted locally.",
    notes: [
      { check: "Identity", time: "1 day", note: "Government records." },
      { check: "Employment", time: "1 – 2 days", note: "Employer confirmation, generally prompt." },
      { check: "Education", time: "2 days", note: "Local institutions confirm quickly; foreign degrees follow the issuing country's timeline." },
    ],
    watchOut:
      "The binding constraint is rarely Singapore — it is the origin country of the qualification. A work-pass file moves at the speed of the slowest foreign registrar in it.",
  },
  {
    slug: "united-arab-emirates",
    name: "United Arab Emirates",
    region: "Middle East & Africa",
    turnaround: "Same day – 3 days",
    office: "Dubai",
    img: "/img/18-uae.jpg",
    summary:
      "A destination country running on an imported workforce, so almost every check concerns a document issued somewhere else — and often requires attestation as well as verification.",
    notes: [
      { check: "Identity", time: "Same day", note: "Emirates ID and passport records." },
      { check: "Trade licence", time: "2 days", note: "Emirate-level licence registers." },
      { check: "Education", time: "3 days+", note: "Runs in the country of issue; attestation is a separate process." },
    ],
    watchOut:
      "Attestation and verification are different things and are frequently confused. Attestation certifies a document's form through official channels; verification asks the issuer whether the record exists. Employers usually need both.",
  },
  {
    slug: "egypt",
    name: "Egypt",
    region: "Middle East & Africa",
    turnaround: "Same day – 4 days",
    office: "Cairo",
    img: "/img/20-egypt.jpg",
    summary:
      "Our North Africa base, covering local company and trade records as well as credentials for workers heading to the Gulf and Europe.",
    notes: [
      { check: "Identity", time: "Same day", note: "National ID records." },
      { check: "Trade licence", time: "2 days", note: "Commercial registry confirmation." },
      { check: "Education", time: "3 – 4 days", note: "University confirmation; older records may be archived on paper." },
    ],
    watchOut:
      "Pre-digitisation records are often paper archives. They are retrievable, but the timeline reflects someone physically locating a file — which we state upfront rather than discovering mid-check.",
  },
  {
    slug: "united-kingdom",
    name: "United Kingdom",
    region: "Europe & the Americas",
    turnaround: "Same day – 3 days",
    office: null,
    img: "/img/16-united-kingdom.jpg",
    summary:
      "Well-structured institutional records with strong data-protection expectations — consent scope matters as much as turnaround here.",
    notes: [
      { check: "Identity", time: "Same day", note: "Document and register checks." },
      { check: "Education", time: "1 – 3 days", note: "University confirmation, generally responsive." },
      { check: "Employment", time: "2 days", note: "Employer HR; many use a reference service." },
      { check: "Criminal record", time: "Varies", note: "Disclosure regime — the individual's own certificate is usually the route." },
    ],
    watchOut:
      "Criminal-record disclosure is tightly regulated and role-dependent. The lawful level of disclosure depends on the job, so we scope it to the role rather than running the deepest check available.",
  },
];

export const REGIONS = [
  "South & Southeast Asia",
  "Middle East & Africa",
  "Europe & the Americas",
] as const;

export function getCountry(slug: string) {
  return COUNTRIES.find((c) => c.slug === slug);
}
