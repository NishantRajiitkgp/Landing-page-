/** Trust Technology Platform — "Most verification systems are static. Ours
    compound." Homepage v2, the canvas's "Sheet 10 / 12" (Desktop4, generated
    by `assemble_plat.py` then `assemble_graph.py`). New on the homepage; it
    replaces no older section.

    Five bands: the live network with its rewind slider (`./TrustNetwork`,
    a canvas island) beside the compounding flywheel; three engine cards; a
    marquee of the domains trust moves through; and the belief statement.
    Everything but the canvas, the slider and the pause control is server
    markup (`./TrustPlatformStage` holds the pause state).

    One tree at every width (the v2 phone pass, Sep 2026): on the phone the
    bands stack and the network scales with its card (`platform.css`). */
import { Logo } from "@/components/brand/Logo";
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
// One sheet per v2 section, imported here so only the homepage downloads it
// (the reasoning and the measurement are in `sections/Hero.tsx`).
import "@/app/v2/platform.css";
import { TrustNetwork } from "./TrustNetwork";
import { TrustPlatformStage } from "./TrustPlatformStage";

type WordId = "trust" | "verifications" | "intelligence" | "institutions" | "customers" | "ecosystem";
/** Clockwise from twelve o'clock, 60° apart — the board's order. */
const WORDS: WordId[] = ["trust", "verifications", "intelligence", "institutions", "customers", "ecosystem"];
const FLY = ["intelligence", "network", "ecosystem"] as const;
const DOMAINS = ["mobility", "business", "procurement", "compliance", "financial", "identity", "crossBorder", "credentials"] as const;

/** The three engine icons (40-unit box). The green stroke is the animated
 *  part of each — the scan line, the ping, the route — and is a literal on
 *  the SVG attribute, the exemption `hv/no-color-literal` gives artwork. */
const ENGINES = [
  {
    id: "onboarding",
    icon: (
      <>
        <rect x="9" y="6" width="22" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 14h12M14 19h12M14 24h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path className="tq-scan" d="M6 12h28" stroke="#1B6B4A" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "research",
    icon: (
      <>
        <circle cx="18" cy="18" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M25 25l8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle className="tq-ping" cx="18" cy="18" r="3" fill="#1B6B4A" />
      </>
    ),
  },
  {
    id: "workflow",
    icon: (
      <>
        <circle cx="8" cy="20" r="3.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="32" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="32" cy="30" r="3.5" stroke="currentColor" strokeWidth="1.5" />
        <path className="tq-route" d="M11.5 20C20 20 20 10 28.5 10M11.5 20C20 20 20 30 28.5 30" stroke="#1B6B4A" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
] as const;

export async function TrustPlatform() {
  const t = (await copy(SECTIONS)).trustPlatform;
  const domainRow = DOMAINS.map((id) => t.domains.items[id]);

  return (
    <TrustPlatformStage kicker={t.kicker} sheet={t.sheet} pauseLabel={t.motion.pause} playLabel={t.motion.play}>
      <div className="sec-head tq-head">
        <h2 className="h2 tq-h2">
          {t.headline}
          <br />
          <em className="tq-it">{t.headlineEm}</em>
        </h2>
        <p className="lede tq-lede">{t.lede}</p>
      </div>

      <div className="tq-row">
        <div className="tq-net">
          <div className="tq-net-top">
            <span className="tq-net-t">{t.net.title}</span>
            <span className="tq-legend">
              <i className="tq-lg-i" />{t.net.legend.institutions}
              <i className="tq-lg-c" />{t.net.legend.customers}
              <i className="tq-lg-e" />{t.net.legend.verifications}
            </span>
          </div>
          <TrustNetwork t={t.net}>
            <div className="tq-med" aria-hidden="true">
              <span className="tq-rip" />
              <span className="tq-rip tq-rip2" />
              {/* The dial's 72 ticks are two dashed circles, not 72 lines:
                  a 1-unit dash every 5° (every 30° on the inner, longer
                  ring). `pathLength="360"` makes the dash maths degrees.
                  The board's 72 `<line>`s were ~5 KB of markup, sent twice
                  (HTML and flight payload). */}
              <svg className="tq-dial" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="75.5" pathLength="360" strokeWidth="3" strokeDasharray="0.76 4.24" strokeDashoffset="0.38" />
                <circle cx="80" cy="80" r="72.5" pathLength="360" strokeWidth="3" strokeDasharray="0.79 29.21" strokeDashoffset="0.395" />
              </svg>
              <span className="tq-med-in">
                <Logo width={96} height={28} />
              </span>
            </div>
          </TrustNetwork>
        </div>

        <div className="tq-fly">
          <div className="tq-wheel" aria-hidden="true">
            <div className="tq-wheel-r" />
            <div className="tq-wheel-in">
              {WORDS.map((id, i) => (
                <span key={id} className="tq-w" style={{ "--a": `${i * 60}deg` } as React.CSSProperties}>
                  {t.wheel.words[id]}
                </span>
              ))}
            </div>
            <div className="tq-wheel-c">
              {t.wheel.lead}
              <br />
              <em>{t.wheel.em}</em>
            </div>
          </div>
          <ol className="tq-fly-list">
            {FLY.map((id, i) => (
              <li key={id} className="tq-fl">
                <span className="tq-fl-n" aria-hidden="true">{`0${i + 1}`}</span>
                <div>
                  <b>{t.fly[id].title}</b>
                  <p>{t.fly[id].body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="tq-eng">
        {ENGINES.map(({ id, icon }, i) => (
          <div key={id} className="tq-e-card">
            <div className="tq-e-top">
              <span className="tq-e-n" aria-hidden="true">{`0${i + 1}`}</span>
              <span className="tq-e-ic">
                <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">{icon}</svg>
              </span>
            </div>
            <h3>{t.engines[id].title}</h3>
            <p>{t.engines[id].body}</p>
          </div>
        ))}
      </div>

      <div className="tq-dom">
        <h3 className="tq-dom-k">{t.domains.kicker}</h3>
        {/* The list is read once; the second copy exists only so the
            marquee loops seamlessly, and is hidden from assistive tech. */}
        <div className="tq-marq">
          <div className="tq-marq-in">
            <ul className="tq-marq-set">
              {domainRow.map((d) => <li key={d} className="tq-d">{d}<i /></li>)}
            </ul>
            <ul className="tq-marq-set" aria-hidden="true">
              {domainRow.map((d) => <li key={d} className="tq-d">{d}<i /></li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="tq-belief">
        <div className="k">{t.belief.kicker}</div>
        <p className="tq-b1">{t.belief.first}</p>
        <p className="tq-b2">
          {t.belief.lead}{" "}
          <span className="tq-move">
            {t.belief.move}
            <svg className="tq-ul" viewBox="0 0 400 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <path d="M3 14 C 110 8, 250 18, 397 9" pathLength="1" />
            </svg>
          </span>
        </p>
      </div>
    </TrustPlatformStage>
  );
}
