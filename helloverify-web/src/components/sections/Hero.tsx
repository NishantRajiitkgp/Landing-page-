/** Hero - Verified at the source, in minutes. */
import { YCBadge } from "@/components/brand/YCBadge";
// The ghost button's arrow was an inline copy of `brand/Arrow.tsx`, identical
// attribute for attribute in both elements and in their order, `aria-hidden`
// included - so this one carried no defect and the swap emits the same bytes.
// Shared anyway: an inline copy is the template the next one gets pasted from,
// and three of the six copies TASKS Part 5 carried had lost the attribute that
// way. §4 rule 2, §17 condition 22.
import { Arrow } from "@/components/brand/Arrow";
import { AppLink } from "@/components/chrome/AppLink";
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";

export async function Hero() {
  const t = (await copy(SECTIONS)).hero;

  return (
    <>
      <div className="dsk">
        <div className="wrap" style={{ paddingTop: '88px', paddingBottom: '56px', textAlign: 'center' }}>
          {' '}
          {/* The "Backed by Y Combinator" pill was an `<a href="#">` and is
              now a `<span>`, because there is no URL to give it. Searched the
              old repo for one: `ycombinator.com` appears nowhere, and the
              badge there is a `<div>` that never was a link
              (`src/components/Hero.tsx:97-111`, fed by
              `public/cms/en/home.base.json:3-5`, which carries `badgeText`,
              `badgeLogoUrl` and `badgeLogoAlt` and no href field at all).
              Inventing `https://www.ycombinator.com/companies/helloverify`
              was rejected outright — an unverified destination on the first
              element of the homepage, asserting a directory listing nobody
              here has opened.

              A `<span>` is also what the OTHER breakpoint already emits: the
              `.mob` copy of this pill below is already `<span className="rise
              d1">` with the same children, so this ends a divergence between
              the two trees rather than creating one. `.rise`/`.d1` are
              animation classes and the pill's whole appearance is inline, so
              nothing was inherited from `a`. §17 condition 22. */}
          <span className="rise d1" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', height: '38px', padding: '0 16px 0 14px', borderRadius: '999px', background: 'var(--white)', border: '1px solid var(--hair)', fontSize: '13px', fontWeight: '500', color: 'var(--ink-soft)' }}>
            {' '}
            <span>
              {t.backedBy}
            </span>
            {' '}
            <YCBadge width={103} height={20} />
            {' '}
          </span>
          {' '}
          <h1 className="serif rise d2" style={{ margin: '34px auto 0', maxWidth: '1080px', fontSize: '112px', lineHeight: '0.96', letterSpacing: '-0.03em', fontWeight: '400', textWrap: 'balance' }}>
            {' '}{t.headline}
            <br />
            {' '}
            <em style={{ fontStyle: 'italic', fontWeight: '400' }}>
              {t.headlineEm}
            </em>
            {' '}
          </h1>
          {' '}
          <p className="rise d3" style={{ margin: '36px auto 0', maxWidth: '640px', fontSize: '21px', lineHeight: '1.45', color: 'var(--ink-soft)', letterSpacing: '-0.005em', textWrap: 'pretty' }}>
            {' '}{t.lede}{' '}
          </p>
          {' '}
          <div className="rise d4" style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px' }}>
            {' '}
            <AppLink href="/contact" className="btn btn-ink">
              {t.cta}
            </AppLink>
            {' '}
            <AppLink href="/resources/checks" className="btn btn-ghost">
              {' '}
              <span>
                {t.checks}
              </span>
              {' '}
              <Arrow />
              {' '}
            </AppLink>
            {' '}
          </div>
          {' '}
        </div>
      </div>
      <div className="mob">
        <div className="wrap" style={{ paddingTop: '40px', paddingBottom: '28px' }}>
          {' '}
          <span className="rise d1" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', height: '32px', padding: '0 12px', borderRadius: '999px', background: 'var(--white)', border: '1px solid var(--hair)', fontSize: '12px', fontWeight: '500', color: 'var(--ink-soft)' }}>
            {' '}
            <span>
              {t.backedBy}
            </span>
            {' '}
            <YCBadge width={82} height={16} />
            {' '}
          </span>
          {' '}
          <h1 className="serif rise d2" style={{ margin: '22px 0 0', fontSize: '54px', lineHeight: '0.98', letterSpacing: '-0.03em', fontWeight: '400' }}>
            {t.headline}{' '}
            <em style={{ fontStyle: 'italic' }}>
              {t.headlineEm}
            </em>
          </h1>
          {' '}
          <p className="rise d3" style={{ margin: '20px 0 0', fontSize: '17px', lineHeight: '1.45', color: 'var(--ink-soft)' }}>
            {t.lede}
          </p>
          {' '}
          <div className="rise d4" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {' '}
            <AppLink href="/contact" className="btn btn-ink full">
              {t.cta}
            </AppLink>
            {' '}
            <AppLink href="/resources/checks" className="btn btn-line full">
              {t.checks}
            </AppLink>
            {' '}
          </div>
          {' '}
        </div>
      </div>
    </>
  );
}
