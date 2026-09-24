/** Hero - Verified at the source, in minutes.

    Desktop is homepage v2 (the canvas "security print" hero, Sep 2026):
    a turning guilloche, a UV lamp that follows the pointer and reveals a
    green print and paper fibres, a microtext frame, a stamp that lands beside
    "in minutes." and replays on click, and six doors — one per audience —
    in place of the old text rail. Hand-ported, not generated (see the header
    of `app/v2.css`); the interactive shell is `./HeroStage`.

    The phone keeps the generated `.mob` tree for now: the v2 boards have no
    390px artboard, and a phone layout invented without one is its own part. */
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
import { HeroPrint } from "./HeroPrint";
import { HeroStage } from "./HeroStage";

type DoorId = "governments" | "enterprise" | "kyc" | "vendors" | "premium" | "consumer";

/** Each door's destination and its line icon (32-unit box, stroked from CSS).
 *  The routes are the IA's own for each audience — `lib/seo/routes.ts`. */
const DOORS: { id: DoorId; href: string; icon: React.ReactNode }[] = [
  { id: "governments", href: "/governments", icon: <path d="M5 13.5L16 7l11 6.5M7 14.5v9M12.3 14.5v9M19.7 14.5v9M25 14.5v9M4.5 26h23M6 23.5h20" /> },
  { id: "enterprise", href: "/business/enterprise", icon: <><rect x="5" y="11" width="22" height="14" rx="2.5" /><path d="M12 11V8.6c0-1 .8-1.6 1.6-1.6h4.8c.8 0 1.6.6 1.6 1.6V11M5 17h22M14 17v2h4v-2" /></> },
  { id: "kyc", href: "/business/customer-kyc", icon: <><path d="M6 11V8.5A2.5 2.5 0 0 1 8.5 6H11M21 6h2.5A2.5 2.5 0 0 1 26 8.5V11M26 21v2.5a2.5 2.5 0 0 1-2.5 2.5H21M11 26H8.5A2.5 2.5 0 0 1 6 23.5V21" /><circle cx="16" cy="14" r="3.4" /><path d="M10.5 22.5c1.2-2.6 3.2-3.8 5.5-3.8s4.3 1.2 5.5 3.8" /></> },
  { id: "vendors", href: "/business/certifier", icon: <><path d="M16 5.5l10 5v11l-10 5-10-5v-11z" /><path d="M6 10.5l10 5 10-5M16 15.5v11M11 8l10 5" /></> },
  { id: "premium", href: "/individuals/immigration", icon: <><rect x="8" y="5" width="16" height="22" rx="2" /><circle cx="16" cy="14" r="4.2" /><path d="M11.8 14h8.4M16 9.8c1.4 1.3 1.4 7.1 0 8.4M16 9.8c-1.4 1.3-1.4 7.1 0 8.4M12 22.5h8" /></> },
  { id: "consumer", href: "/individuals/hellov", icon: <><path d="M5.5 15L16 6.5 26.5 15M8.5 13v13h15V13" /><path d="M13.5 26v-6.5h5V26" /></> },
];

function Reg({ at }: { at: "tl" | "tr" | "bl" | "br" }) {
  return (
    <svg className={`hv-reg hv-reg-${at}`} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="4.5" fill="none" stroke="#C9C3B6" strokeWidth="0.8" />
      <path d="M8 0v16M0 8h16" stroke="#C9C3B6" strokeWidth="0.8" />
    </svg>
  );
}

export async function Hero() {
  const t = (await copy(SECTIONS)).hero;
  // Tiled microtext; each repeat ends in "·", so a space rejoins them.
  const micro = `${t.microtext} `.repeat(6);

  return (
    <>
      <div className="dsk">
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
                  {t.headlineEm}
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
          </div>

          <nav className="dr" aria-label={t.doors.label}>
            <div className="dr-k"><i /><span className="k">{t.doors.kicker}</span><i /></div>
            <div className="dr-row">
              <span className="dr-floor" aria-hidden="true" />
              <span className="dr-floor-go" aria-hidden="true" />
              {DOORS.map(({ id, href, icon }, i) => {
                const d = t.doors.items[id];
                return (
                  <AppLink
                    key={id}
                    href={href}
                    className="dr-d"
                    // `--i` staggers the entrance and `--pd` offsets the idle
                    // peek so one door opens at a time along the row. Custom
                    // properties, set per element: the only per-door values.
                    style={{ "--i": i, "--pd": `${(4.2 + i * 2.2).toFixed(1)}s` } as React.CSSProperties}
                    aria-label={`${d.name}: ${d.line}, ${d.time}`}
                  >
                    <span className="dr-arch">
                      <span className="dr-in">
                        <span className="dr-t">{d.time}</span>
                        <span className="dr-go"><Arrow size="14" /></span>
                      </span>
                      <span className="dr-leaf">
                        <svg className="dr-ic" viewBox="0 0 32 32" fill="none" aria-hidden="true">{icon}</svg>
                        <i className="dr-knob" />
                      </span>
                    </span>
                    <span className="dr-lab"><span className="dr-a">{d.name}</span><span className="dr-b">{d.line}</span></span>
                  </AppLink>
                );
              })}
            </div>
          </nav>
        </HeroStage>
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
