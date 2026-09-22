/** Hero - Verified at the source, in minutes. */
import { YCBadge } from "@/components/brand/YCBadge";
// The ghost button's arrow was an inline copy of `brand/Arrow.tsx`, identical
// attribute for attribute in both elements and in their order, `aria-hidden`
// included - so this one carried no defect and the swap emits the same bytes.
// Shared anyway: an inline copy is the template the next one gets pasted from,
// and three of the six copies TASKS Part 5 carried had lost the attribute that
// way. §4 rule 2, §17 condition 22.
import { Arrow } from "@/components/brand/Arrow";

export function Hero() {
  return (
    <>
      <div className="dsk">
        <div className="wrap" style={{ paddingTop: '88px', paddingBottom: '56px', textAlign: 'center' }}>
          {' '}
          <a href="#" className="rise d1" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', height: '38px', padding: '0 16px 0 14px', borderRadius: '999px', background: 'var(--white)', border: '1px solid var(--hair)', fontSize: '13px', fontWeight: '500', color: 'var(--ink-soft)' }}>
            {' '}
            <span>
              Backed by
            </span>
            {' '}
            <YCBadge width={103} height={20} />
            {' '}
          </a>
          {' '}
          <h1 className="serif rise d2" style={{ margin: '34px auto 0', maxWidth: '1080px', fontSize: '112px', lineHeight: '0.96', letterSpacing: '-0.03em', fontWeight: '400', textWrap: 'balance' }}>
            {' '}Verified at the source,
            <br />
            {' '}
            <em style={{ fontStyle: 'italic', fontWeight: '400' }}>
              in minutes.
            </em>
            {' '}
          </h1>
          {' '}
          <p className="rise d3" style={{ margin: '36px auto 0', maxWidth: '640px', fontSize: '21px', lineHeight: '1.45', color: 'var(--ink-soft)', letterSpacing: '-0.005em', textWrap: 'pretty' }}>
            {' '}AI reads the documents. Our team confirms with the issuer — the university, the employer, the registry. You get an answer in as little as 15 minutes.{' '}
          </p>
          {' '}
          <div className="rise d4" style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px' }}>
            {' '}
            <a href="#" className="btn btn-ink">
              Talk to sales
            </a>
            {' '}
            <a href="#" className="btn btn-ghost">
              {' '}
              <span>
                See all 33 checks
              </span>
              {' '}
              <Arrow />
              {' '}
            </a>
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
              Backed by
            </span>
            {' '}
            <YCBadge width={82} height={16} />
            {' '}
          </span>
          {' '}
          <h1 className="serif rise d2" style={{ margin: '22px 0 0', fontSize: '54px', lineHeight: '0.98', letterSpacing: '-0.03em', fontWeight: '400' }}>
            Verified at the source,{' '}
            <em style={{ fontStyle: 'italic' }}>
              in minutes.
            </em>
          </h1>
          {' '}
          <p className="rise d3" style={{ margin: '20px 0 0', fontSize: '17px', lineHeight: '1.45', color: 'var(--ink-soft)' }}>
            AI reads the documents. Our team confirms with the issuer — the university, the employer, the registry. You get an answer in as little as 15 minutes.
          </p>
          {' '}
          <div className="rise d4" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {' '}
            <a href="#" className="btn btn-ink full">
              Talk to sales
            </a>
            {' '}
            <a href="#" className="btn btn-line full">
              See all 33 checks
            </a>
            {' '}
          </div>
          {' '}
        </div>
      </div>
    </>
  );
}
