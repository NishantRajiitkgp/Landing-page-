/** /platform/coverage — where a document can be confirmed at its source.
 *  Replaces legacy /international. Country times are indicative and labelled so. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import { FaqSection } from "@/components/chrome/FaqSection";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { SecHead } from "@/components/chrome/SecHead";
import { Arrow } from "@/components/brand/Arrow";
import { Steps } from "@/components/chrome/Steps";
import { PLATFORM, type CountryKey, type RegionKey } from "@/lib/copy/platform";
import { copy } from "@/lib/copy/request";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/platform/coverage");
}

/** WHICH countries, grouped into WHICH regions, in WHICH order — structure,
 *  and it stays. The 27 strings are `lib/copy/platform`'s, keyed by `RegionKey`
 *  and `CountryKey`, so a country listed without a name and a time is TS2322 on
 *  this array in every locale at once. The shape is `LANES` on
 *  `/business/enterprise`, for the reason `lib/copy/index.ts` argues under
 *  "Where the keys come from"; the dictionary holds one FLAT country record for
 *  the TS2536 reason recorded beside it. */
const REGIONS: readonly { r: RegionKey; list: readonly CountryKey[] }[] = [
  {
    r: "southSoutheastAsia",
    list: ["india", "philippines", "singapore", "indonesia", "vietnam", "sriLanka", "nepal", "bangladesh"],
  },
  {
    r: "middleEastAfrica",
    list: ["uae", "saudiArabia", "egypt", "qatar", "kuwait", "kenya", "nigeria", "southAfrica"],
  },
  {
    r: "europeAmericas",
    list: ["uk", "germany", "france", "netherlands", "poland", "us", "canada", "brazil"],
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
  const t = await copy(PLATFORM);
  const c = t.coverage;

  return (
    <PageShell
      crumbs={[{ label: t.crumb, href: "/platform" }, { label: c.crumb }]}
      closing={{
        heading: c.closing.heading,
        sub: c.closing.sub,
        img: "/img/19-singapore.jpg",
      }}
    >
      <div className="wrap hero3">
        <div className="k">{c.hero.k}</div>
        <h1 className="h1">{c.hero.h1}</h1>
        <p className="sub">{c.hero.sub}</p>
        <div className="hrow">
          <AppLink href="/contact" className="btn btn-ink">{c.hero.cta}</AppLink>
          <a href="#countries" className="btn btn-ghost">
            <span>{c.hero.times}</span>
            <Arrow />
          </a>
        </div>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it">{c.strip.countries}</span>
          <span className="it">{c.strip.offices}</span>
          <span className="it">{c.strip.hours}</span>
          <span className="it">{c.strip.live}</span>
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
        <SecHead k={c.offices.k} h={c.offices.h}>
          {c.offices.lede}
        </SecHead>
        {/* Six cards, still written out longhand — the six cities are the only
            thing that differs and `<b>` plus `<span>` is two elements with one
            text child each, not a repeated record worth a list. `hours` is ONE
            leaf read six times: the lede directly above says the offices are
            "each open 09–18 local", so six leaves would let a locale break the
            sentence that describes them. */}
        <div className="body3 off3">
          <div className="o3"><b>{c.officeRows.manila}</b><span>{c.officeRows.hours}</span></div>
          <div className="o3"><b>{c.officeRows.singapore}</b><span>{c.officeRows.hours}</span></div>
          <div className="o3"><b>{c.officeRows.noida}</b><span>{c.officeRows.hours}</span></div>
          <div className="o3"><b>{c.officeRows.dubai}</b><span>{c.officeRows.hours}</span></div>
          <div className="o3"><b>{c.officeRows.cairo}</b><span>{c.officeRows.hours}</span></div>
          <div className="o3"><b>{c.officeRows.newYork}</b><span>{c.officeRows.hours}</span></div>
        </div>
      </div>

      {/* countries */}
      <div className="wrap sec3" id="countries">
        {/* The countries quoted are the ones carrying a RANGE in `REGIONS`.
            The three "Today, 4:00 PM" entries are deliberately not restated:
            they are a live desk-time display, and turning one into "same day"
            in a citeable sentence would be an interpretation, not a fact on
            this page. */}
        <SecHead k={c.countryTimes.k} h={c.countryTimes.h}>
          {c.countryTimes.lede}
        </SecHead>
        {/* Both `key=` expressions still resolve through the dictionary to the
            English bytes they resolved to before — the region heading and the
            country name (third corollary, `lib/copy/index.ts`). */}
        <div className="body3 reg3">
          {REGIONS.map((g) => (
            <div key={c.regions[g.r]}>
              <div className="rgt">{c.regions[g.r]}</div>
              <div className="rl">
                {g.list.map((k) => (
                  <div className="c3" key={c.countries[k].c}>
                    <span className="cn3">{c.countries[k].c}</span>
                    <span className="ct3">{c.countries[k].t}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* `note` is a FUNCTION leaf taking the anchor, which is the shape
            `lib/copy/index.ts` describes for a sentence wrapping something the
            component owns — here an href and an inline style. A plain string
            would have had to end in a space to keep the byte, and an
            edge-whitespace leaf is what `tools/test/copy.test.ts` §3 rejects.
            Fragment-wrapping the text-plus-element pair is byte-identical;
            joining the two texts is not (measured on `business`). */}
        <div className="pricenote">
          {c.note(
            <AppLink href="/contact" style={{ color: "inherit", textDecoration: "underline" }}>{c.noteLink}</AppLink>,
          )}
        </div>
      </div>

      {/* how coverage works */}
      <div className="wrap sec3">
        <SecHead k={c.means.k} h={c.means.h}>
          {c.means.lede}
        </SecHead>
        {/* NO `name`, so NO HowTo (§17 condition 18). This strip is not a
            sequence anyone performs: the band's `<h2>` is "What does global
            coverage actually mean?" and its lede answers "coverage … means
            someone can reach the office that holds the record" — a definition,
            and the three cards are the properties that definition has, not
            steps in order. A HowTo named with a "what does X mean" question
            would be instructions for an unstated task, which is the
            mis-citation `lib/seo/schema/howto.ts` refuses a placeholder name
            to avoid. `check-schema.mjs` carries this page in
            HOWTO_NOT_A_SEQUENCE so the decision fails loudly if it changes. */}
        <Steps items={[c.steps.inCountry, c.steps.atSource, c.steps.honest]} />
      </div>

      {/* FAQ — markup and FAQPage node both from the SAME array (see
          FaqSection). The four questions are `platform.coverage.faqs`; the
          order they are asked in is structure and stays here. */}
      <FaqSection
        head={c.faqHead}
        faqs={[c.faqs.count120, c.faqs.everywhere, c.faqs.crisis, c.faqs.addCountry]}
      />
    </PageShell>
  );
}
