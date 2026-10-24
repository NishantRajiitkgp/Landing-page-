/** The trust road's last stop (`./TechRoad`), the economy between
    countries, and the road's two ends: HelloVerify the verification
    provider where it starts, and the global trust platform it arrives at,
    a dotted world with the eight stops in orbit round it. */
import type { CSSProperties } from "react";
import { Logo } from "@/components/brand/Logo";
import { n, type TechArt } from "./TechPillarKit";
import { Board, Chip, Coin, PLANE, Piece, gr, on, run, type Pt } from "./TechRoadKit";

/** The land as a 48 × 21 grid, one row of [first, last] column runs per
    six degrees of latitude down from 72°N, 7.5° of longitude a column. */
const LAND: [number, number][][] = [
  [[3, 5], [8, 13], [16, 20], [32, 42]],
  [[2, 15], [17, 19], [26, 47]],
  [[3, 15], [18, 18], [25, 45]],
  [[6, 15], [23, 42], [45, 45]],
  [[7, 15], [23, 41]],
  [[7, 14], [22, 42]],
  [[8, 14], [23, 31], [34, 40], [42, 42]],
  [[8, 13], [22, 31], [33, 39]],
  [[9, 11], [13, 13], [21, 31], [33, 35], [37, 39]],
  [[10, 11], [21, 30], [33, 34], [36, 38], [40, 40]],
  [[11, 12], [21, 29], [33, 33], [37, 38], [40, 40]],
  [[13, 15], [22, 30], [37, 39]],
  [[13, 17], [25, 29], [37, 42]],
  [[13, 19], [25, 29], [41, 43]],
  [[13, 18], [25, 29], [41, 42]],
  [[14, 18], [25, 30], [40, 43]],
  [[14, 17], [25, 28], [39, 44]],
  [[14, 16], [26, 27], [39, 44]],
  [[14, 16], [42, 43]],
  [[14, 15], [46, 46]],
  [[14, 15]],
];
const CELLS = LAND.flatMap((row, r) => row.flatMap(([a, b]) => Array.from({ length: b - a + 1 }, (_, i) => [r, a + i] as const)));

/* 08 · Cross-border economic activity. The world map, its trading cities
   lit, the trust rails arcing between them with planes along them, ships
   crossing the oceans and money changing hands. */
const mapX = (c: number) => 42 + c * 10.8;
const mapY = (r: number) => 128 + r * 11.4;
const MAP = CELLS.map(([r, c]) => `M${n(mapX(c))} ${n(mapY(r))}h0`).join("");
const city = (lon: number, lat: number): Pt => [n(mapX((lon + 180) / 7.5 - 0.5)), n(mapY((72 - lat) / 6))];
const BOSTON = city(-71, 42.4);
const LONDON = city(-0.1, 51.5);
const DUBAI = city(55.3, 25.2);
const MUMBAI = city(72.9, 19.1);
const SINGAPORE = city(103.8, 1.35);
const SYDNEY = city(151.2, -33.9);
const SAO_PAULO = city(-46.6, -23.5);
const LAGOS = city(3.4, 6.5);
const CITIES = [BOSTON, LONDON, DUBAI, MUMBAI, SINGAPORE, SYDNEY, SAO_PAULO, LAGOS];
const CENTRE: Pt = [300, 280];
const rail = ([px, py]: Pt, [qx, qy]: Pt) => {
  const lift = 30 + Math.hypot(qx - px, qy - py) * 0.55;
  return { x0: px, y0: py, x1: n((px + qx) / 2), y1: n(Math.min(py, qy) - lift), x2: qx, y2: qy };
};
const RAILS = [
  rail(CENTRE, BOSTON), rail(CENTRE, DUBAI), rail(CENTRE, SAO_PAULO), rail(CENTRE, SINGAPORE),
  rail(BOSTON, LONDON), rail(LONDON, DUBAI), rail(MUMBAI, SINGAPORE), rail(SINGAPORE, SYDNEY), rail(SAO_PAULO, LAGOS),
];
const q = (r: ReturnType<typeof rail>) => `M${r.x0} ${r.y0}Q${r.x1} ${r.y1} ${r.x2} ${r.y2}`;
/** Coins over four cities: where, when they arrive, how near. */
const PURSES: [Pt, number, number][] = [[LONDON, 0.6, 1.2], [SINGAPORE, 0.66, 1.4], [SAO_PAULO, 0.72, 1.3], [SYDNEY, 0.78, 0.9]];

