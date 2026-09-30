/** Trust Technology Platform — "Most verification systems are static. Ours
    compound." Homepage v2, the canvas's "Sheet 10 / 12" (Desktop4, generated
    by `assemble_plat.py` then `assemble_graph.py`). New on the homepage; it
    replaces no older section.

    Two bands: the live network with its rewind slider (`./TrustNetwork`,
    a canvas island) beside the compounding flywheel; and the belief
    statement. The three engine cards and the domains marquee came off on
    30 Sep 2026; their copy remains in `trustPlatform`.
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

export async function TrustPlatform() {
  const t = (await copy(SECTIONS)).trustPlatform;

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
