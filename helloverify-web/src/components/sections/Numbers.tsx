/** Built on trust. Proven by numbers.

    Desktop is homepage v2 (the canvas "Proof" sheet, Sep 2026): a 212px
    odometer that rolls to 20,000,000 and rolls again when clicked, a live
    pace strip, and three cards that each draw their figure — a grid of
    marks for the clients, a dial of ticks for the countries, a barcode for
    the checks. Hand-ported; the shell is `./NumbersStage`, the pace strip
    `./NumbersPace`, the two computed pictures `./NumbersArt`.

    The phone keeps the generated `.mob` tree: the v2 board has no 390px
    artboard. */
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
import "@/app/v2/numbers.css";
import { NumbersBarcode, NumbersDial } from "./NumbersArt";
import { NumbersPace } from "./NumbersPace";
import { NumbersStage } from "./NumbersStage";

/** One odometer column per digit. Each strip holds 0-9 four times (drawn by
 *  CSS, see `numbers.css`) and rolls to the digit's fourth pass, `30 + d`,
 *  so every column spins three full turns first; durations and delays step
 *  per column so the digits land left to right, as on the board. Anything
 *  that is not a digit (the group separator) is printed as it is. */
function Odometer({ value }: { value: string }) {
  let di = 0;
  return [...value].map((ch, i) => {
    if (!/[0-9]/.test(ch)) return <span key={i} className="nm-comma">{ch}</span>;
    const n = di++;
    const vars = { "--to": 30 + Number(ch), "--dur": `${(2.1 + n * 0.16).toFixed(2)}s`, "--del": `${(0.15 + n * 0.05).toFixed(2)}s` };
    return (
      <span key={i} className="nm-col">
        <span className="nm-strip" style={vars as React.CSSProperties} />
      </span>
    );
  });
}

export async function Numbers() {
  const sections = await copy(SECTIONS);
  const t = sections.numbers;
  const f = t.figures;

  return (
    <>
      <div className="dsk">
        <NumbersStage>
          <div className="nm-mast">
            <span className="k">{t.kicker}</span>
            <span className="nm-sheet">{t.sheet}</span>
          </div>
          <div className="sec-head nm-head">
            <h2 className="h2">
              {t.headingA}
              <br />
              <em className="nm-it">{t.headingB}</em>
            </h2>
            <p className="lede nm-lede">{t.lede}</p>
          </div>
          <div className="nm-hero" data-nm-go="">
            <button type="button" className="nm-odo-btn" aria-label={t.recount}>
              <span className="nm-odo nm-odoA" aria-hidden="true">
                <Odometer value={t.odometer} />
                <span className="nm-plus">{t.plus}</span>
              </span>
            </button>
            <span className="nm-sr">{`${t.odometer}${t.plus}`}</span>
            <p className="nm-hero-cap">{f.checks.l}</p>
          </div>
          <NumbersPace lead={t.pace.lead} note={t.pace.note} pauseLabel={sections.hero.motion.pause} playLabel={sections.hero.motion.play} />
          <div className="nm-cards" data-nm-go="">
            <div className="nm-card">
              <div className="nm-viz">
                {/* 50 x 40 marks, one per client: two tiled patterns, the ink
                    one wiped in over the paper one. A few hundred bytes as
                    SVG, so it stays in the server tree. */}
                <svg className="nm-grid" viewBox="0 0 250 200" aria-hidden="true" focusable="false">
                  <defs>
                    <pattern id="nm-sq" width="5" height="5" patternUnits="userSpaceOnUse">
                      <rect width="2.6" height="2.6" rx="0.5" fill="#E3DED3" />
                    </pattern>
                    <pattern id="nm-sq-on" width="5" height="5" patternUnits="userSpaceOnUse">
                      <rect width="2.6" height="2.6" rx="0.5" fill="#3D3B35" />
                    </pattern>
                  </defs>
                  <rect width="250" height="200" fill="url(#nm-sq)" />
                  <rect width="250" height="200" fill="url(#nm-sq-on)" className="nm-grid-on" />
                </svg>
              </div>
              <div className="nm-n"><span>{f.clients.v}</span><i>{t.plus}</i></div>
              <p className="nm-cap">{f.clients.l}</p>
              <div className="nm-foot"><span className="nm-key nm-key-ink" />{t.keys.clients}</div>
            </div>
            <div className="nm-card">
              <div className="nm-viz">
                <NumbersDial a={t.dial.a} b={t.dial.b} />
              </div>
              <div className="nm-n"><span>{f.countries.v}</span><i>{t.plus}</i></div>
              <p className="nm-cap">{f.countries.l}</p>
              <div className="nm-foot"><span className="nm-key nm-key-green" />{t.keys.countries}</div>
            </div>
            <div className="nm-card">
              <div className="nm-viz nm-viz-code">
                <NumbersBarcode />
                <div className="nm-code-k">
                  <span><i className="nm-key nm-key-green" />{t.code.fast}</span>
                  <span>{t.code.slow}</span>
                </div>
              </div>
              <div className="nm-n"><span>{f.catalogue.v}</span><i>{t.plus}</i></div>
              <p className="nm-cap">{f.catalogue.l}</p>
              <div className="nm-foot"><span className="nm-key nm-key-bar" />{t.keys.catalogue}</div>
            </div>
          </div>
        </NumbersStage>
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
