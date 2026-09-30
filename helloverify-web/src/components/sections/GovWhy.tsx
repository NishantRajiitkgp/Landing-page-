/** Why governments, authorities and large enterprises work with HelloVerify.

    The band after the seals (29 Sep 2026): the old site's six-card grid of
    reasons, rebuilt as a light sheet of six engraved plates — a still
    rosette behind, a 1px-gapped grid whose hairlines catch a green light
    that follows the pointer (`./GovWhyStage`), and on every plate a drawing
    of its reason that loops (`./GovWhyArt`) under a "Pause motion" control.
    It closes on the certifications and the ask. (Built dark first; made
    light on review, to sit in the page's paper.)

    Server-rendered throughout except the stage; every figure and sentence
    is `sections.govWhy` (see its header for where each came from). */
import { Arrow } from "@/components/brand/Arrow";
import { AppLink } from "@/components/chrome/AppLink";
import { copy } from "@/lib/copy/request";
import { SECTIONS, type GovWhyId } from "@/lib/copy/sections";
import "@/app/v2/govwhy.css";
import { ArtGovs, ArtPlatform, ArtReport, ArtScale, ArtTimeline, ArtTrust } from "./GovWhyArt";
import { SEALS } from "./GovSeals";
import { GovWhyStage } from "./GovWhyStage";

/** Each mark's own pixel size (`public/img/`), so it renders at its true
 *  proportions and is never stretched. */
const MARK_SIZE: Record<string, [number, number]> = {
  "/img/mom.jpg": [240, 240],
  "/img/latvia-coat-of-arms.png": [197, 158],
  "/img/italy-emblem.png": [180, 200],
  "/img/mohesr-emblem.png": [220, 264],
};

/** Plate order: the old site's grid, read left to right, top to bottom. */
const ORDER: readonly GovWhyId[] = ["trust", "psv", "platform", "govs", "longTerm", "evidence"];

export async function GovWhy() {
  const all = await copy(SECTIONS);
  const t = all.govWhy;
  const v = t.viz;
  const art: Record<GovWhyId, React.ReactNode> = {
    trust: <ArtTrust t={v.trust} />,
    psv: <ArtScale s={v.scale} />,
    platform: <ArtPlatform core={v.core} nodes={v.nodes} />,
    govs: <ArtGovs govs={SEALS.map((s) => ({ name: all.govSeals.items[s.id].name, logo: s.logo, w: MARK_SIZE[s.logo][0], h: MARK_SIZE[s.logo][1] }))} />,
    longTerm: <ArtTimeline since={v.since} today={v.today} ahead={v.ahead} />,
    evidence: <ArtReport r={v.report} stamp={v.stamp} proofs={v.proofs} />,
  };

  return (
    <section className="gw" aria-labelledby="gw-h">
      <div className="wrap gw-in">
        <div className="gw-mast">
          <span className="gw-k">{t.kicker}</span>
          <i aria-hidden="true" />
          <span className="gw-k gw-k-end">{t.kickerEnd}</span>
        </div>
        <h2 className="gw-h" id="gw-h">
          {t.headingA} <em>{t.headingB}</em>
        </h2>
        <GovWhyStage pauseLabel={all.hero.motion.pause} playLabel={all.hero.motion.play}>
          {ORDER.map((id, i) => (
            <article key={id} className="gw-plate">
              <div className="gw-viz">{art[id]}</div>
              <span className="gw-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="gw-t">{t.items[id].t}</h3>
              <p className="gw-p">{t.items[id].p}</p>
            </article>
          ))}
        </GovWhyStage>
        <div className="gw-foot">
          <span className="gw-certs">{t.certs}</span>
          <AppLink href="/contact" className="gw-cta">
            <span>{t.cta}</span>
            <Arrow />
          </AppLink>
        </div>
      </div>
    </section>
  );
}
