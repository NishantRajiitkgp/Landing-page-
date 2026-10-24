/** "From verification provider to global trust platform" on `/technology`,
    as one journey down a road. A tall runway pins a frame over a world
    nine screens wide: the eight platform areas as stops, in story order
    from one professional out to the whole economy, then the destination.
    Scrolling rides a case down the road from HelloVerify, one stop at a
    time: each stop's copy and scene rise in as the case arrives, the
    scene's floating pieces build themselves round the road (`./TechRoadPeople`,
    `./TechRoadPapers`, `./TechRoadTrade`, `./TechRoadFirm`, `./TechRoadWorld`), and both
    dissolve as the case rides on. A rail across the top tracks the eight
    and jumps between them. The scroll is `./TechRoadStage`. */
import type { CSSProperties, ReactNode } from "react";
import "@/app/v2/tech.css";
import type { PlatformArea, PlatformCopy } from "@/lib/copy/platform";
import type { TechArt } from "./TechPillarKit";
import { RoadDefs } from "./TechRoadKit";
import { Credentials, Finance } from "./TechRoadPapers";
import { Identity, Mobility } from "./TechRoadPeople";
import { TechRoadStage } from "./TechRoadStage";
import { Business } from "./TechRoadFirm";
import { Compliance, Procurement } from "./TechRoadTrade";
import { CrossBorder, RoadEnd, RoadStart } from "./TechRoadWorld";

/** The story's order: a person crossing a border, their identity, their
    money and their papers; then the rules, the supply chain, the company;
    and last the economy between countries. */
const ROUTE: PlatformArea[] = [
  "workforceMobility",
  "digitalIdentity",
  "financialOnboarding",
  "verifiedCredentials",
  "complianceRegulatory",
  "procurementVendor",
  "businessVerification",
  "crossBorder",
];
const SCENES: Record<PlatformArea, (p: { a: TechArt }) => ReactNode> = {
  workforceMobility: Mobility,
  digitalIdentity: Identity,
  financialOnboarding: Finance,
  verifiedCredentials: Credentials,
  complianceRegulatory: Compliance,
  procurementVendor: Procurement,
  businessVerification: Business,
  crossBorder: CrossBorder,
};
/** How far each frame sits above or below the line, in % of the frame, so the road winds. */
const WAVE = [0, -8, 6, -7, 8, -6, 7, -5, 0];
const STRANDS = 6;

const nn = (i: number) => String(i + 1).padStart(2, "0");
const frame = (i: number) => ({ "--i": i, "--wy": WAVE[i] }) as CSSProperties;

export function TechRoad({
  h,
  sub,
  cards,
  art,
}: {
  h: string;
  sub: string;
  cards: PlatformCopy["technology"]["platform"]["cards"];
  art: TechArt;
}) {
  return (
    <TechRoadStage>
      <RoadDefs />
      <div className="wrap">
        <div className="sec-head tk-head">
          <h2 className="h2 tk-rv">{h}</h2>
          <p className="lede tk-rv tk-rv2">{sub}</p>
        </div>
      </div>

      <div className="tk-rd-run">
        <div className="tk-rd-pin">
          <div className="tk-rd-world" style={{ "--frames": ROUTE.length + 1 } as CSSProperties}>
            <svg className="tk-rd-road" aria-hidden="true">
              {Array.from({ length: ROUTE.length + 1 }, (_, r) => (
                <g key={r} className="tk-rd-seg">
                  <path className="tk-rd-ghost" />
                  <path className="tk-rd-glow" pathLength={1} />
                  {Array.from({ length: STRANDS }, (_, k) => (
                    <path key={k} className={`tk-rd-str tk-rd-s${k}`} pathLength={1} />
                  ))}
                  <path className="tk-rd-comet" pathLength={1} />
                </g>
              ))}
            </svg>

            <ol className="tk-rd-stops">
              {ROUTE.map((key, i) => {
                const Scene = SCENES[key];
                return (
                  <li key={key} className="tk-rd-stop" style={frame(i)}>
                    <div className="tk-rd-tx">
                      <span className="tk-rd-n" aria-hidden="true">
                        <b>{nn(i)}</b> / {nn(ROUTE.length - 1)}
                      </span>
                      <h3>{cards[key].t}</h3>
                      <p>{cards[key].p}</p>
                    </div>
                    <div className="tk-rd-scene" aria-hidden="true">
                      <span className="tk-rd-big">{nn(i)}</span>
                      <Scene a={art} />
                    </div>
                    {i === 0 && <RoadStart label={art.road.start} />}
                  </li>
                );
              })}
            </ol>

            <div className="tk-rd-stop tk-rd-fin" style={frame(ROUTE.length)} aria-hidden="true">
              <RoadEnd label={art.road.end} />
            </div>

            <i className="tk-rd-car" aria-hidden="true">
              <svg viewBox="0 0 16 16">
                <path d="M4.4 8.3l2.4 2.4 4.8-5" />
              </svg>
            </i>
          </div>

          <ol className="tk-rd-rail">
            {ROUTE.map((key, i) => (
              <li key={key}>
                <button type="button" className="tk-rd-hop" data-i={i} data-s={i ? "next" : "now"}>
                  <i aria-hidden="true" />
                  <span>{nn(i)}</span>
                  <span className="sr-only">{cards[key].t}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </TechRoadStage>
  );
}
