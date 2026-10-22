/** The scenes on the `/technology` platform-area tiles (`./TechAreas`), one
    per area, each acting out its line. Each beat starts `--s` after its
    tile's own `--d`, so a scene plays as its tile rises in. Decoration. */
import type { CSSProperties, ReactNode } from "react";
import { CARD, GLOBE, Glyph, HASH, ID, OFFICE, PERSON, SEARCH, SHIELD, n } from "./TechPillarKit";

const BOX = "M12 3.5 19.5 7.5v9L12 20.5 4.5 16.5v-9zM4.5 7.5 12 11.5l7.5-4M12 11.5v9";
const SCALES = "M12 4v16M7 20h10M5 7.5h14M7.5 7.5 4.5 14a3 3 0 0 0 6 0zM16.5 7.5 13.5 14a3 3 0 0 0 6 0z";
const FINGER = "M7.5 18.5c-1.2-1.7-1.9-3.8-1.9-6a6.4 6.4 0 0 1 12.8 0M12 12.5c0 3-.8 5.6-2.2 7.6M9.2 12.5a2.8 2.8 0 0 1 5.6 0c0 2.6-.5 5-1.5 7M18.4 15.5c-.2 1.4-.6 2.8-1.2 4";

const sv = (s: number) => ({ "--s": `${s}s` }) as CSSProperties;

function Tk({ x, y, r = 6, s, bad }: { x: number; y: number; r?: number; s: number; bad?: boolean }) {
  const k = r / 8;
  const mark = bad
    ? `M${n(x - 3 * k)} ${n(y - 3 * k)}l${n(6 * k)} ${n(6 * k)}M${n(x + 3 * k)} ${n(y - 3 * k)}l${n(-6 * k)} ${n(6 * k)}`
    : `M${n(x - 3.6 * k)} ${n(y + 0.2 * k)}l${n(2.4 * k)} ${n(2.4 * k)} ${n(4.8 * k)} ${n(-5 * k)}`;
  return (
    <g className={bad ? "tk-ok tk-ok-bad tk-a-pop" : "tk-ok tk-a-pop"} style={sv(s)}>
      <circle cx={x} cy={y} r={r} />
      <path className="tk-uf" d={mark} />
    </g>
  );
}

function Nd({ x, y, r, g, s, red }: { x: number; y: number; r: number; g: string; s: number; red?: boolean }) {
  return (
    <g className="tk-a-pop" style={sv(s)}>
      <circle className="tk-node" cx={x} cy={y} r={r} />
      <Glyph g={g} x={x} y={y} s={r / 26} cls={red ? "tk-ic tk-ic-r" : "tk-ic"} />
    </g>
  );
}

function Scene({ children, vb = "0 0 200 110" }: { children: ReactNode; vb?: string }) {
  return (
    <svg className="tk-tile-art tk-sc tk-mirror" viewBox={vb} fill="none" aria-hidden="true">
      {children}
    </svg>
  );
}

/* Feature tile: a professional, credential in hand, crossing a border on
   the routes between cities. */
const CITIES = [
  { x: 36, y: 150 }, { x: 118, y: 96 }, { x: 196, y: 140 }, { x: 262, y: 72 }, { x: 338, y: 128 }, { x: 392, y: 54 },
];
const ROUTES: [number, number][] = [[0, 1], [0, 2], [2, 3], [3, 5], [4, 5], [2, 4]];
const arc = (a: number, b: number) => {
  const p = CITIES[a];
  const q = CITIES[b];
  return `M${p.x} ${p.y} Q ${(p.x + q.x) / 2} ${Math.min(p.y, q.y) - 46} ${q.x} ${q.y}`;
};
const TRIP = "M118 96Q228 20 338 128";

function Mobility() {
  return (
    <Scene vb="0 0 428 180">
      <path className="tk-border tk-a-fade" d="M228 8V172" style={sv(0.3)} />
      {ROUTES.map(([a, b], i) => (
        <path key={i} className="tk-route tk-a-draw" d={arc(a, b)} pathLength="1" style={sv(0.4 + i * 0.1)} />
      ))}
      <path className="tk-p-link tk-a-draw" d={TRIP} pathLength="1" style={sv(1.1)} />
      {CITIES.map((c, i) => (
        <g key={i} className="tk-a-pop" style={sv(0.3 + i * 0.08)}>
          <circle className="tk-city-halo" cx={c.x} cy={c.y} r="9" />
          <circle className="tk-dot-red" cx={c.x} cy={c.y} r="3.5" />
        </g>
      ))}
      <Nd x={228} y={58} r={18} g={PERSON} s={1.5} />
      <g className="tk-a-pop" style={sv(1.7)}>
        <rect className="tk-sheet" x="244" y="60" width="30" height="20" rx="4" />
        <Glyph g={ID} x={259} y={70} s={0.55} cls="tk-ic tk-ic-m" />
      </g>
      <Tk x={272} y={58} s={1.9} />
    </Scene>
  );
}