function Ship() {
  return (
    <>
      <path d="M2 26h86l-10 12H12z" fill={gr("ink")} />
      <path className="tk-rd-red" d="M2 26h86l-1.5 2H3.5z" />
      {[0, 1, 2, 3, 4].map((k) => (
        <rect key={k} className={k % 2 ? "tk-rd-tint" : "tk-rd-red"} x={12 + k * 11} y="15" width="10" height="11" rx="1" />
      ))}
      {[0, 1, 2].map((k) => (
        <rect key={k} className={k === 1 ? "tk-rd-red" : "tk-rd-off"} x={23 + k * 11} y="5" width="10" height="10" rx="1" />
      ))}
      <rect x="70" y="8" width="12" height="18" rx="1.5" fill={gr("card")} className="tk-rd-edge" />
      <rect className="tk-rd-ink2" x="72.5" y="11" width="7" height="3" rx="1" />
    </>
  );
}

export function CrossBorder({ a }: { a: TechArt }) {
  return (
    <Board
      id="eco"
      hub={[284, 280, 316, 280]}
      back={
        <g className="tk-rd-flipx">
          <path className="tk-rd-p tk-rd-fade tk-rd-map" style={on(0.01)} d={MAP} />
          {RAILS.map((r, k) => (
            <path key={k} className={`tk-rd-p tk-rd-draw tk-rd-arc${k > 3 ? " tk-rd-arc2" : ""}`} style={on(0.16 + k * 0.05)} d={q(r)} pathLength={1} />
          ))}
          {CITIES.map(([x, y], k) => (
            <g key={k} className="tk-rd-p tk-rd-pop" style={on(0.12 + k * 0.03)}>
              <circle className="tk-rd-cityh" cx={x} cy={y} r="9" />
              <circle className="tk-rd-red" cx={x} cy={y} r="3.4" />
            </g>
          ))}
        </g>
      }
      front={
        <>
          <g className="tk-rd-flipx">
            {[RAILS[4], RAILS[5]].map((r, k) => (
              <g key={k} className="tk-rd-t tk-rd-plane tk-rd-plane-s" style={run(0.4 + k * 0.08, 0.32, r)}>
                <path d={PLANE} fill={gr("red")} />
              </g>
            ))}
          </g>
          <g className="tk-rd-p tk-rd-pop" style={on(0.02)}>
            <circle cx={CENTRE[0]} cy={CENTRE[1]} r="26" fill={gr("glow")} />
            <circle cx={CENTRE[0]} cy={CENTRE[1]} r="15" fill={gr("red")} />
            <path className="tk-rd-lnw tk-rd-thick tk-uf" d="M293.4 280.4l4.4 4.4 8.6-9" />
          </g>
        </>
      }
      chips={
        <>
          <Chip x={300} y={64} at={0.52}>{a.road.rails}</Chip>
          <Chip x={BOSTON[0] - 44} y={BOSTON[1]} at={0.14} fixed>{a.globe.boston}</Chip>
          <Chip x={SINGAPORE[0] + 54} y={SINGAPORE[1] + 4} at={0.2} fixed>{a.globe.singapore}</Chip>
        </>
      }
    >
      <Piece x={196} y={226} w={66} vb="0 0 90 40" at={0.2} z={1.1} ph={0.2} bob={3} fixed>
        <g className="tk-rd-t tk-rd-drift" style={run(0.2, 0.8)}>
          <Ship />
        </g>
      </Piece>
      <Piece x={356} y={322} w={74} vb="0 0 90 40" at={0.26} z={1.3} ph={0.6} bob={3} fixed>
        <g className="tk-rd-t tk-rd-drift" style={run(0.26, 0.74)}>
          <Ship />
        </g>
      </Piece>
      {PURSES.map(([[x, y], at, z], k) => (
        <Piece key={k} x={x + 6} y={y - 40} w={30} vb="0 0 40 40" at={at} z={z} ph={k * 0.27} a="pop" fixed>
          <Coin />
        </Piece>
      ))}
    </Board>
  );
}

/** Where the road begins: HelloVerify, the verification provider. It
    leaves from the badge's end, or on a phone from its top. */
