/** Hero - Trust Infrastructure platform for Instant AI-Powered Background Checks.

    Homepage v2 (the canvas "security print" hero, Sep 2026), at every width:
    a turning guilloche, a UV lamp that follows the pointer and reveals a
    green print and paper fibres, a microtext frame, a stamp that lands beside
    "Checks." and replays on click. Hand-ported, not generated (see the header
    of `app/v2/hero.css`); the interactive shell is `./HeroStage`. Under the
    buttons, `./HeroLedger` rolls in the Numbers band's four figures and
    keeps the checks count running.

    One tree since the phone pass: the generated `.mob` tree (a plain
    headline and two stacked buttons) is gone, and `hero.css` re-lays the
    same markup out below 1081px with the content in flow. On
    a touch screen the lamp rests lit and a tap moves it. */
import { YCBadge } from "@/components/brand/YCBadge";
// The ghost button's arrow is the shared `brand/Arrow.tsx` — an inline copy
// is the template the next one gets pasted from (§4 rule 2, §17 cond. 22).
import { Arrow } from "@/components/brand/Arrow";
import { AppLink } from "@/components/chrome/AppLink";
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
// Homepage v2 styles are one sheet per section in `app/v2/`, imported by the
// section itself so only the routes that render it download it. Measured when
// this sheet sat in `globals.css`: `/en/about` went to 16.1 KB of CSS against
// the 16 KB ceiling for a hero it never renders.
import "@/app/v2/hero.css";
import { HeroLedger } from "./HeroLedger";
import { HeroPrint } from "./HeroPrint";
import { HeroStage } from "./HeroStage";

function Reg({ at }: { at: "tl" | "tr" | "bl" | "br" }) {
  return (
    <svg className={`hv-reg hv-reg-${at}`} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="4.5" fill="none" stroke="#C9C3B6" strokeWidth="0.8" />
      <path d="M8 0v16M0 8h16" stroke="#C9C3B6" strokeWidth="0.8" />
    </svg>
  );
}

export async function Hero() {
  const sections = await copy(SECTIONS);
  const t = sections.hero;
  // The ledger prints the Numbers band's figures, not copies of them.
  const nm = sections.numbers;
  // Tiled microtext; each repeat ends in "·", so a space rejoins them.
  const micro = `${t.microtext} `.repeat(6);

  return (
    <HeroStage pauseLabel={t.motion.pause} playLabel={t.motion.play}>
      <HeroPrint uvRing={`${t.uvRing} `.repeat(9).slice(0, 350)} />
      <div className="hv-frame" aria-hidden="true">
        <div className="hv-mt hv-mt-top"><div className="hv-mt-in">{micro}</div></div>
        <div className="hv-mt hv-mt-bot"><div className="hv-mt-in hv-mt-rev">{micro}</div></div>
        <div className="hv-frame-in" />
        <Reg at="tl" /><Reg at="tr" /><Reg at="bl" /><Reg at="br" />
      </div>
      <div className="hv-note hv-note-tl" aria-hidden="true">{t.notes.sheet}</div>
      <div className="hv-note hv-note-tr" aria-hidden="true">{t.notes.series}</div>
      <div className="hv-note hv-note-bl" aria-hidden="true"><span className="hv-uvdot" />{t.notes.uv}</div>

      <div className="hv-content">
        {/* The pill is a `<span>`, not a link: there is no verified URL to
            give it (the reasoning is in git history of this file). */}
        <span className="rise d1 hv-pill">
          <span>{t.backedBy}</span>
          <YCBadge width={103} height={20} />
        </span>
        <h1 className="serif hv-h1">
          <span className="hv-l hv-l1">
            {t.headlineLead}{" "}
            <span className="hv-src">
              {t.headlineMark}
              <svg className="hv-ul" viewBox="0 0 400 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                <path d="M3 13 C 110 8, 250 17, 397 10" pathLength="1" />
              </svg>
            </span>
          </span>
          <span className="hv-l hv-l2">
            <em className="hv-em">
              {t.headlineEm}{" "}
              <span className="hv-em-end">
                {t.headlineEmEnd}
                <button type="button" className="hv-seal-btn hv-stampA" aria-label={t.seal.replay}>
                  <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false">
                    <defs>
                      <filter id="hv-ink" x="-10%" y="-10%" width="120%" height="120%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={4} result="n" />
                        <feDisplacementMap in="SourceGraphic" in2="n" scale={2} xChannelSelector="R" yChannelSelector="G" result="d" />
                        <feTurbulence type="fractalNoise" baseFrequency="0.22" numOctaves={3} seed={9} result="n2" />
                        <feColorMatrix in="n2" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.6 2.45" result="holes" />
                        <feComposite in="d" in2="holes" operator="in" />
                      </filter>
                      <path id="hv-seal-arc" d="M100 100 m-71 0 a71 71 0 1 1 142 0 a71 71 0 1 1 -142 0" />
                    </defs>
                    <circle className="hv-shock" cx="100" cy="100" r="88" fill="none" stroke="#1B6B4A" strokeWidth="2" />
                    <g className="hv-seal" filter="url(#hv-ink)" fill="none" stroke="#1B6B4A">
                      <circle cx="100" cy="100" r="92" strokeWidth="3.4" />
                      <circle cx="100" cy="100" r="85" strokeWidth="1.2" />
                      <circle cx="100" cy="100" r="57" strokeWidth="1.2" />
                      <text fill="#1B6B4A" stroke="none" fontFamily="geistMono, SF Mono, Menlo, monospace" fontSize="11.2" fontWeight="500" letterSpacing="1.4">
                        <textPath href="#hv-seal-arc" textLength="440" lengthAdjust="spacing">{`${t.seal.ring} `}</textPath>
                      </text>
                      <path d="M75 92 l16 16 l34 -35" strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" />
                      <text x="100" y="134" textAnchor="middle" fill="#1B6B4A" stroke="none" fontFamily="newsreader, Georgia, serif" fontStyle="italic" fontSize="21">{t.seal.word}</text>
                    </g>
                  </svg>
                </button>
              </span>
            </em>
          </span>
        </h1>
        <p className="rise d3 hv-lede">{t.lede}</p>
        <div className="rise d4 hv-ctas">
          <AppLink href="/contact" className="btn btn-ink">{t.cta}</AppLink>
          <AppLink href="/resources/checks" className="btn btn-ghost">
            <span>{t.checks}</span>
            <Arrow />
          </AppLink>
        </div>
        <div className="rise d6 hv-lg-wrap">
          <HeroLedger
            checks={nm.odometer}
            plus={nm.plus}
            live={t.ledger.live}
            checksLabel={t.ledger.checks}
            cells={[
              { k: "clients", v: nm.figures.clients.v, l: t.ledger.clients },
              { k: "countries", v: nm.figures.countries.v, l: t.ledger.countries },
              { k: "catalogue", v: nm.figures.catalogue.v, l: t.ledger.catalogue },
            ]}
          />
        </div>
      </div>
    </HeroStage>
  );
}
