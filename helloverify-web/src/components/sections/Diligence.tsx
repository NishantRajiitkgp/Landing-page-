/** Business due diligence - two Certifier products, each running a risk scan.

    Homepage v2, desktop only (the Business board, Sep 2026). New on the
    homepage, so there is no `.mob` tree to keep; the phone gets its own part.

    Each card loops a 10 s scan in pure CSS (`app/v2/diligence.css`): the four
    check tiles go orb → tick one after another, the gauge needle climbs from
    red to green, "Scanning…" gives way to "Low risk", and the "Certified
    vendor profile" stamp lands on the photograph. The second card runs 1.4 s
    behind the first so the two never tick in step. A loop that long needs a
    pause (WCAG 2.2.2), so the band sits in a `MotionStage` whose paused class
    sets `animation-play-state: paused`; reduced motion shows the finished
    state (every tick, needle at green, stamp down) instead of the loop.

    Server-rendered throughout; the pause button is the only client code. */
import Image from "next/image";

import { Arrow } from "@/components/brand/Arrow";
import { AppLink } from "@/components/chrome/AppLink";
import { SIZES_PATH_SPAN3, tint } from "@/lib/img";
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
import "@/app/v2/diligence.css";
import { MotionButton, MotionStage } from "./BizMotion";

type CardId = "trade" | "vendor";

/** Photograph and focal point per card. Each card is (1440 − 2×120 − 32) / 2
 *  = 584 px wide at 1440, 40.6vw, which is exactly `SIZES_PATH_SPAN3`'s
 *  41vw — reused rather than declaring the same string again. */
const CARDS: { id: CardId; src: string; pos: string }[] = [
  { id: "trade", src: "/img/v2/dd-trade.jpg", pos: "50% 30%" },
  { id: "vendor", src: "/img/v2/dd-vendor.jpg", pos: "55% 40%" },
];

/** The gauge's 21 ticks on a 180° arc (r 50, every fifth one longer),
 *  computed once at module load. */
const TICKS = Array.from({ length: 21 }, (_, k) => {
  const a = Math.PI + (k / 20) * Math.PI;
  const r2 = k % 5 === 0 ? 43 : 46;
  const f = (v: number) => v.toFixed(1);
  return { x1: f(70 + 50 * Math.cos(a)), y1: f(66 + 50 * Math.sin(a)), x2: f(70 + r2 * Math.cos(a)), y2: f(66 + r2 * Math.sin(a)) };
});

function Gauge({ i }: { i: number }) {
  return (
    <svg className="dd-gauge" viewBox="0 0 140 80" aria-hidden="true" focusable="false">
      <defs>
        {/* Risk colours: red, amber, the brand green. Artwork literals — the
            gauge's scale, not UI colour (the flag/wordmark exemption). */}
        <linearGradient id={`ddg${i}`} x1="0" x2="1">
          <stop offset="0" stopColor="#D9534A" />
          <stop offset=".5" stopColor="#E3A33B" />
          <stop offset="1" stopColor="#1B6B4A" />
        </linearGradient>
      </defs>
      <path d="M14 66 A56 56 0 0 1 126 66" fill="none" stroke={`url(#ddg${i})`} strokeWidth="7" strokeLinecap="round" />
      <g className="dd-gt">
        {TICKS.map((t) => (
          <line key={`${t.x1},${t.y1}`} {...t} />
        ))}
      </g>
      <g className="dd-needle">
        <line x1="70" y1="66" x2="70" y2="24" />
        <circle cx="70" cy="66" r="6" />
      </g>
    </svg>
  );
}

function Stamp({ i, ring }: { i: number; ring: string }) {
  return (
    <svg className="dd-stamp" viewBox="0 0 160 160" aria-hidden="true" focusable="false">
      <defs>
        <path id={`dds${i}`} d="M80 80 m-56 0 a56 56 0 1 1 112 0 a56 56 0 1 1 -112 0" />
      </defs>
      <circle className="dd-stamp-bg" cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="2.6" />
      <circle cx="80" cy="80" r="65" fill="none" stroke="currentColor" strokeWidth="1" />
      <text fontFamily="geistMono, SF Mono, Menlo, monospace" fontSize="10.6" letterSpacing="2" fill="currentColor">
        <textPath href={`#dds${i}`} textLength="344" lengthAdjust="spacing">{`${ring} `}</textPath>
      </text>
      <path d="M58 82l14 14 30-33" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const OK = (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3.6 8.4l2.9 2.9 5.9-6.6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export async function Diligence() {
  const t = (await copy(SECTIONS)).diligence;
  const motion = (await copy(SECTIONS)).hero.motion;

  return (
    <div className="dsk">
      <MotionStage className="wrap hair-top dd" pausedClassName="dd-paused">
        <div className="dd-mast">
          <span className="k">{t.kicker}</span>
          <span className="dd-mast-r">
            <MotionButton className="dd-motion" pauseLabel={motion.pause} playLabel={motion.play} />
            <span className="dd-sheet">{t.sheet}</span>
          </span>
        </div>
        <div className="sec-head dd-head">
          <h2 className="h2 dd-h2">
            {t.headingA} <em className="dd-it">{t.headingB}</em>
          </h2>
          <p className="lede dd-lede">{t.lede}</p>
        </div>
        <div className="dd-row">
          {CARDS.map((c, i) => {
            const card = t.cards[c.id];
            return (
              <article key={c.id} className={`dd-card dd-c${i}`}>
                <div className="dd-ph" style={{ background: tint(c.src) }}>
                  <Image className="dd-img" src={c.src} alt="" fill sizes={SIZES_PATH_SPAN3} style={{ objectPosition: c.pos }} />
                  <div className="dd-scrim" />
                  <span className="dd-chip">{t.chip}</span>
                  <div className="dd-sw">
                    <Stamp i={i} ring={t.stamp} />
                  </div>
                  <div className="dd-cap">
                    <span>{card.when}</span>
                    <h3>{card.t}</h3>
                  </div>
                </div>
                <div className="dd-body">
                  <p className="dd-p">{card.p}</p>
                  <div className="dd-scan">
                    <div className="dd-ckk">{t.included}</div>
                    <div className="dd-grid">
                      {Object.entries(card.checks).map(([k, v], j) => (
                        <div key={k} className={`dd-ck dd-ck${j}`}>
                          <span className="dd-orb" aria-hidden="true">
                            <span className="dd-spin" />
                            <span className="dd-ok">{OK}</span>
                          </span>
                          <span>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="dd-meter" aria-hidden="true">
                      <Gauge i={i} />
                      <div className="dd-ml">
                        <span className="dd-m1">{t.scanning}</span>
                        <span className="dd-m2">{t.low}</span>
                      </div>
                    </div>
                  </div>
                  <div className="dd-foot">
                    <div className="dd-eta">
                      <b>{t.eta}</b>
                      <span>{t.etaLabel}</span>
                    </div>
                    <AppLink href="/business/certifier" className="dd-more">
                      {t.explore} <Arrow size="14" />
                    </AppLink>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </MotionStage>
    </div>
  );
}