/* Wide tile: four linked credentials. One was edited, and it shows. */
function Credentials() {
  return (
    <Scene vb="0 0 420 96">
      {[0, 1, 2].map((i) => (
        <path key={i} className="tk-chain-link tk-a-draw" d={`M${86 + i * 110} 48 H ${110 + i * 110}`} pathLength="1" style={sv(0.9 + i * 0.25)} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} className="tk-a-in" style={sv(0.5 + i * 0.22)}>
          <rect className="tk-sheet" x={6 + i * 110} y="18" width="80" height="60" rx="9" />
          <rect className={i === 3 ? "tk-red" : "tk-soft"} x={18 + i * 110} y="30" width="26" height="5" rx="2.5" />
          <rect className="tk-bar" x={18 + i * 110} y="44" width="52" height="5" rx="2.5" />
          <rect className="tk-bar" x={18 + i * 110} y="56" width="38" height="5" rx="2.5" />
          <Glyph g={HASH} x={72 + i * 110} y={64} s={0.5} cls="tk-ic tk-ic-m" />
        </g>
      ))}
      <path className="tk-strike tk-a-draw" d="M126 46c4-4 8 4 12 0s8 4 12 0 8 4 12 0 8 4 12 0" pathLength="1" style={sv(1.8)} />
      <Tk x={194} y={22} r={8} s={2} bad />
      <g className="tk-a-pop" style={sv(2.3)}>
        <circle className="tk-dot-red" cx="394" cy="70" r="11" />
        <path className="tk-tick-white tk-uf" d="M389.5 70.3l3 3 6-6.3" />
      </g>
    </Scene>
  );
}

export const SCENES: Record<string, () => ReactNode> = {
  workforceMobility: Mobility,
  verifiedCredentials: Credentials,

  businessVerification: () => (
    <Scene>
      <path className="tk-edge2 tk-a-draw" d="M90 56H122M122 32V80M122 32H140M122 80H140" pathLength="1" style={sv(0.6)} />
      <Nd x={62} y={56} r={26} g={OFFICE} s={0.3} />
      <Nd x={86} y={80} r={12} g={SEARCH} s={0.5} red />
      <Nd x={152} y={32} r={12} g={PERSON} s={0.8} />
      <Nd x={152} y={80} r={12} g={PERSON} s={0.9} />
      <Tk x={162} y={22} r={5} s={1.1} />
      <Tk x={162} y={70} r={5} s={1.2} />
    </Scene>
  ),

  procurementVendor: () => (
    <Scene>
      <path className="tk-p-link tk-a-draw" d="M40 56H160" pathLength="1" style={sv(0.4)} />
      {[40, 100, 160].map((x, i) => (
        <g key={x}>
          <Nd x={x} y={56} r={18} g={BOX} s={0.3 + i * 0.15} />
          <Tk x={x + 13} y={42} s={0.8 + i * 0.15} />
        </g>
      ))}
      <circle className="tk-sc-ring tk-a-fade" cx="160" cy="56" r="25" style={sv(0.7)} />
    </Scene>
  ),

  complianceRegulatory: () => (
    <Scene>
      <path className="tk-edge2 tk-a-draw" d="M100 56L40 28M100 56L160 28M100 56V92" pathLength="1" style={sv(0.4)} />
      <Nd x={100} y={56} r={24} g={SCALES} s={0.3} />
      {[
        [40, 28],
        [160, 28],
        [100, 92],
      ].map(([x, y], i) => (
        <g key={x + y}>
          <Nd x={x} y={y} r={12} g={SHIELD} s={0.5 + i * 0.1} />
          <Tk x={x + 9} y={y - 9} r={5} s={0.8 + i * 0.12} />
        </g>
      ))}
    </Scene>
  ),

  financialOnboarding: () => (
    <Scene>
      <g className="tk-a-in" style={sv(0.3)}>
        <rect className="tk-sheet" x="18" y="30" width="72" height="50" rx="8" />
        <circle className="tk-paperfill" cx="38" cy="55" r="10" />
        <Glyph g={PERSON} x={38} y={55} s={0.5} cls="tk-ic tk-ic-m" />
        <rect className="tk-inkbar" x="54" y="49" width="28" height="5" rx="2.5" />
        <rect className="tk-soft" x="54" y="60" width="20" height="4" rx="2" />
      </g>
      <path className="tk-p-link tk-a-draw" d="M92 55H132" pathLength="1" style={sv(0.6)} />
      <Tk x={112} y={55} r={7} s={0.9} />
      <Nd x={158} y={55} r={22} g={CARD} s={1.1} />
    </Scene>
  ),

  digitalIdentity: () => (
    <Scene>
      <Nd x={48} y={55} r={24} g={FINGER} s={0.3} red />
      <path className="tk-p-link tk-a-draw" d="M74 55H120" pathLength="1" style={sv(0.5)} />
      <g className="tk-a-in" style={sv(0.6)}>
        <rect className="tk-sc-phone" x="122" y="14" width="52" height="82" rx="10" />
        <rect className="tk-pale" x="130" y="28" width="36" height="24" rx="5" />
        <rect className="tk-soft" x="130" y="62" width="30" height="4" rx="2" />
        <rect className="tk-soft" x="130" y="72" width="20" height="4" rx="2" />
      </g>
      <Tk x={168} y={24} s={0.9} />
    </Scene>
  ),

  crossBorder: () => (
    <Scene>
      <rect className="tk-sc-land" x="8" y="14" width="88" height="82" rx="12" />
      <rect className="tk-abroad" x="104" y="14" width="88" height="82" rx="12" />
      <path className="tk-border" d="M100 8V102" />
      <path className="tk-sc-rail tk-a-draw" d="M22 55H178" pathLength="1" style={sv(0.3)} />
      {Array.from({ length: 11 }, (_, i) => (
        <path key={i} className="tk-sc-sleeper" d={`M${28 + i * 14.4} 49V61`} />
      ))}
      <rect className="tk-red tk-sc-train" x="86" y="47" width="28" height="16" rx="5" style={sv(0.6)} />
      <Nd x={30} y={30} r={10} g={GLOBE} s={0.2} />
      <Nd x={170} y={30} r={10} g={GLOBE} s={0.3} />
    </Scene>
  ),
};
