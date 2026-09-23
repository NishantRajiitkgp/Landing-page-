/** Built on trust. Proven by numbers. */
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";

export async function Numbers() {
  const t = (await copy(SECTIONS)).numbers;

  return (
    <>
      <div className="dsk">
        <div className="wrap" style={{ paddingTop: '160px', paddingBottom: '140px' }}>
          {' '}
          <div className="sec-head">
            <h2 className="h2">
              {t.headingA}
              <br />
              {t.headingB}
            </h2>
            <p className="lede" style={{ marginBottom: '8px' }}>
              {t.lede}
            </p>
          </div>
          {' '}
          <div style={{ marginTop: '88px', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '72px 80px' }}>
            {' '}
            <div>
              <div className="big">
                <span className="in" style={{ animationDelay: '0.1s' }}>
                  {t.figures.checks.v}
                </span>
                <span className="sfx in" style={{ animationDelay: '0.18s' }}>
                  {t.plus}
                </span>
              </div>
              <div className="big-l">
                {t.figures.checks.l}
              </div>
            </div>
            {' '}
            <div>
              <div className="big">
                <span className="in" style={{ animationDelay: '0.2s' }}>
                  {t.figures.clients.v}
                </span>
                <span className="sfx in" style={{ animationDelay: '0.28s' }}>
                  {t.plus}
                </span>
              </div>
              <div className="big-l">
                {t.figures.clients.l}
              </div>
            </div>
            {' '}
            <div>
              <div className="big">
                <span className="in" style={{ animationDelay: '0.3s' }}>
                  {t.figures.countries.v}
                </span>
                <span className="sfx in" style={{ animationDelay: '0.38s' }}>
                  {t.plus}
                </span>
              </div>
              <div className="big-l">
                {t.figures.countries.l}
              </div>
            </div>
            {' '}
            <div>
              <div className="big">
                <span className="in" style={{ animationDelay: '0.4s' }}>
                  {t.figures.catalogue.v}
                </span>
                <span className="sfx in" style={{ animationDelay: '0.48s' }}>
                  {t.plus}
                </span>
              </div>
              <div className="big-l">
                {t.figures.catalogue.l}
              </div>
            </div>
            {' '}
          </div>
          {' '}
        </div>
      </div>
      <div className="mob">
        <div className="wrap" style={{ paddingTop: '80px', paddingBottom: '72px' }}>
          {' '}
          <h2 className="h2">
            {t.headingMob}
          </h2>
          {' '}
          <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr', gap: '36px' }}>
            {' '}
            <div>
              <div className="big">
                <span className="in" style={{ animationDelay: '0.1s' }}>
                  {t.figures.checks.v}
                </span>
                <span className="sfx in" style={{ animationDelay: '0.18s' }}>
                  {t.plus}
                </span>
              </div>
              <div className="big-l">
                {t.figures.checks.l}
              </div>
            </div>
            {' '}
            <div>
              <div className="big">
                <span className="in" style={{ animationDelay: '0.2s' }}>
                  {t.figures.clients.v}
                </span>
                <span className="sfx in" style={{ animationDelay: '0.28s' }}>
                  {t.plus}
                </span>
              </div>
              <div className="big-l">
                {t.figures.clients.l}
              </div>
            </div>
            {' '}
            <div>
              <div className="big">
                <span className="in" style={{ animationDelay: '0.3s' }}>
                  {t.figures.countries.v}
                </span>
                <span className="sfx in" style={{ animationDelay: '0.38s' }}>
                  {t.plus}
                </span>
              </div>
              <div className="big-l">
                {t.figures.countries.l}
              </div>
            </div>
            {' '}
            <div>
              <div className="big">
                <span className="in" style={{ animationDelay: '0.4s' }}>
                  {t.figures.catalogue.v}
                </span>
                <span className="sfx in" style={{ animationDelay: '0.48s' }}>
                  {t.plus}
                </span>
              </div>
              <div className="big-l">
                {t.figures.catalogue.l}
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
