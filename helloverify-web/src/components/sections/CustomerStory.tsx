import Image from "next/image";
import { SIZES_MARK, tint } from "@/lib/img";
// "Read the story" carried an inline copy of `brand/Arrow.tsx`, identical
// attribute for attribute and in order, `aria-hidden` included - no defect
// here, and the swap emits the same bytes. Shared because an inline copy is
// what the next paste starts from: three of the six copies TASKS Part 5
// carried had dropped `aria-hidden` that way. §4 rule 2, §17 condition 22.
import { Arrow } from "@/components/brand/Arrow";
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
/** Customer story — WITHHELD until there is a real one.
 *
 * The markup below quotes a "Head of Fleet Operations" at a "Quick-commerce
 * company, Bengaluru" who does not exist, beside a stock headshot, under a
 * "SAMPLE — REPLACE" pill the visitor can read. It is the only fabricated
 * attributed quote on the homepage and the only item in the 22 Sep demo walk
 * that is a liability rather than an untidiness, so it does not render.
 *
 * A REAL testimonial does exist and was NOT used, deliberately. The old repo
 * carries three at `public/cms/en/about.base.json` → `sections[5].cards[]`
 * ("What Our Client Speak"), live on the current site: HCL, Cognizant and
 * Hero Fincorp, each attributed by role and company line ("HR Shared
 * Services @ India's largest IT company") with a client logo, and each
 * de-identified on purpose — no personal name, no photograph. Dropping one
 * into this section verbatim would leave the two stat blocks beside it
 * ("1,600+ riders verified a month", "5 days to 30 min") attached to a named
 * real customer. Those figures have no source: searched the old repo for
 * "1,600", "1600" and "rider" and the only hit is an image alt text. That
 * turns a self-labelled sample into an unlabelled false claim about an
 * identifiable company — strictly worse than what is here now. Fitting the
 * real quote properly means a logo where the headshot is and no metrics at
 * all, which is a different section, not this one.
 *
 * WHY A FLAG AND NOT A DELETION: the layout is the shell a real story will
 * reuse, and the gate lives here rather than at the call site so the homepage
 * (`app/[locale]/page.tsx`) does not have to know. Setting
 * `STORY_IS_ATTRIBUTABLE` true is the whole re-enable once a quote and its
 * metrics have a named owner. Rejected: deleting the component, which loses
 * the layout and spreads the same decision over two files.
 *
 * The `href="#"` on "Read the story" below is left as it is — it belongs to
 * a story that does not exist, and it now emits nothing on any route.
 */
const STORY_IS_ATTRIBUTABLE: boolean = false;

export async function CustomerStory() {
  if (!STORY_IS_ATTRIBUTABLE) return null;

  const t = (await copy(SECTIONS)).customerStory;

  return (
    <>
      <div className="dsk">
        <div className="wrap hair-top" style={{ paddingTop: '120px', paddingBottom: '120px' }}>
          {' '}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 8fr) minmax(0, 4fr)', gap: '80px', alignItems: 'start' }}>
            {' '}
            <div>
              {' '}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="k">
                  {t.kicker}
                </span>
                <span className="mono" style={{ padding: '3px 8px', borderRadius: '999px', background: 'var(--white)', border: '1px solid var(--hair)', color: 'var(--muted)', fontSize: '10.5px' }}>
                  {t.pill}
                </span>
              </div>
              {' '}
              <blockquote className="serif" style={{ margin: '28px 0 0', fontSize: '46px', lineHeight: '1.12', letterSpacing: '-0.025em', textWrap: 'pretty' }}>
                {t.quote}
              </blockquote>
              {' '}
              <div style={{ marginTop: '36px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                {' '}
                <div className="ph" style={{ width: '52px', height: '52px', borderRadius: '50%', background: tint("/img/22-portrait-fleet-head.jpg") }}>
                  <div className="light">
                  </div>
                  <Image className="pimg" src="/img/22-portrait-fleet-head.jpg" alt="" fill sizes={SIZES_MARK} />
                </div>
                {' '}
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '500' }}>
                    {t.role}
                  </div>
                  <div style={{ marginTop: '2px', fontSize: '14px', color: 'var(--muted)' }}>
                    {t.org}
                  </div>
                </div>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
            <div style={{ paddingTop: '8px' }}>
              {' '}
              <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--hair)' }}>
                <div className="serif" style={{ fontSize: '56px', lineHeight: '1', letterSpacing: '-0.03em' }}>
                  {t.stats.ridersValue}
                  <span style={{ color: 'var(--muted)' }}>
                    {t.stats.ridersPlus}
                  </span>
                </div>
                <div style={{ marginTop: '8px', fontSize: '15px', color: 'var(--muted)' }}>
                  {t.stats.ridersLabel}
                </div>
              </div>
              {' '}
              <div style={{ padding: '24px 0', borderBottom: '1px solid var(--hair)' }}>
                <div className="serif" style={{ fontSize: '44px', lineHeight: '1', letterSpacing: '-0.03em' }}>
                  {t.stats.timeA}{' '}
                  <span style={{ color: 'var(--muted)' }}>
                    {t.stats.timeTo}
                  </span>
                  {' '}{t.stats.timeB}
                </div>
                <div style={{ marginTop: '8px', fontSize: '15px', color: 'var(--muted)' }}>
                  {t.stats.timeLabel}
                </div>
              </div>
              {' '}
              <div style={{ paddingTop: '24px' }}>
                <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '500' }}>
                  {t.readStory}{' '}
                  <Arrow />
                </a>
              </div>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </div>
      </div>
      <div className="mob">
        <div className="wrap sec hair-top">
          {' '}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="k">
              {t.kicker}
            </span>
            <span className="mono" style={{ padding: '2px 7px', borderRadius: '999px', background: 'var(--white)', border: '1px solid var(--hair)', color: 'var(--muted)', fontSize: '10px' }}>
              {t.pillMob}
            </span>
          </div>
          {' '}
          <blockquote className="serif" style={{ margin: '18px 0 0', fontSize: '28px', lineHeight: '1.15', letterSpacing: '-0.02em' }}>
            {t.quote}
          </blockquote>
          {' '}
          <div style={{ marginTop: '20px', fontSize: '14px' }}>
            <b style={{ fontWeight: '500' }}>
              {t.role}
            </b>
            <span style={{ color: 'var(--muted)' }}>
              {' '}{t.orgMob}
            </span>
          </div>
          {' '}
          <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px', paddingTop: '20px', borderTop: '1px solid var(--hair)' }}>
            {' '}
            <div>
              <div className="serif" style={{ fontSize: '36px', lineHeight: '1' }}>
                {t.stats.ridersMob}
              </div>
              <div style={{ marginTop: '6px', fontSize: '13px', color: 'var(--muted)' }}>
                {t.stats.ridersLabel}
              </div>
            </div>
            {' '}
            <div>
              <div className="serif" style={{ fontSize: '28px', lineHeight: '1' }}>
                {t.stats.timeMob}
              </div>
              <div style={{ marginTop: '6px', fontSize: '13px', color: 'var(--muted)' }}>
                {t.stats.timeLabelMob}
              </div>
            </div>
            {' '}
          </div>
          {' '}
        </div>
      </div>
    </>
  );
}
