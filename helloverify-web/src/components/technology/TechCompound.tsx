/** "A platform that gets stronger with every verification" on `/technology`.
    The headline's claim is proved by a race (`./TechRace`): a static system
    and HelloVerify run the same cases on one clock, and only one of them
    gets faster, and safer, with each. The three claims sit under it and
    light as the race reaches the moment each one describes. */
import type { CSSProperties, ReactNode } from "react";
import "@/app/v2/tech.css";
import type { PlatformCopy } from "@/lib/copy/platform";
import { TechCompoundStage } from "./TechCompoundStage";
import { TechRace } from "./TechRace";

export function TechCompound({
  h,
  sub,
  cards,
  race,
}: {
  h: ReactNode;
  sub: string;
  cards: { t: string; p: string }[];
  race: PlatformCopy["technology"]["compound"]["race"];
}) {
  return (
    <TechCompoundStage>
      <div className="sec-head tk-head">
        <h2 className="h2 tk-rv tk-cmp-h">{h}</h2>
        <p className="lede tk-rv tk-rv2">{sub}</p>
      </div>

      <TechRace r={race} />

      <ol className="tk-cmp-list tk-rc-claims">
        {cards.map((c, i) => (
          <li key={c.t} className="tk-cmp-c" data-k={`c${i}`} style={{ "--d": `${(0.2 + i * 0.12).toFixed(2)}s` } as CSSProperties}>
            <span className="tk-cmp-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3>{c.t}</h3>
              <p>{c.p}</p>
            </div>
          </li>
        ))}
      </ol>
    </TechCompoundStage>
  );
}
