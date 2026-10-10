/** Why governments, authorities and large enterprises work with HelloVerify.

    The band after the seals (29 Sep 2026): the old site's six-card grid of
    reasons, rebuilt as a light sheet of six engraved plates — a still
    rosette behind, a 1px-gapped grid whose hairlines catch a green light
    that follows the pointer (`./GovWhyStage`), and on every plate a drawing
    of its reason that loops (`./GovWhyArt`, `./GovWhyTrust`, `./GovWhyScale`)
    under a "Pause motion" control. The six plates are one film, left to
    right, top to bottom: 01 lays the layer under a nation; 02 is the first
    door of that layer, asking the source anywhere in the world, at scale;
    03 is every party on the one platform; 04 is who already trusts it —
    the authorities and enterprises, region by region; 05 is the years settling
    into the rock under it, and then not stopping; 06 is that answer
    coming back up as one stamped report. It closes on
    the ask. (Built dark first; made
    light on review, to sit in the page's paper.)

    Server-rendered throughout except the stage; every figure and sentence
    is `sections.govWhy` (see its header for where each came from).
 */
import { Arrow } from "@/components/brand/Arrow";
import { AppLink } from "@/components/chrome/AppLink";
import { copy } from "@/lib/copy/request";
import { SECTIONS, type GovWhyId } from "@/lib/copy/sections";
import "@/app/v2/govwhy.css";
import { ArtGovs } from "./GovWhyGovs";
import { ArtReport } from "./GovWhyReport";
import { ArtPlatform } from "./GovWhyPlatform";
import { ArtScale } from "./GovWhyScale";
import { GovWhyStage } from "./GovWhyStage";
import { ArtTrust } from "./GovWhyTrust";
import { ArtYears } from "./GovWhyYears";

/** Plate order: the old site's grid, read left to right, top to bottom. */
const ORDER: readonly GovWhyId[] = ["trust", "psv", "platform", "govs", "longTerm", "evidence"];
/** The plates rebuilt as chapters of the one cross-section story
 *  (`./GovWhyTrust`), drawn edge to edge in their frame. */
const FULL: ReadonlySet<GovWhyId> = new Set(["trust", "psv", "platform", "govs", "longTerm", "evidence"]);

export async function GovWhy() {
  const all = await copy(SECTIONS);
  const t = all.govWhy;
  const v = t.viz;
  const art: Record<GovWhyId, React.ReactNode> = {
    trust: <ArtTrust t={v.trust} />,
    psv: <ArtScale s={v.scale} layer={v.trust.layer} />,
    platform: <ArtPlatform core={v.core} eco={v.eco} />,
    govs: <ArtGovs layer={v.trust.layer} g={v.govs} />,
    longTerm: <ArtYears since={v.since} today={v.today} ahead={v.ahead} big={v.scale.big} layer={v.trust.layer} />,
    evidence: <ArtReport report={v.report} stamp={v.stamp} proofs={v.proofs} layer={v.trust.layer} />,
  };

  return (
    <section className="gw" aria-labelledby="gw-h">
      <div className="wrap gw-in">
        <h2 className="gw-h" id="gw-h">
          {t.headingA} <em>{t.headingB}</em>
        </h2>
        <GovWhyStage pauseLabel={all.hero.motion.pause} playLabel={all.hero.motion.play}>
          {ORDER.map((id, i) => (
            <article key={id} className="gw-plate">
              <div className={FULL.has(id) ? "gw-viz gw-viz-full" : "gw-viz"}>{art[id]}</div>
              <span className="gw-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="gw-t">{t.items[id].t}</h3>
              <p className="gw-p">{t.items[id].p}</p>
            </article>
          ))}
        </GovWhyStage>
        <div className="gw-foot">
          <AppLink href="/contact" className="gw-cta">
            <span>{t.cta}</span>
            <Arrow />
          </AppLink>
        </div>
      </div>
    </section>
  );
}
