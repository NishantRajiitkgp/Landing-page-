/** The `/technology` AI pillars as a scroll story: the three steps run down
    a rail on one side while a sticky stage on the other draws the active
    pillar. On a phone the stage pins above the steps. */
import type { ReactNode } from "react";
import "@/app/v2/tech.css";
import { CaptureArt } from "./TechCaptureArt";
import { ResearchArt } from "./TechResearchArt";
import { RouteArt } from "./TechRouteArt";
import type { TechArt } from "./TechPillarKit";
import { TechPillarsStage } from "./TechPillarsStage";

/** One board per step, in step order; each draws its own labels from `l`. */
const BOARDS: ((p: { l: TechArt }) => ReactNode)[] = [CaptureArt, ResearchArt, RouteArt];

export function TechPillars({
  h,
  sub,
  cards,
  art,
}: {
  h: string;
  sub: string;
  cards: { t: string; p: string }[];
  art: TechArt;
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
          {BOARDS.map((Board, i) => (
            <div key={i} className={`tk-vis tk-v${i + 1}`}>
              <Board l={art} />
            </div>
          ))}
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