export function RoadStart({ label }: { label: string }) {
  return (
    <div className="tk-rd-start" aria-hidden="true">
      <span className="tk-rd-start-logo">
        <Logo width={84} height={24} />
      </span>
      <small>{label}</small>
      <i className="tk-rd-port" data-port="out" style={{ "--px": 100, "--py": 50 } as CSSProperties} />
      <i className="tk-rd-port" data-port="up" style={{ "--px": 20, "--py": 0 } as CSSProperties} />
    </div>
  );
}

/* The destination: the world as a sphere of dots, seen from over Africa
   and the Gulf, nearer dots larger and darker; trust rails arc over its
   face between the trading cities; and the eight stops ride a tilted
   orbit round it, its far side passing behind the globe. */
const G = { cx: 300, cy: 226, r: 132, lon0: 34, lat0: 16 };
const RAD = Math.PI / 180;
const unit = (lat: number, lon: number) => {
  const f = lat * RAD;
  const l = (lon - G.lon0) * RAD;
  const f0 = G.lat0 * RAD;
  return {
    x: Math.cos(f) * Math.sin(l),
    y: Math.cos(f0) * Math.sin(f) - Math.sin(f0) * Math.cos(f) * Math.cos(l),
    z: Math.sin(f0) * Math.sin(f) + Math.cos(f0) * Math.cos(f) * Math.cos(l),
  };
};
const screen = (v: { x: number; y: number }, k = 1): Pt => [n(G.cx + G.r * k * v.x), n(G.cy - G.r * k * v.y)];
const DEPTHS = [0.72, 0.42, 0.08];
const GLOBE_DOTS = DEPTHS.map((lo, i) =>
  CELLS.flatMap(([r, c]) =>
    [0, 1].flatMap((sy) =>
      [0, 1].map((sx) => {
        const v = unit(72 - r * 6 + 1.5 - sy * 3, -180 + c * 7.5 + 1.9 + sx * 3.75);
        const hi = i ? DEPTHS[i - 1] : 2;
        return v.z > lo && v.z <= hi ? `M${screen(v).join(" ")}h0` : "";
      }),
    ),
  ).join(""),
);
const GRATICULE = [
  ...[-30, 0, 30, 60].map((lat) => Array.from({ length: 73 }, (_, i) => unit(lat, i * 5))),
  ...[-60, -30, 0, 30, 60, 90, 120].map((lon) => Array.from({ length: 37 }, (_, i) => unit(-90 + i * 5, lon + G.lon0))),
]
  .map((pts) => pts.map((v, i) => (v.z > 0 ? `${i && pts[i - 1].z > 0 ? "L" : "M"}${screen(v).join(" ")}` : "")).join(""))
  .join("");
const PLACES: Record<string, [number, number]> = {
  london: [51.5, -0.1], lagos: [6.5, 3.4], cairo: [30, 31.2], nairobi: [-1.3, 36.8], dubai: [25.2, 55.3], mumbai: [19.1, 72.9], moscow: [55.7, 37.6], singapore: [1.35, 103.8],
};
/** A great circle between two places, lifted off the surface mid-way. */
const greatArc = (p: string, q2: string) => {
  const a = unit(...PLACES[p]);
  const b = unit(...PLACES[q2]);
  const w = Math.acos(Math.min(1, a.x * b.x + a.y * b.y + a.z * b.z));
  return Array.from({ length: 25 }, (_, i) => {
    const t = i / 24;
    const s1 = Math.sin((1 - t) * w) / Math.sin(w);
    const s2 = Math.sin(t * w) / Math.sin(w);
    const v = { x: a.x * s1 + b.x * s2, y: a.y * s1 + b.y * s2 };
    return `${i ? "L" : "M"}${screen(v, 1 + 0.2 * Math.sin(Math.PI * t)).join(" ")}`;
  }).join("");
};
const ARCS = [greatArc("london", "dubai"), greatArc("dubai", "singapore"), greatArc("lagos", "london"), greatArc("nairobi", "mumbai"), greatArc("cairo", "moscow"), greatArc("lagos", "dubai")];
const DOTS_AT = Object.values(PLACES).map(([lat, lon]) => screen(unit(lat, lon)));

