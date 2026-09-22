import Image from "next/image";
import { SIZES_FEATURE, noteInk, tint } from "@/lib/img";
/** Contact form. */

export function Contact() {
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
                photo · warm, people at work
              </div>
              {' '}
              <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(to top, rgba(14,13,10,0.95) 0%, rgba(14,13,10,0.7) 32%, rgba(14,13,10,0.15) 70%, rgba(14,13,10,0) 100%)' }}>
              </div>
              {' '}
              <div style={{ position: 'absolute', insetInlineStart: '56px', insetInlineEnd: '56px', bottom: '56px', zIndex: '3', color: 'var(--white)', textShadow: '0 2px 24px rgba(14,13,10,0.8)' }}>
                {' '}
                <h2 className="serif" style={{ margin: '0', fontSize: '64px', lineHeight: '0.98', letterSpacing: '-0.03em', fontWeight: '400' }}>
                  Every great journey deserves a{' '}
                  <em style={{ fontStyle: 'italic' }}>
                    verified
                  </em>
                  {' '}beginning.
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
                  Take the first step. We'll handle the rest.
                </p>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
            <div style={{ padding: '56px 64px' }}>
              {' '}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                {' '}
                <div className="k">
                  Talk to sales
                </div>
                {' '}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span className="seg on">
                    Business
                  </span>
                  <span className="seg">
                    Government
                  </span>
                  <span className="seg">
                    Individual
                  </span>
                </div>
                {' '}
              </div>
              {' '}
              <div style={{ marginTop: '36px', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '28px 24px' }}>
                {' '}
                <div>
                  <div className="fld-l">
                    Full name
                  </div>
                  <div className="inp fill">
                    Priya Menon
                  </div>
                </div>
                {' '}
                <div>
                  <div className="fld-l">
                    Company
                  </div>
                  <div className="inp">
                    Company name
                  </div>
                </div>
                {' '}
                <div>
                  <div className="fld-l">
                    Business email
                  </div>
                  <div className="inp">
                    name@company.com
                  </div>
                </div>
                {' '}
                <div>
                  <div className="fld-l">
                    Mobile
                  </div>
                  <div className="inp">
                    <span>
                      <span style={{ color: 'var(--ink)' }}>
                        +91
                      </span>
                      {' '}· 98··· ·····
                    </span>
                  </div>
                </div>
                {' '}
                <div style={{ gridColumn: 'span 2' }}>
                  <div className="fld-l">
                    Services of interest
                  </div>
                  <div className="inp">
                    <span>
                      Employee verification, KYC, Certifier, Consumer…
                    </span>
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M3 4.5l3 3 3-3" stroke="#15140F" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      </path>
                    </svg>
                  </div>
                </div>
                {' '}
                <div style={{ gridColumn: 'span 2' }}>
                  <div className="fld-l">
                    Message
                  </div>
                  <div className="inp" style={{ height: '84px', alignItems: 'flex-start', paddingTop: '14px' }}>
                    How many checks a month, and where?
                  </div>
                </div>
                {' '}
              </div>
              {' '}
              <p style={{ margin: '24px 0 0', fontSize: '13px', lineHeight: '1.5', color: 'var(--muted)' }}>
                By submitting, you consent to HelloVerify processing your data for lead generation and related communications, per our{' '}
                <a href="#" style={{ color: 'var(--muted)', textDecoration: 'underline' }}>
                  Privacy Policy
                </a>
                . Withdraw any time at{' '}
                <a href="#" style={{ color: 'var(--muted)', textDecoration: 'underline' }}>
                  privacy@helloverify.com
                </a>
                .
              </p>
              {' '}
              <div style={{ marginTop: '28px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                {' '}
                <a href="#" className="btn btn-ink">
                  Submit
                </a>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
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
                  Every great journey deserves a{' '}
                  <em style={{ fontStyle: 'italic' }}>
                    verified
                  </em>
                  {' '}beginning.
                </h2>
              </div>
              {' '}
            </div>
            {' '}
            <div style={{ padding: '24px 22px 28px' }}>
              {' '}
              <div style={{ display: 'flex', gap: '6px' }}>
                <span className="seg on">
                  Business
                </span>
                <span className="seg">
                  Government
                </span>
                <span className="seg">
                  Individual
                </span>
              </div>
              {' '}
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {' '}
                <div>
                  <div className="fld-l">
                    Full name
                  </div>
                  <div className="inp fill">
                    Priya Menon
                  </div>
                </div>
                {' '}
                <div>
                  <div className="fld-l">
                    Company
                  </div>
                  <div className="inp">
                    Company name
                  </div>
                </div>
                {' '}
                <div>
                  <div className="fld-l">
                    Business email
                  </div>
                  <div className="inp">
                    name@company.com
                  </div>
                </div>
                {' '}
                <div>
                  <div className="fld-l">
                    Mobile
                  </div>
                  <div className="inp">
                    <span>
                      <span style={{ color: 'var(--ink)' }}>
                        +91
                      </span>
                      {' '}· 98··· ·····
                    </span>
                  </div>
                </div>
                {' '}
                <div>
                  <div className="fld-l">
                    Services of interest
                  </div>
                  <div className="inp">
                    <span>
                      Employee verification, KYC…
                    </span>
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M3 4.5l3 3 3-3" stroke="#15140F" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      </path>
                    </svg>
                  </div>
                </div>
                {' '}
                <div>
                  <div className="fld-l">
                    Message
                  </div>
                  <div className="inp">
                    How many checks a month, and where?
                  </div>
                </div>
                {' '}
              </div>
              {' '}
              <p style={{ margin: '18px 0 0', fontSize: '12.5px', lineHeight: '1.5', color: 'var(--muted)' }}>
                By submitting, you consent to HelloVerify processing your data for lead generation, per our{' '}
                <a href="#" style={{ color: 'var(--muted)', textDecoration: 'underline' }}>
                  Privacy Policy
                </a>
                . Withdraw any time at privacy@helloverify.com.
              </p>
              {' '}
              <a href="#" className="btn btn-ink full" style={{ marginTop: '18px' }}>
                Submit
              </a>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </div>
      </div>
    </>
  );
}
