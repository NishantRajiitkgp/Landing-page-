import Image from "next/image";
import { SIZES_MARK, tint } from "@/lib/img";
/** Customer story. */

export function CustomerStory() {
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
                  Customer story
                </span>
                <span className="mono" style={{ padding: '3px 8px', borderRadius: '999px', background: 'var(--white)', border: '1px solid var(--hair)', color: 'var(--faint)', fontSize: '10.5px' }}>
                  SAMPLE — REPLACE
                </span>
              </div>
              {' '}
              <blockquote className="serif" style={{ margin: '28px 0 0', fontSize: '46px', lineHeight: '1.12', letterSpacing: '-0.025em', textWrap: 'pretty' }}>
                “We onboard four hundred riders a week. Verification used to be the thing that slowed us down. Now it finishes before the induction video does.”
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
                    Head of Fleet Operations
                  </div>
                  <div style={{ marginTop: '2px', fontSize: '14px', color: 'var(--muted)' }}>
                    Quick-commerce company, Bengaluru
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
                  1,600
                  <span style={{ color: 'var(--faint)' }}>
                    +
                  </span>
                </div>
                <div style={{ marginTop: '8px', fontSize: '15px', color: 'var(--muted)' }}>
                  riders verified a month
                </div>
              </div>
              {' '}
              <div style={{ padding: '24px 0', borderBottom: '1px solid var(--hair)' }}>
                <div className="serif" style={{ fontSize: '44px', lineHeight: '1', letterSpacing: '-0.03em' }}>
                  5 days{' '}
                  <span style={{ color: 'var(--faint)' }}>
                    to
                  </span>
                  {' '}30 min
                </div>
                <div style={{ marginTop: '8px', fontSize: '15px', color: 'var(--muted)' }}>
                  time to a completed report, before and after
                </div>
              </div>
              {' '}
              <div style={{ paddingTop: '24px' }}>
                <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '500' }}>
                  Read the story{' '}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    </path>
                  </svg>
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
              Customer story
            </span>
            <span className="mono" style={{ padding: '2px 7px', borderRadius: '999px', background: 'var(--white)', border: '1px solid var(--hair)', color: 'var(--faint)', fontSize: '10px' }}>
              SAMPLE
            </span>
          </div>
          {' '}
          <blockquote className="serif" style={{ margin: '18px 0 0', fontSize: '28px', lineHeight: '1.15', letterSpacing: '-0.02em' }}>
            “We onboard four hundred riders a week. Verification used to be the thing that slowed us down. Now it finishes before the induction video does.”
          </blockquote>
          {' '}
          <div style={{ marginTop: '20px', fontSize: '14px' }}>
            <b style={{ fontWeight: '500' }}>
              Head of Fleet Operations
            </b>
            <span style={{ color: 'var(--muted)' }}>
              {' '}· Quick-commerce company, Bengaluru
            </span>
          </div>
          {' '}
          <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px', paddingTop: '20px', borderTop: '1px solid var(--hair)' }}>
            {' '}
            <div>
              <div className="serif" style={{ fontSize: '36px', lineHeight: '1' }}>
                1,600+
              </div>
              <div style={{ marginTop: '6px', fontSize: '13px', color: 'var(--muted)' }}>
                riders verified a month
              </div>
            </div>
            {' '}
            <div>
              <div className="serif" style={{ fontSize: '28px', lineHeight: '1' }}>
                5 days to 30 min
              </div>
              <div style={{ marginTop: '6px', fontSize: '13px', color: 'var(--muted)' }}>
                time to a report
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
