/** /resources/glossary — vocabulary the industry uses loosely, defined precisely. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/resources/glossary");
}

const TERMS: { t: string; d: React.ReactNode }[] = [
  {
    t: "Primary source verification",
    d: (
      <>
        Confirming a claim with the organisation that originally issued the record — the university
        registrar, the transport authority, the court. <em>Not</em> a database that once copied that
        record. It is slower, and it is the only thing that survives a well-made forgery.
      </>
    ),
  },
  {
    t: "Database screening",
    d: (
      <>
        Searching aggregated records for a name or number. Fast, and genuinely correct for sanctions
        and watchlists — where the list <em>is</em> the source. Misleading when sold as verification
        of a degree or a licence.
      </>
    ),
  },
  {
    t: "Attestation",
    d: (
      <>
        Official certification of a document&apos;s form, usually through embassies or foreign
        ministries. <em>Different from verification:</em> attestation says the paper is properly
        certified; verification asks the issuer whether the record exists. Gulf employers often
        need both.
      </>
    ),
  },
  {
    t: "BGV",
    d: (
      <>
        Background verification — the umbrella term for checking a person&apos;s identity, history
        and records before employment. Used interchangeably with &ldquo;background screening&rdquo;,
        though screening more often implies the database-only variety.
      </>
    ),
  },
  {
    t: "Adverse media",
    d: (
      <>
        Negative news coverage associated with a person or company, searched as part of risk
        screening. Produces false positives on common names, so every hit should be reviewed by a
        person before it reaches a report.
      </>
    ),
  },
  {
    t: "Unverifiable",
    d: (
      <>
        A result meaning the source could not be reached — institution closed, records destroyed,
        registry offline. <em>Critically different from &ldquo;failed&rdquo;.</em> Systems built to
        return a binary often report this as a pass, which is the most common way verification
        misleads the person relying on it.
      </>
    ),
  },
  {
    t: "Turnaround time (TAT)",
    d: (
      <>
        Time from submission to result. Worth asking what it is measured between — some vendors
        quote from when <em>they</em> start work, excluding the queue the candidate sat in.
      </>
    ),
  },
  {
    t: "Consent",
    d: (
      <>
        The person&apos;s informed agreement to a specific check for a specific purpose. Legally
        required in most jurisdictions, and scope-bound: consent to verify a licence is not consent
        to pull a credit report.
      </>
    ),
  },
  {
    t: "Data residency",
    d: (
      <>
        Where personal data is stored and processed. Contractually fixable for storage; inherently
        cross-border for source confirmation, because the record lives where it was issued.
      </>
    ),
  },
  {
    t: "Moonlighting",
    d: (
      <>
        Holding concurrent employment, visible through overlapping statutory contributions. The
        overlap is a fact; whether it is a problem is a policy question for the employer, not a
        verdict from a vendor.
      </>
    ),
  },
  {
    t: "Sub-processor",
    d: (
      <>
        A third party that processes personal data on a processor&apos;s behalf — infrastructure,
        messaging, in-country partners. Should be named in a register, not described as
        &ldquo;trusted partners&rdquo;.
      </>
    ),
  },
  {
    t: "Re-verification",
    d: (
      <>
        Running checks again on someone already verified — at role change, on a schedule, or after
        an incident. A check is a snapshot; re-verification is what stops it going stale.
      </>
    ),
  },
];

export default async function GlossaryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enables static rendering: without it every next-intl call in this
  // subtree (AppLink resolves the locale) falls back to reading request
  // headers, which makes the route dynamic. BUILD-SPEC §5.
  setRequestLocale(locale);

  return (
    <PageShell
      crumbs={[{ label: "Resources", href: "/resources" }, { label: "Glossary" }]}
      closing={{
        heading: (
          <>
            Ask us to define <em>anything here.</em>
          </>
        ),
        sub: "Including the terms our own industry would rather keep vague.",
      }}
    >
      <div className="wrap hero3">
        <div className="k">Resources · Glossary</div>
        <h1 className="h1">
          Words used loosely, <em>defined precisely.</em>
        </h1>
        <p className="sub">
          Much of this industry&apos;s vocabulary is deliberately soft, because precision would make
          two very different products look different. These are the definitions we hold ourselves to.
        </p>
      </div>

      <div className="wrap sec3" style={{ paddingTop: 64, paddingBottom: 20 }}>
        <dl className="gl3">
          {TERMS.map((x) => (
            <div className="g3r" key={x.t}>
              <dt>{x.t}</dt>
              <dd>{x.d}</dd>
            </div>
          ))}
        </dl>
      </div>
    </PageShell>
  );
}
