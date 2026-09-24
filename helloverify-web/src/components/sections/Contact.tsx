import Image from "next/image";
import { getLocale } from "next-intl/server";

import { AppLink } from "@/components/chrome/AppLink";
import { ContactForm } from "@/components/forms/ContactForm";
import { SIZES_FEATURE, noteInk, tint } from "@/lib/img";
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
import "@/app/v2/contact.css";
/** Contact form.
 *
 *  THE FORM IS REAL NOW (24 Sep 2026). The closing band drew a mock — six
 *  static boxes, three segment chips that did nothing and a "Submit" that
 *  linked to /contact — so a visitor who picked "Government" or "Individual"
 *  got no response at all. Both trees now render `forms/ContactForm`, the
 *  /contact form and its Server Action, which switches its fields per
 *  audience (`SEGMENT_FORM` in `forms/LeadFields.tsx`). Each tree gets its
 *  own id prefix, since both are in the DOM. The layout rules the /contact
 *  page scopes to `.ct3` are restated for `.hc` in `app/v2/contact.css`.
 *
 *  WHAT IS STILL WRITTEN TWICE, and was measured as genuinely different
 *  when the mock was split out (see git history for `blocks/LeadMock.tsx`):
 *  the headline (64px/0.98 against 36px/1), the photo panel (a 760px minimum
 *  against a fixed 300px; only desktop carries the `.light` gradient, the
 *  `.note` caption and the closing paragraph) and the consent paragraph
 *  (shorter on the phone, which does not link the address).
 */

export async function Contact() {
  const t = (await copy(SECTIONS)).contact;
  const locale = await getLocale();

  return (
    <>
      <div className="dsk">
        <div style={{ padding: '0 40px' }}>
          {' '}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 6fr) minmax(0, 6fr)', borderRadius: '32px', overflow: 'hidden', border: '1px solid var(--hair)', background: 'var(--white)' }}>
            {' '}
            <div className="ph" style={{ minHeight: '760px', background: tint("/img/23-closing.jpg") }}>
              {' '}
              <div className="light" style={{ background: 'radial-gradient(90% 70% at 70% 100%, rgba(255,255,255,0.18), rgba(255,255,255,0) 60%)' }}>
              </div>
              <Image className="pimg" src="/img/23-closing.jpg" alt="" fill sizes={SIZES_FEATURE} />
              {' '}
              {/* Inverted because `/img/23-closing.jpg`'s tint is dark
                  (`#6B6E5B`, relative luminance 0.1503); the 0.35 alpha is this
                  board's own and is kept per photograph in `lib/img.ts` rather
                  than unified with the other two values, which would change
                  what six tiles render. */}
              <div className="note" style={{ top: '26%', color: noteInk("/img/23-closing.jpg") }}>
                {t.note}
              </div>
              {' '}
              <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(to top, rgba(14,13,10,0.95) 0%, rgba(14,13,10,0.7) 32%, rgba(14,13,10,0.15) 70%, rgba(14,13,10,0) 100%)' }}>
              </div>
              {' '}
              <div style={{ position: 'absolute', insetInlineStart: '56px', insetInlineEnd: '56px', bottom: '56px', zIndex: '3', color: 'var(--white)', textShadow: '0 2px 24px rgba(14,13,10,0.8)' }}>
                {' '}
                <h2 className="serif" style={{ margin: '0', fontSize: '64px', lineHeight: '0.98', letterSpacing: '-0.03em', fontWeight: '400' }}>
                  {t.headingA}{' '}
                  <em style={{ fontStyle: 'italic' }}>
                    {t.headingEm}
                  </em>
                  {' '}{t.headingB}
                </h2>
                {' '}
                {/* THE ONLY SUPPRESSION OF `hv/no-color-literal` IN `src/`, and
                    the only lint suppression of any kind - so it is a decision
                    waiting on you, not a style choice.

                    Extending the rule past hex (22 Sep 2026) surfaced six
                    whole-value `rgba()` literals. Five were the `.ph .note`
                    caption and went to `PLACEHOLDER_NOTE` in `lib/img.ts`,
                    where a per-photograph colour belongs. This one is none of
                    the three documented exemptions: it is body copy on the
                    closing band - UI colour, read by a human - and the palette
                    has no translucent white tier to send it to. `var(--white)`
                    is #FFFFFF at full opacity and would visibly change this
                    paragraph, so substituting it would be a design change
                    smuggled in as a lint fix.

                    Adding a token is a DESIGN.md decision (§2.1), and TASKS
                    Part 3 settled the precedent: four new tokens, not
                    seventeen. One occurrence in the whole codebase is thin
                    evidence for a new tier, so it is recorded rather than
                    guessed. Two ways out if you want it gone: a translucent
                    white token, or `color: var(--white)` with `opacity` on this
                    paragraph - identical rendering here, since the element
                    paints nothing but its own text, but that is a claim that
                    wants a screenshot before anyone relies on it. */}
                {/* eslint-disable-next-line hv/no-color-literal */}
                <p style={{ margin: '20px 0 0', fontSize: '18px', lineHeight: '1.45', color: 'rgba(255,255,255,0.82)', maxWidth: '460px' }}>
                  {t.sub}
                </p>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
            <div className="hc" style={{ padding: '56px 64px' }}>
              <ContactForm
                locale={locale}
                idPrefix="d-"
                consent={
                  <p className="consent">
                    {t.consent.lead}{' '}
                    <AppLink href="/legal/privacy-policy">{t.consent.policy}</AppLink>
                    {t.consent.mid}{' '}
                    <a href="mailto:privacy@helloverify.com">{t.consent.email}</a>
                    {t.consent.end}
                  </p>
                }
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mob">
        <div style={{ padding: '0 12px' }}>
          {' '}
          <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--hair)', background: 'var(--white)' }}>
            {' '}
            <div className="ph" style={{ height: '300px', background: tint("/img/23-closing.jpg") }}>
              {' '}
              <div className="light">
              </div>
              <Image className="pimg" src="/img/23-closing.jpg" alt="" fill sizes={SIZES_FEATURE} />
              <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(to top, rgba(14,13,10,0.95) 0%, rgba(14,13,10,0.7) 32%, rgba(14,13,10,0.15) 70%, rgba(14,13,10,0) 100%)' }}>
              </div>
              {' '}
              <div style={{ position: 'absolute', insetInlineStart: '22px', insetInlineEnd: '22px', bottom: '22px', zIndex: '3', color: 'var(--white)', textShadow: '0 2px 24px rgba(14,13,10,0.8)' }}>
                <h2 className="serif" style={{ margin: '0', fontSize: '36px', lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '400' }}>
                  {t.headingA}{' '}
                  <em style={{ fontStyle: 'italic' }}>
                    {t.headingEm}
                  </em>
                  {' '}{t.headingB}
                </h2>
              </div>
              {' '}
            </div>
            {' '}
            <div className="hc" style={{ padding: '24px 22px 28px' }}>
              <ContactForm
                locale={locale}
                idPrefix="m-"
                consent={
                  <p className="consent">
                    {t.consent.leadMob}{' '}
                    <AppLink href="/legal/privacy-policy">{t.consent.policy}</AppLink>
                    {t.consent.tailMob}
                  </p>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
