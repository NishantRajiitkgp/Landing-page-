/** The `/technology` AI pillars as one scroll story. A tall runway pins a
    frame: the active step's copy above, and below it a track of three
    cards on one red thread. Scrolling plays one applicant's case through
    them in order (onboarded, researched, routed abroad) and pans the track
    from card to card as the case travels the thread between them. The
    scroll logic is `./TechPillarsStage`; each card draws its own step. */
import "@/app/v2/tech.css";
import { OnboardCard } from "./TechStoryOnboard";
import { ResearchCard } from "./TechStoryResearch";
import { RouteCard } from "./TechStoryRoute";
import type { TechArt } from "./TechPillarKit";
import { TechPillarsStage } from "./TechPillarsStage";

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
  const s = art.story;
  const keep = "Global Workforce & Business";
  const head = h.startsWith(keep) ? (
    <>
      <span className="tk-pil-keep">{keep}</span>
      {h.slice(keep.length)}
    </>
  ) : (
    h
  );
  return (
    <TechPillarsStage>
      <div className="wrap">
        <div className="sec-head tk-head">
          <h2 className="h2 tk-rv">{head}</h2>
          <p className="lede tk-rv tk-rv2">{sub}</p>
        </div>
      </div>

      <div className="tk-sy-run">
        <div className="tk-sy-pin">
          <ol className="wrap tk-sy-steps">
            {cards.map((c, i) => (
              <li key={c.t} className="tk-sy-step">
                <span className="tk-sy-step-n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{c.t}</h3>
                <p>{c.p}</p>
              </li>
            ))}
          </ol>

          <div className="tk-sy-stage" aria-hidden="true">
            <div className="tk-sy-track">
              <div className="tk-sy-lead">
                <i className="tk-sy-dot" />
              </div>
              <div className="tk-sy-card">
                <OnboardCard s={s} ready={art.ready} manual={art.manual} />
              </div>
              <div className="tk-sy-gap">
                <i className="tk-sy-dot" />
              </div>
              <div className="tk-sy-card">
                <ResearchCard s={s} />
              </div>
              <div className="tk-sy-gap">
                <i className="tk-sy-dot" />
              </div>
              <div className="tk-sy-card">
                <RouteCard s={s} />
              </div>
              <div className="tk-sy-lead tk-sy-out">
                <i className="tk-sy-dot" />
              </div>
            </div>
          </div>

          <div className="tk-sy-bar" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
    </TechPillarsStage>
  );
}
