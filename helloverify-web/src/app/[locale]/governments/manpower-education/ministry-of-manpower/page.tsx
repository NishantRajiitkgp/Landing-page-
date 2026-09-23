/** Case study — the single strongest proof artefact for the government buyer (IA §4.1).
 *  Real facts only: MOM is a named client on the current site. Figures marked
 *  [placeholder] await sign-off and are rendered as such rather than invented. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { Arrow } from "@/components/brand/Arrow";
import { Steps } from "@/components/chrome/Steps";
import { GOVERNMENTS } from "@/lib/copy/governments";
import { copy } from "@/lib/copy/request";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/governments/manpower-education/ministry-of-manpower");
}

export default async function MomCaseStudy({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enables static rendering: without it every next-intl call in this
  // subtree (AppLink resolves the locale) falls back to reading request
  // headers, which makes the route dynamic. BUILD-SPEC §5.
  setRequestLocale(locale);
  const t = await copy(GOVERNMENTS);
  const d = t.mom;

  return (
    <PageShell
      crumbs={[
        { label: t.crumb, href: "/governments" },
        { label: t.manpowerEducation.crumb, href: "/governments/manpower-education" },
        { label: d.crumb },
      ]}
      closing={{
        heading: d.closing.heading,
        sub: d.closing.sub,
        img: "/img/10-ministry-hall.jpg",
      }}
    >
      {/* hero */}
      <div className="wrap hero3">
        <div className="k">{d.hero.k}</div>
        <h1 className="h1">{d.hero.h1}</h1>
        <p className="sub">{d.hero.sub}</p>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it">{d.strip.passes}</span>
          <span className="it">{d.strip.countries}</span>
          <span className="it">{d.strip.before}</span>
          <span className="it">{d.strip.live}</span>
        </div>
      </div>

      {/* the quote + stats */}
      <div className="wrap sec3">
        <div className="quote3">
          <div>
            {/* Was a <blockquote> attributed to a "Verification programme lead"
                beside /img/22-portrait-fleet-head.jpg. Both were invented: the
                sentence appears nowhere in the old repo, and that portrait is the
                same stock headshot the homepage's self-labelled SAMPLE story used.
                A government case study is the worst page on the site to carry an
                invented source, so the attribution is gone.

                The words stay, as this company's own position rather than someone
                else's words -- <p>, not <blockquote>, because `blockquote` asserts
                the text came from another source and that is the claim being
                withdrawn. `.quote3 .q` is a class selector (pages.css:277), so the
                typography is unchanged. The three `.stats` beside it are sourced
                and stay, which is why this is not gated the way CustomerStory is. */}
            <p className="q">{d.quote}</p>
          </div>
          <div className="stats">
            {/* `v` is one RICH-TEXT leaf per stat — `120<em>+</em>` is a text
                child and an element, and splitting it into two leaves would put
                two adjacent text children where one sits today. */}
            <div className="s">
              <div className="v">{d.stats.countries.v}</div>
              <div className="l">{d.stats.countries.l}</div>
            </div>
            <div className="s">
              <div className="v">{d.stats.days.v}</div>
              <div className="l">{d.stats.days.l}</div>
            </div>
            <div className="s">
              <div className="v">{d.stats.before.v}</div>
              <div className="l">{d.stats.before.l}</div>
            </div>
          </div>
        </div>
      </div>

      {/* the story */}
      <div className="wrap sec3">
        {/* ANSWER BLOCK (BUILD-SPEC §11a.2), 42 words. Both `sec-head` blocks
            on this page were headings with NO lede — the shape `SecHead.tsx`
            documents as one of the 21 it deliberately does not own — so the
            answer had nowhere to live and a `.lede` is added in the same
            markup `SecHead` emits (`marginBottom: 8`). Converting the heading
            alone would have left a question with no answer beside it, which is
            the one thing §11a.2 cannot do without.

            The answer is angled at the appeal risk rather than repeating the
            prose below it: the first paragraph already enumerates the degree,
            the employment record and the identity document, and a lede that
            restated it verbatim would be duplication rather than a summary.
            Both halves — "thousands of kilometres away" and the accept/reject
            error pair — are this page's own hero sub and second paragraph. */}
        <div className="sec-head">
          <div>
            <div className="k">{d.problem.k}</div>
            <h2 className="h2" style={{ marginTop: 12 }}>{d.problem.h}</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>{d.problem.lede}</p>
        </div>
        <div className="body3 prose3">
          <p>{d.prose.claims}</p>
          <p>{d.prose.gap}</p>

          <h3>{d.prose.changedH}</h3>
          <p>{d.prose.changed}</p>
          {/* The one rich-text leaf in this block: three `<br />`s making a
              bulleted list out of line breaks, so the breaks travel with the
              words rather than being re-assembled around them. */}
          <div className="aside">{d.prose.outcomes}</div>
          <p>{d.prose.thirdState}</p>

          <h3>{d.prose.runsH}</h3>
          <p>{d.prose.capture}</p>
          <p>{d.prose.offices}</p>

          <h3>{d.prose.holdsH}</h3>
          <p>{d.prose.holds}</p>
        </div>
      </div>

      {/* what a ministry gets */}
      <div className="wrap sec3" style={{ paddingBottom: 20 }}>
        {/* ANSWER BLOCK (§11a.2), 45 words, and a `.lede` added for the same
            reason as the block above. This one DOES restate the four cards
            below it, which is the exemplar's shape on
            `/business/employee-verification` ("Re-verify at four moments…"
            names the four cards under it): an engine lifting the block gets
            the whole answer, and a reader gets the cards. Nothing here is new
            — the four are the `Steps` items verbatim. */}
        <div className="sec-head">
          <div>
            <div className="k">{d.gets.k}</div>
            <h2 className="h2" style={{ marginTop: 12 }}>{d.gets.h}</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>{d.gets.lede}</p>
        </div>
        {/* NO `name`, so NO HowTo (§17 condition 18). The band's own lede says
            what these four are — "four things in the contract" — and they are
            deliverables, not steps: source proof, honest gaps, scale and an
            appeal-ready trail all hold at once and in no order. The `01`–`04`
            is the strip's ornament, which is exactly why `howto.ts` does not
            read `n`. Carried in `check-schema.mjs`'s HOWTO_NOT_A_SEQUENCE. */}
        <Steps items={[d.steps.proof, d.steps.gaps, d.steps.scale, d.steps.appeal]} />
        <div style={{ marginTop: 40, display: "flex", gap: 14, flexWrap: "wrap" }}>
          <AppLink href="/governments/manpower-education" className="btn btn-line btn-sm">{d.verification}</AppLink>
          <AppLink href="/platform/security-compliance" className="btn btn-ghost btn-sm">
            <span>{d.artefacts}</span>
            <Arrow />
          </AppLink>
        </div>
      </div>
    </PageShell>
  );
}
