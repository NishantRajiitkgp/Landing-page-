/** "From verification provider to global trust platform" on `/technology`:
    the eight platform areas as a bento grid, each tile carrying a small
    scene that acts out its line (`./TechAreaArt`). Workforce mobility is the
    feature tile; verified credentials is the wide one. Scenes are decoration
    (`aria-hidden`). */
import type { CSSProperties } from "react";
import "@/app/v2/tech.css";
import { SCENES } from "./TechAreaArt";
import { TechAreasStage } from "./TechAreasStage";
import type { TechArt } from "./TechPillarKit";

const AREA_CLASS: Record<string, string> = {
  workforceMobility: "tk-tile-a",
  verifiedCredentials: "tk-tile-h",
};

const d = (s: number) => ({ "--d": `${s.toFixed(2)}s` }) as CSSProperties;

export function TechAreas({
  h,
  sub,
  areas,
}: {
  h: string;
  sub: string;
  areas: { key: string; t: string; p: string }[];
  art: TechArt;
}) {
  return (
    <TechAreasStage>
      <div className="sec-head tk-head">
        <h2 className="h2 tk-rv">{h}</h2>
        <p className="lede tk-rv tk-rv2">{sub}</p>
      </div>

      <ul className="tk-bento">
        {areas.map((a, i) => {
          const Scene = SCENES[a.key];
          return (
            <li key={a.key} className={`tk-tile ${AREA_CLASS[a.key] ?? ""}`} style={d(0.1 + i * 0.07)}>
              <div className="tk-tile-top" aria-hidden="true">
                <span className="tk-tile-n">{String(i + 1).padStart(2, "0")}</span>
              </div>
              {Scene && <Scene />}
              <div className="tk-tile-tx">
                <h3>{a.t}</h3>
                <p>{a.p}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </TechAreasStage>
  );
}
