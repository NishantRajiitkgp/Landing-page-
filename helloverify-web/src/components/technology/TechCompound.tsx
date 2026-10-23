/** "A platform that gets stronger with every verification" on `/technology`,
    as one scroll story. A tall runway pins the three claims beside a scene
    (`./TechGrowBoard`) that runs out to the edge of the page: scrolling
    builds the claims up one by one while the scene plays each in turn, and
    the headline lands last, as their sum. It leads the markup, so it still
    heads the section when read out. The canvas behind spans the whole
    frame, for the field of act three. The scroll is `./TechCompoundStage`. */
import type { ReactNode } from "react";
import "@/app/v2/tech.css";
import type { PlatformCopy } from "@/lib/copy/platform";
import type { TechArt } from "./TechPillarKit";
import { TechCompoundStage } from "./TechCompoundStage";
import { TechGrowBoard } from "./TechGrowBoard";

export function TechCompound({
  h,
  cards,
  grow,
  art,
}: {
  h: ReactNode;
  cards: { t: string; p: string }[];
  grow: PlatformCopy["technology"]["compound"]["grow"];
  art: TechArt;
}) {
  return (
    <TechCompoundStage>
      <div className="tk-cx-run">
        <div className="wrap tk-cx-pin">
          <canvas className="tk-cx-cv" aria-hidden="true" />
          <div className="tk-cx-copy">
            <h2 className="h2 tk-cx-end">{h}</h2>
            <ol className="tk-cx-steps">
              {cards.map((c, i) => (
                <li key={c.t} className="tk-cx-step">
                  <span className="tk-cx-n" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>{c.t}</h3>
                  <div className="tk-cx-p">
                    <p>{c.p}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <TechGrowBoard g={grow} art={art} />
        </div>
      </div>
    </TechCompoundStage>
  );
}
