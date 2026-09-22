/** /platform/coverage — where a document can be confirmed at its source.
 *  Replaces legacy /international. Country times are indicative and labelled so. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import { FaqSection } from "@/components/chrome/FaqSection";
import type { Faq } from "@/lib/seo/schema/faq";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { SecHead } from "@/components/chrome/SecHead";
import { Arrow } from "@/components/brand/Arrow";
import { Steps } from "@/components/chrome/Steps";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/platform/coverage");
}

const REGIONS: { r: string; list: { c: string; t: string }[] }[] = [
  {
    r: "South & Southeast Asia",
    list: [
      { c: "India", t: "15 min – 3 days" },
      { c: "Philippines", t: "Tomorrow, 9:00 AM" },
      { c: "Singapore", t: "Fri, 10:30 AM" },
      { c: "Indonesia", t: "2 – 4 days" },
      { c: "Vietnam", t: "2 – 4 days" },
      { c: "Sri Lanka", t: "2 – 5 days" },
      { c: "Nepal", t: "2 – 5 days" },
      { c: "Bangladesh", t: "3 – 5 days" },
    ],
  },
  {
    r: "Middle East & Africa",
    list: [
      { c: "United Arab Emirates", t: "Today, 4:00 PM" },
      { c: "Saudi Arabia", t: "1 – 3 days" },
      { c: "Egypt", t: "Today, 4:00 PM" },
      { c: "Qatar", t: "1 – 3 days" },
      { c: "Kuwait", t: "2 – 4 days" },
      { c: "Kenya", t: "3 – 5 days" },
      { c: "Nigeria", t: "3 – 6 days" },
      { c: "South Africa", t: "2 – 4 days" },
    ],
  },
  {
    r: "Europe & the Americas",
    list: [
      { c: "United Kingdom", t: "Today, 4:00 PM" },
      { c: "Germany", t: "1 – 3 days" },
      { c: "France", t: "1 – 3 days" },
      { c: "Netherlands", t: "1 – 3 days" },
      { c: "Poland", t: "2 – 4 days" },
      { c: "United States", t: "1 – 3 days" },
      { c: "Canada", t: "1 – 3 days" },
      { c: "Brazil", t: "3 – 5 days" },
    ],
  },
];

/** The FAQ copy, stated once. `<FaqSection>` renders it and emits the
 *  matching `FAQPage` node from the same array — Google requires the two to
 *  say the same words (BUILD-SPEC §8.2, and `lib/seo/schema/faq.ts`). */
const FAQS: Faq[] = [
  {
    q: "What does \"120+ countries\" actually count?",
    a:
      "Countries where we can confirm at least one check type with the authority that issued the document, through our own offices or a named partner. It does not count countries where all we could do is search a commercial database.",
  },
  {
    q: "Is every check available everywhere?",
    a:
      "No, and any vendor claiming otherwise is describing a database. Criminal record access in particular varies by jurisdiction — some require the individual to request their own certificate. The catalogue shows what is possible per country before you order.",
  },
  {
    q: "How do you handle countries in crisis?",
    a:
      "Where institutions are closed or records are destroyed, we say so. The report distinguishes unverifiable from failed, which protects applicants who did nothing wrong but happen to come from somewhere with broken record-keeping.",
  },
  {
    q: "Can you add a country for us?",
    a:
      "Often, yes — for a committed volume we will establish a route into a new jurisdiction, typically a matter of weeks. Tell us the country and the check types you need.",
  },
];

