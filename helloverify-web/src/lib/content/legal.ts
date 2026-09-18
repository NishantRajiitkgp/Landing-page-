/**
 * Legal documents — structure only.
 *
 * DELIBERATELY NOT DRAFTED HERE. BUILD-SPEC §4 says legal pages port *verbatim*
 * from the existing site, and operative legal text must come from counsel. What
 * lives here is the document skeleton (headings, order, effective date) so the
 * template, navigation, SEO and the ToC are designed and reviewable now; each
 * section renders a visible "awaiting legal copy" state until the real clause is
 * pasted into `body`.
 *
 * To fill: replace `body: null` with the approved paragraphs for that section.
 */

export type LegalSection = { id: string; h: string; body: string[] | null };

export type LegalDoc = {
  slug: string;
  title: string;
  summary: string;
  effective: string;
  sections: LegalSection[];
};

const s = (id: string, h: string, body: string[] | null = null): LegalSection => ({ id, h, body });

export const LEGAL: LegalDoc[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    summary:
      "What personal data HelloVerify collects, why, who it is shared with, how long it is kept, and the rights you have over it.",
    effective: "Awaiting legal sign-off",
    sections: [
      s("who-we-are", "Who we are"),
      s("what-we-collect", "Personal data we collect"),
      s("why", "Why we process it, and our lawful basis"),
      s("consent", "Consent, and how to withdraw it"),
      s("sharing", "Who we share data with"),
      s("sub-processors", "Sub-processors"),
      s("transfers", "International transfers"),
      s("retention", "How long we keep data"),
      s("security", "How we protect it"),
      s("your-rights", "Your rights, including erasure and access"),
      s("candidates", "If you are a candidate being verified"),
      s("children", "Children's data"),
      s("changes", "Changes to this policy"),
      s("contact", "How to contact us or complain"),
    ],
  },
  {
    slug: "terms-of-service",
    title: "Terms of Service",
    summary:
      "The terms on which HelloVerify provides verification services, and the obligations that come with using them.",
    effective: "Awaiting legal sign-off",
    sections: [
      s("agreement", "The agreement"),
      s("definitions", "Definitions"),
      s("services", "The services we provide"),
      s("your-obligations", "Your obligations, including consent to verify"),
      s("acceptable-use", "Acceptable use"),
      s("fees", "Fees, payment and taxes"),
      s("turnaround", "Turnaround times and service levels"),
      s("accuracy", "Accuracy, disputes and re-verification"),
      s("ip", "Intellectual property"),
      s("confidentiality", "Confidentiality"),
      s("liability", "Limitation of liability"),
      s("indemnity", "Indemnity"),
      s("term", "Term, suspension and termination"),
      s("law", "Governing law and disputes"),
    ],
  },
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    summary: "The cookies and similar technologies this website uses, and how to control them.",
    effective: "Awaiting legal sign-off",
    sections: [
      s("what-are-cookies", "What cookies are"),
      s("categories", "Categories we use"),
      s("essential", "Strictly necessary cookies"),
      s("analytics", "Analytics and performance"),
      s("marketing", "Marketing cookies"),
      s("third-party", "Third-party cookies"),
      s("managing", "Managing your preferences"),
      s("changes", "Changes to this policy"),
    ],
  },
  {
    slug: "acceptable-use-policy",
    title: "Acceptable Use Policy",
    summary:
      "What HelloVerify may not be used for — including running checks without the subject's consent.",
    effective: "Awaiting legal sign-off",
    sections: [
      s("purpose", "Purpose of this policy"),
      s("consent-required", "Consent is required, without exception"),
      s("prohibited", "Prohibited uses"),
      s("discrimination", "Prohibited discriminatory use of results"),
      s("data-handling", "Handling results you receive"),
      s("reporting", "Reporting misuse"),
      s("enforcement", "Enforcement and suspension"),
    ],
  },
  {
    slug: "data-processing-addendum",
    title: "Data Processing Addendum",
    summary:
      "The DPA governing HelloVerify's processing of personal data on your behalf, including sub-processors and transfer terms.",
    effective: "Awaiting legal sign-off",
    sections: [
      s("roles", "Roles of the parties"),
      s("scope", "Scope and duration of processing"),
      s("instructions", "Processing instructions"),
      s("confidentiality", "Personnel and confidentiality"),
      s("security-measures", "Technical and organisational measures"),
      s("sub-processing", "Sub-processing and the sub-processor register"),
      s("assistance", "Assistance with data subject requests"),
      s("breach", "Personal data breach notification"),
      s("transfers", "International transfers and safeguards"),
      s("audit", "Audits and evidence"),
      s("deletion", "Deletion and return of data"),
    ],
  },
  {
    slug: "refund-policy",
    title: "Refund Policy",
    summary:
      "When a check is refundable, when it is not, and what happens when a verification cannot be completed.",
    effective: "Awaiting legal sign-off",
    sections: [
      s("principle", "The principle"),
      s("unverifiable", "When a source cannot be reached"),
      s("consent-refused", "When the subject does not consent"),
      s("re-runs", "Corrections and free re-verification"),
      s("non-refundable", "What is not refundable"),
      s("how-to-request", "How to request a refund"),
      s("timeframes", "Timeframes and method"),
    ],
  },
  /* The two policies below exist because their URLs are indexed on the old
   * site and had no successor here, so `/en/equal-opportunities` and
   * `/en/criminal-convictions-policy` would have 404'd at cutover. Section ids
   * and order are lifted from the old pages (`src/pages/policy/*.tsx`, 311 and
   * 347 lines of real copy) so the verbatim port is a 1:1 paste per section
   * rather than a re-derivation. */
  {
    slug: "equal-opportunities",
    title: "Equal Opportunities",
    summary:
      "How HelloVerify treats applicants and employees equally, and how that obligation carries into the verification work we do for clients.",
    effective: "Awaiting legal sign-off",
    sections: [
      s("scope", "Scope"),
      s("purpose", "Purpose"),
      s("discrimination", "Discrimination"),
      s("recruitment", "Recruitment and selection"),
      s("training", "Training, promotion and conditions of service"),
      s("disabilities", "Disabilities"),
      s("part-time", "Part-time and fixed-term work"),
      s("monitoring", "Monitoring equal opportunity"),
      s("grievance", "Grievance management"),
      s("responsibility", "Responsibility and administration of the policy"),
      s("breach", "Breach of the policy"),
      s("policy-changes", "Policy changes"),
    ],
  },
  {
    slug: "criminal-convictions-policy",
    title: "Criminal Convictions and Data Malpractice Policy",
    summary:
      "The basis on which HelloVerify processes criminal conviction and professional malpractice data, which is special-category data almost everywhere we operate.",
    effective: "Awaiting legal sign-off",
    sections: [
      s("about", "About this policy"),
      s("definitions", "Definitions"),
      s("why", "Why we process criminal conviction and professional malpractice data"),
      s("lawfulness", "Lawfulness, fairness and transparency"),
      s("purpose-limitation", "Purpose limitation"),
      s("data-minimisation", "Data minimisation"),
      s("accuracy", "Accuracy"),
      s("storage", "Storage limitation"),
      s("security", "Security, integrity and confidentiality"),
      s("accountability", "Accountability principle"),
      s("review", "Review"),
    ],
  },
];

export function getLegal(slug: string) {
  return LEGAL.find((d) => d.slug === slug);
}