/** The orbit: an ellipse round the globe, tilted, its near half in front. */
const O = { cx: 300, cy: 238, rx: 282, ry: 108, tilt: -8 * RAD };
const orbit = (t: number): Pt => {
  const x = O.rx * Math.cos(t);
  const y = O.ry * Math.sin(t);
  return [n(O.cx + x * Math.cos(O.tilt) - y * Math.sin(O.tilt)), n(O.cy + x * Math.sin(O.tilt) + y * Math.cos(O.tilt))];
};
const half = (from: number, to: number) => `M${orbit(from).join(" ")}A${O.rx} ${O.ry} ${n(O.tilt / RAD)} 0 0 ${orbit(to).join(" ")}`;
const STATIONS = [157.5, 112.5, 67.5, 22.5, -22.5, -67.5, -112.5, -157.5].map((d) => orbit(d * RAD));
const [PX, PY] = orbit(Math.PI);

function Station({ k }: { k: number }) {
  const [x, y] = STATIONS[k];
  return (
    <g className={`tk-rd-p tk-rd-stn${k > 3 ? " tk-rd-stn-far" : ""}`} style={on(0.1 + k * 0.07)}>
      <circle className="tk-rd-stn-halo" cx={x} cy={y} r="24" />
      <circle className="tk-rd-stn-dot" cx={x} cy={y} r="17" />
      <text className="tk-rd-stn-n" x={x} y={y} dy=".35em" textAnchor="middle">
        {String(k + 1).padStart(2, "0")}
      </text>
    </g>
  );
}

export function RoadEnd({ label }: { label: string }) {
  return (
    <div className="tk-rd-fin-in">
      <div className="tk-rd-orb">
        <svg className="tk-rd-orb-svg" viewBox="0 0 600 460" fill="none" aria-hidden="true">
          <circle cx={G.cx} cy={G.cy} r={G.r * 1.55} fill={gr("glow")} />
          <g className="tk-rd-flipx">
            <path className="tk-rd-orbit" d={half(2 * Math.PI, Math.PI)} />
            <path className="tk-rd-t tk-rd-orbit-lit" style={run(0.4, 0.3)} d={half(2 * Math.PI, Math.PI)} pathLength={1} />
            {[4, 5, 6, 7].map((k) => (
              <Station key={k} k={k} />
            ))}
          </g>
          <g className="tk-rd-p tk-rd-fade" style={on(0.02)}>
            <circle cx={G.cx} cy={G.cy} r={G.r + 7} className="tk-rd-atmo" />
            <circle cx={G.cx} cy={G.cy} r={G.r} fill={gr("sphere")} />
            <path className="tk-rd-grat" d={GRATICULE} />
            {GLOBE_DOTS.map((d, i) => (
              <path key={i} className={`tk-rd-gdot tk-rd-gdot${i}`} d={d} />
            ))}
            <circle cx={G.cx} cy={G.cy} r={G.r} className="tk-rd-rim" />
          </g>
          {ARCS.map((d, k) => (
            <path key={k} className="tk-rd-p tk-rd-draw tk-rd-garc" style={on(0.2 + k * 0.07)} d={d} pathLength={1} />
          ))}
          {DOTS_AT.map(([x, y], k) => (
            <g key={k} className="tk-rd-p tk-rd-pop" style={on(0.16 + k * 0.04)}>
              <circle className="tk-rd-cityh" cx={x} cy={y} r="7" />
              <circle className="tk-rd-red" cx={x} cy={y} r="2.8" />
            </g>
          ))}
          <g className="tk-rd-flipx">
            <path className="tk-rd-orbit" d={half(Math.PI, 0)} />
            <path className="tk-rd-t tk-rd-orbit-lit" style={run(0.06, 0.32)} d={half(Math.PI, 0)} pathLength={1} />
            {[0, 1, 2, 3].map((k) => (
              <Station key={k} k={k} />
            ))}
          </g>
        </svg>
        <i className="tk-rd-port" data-port="in" style={{ "--px": n(PX / 6), "--py": n(PY / 4.6) } as CSSProperties} />
      </div>
      <div className="tk-rd-p tk-rd-rise tk-rd-fin-t" style={on(0.74)}>
        <span className="tk-rd-fin-logo">
          <Logo width={112} height={33} />
        </span>
        <b>{label}</b>
      </div>
    </div>
  );
}