export default async function CoveragePage({
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
      crumbs={[{ label: "Platform", href: "/platform" }, { label: "Global coverage" }]}
      closing={{
        heading: (
          <>
            Tell us the country. <em>We'll tell you the truth.</em>
          </>
        ),
        sub: "Including when the honest answer is that a registry still works on paper.",
        img: "/img/19-singapore.jpg",
      }}
    >
      <div className="wrap hero3">
        <div className="k">Platform · Global coverage</div>
        <h1 className="h1">
          Verified in <em>120+ countries.</em>
        </h1>
        <p className="sub">
          A document is only properly verified in the country that issued it. Our own offices and
          partner network reach the registries, universities, courts and employers that hold the
          records — locally, in language, to local process.
        </p>
        <div className="hrow">
          <AppLink href="/contact" className="btn btn-ink">Ask about a country</AppLink>
          <a href="#countries" className="btn btn-ghost">
            <span>See country times</span>
            <Arrow />
          </a>
        </div>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it"><b>120+</b> countries reachable</span>
          <span className="it"><b>6</b> offices, twelve hours apart</span>
          <span className="it"><b>21 of 24</b> hours with someone at a desk</span>
          <span className="it"><span className="dot live" /> someone is working now</span>
        </div>
      </div>

      {/* offices */}
      <div className="wrap sec3">
        {/* ANSWER BLOCKS (BUILD-SPEC §11a.2). Three statement headings become
            the questions a procurement reader types, and each lede becomes the
            answer at 45, 42 and 45 words. Each names the offices, the country
            times or coverage rather than "that overlap" and "coverage here",
            which point outside the block (§11a.2 rule 3).

            Offices and hours are the `off3` cards below and the strip above
            (21 of 24 hours); every country time is a `REGIONS` entry. */}
        <SecHead k="Six offices" h="Where are HelloVerify's offices?">
          HelloVerify works from six offices — Manila, Singapore, Noida, Dubai, Cairo and New
          York — each open 09–18 local, which puts someone at a desk for 21 of 24 hours. A
          request filed at night in one place is picked up in the morning elsewhere.
        </SecHead>
        <div className="body3 off3">
          <div className="o3"><b>Manila</b><span>09–18 local</span></div>
          <div className="o3"><b>Singapore</b><span>09–18 local</span></div>
          <div className="o3"><b>Noida</b><span>09–18 local</span></div>
          <div className="o3"><b>Dubai</b><span>09–18 local</span></div>
          <div className="o3"><b>Cairo</b><span>09–18 local</span></div>
          <div className="o3"><b>New York</b><span>09–18 local</span></div>
        </div>
      </div>

      {/* countries */}
      <div className="wrap sec3" id="countries">
        {/* The countries quoted are the ones carrying a RANGE in `REGIONS`.
            The three "Today, 4:00 PM" entries are deliberately not restated:
            they are a live desk-time display, and turning one into "same day"
            in a citeable sentence would be an interpretation, not a fact on
            this page. */}
        <SecHead k="Country times" h="How long does verification take in each country?">
          HelloVerify's indicative times for source-confirmed checks vary by country: India 15
          minutes to 3 days, the United States, Germany and Saudi Arabia 1–3 days, Nigeria 3–6
          days. Digital registries answer in minutes; where a registrar works on paper, the
          estimate says days.
        </SecHead>
        <div className="body3 reg3">
          {REGIONS.map((g) => (
            <div key={g.r}>
              <div className="rgt">{g.r}</div>
              <div className="rl">
                {g.list.map((x) => (
                  <div className="c3" key={x.c}>
                    <span className="cn3">{x.c}</span>
                    <span className="ct3">{x.t}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="pricenote">
          Indicative times for source-confirmed checks · a further 90+ countries are covered through
          the partner network — <AppLink href="/contact" style={{ color: "inherit", textDecoration: "underline" }}>ask about a specific country</AppLink>
        </div>
      </div>

      {/* how coverage works */}
      <div className="wrap sec3">
        <SecHead k="What coverage means" h="What does global coverage actually mean?">
          Coverage at HelloVerify means someone can reach the office that holds the record — a
          court, a university, a transport authority — in the country that issued the document,
          not a database licence. If nobody can, the report says unverifiable and names the
          route tried.
        </SecHead>
        <Steps
          items={[
          { n: "01", t: "In-country", p: "The check runs where the document was issued, by people who know that registry's process and language." },
          { n: "02", t: "At the source", p: "The university, the court, the transport authority — not an aggregator that once copied their data." },
          { n: "03", t: "Honestly reported", p: "If a registry can't be reached, the report says unverifiable and names the route tried. Never a silent pass." },
          ]}
        />
      </div>

      {/* FAQ — markup and FAQPage node both from FAQS (see FaqSection). */}
      <FaqSection head={<>About reach.</>} faqs={FAQS} />
    </PageShell>
  );
}
