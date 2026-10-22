/** "From verification provider to global trust platform" on `/technology`:
    the eight platform areas as a bento grid. Workforce mobility is the
    feature tile, drawn as routes between cities; verified credentials is
    the wide one, drawn as a chain of sealed credentials. The other six carry
    a line icon each. Drawings and icons are decoration (`aria-hidden`). */
import type { CSSProperties, ReactNode } from "react";
import "@/app/v2/tech.css";
import { TechAreasStage } from "./TechAreasStage";
import type { TechArt } from "./TechPillarKit";

const ICONS: Record<string, ReactNode> = {
  workforceMobility: <path d="M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5M4 7.5h16v11H4zM4 12.5h16M10.5 12.5v1.6h3v-1.6" />,
  businessVerification: <path d="M5 20V5.5h9V20M14 9.5h5V20M3.5 20h17M8 8.5h3M8 11.5h3M8 14.5h3M16.5 13h.01M16.5 16h.01" />,
  procurementVendor: <path d="M12 3.5 19.5 7.5v9L12 20.5 4.5 16.5v-9zM4.5 7.5 12 11.5l7.5-4M12 11.5v9M8.2 5.5l7.5 4" />,
  complianceRegulatory: <path d="M12 4v16M7 20h10M5 7.5h14M7.5 7.5 4.5 14a3 3 0 0 0 6 0zM16.5 7.5 13.5 14a3 3 0 0 0 6 0zM12 4.5a1 1 0 1 0 0-.01" />,
  financialOnboarding: <path d="M3.5 7h17v11h-17zM3.5 10.5h17M7 14.5h4M15 14.5h2" />,
  digitalIdentity: <path d="M7.5 18.5c-1.2-1.7-1.9-3.8-1.9-6a6.4 6.4 0 0 1 12.8 0M12 12.5c0 3-.8 5.6-2.2 7.6M9.2 12.5a2.8 2.8 0 0 1 5.6 0c0 2.6-.5 5-1.5 7M18.4 15.5c-.2 1.4-.6 2.8-1.2 4" />,
  crossBorder: <path d="M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM3.5 12h17M12 3.5c2.4 2.3 3.5 5.1 3.5 8.5s-1.1 6.2-3.5 8.5c-2.4-2.3-3.5-5.1-3.5-8.5s1.1-6.2 3.5-8.5z" />,
  verifiedCredentials: <path d="M5 4h14v11H5zM8.5 8h7M8.5 11h4.5M10 15l-1.5 5 3.5-1.6 3.5 1.6-1.5-5" />,
};

const AREA_CLASS: Record<string, string> = {
  workforceMobility: "tk-tile-a",
  verifiedCredentials: "tk-tile-h",
};

/* Routes between six cities, for the feature tile. */
const CITIES = [
  { x: 36, y: 150 }, { x: 118, y: 96 }, { x: 196, y: 140 }, { x: 262, y: 72 }, { x: 338, y: 128 }, { x: 392, y: 54 },
];
const ROUTES: [number, number][] = [[0, 1], [1, 3], [0, 2], [2, 4], [3, 5], [2, 3], [4, 5]];
const arc = (a: number, b: number) => {
  const p = CITIES[a];
  const q = CITIES[b];
  return `M${p.x} ${p.y} Q ${(p.x + q.x) / 2} ${Math.min(p.y, q.y) - 46} ${q.x} ${q.y}`;
};
const d = (s: number) => ({ "--d": `${s.toFixed(2)}s` }) as CSSProperties;

function RoutesArt() {
  return (
    <svg className="tk-tile-art tk-mirror" viewBox="0 0 428 180" fill="none" aria-hidden="true">
      {ROUTES.map(([a, b], i) => (
        <path key={i} className="tk-route" d={arc(a, b)} pathLength="1" style={d(0.6 + i * 0.14)} />
      ))}
      {[0, 3, 5].map((r, i) => (
        <path key={r} className="tk-pk tk-route-pk" d={arc(...ROUTES[r])} pathLength="1" style={d(1.7 + i * 0.45)} />
      ))}
      {CITIES.map((c, i) => (
        <g key={i} className="tk-city" transform={`translate(${c.x} ${c.y})`} style={d(0.45 + i * 0.1)}>
          <circle className="tk-city-halo" r="9" />
          <circle className="tk-dot-red" r="3.5" />
        </g>
      ))}
    </svg>
  );
}

/* Four credentials, linked, the last one sealed — for the wide tile. */
function ChainArt() {
  return (
    <svg className="tk-tile-art tk-mirror" viewBox="0 0 420 96" fill="none" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <path key={i} className="tk-chain-link" d={`M${86 + i * 110} 48 H ${110 + i * 110}`} pathLength="1" style={d(0.9 + i * 0.25)} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} className="tk-cred" style={d(0.5 + i * 0.22)}>
          <rect className="tk-sheet" x={6 + i * 110} y="18" width="80" height="60" rx="9" />
          <rect className={i === 3 ? "tk-red" : "tk-soft"} x={18 + i * 110} y="30" width="26" height="5" rx="2.5" />
          <rect className="tk-bar" x={18 + i * 110} y="44" width="52" height="5" rx="2.5" />
          <rect className="tk-bar" x={18 + i * 110} y="56" width="38" height="5" rx="2.5" />
        </g>
      ))}
      <g className="tk-cred-seal" transform="translate(394 70)" style={d(2)}>
        <circle className="tk-dot-red" r="11" />
        <path className="tk-tick-white" d="M-4.5 0.3l3 3 6-6.3" />
      </g>
    </svg>
  );
}

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
        {areas.map((a, i) => (
          <li key={a.key} className={`tk-tile ${AREA_CLASS[a.key] ?? ""}`} style={d(0.1 + i * 0.07)}>
            <div className="tk-tile-top" aria-hidden="true">
              <span className="tk-tile-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  {ICONS[a.key] ?? ICONS.verifiedCredentials}
                </svg>
              </span>
              <span className="tk-tile-n">{String(i + 1).padStart(2, "0")}</span>
            </div>
            {a.key === "workforceMobility" && <RoutesArt />}
            {a.key === "verifiedCredentials" && <ChainArt />}
            <div className="tk-tile-tx">
              <h3>{a.t}</h3>
              <p>{a.p}</p>
            </div>
          </li>
        ))}
      </ul>
    </TechAreasStage>
  );
}
