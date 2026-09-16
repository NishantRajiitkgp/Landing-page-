/** Hero - Verified at the source, in minutes. */
import { YCBadge } from "@/components/brand/YCBadge";

export function Hero() {
  return (
    <>
      <div className="dsk">
        <div className="wrap" style={{ paddingTop: '88px', paddingBottom: '56px', textAlign: 'center' }}>
          {' '}
          <a href="#" className="rise d1" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', height: '38px', padding: '0 16px 0 14px', borderRadius: '999px', background: '#FFFFFF', border: '1px solid #E3DFD6', fontSize: '13px', fontWeight: '500', color: '#3D3B35' }}>
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
          <p className="rise d3" style={{ margin: '36px auto 0', maxWidth: '640px', fontSize: '21px', lineHeight: '1.45', color: '#3D3B35', letterSpacing: '-0.005em', textWrap: 'pretty' }}>
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
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                </path>
              </svg>
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
          <span className="rise d1" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', height: '32px', padding: '0 12px', borderRadius: '999px', background: '#FFFFFF', border: '1px solid #E3DFD6', fontSize: '12px', fontWeight: '500', color: '#3D3B35' }}>
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
          <p className="rise d3" style={{ margin: '20px 0 0', fontSize: '17px', lineHeight: '1.45', color: '#3D3B35' }}>
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
