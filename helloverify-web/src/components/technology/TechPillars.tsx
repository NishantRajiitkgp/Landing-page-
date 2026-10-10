/** The `/technology` AI pillars as a scroll story: the three steps run down
    a rail on one side while a sticky stage on the other draws the active
    pillar (`./TechPillarArt`). On a phone the stage pins above the steps. */
import "@/app/v2/tech.css";
import { CaptureArt, ResearchArt } from "./TechPillarArt";
import { RouteArt } from "./TechRouteArt";
import { TechPillarsStage } from "./TechPillarsStage";

export function TechPillars({
  h,
  sub,
  cards,
}: {
  h: string;
  sub: string;
  cards: { t: string; p: string }[];
}) {
  return (
    <TechPillarsStage>
      <div className="sec-head tk-head">
        <h2 className="h2 tk-rv">{h}</h2>
        <p className="lede tk-rv tk-rv2">{sub}</p>
      </div>

      <div className="tk-pil-grid">
        <div className="tk-stage" aria-hidden="true">
          <div className="tk-stage-top">
            <span className="tk-stage-n">
              <b>01</b>
              <b>02</b>
              <b>03</b>
            </span>
            <span className="tk-stage-of">/ 03</span>
          </div>
          <div className="tk-vis tk-v1"><CaptureArt /></div>
          <div className="tk-vis tk-v2"><ResearchArt /></div>
          <div className="tk-vis tk-v3"><RouteArt /></div>
          <div className="tk-stage-bar">
            <i />
            <i />
            <i />
          </div>
        </div>

        <ol className="tk-steps">
          {cards.map((c, i) => (
            <li key={c.t} className="tk-step">
              <span className="tk-step-n">{String(i + 1).padStart(2, "0")}</span>
              <h3>{c.t}</h3>
              <p>{c.p}</p>
            </li>
          ))}
        </ol>
      </div>
    </TechPillarsStage>
  );
}
