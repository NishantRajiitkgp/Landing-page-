/** /checks/[check] — programmatic check page (Template 5, IA §7).
 *  One route file, one page per catalogue entry, statically generated. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/chrome/PageShell";
import { CHECKS, getCheck } from "@/lib/content/checks";
import { AppLink } from "@/components/chrome/AppLink";
import { SecHead } from "@/components/chrome/SecHead";
/** `CHECKS_COPY`, not `CHECKS`: the catalogue above already owns that name in
 *  this file, and the two are deliberately different things — see the
 *  boundary note in `lib/copy/checks.en.tsx`. */
import { CHECKS_COPY } from "@/lib/copy/checks";
import { copy } from "@/lib/copy/request";

export function generateStaticParams() {
  return CHECKS.map((c) => ({ check: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; check: string }>;
}): Promise<Metadata> {
  const { locale, check } = await params;
  const c = getCheck(check);
  // No canonical on a 404. An unknown slug renders notFound() below, and a
  // canonical tag on a 404 invites Google to index the error page.
  if (!c) return {};
  // `c.slug`, not the `check` param: the sitemap is built from the catalogue,
  // so taking the path from the same object is what makes the two byte-identical
  // even if the URL arrived percent-encoded or in a different case.
  return pageMetadata(locale, `/checks/${c.slug}`);
}

export default async function CheckPage({
  params,
}: {
  params: Promise<{ check: string }>;
}) {
  const { check } = await params;
  const c = getCheck(check);
  if (!c) notFound();

  const related = CHECKS.filter((x) => x.group === c.group && x.slug !== c.slug).slice(0, 4);
  const t = await copy(CHECKS_COPY);

  return (
    <PageShell
      crumbs={[
        { label: t.crumbs.resources, href: "/resources" },
        { label: t.crumbs.library, href: "/resources/checks" },
        { label: c.name },
      ]}
      closing={{
        /* "the", and the name verbatim — the note that was a JSX comment
           inside this fragment moved with the fragment, to
           `lib/copy/checks.en.tsx#closing.heading`. */
        heading: t.closing.heading(c.name),
        sub: t.closing.sub(c.source, c.time),
      }}
    >
      {/* hero */}
      <div className="wrap hero3">
        <div className="k">{t.hero.kicker(c.group)}</div>
        <h1 className="h1">{t.hero.h1(c.name)}</h1>
        <p className="sub">{c.answers}</p>
        <div className="hrow">
          <AppLink href="/contact" className="btn btn-ink">{t.hero.talkToSales}</AppLink>
          <a href="https://app.helloverify.com" className="btn btn-line">{t.hero.buy}</a>
        </div>
      </div>

      {/* verdict strip — the facts, up top */}
      <div className="wrap">
        <div className="strip3">
          <span className="it">{t.strip.turnaround(c.time)}</span>
          <span className="it">{t.strip.confirmedWith(c.source)}</span>
          <span className="it"><b>{c.countries}</b></span>
          {c.fast && <span className="it">{t.strip.fast}</span>}
        </div>
      </div>

      {/* THE ANSWER BLOCK (BUILD-SPEC §11a.2). Question-shaped H2, and the
          answer immediately below it in ~35 words, self-contained: it names the
          check rather than saying "this check", so it still means something
          when an engine extracts it away from this page.

          Every value comes from `lib/content/checks.ts` - the same catalogue
          the strip above and the `Service` node are built from - so the
          citeable sentence and the page cannot disagree. Nothing here is new
          copy; it is reviewed copy in a shape that survives extraction.

          COVERAGE IS ITS OWN CLAUSE, not "across {countries}", because the
          twelve values do not all fit that frame: `global-database` reads
          "Global", so "across Global" is broken English on one of the twelve.
          Checked against all of them rather than the two that read nicely.

          TWO MORE THINGS ONE TEMPLATE FOR TWELVE PAGES GOT WRONG, both caught
          by reading the rendered output rather than the source:

          - `c.name.toLowerCase()` turned "Directors & GST" into
            "directors & gst". The name is used VERBATIM now; three of the
            twelve carry an acronym or a proper noun that a lower-casing helper
            cannot know about.
          - "a {name} check" reads "a Identity check" on three of them.
            The article is "the" throughout instead, which is grammatical for
            all twelve names without a vowel test that would itself be wrong
            for the next one added.

          `tools/test/answer-blocks.test.ts` asserts both, so adding a check to
          the catalogue cannot reintroduce them. */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">{t.answer.kicker}</div>
            <h2 className="h2" style={{ marginTop: 12 }}>{t.answer.h2(c.name)}</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            {t.answer.lede(c.name, c.source, c.time, c.countries, c.answers)}
          </p>
        </div>
      </div>

      {/* what you get */}
      <div className="wrap sec3">
        <SecHead k={t.fields.kicker} h={t.fields.h(c.name)}>{t.fields.lede}</SecHead>
        <div className="body3 cloud3">
          {c.fields.map((f) => (
            <span className={`pl3${c.fast ? " fast" : ""}`} key={f}>
              <span className="d" />
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* the honest part */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">{t.caveat.kicker}</div>
            <h2 className="h2" style={{ marginTop: 12 }}>{t.caveat.h2(c.name)}</h2>
          </div>
        </div>
        <div className="body3 prose3">
          <p>{c.caveat}</p>
          <div className="aside">{t.caveat.aside}</div>
        </div>
      </div>

      {/* who orders it */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">{t.who.kicker}</div>
            <h2 className="h2" style={{ marginTop: 12 }}>{t.who.h2}</h2>
          </div>
        </div>
        <div className="body3 intg3">
          {c.usedBy.map((u) => (
            <span className="svc" key={u}>{u}</span>
          ))}
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <div className="wrap sec3" style={{ paddingBottom: 20 }}>
          <div className="sec-head">
            <div>
              <div className="k">{t.related.kicker}</div>
              <h2 className="h2" style={{ marginTop: 12 }}>{t.related.h2}</h2>
            </div>
          </div>
          <div className="body3 idx3">
            {related.map((r) => (
              <AppLink className="x3" href={`/checks/${r.slug}`} key={r.slug}>
                <span className="xn">
                  {r.name}
                  <small>{r.answers}</small>
                </span>
                <span className={`xt${r.fast ? " fast" : ""}`}>{r.time}</span>
                <span className="xs">{r.source}</span>
                <span className="xa">→</span>
              </AppLink>
            ))}
          </div>
          <div style={{ marginTop: 32 }}>
            <AppLink href="/resources/checks" className="btn btn-line btn-sm">{t.related.all}</AppLink>
          </div>
        </div>
      )}
    </PageShell>
  );
}
