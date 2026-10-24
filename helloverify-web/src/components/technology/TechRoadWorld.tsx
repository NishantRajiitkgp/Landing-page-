/** The trust road's last stop (`./TechRoad`), the economy between
    countries, and the road's two ends: HelloVerify the verification
    provider where it starts, the global trust platform where it arrives.
    Drawn from `./TechRoadKit`. */
import type { CSSProperties } from "react";
import { Logo } from "@/components/brand/Logo";
import { n, type TechArt } from "./TechPillarKit";
import { Board, Chip, S, iso, on, poly, run, type Pt } from "./TechRoadKit";

/* 08 · Cross-border economic activity. The slab turns into the world: the
   trading cities light up, trust rails arc between them, ships cross the
   oceans and money moves. `LAND` is a 48 × 21 dot map, one row of
   [first, last] column runs per six degrees of latitude from 72°N. */
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
const mapX = (c: number) => 131 + c * 7.2;
const mapY = (r: number) => 240 + r * 6;
const DOTS = LAND.flatMap((row, r) => row.flatMap(([a, b]) => Array.from({ length: b - a + 1 }, (_, i) => `M${n(mapX(a + i))} ${mapY(r)}h0`))).join("");
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
const RAILS: [Pt, Pt][] = [
  [BOSTON, LONDON],
  [LONDON, DUBAI],
  [DUBAI, SINGAPORE],
  [SINGAPORE, SYDNEY],
  [SAO_PAULO, LAGOS],
  [MUMBAI, LONDON],
  [BOSTON, SAO_PAULO],
  [BOSTON, SINGAPORE],
];
/** A rail between two cities, lifted higher the further it goes. */
const arc = ([px, py]: Pt, [qx, qy]: Pt) => {
  const lift = 34 + Math.hypot(qx - px, qy - py) * 0.95;
  return `M${n(px)} ${n(py)}Q${n((px + qx) / 2)} ${n((py + qy) / 2 - lift)} ${n(qx)} ${n(qy)}`;
};
const SHIPS = [[262, 296, 22, -10], [350, 328, 28, -8]] as const;

export function CrossBorder({ a }: { a: TechArt }) {
  return (
    <Board
      id="eco"
      floor={<path className="tk-rd-sea" d={poly(iso(-S, -S), iso(S, -S), iso(S, S), iso(-S, S))} />}
      chips={
        <>
          <Chip x={316} y={150} at={0.52}>{a.road.rails}</Chip>
          <Chip x={176} y={270} at={0.14}>{a.globe.boston}</Chip>
          <Chip x={470} y={352} at={0.2}>{a.globe.singapore}</Chip>
        </>
      }
    >
      <defs>
        <clipPath id="tk-rd-map">
          <path d={poly(iso(-S + 6, -S + 6), iso(S - 6, -S + 6), iso(S - 6, S - 6), iso(-S + 6, S - 6))} />
        </clipPath>
      </defs>
      <path className="tk-rd-p tk-rd-fade tk-rd-dots" style={on(0.01)} d={DOTS} clipPath="url(#tk-rd-map)" />
      {SHIPS.map(([sx, sy, dx, dy], k) => (
        <g key={k} className="tk-rd-t tk-rd-ship" style={run(0.24 + k * 0.1, 0.6, { "--sx": sx, "--sy": sy, "--dx": dx, "--dy": dy })}>
          <path className="tk-rd-hull" d="M-10 0h20l-4 5h-12z" />
          <rect className="tk-rd-red" x="-4" y="-6" width="8" height="6" rx="1" />
        </g>
      ))}
      {RAILS.map(([p, q], k) => (
        <path key={k} className={`tk-rd-p tk-rd-draw tk-rd-arc${k % 2 ? " tk-rd-arc2" : ""}`} style={on(0.22 + k * 0.045)} d={arc(p, q)} pathLength={1} />
      ))}
      {CITIES.map(([x, y], k) => (
        <g key={k} className="tk-rd-p tk-rd-pop" style={on(0.1 + k * 0.025)}>
          <circle className="tk-rd-cityh" cx={x} cy={y} r="8" />
          <circle className="tk-rd-red" cx={x} cy={y} r="3.2" />
        </g>
      ))}
      {[LONDON, SINGAPORE, SYDNEY, LAGOS].map(([x, y], k) => (
        <g key={k} className="tk-rd-p tk-rd-drop" style={on(0.5 + k * 0.05)}>
          <circle className="tk-rd-coin tk-rd-coin-t" cx={x + 12} cy={y - 16} r="7" />
          <circle className="tk-rd-coin-r" cx={x + 12} cy={y - 16} r="3.8" />
        </g>
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

/** Where it ends: the eight stops lit one by one round a globe, and
    HelloVerify at its centre, the global trust platform. */
const RING = Array.from({ length: 8 }, (_, k) => {
  const f = ((157.5 - k * 45) * Math.PI) / 180;
  return { c: Math.cos(f), s: Math.sin(f) };
});

export function RoadEnd({ label }: { label: string }) {
  return (
    <div className="tk-rd-fin-in">
      <div className="tk-rd-orb">
        <svg className="tk-rd-orb-svg tk-mirror" viewBox="0 0 400 400" fill="none" aria-hidden="true">
          <defs>
            <radialGradient id="tk-rd-glow-end">
              <stop className="tk-rd-glow0" offset="0" />
              <stop className="tk-rd-glow1" offset="1" />
            </radialGradient>
          </defs>
          <circle className="tk-rd-halo" cx="200" cy="200" r="200" fill="url(#tk-rd-glow-end)" />
          <circle className="tk-rd-p tk-rd-draw tk-rd-orbit" style={on(0.02)} cx="200" cy="200" r="168" pathLength={1} />
          {RING.map(({ c, s }, k) => (
            <path key={k} className="tk-rd-p tk-rd-draw tk-rd-spoke2" style={on(0.1 + k * 0.07)} d={`M${n(200 + c * 124)} ${n(200 - s * 124)}L${n(200 + c * 144)} ${n(200 - s * 144)}`} pathLength={1} />
          ))}
          <g className="tk-rd-p tk-rd-fade" style={on(0.03)}>
            <circle className="tk-rd-globe" cx="200" cy="200" r="118" />
            <ellipse className="tk-rd-gl" cx="200" cy="200" rx="118" ry="30" />
            <ellipse className="tk-rd-gl" cx="200" cy="146" rx="98" ry="24" />
            <ellipse className="tk-rd-gl" cx="200" cy="254" rx="98" ry="24" />
            <ellipse className="tk-rd-gl" cx="200" cy="200" rx="44" ry="118" />
            <ellipse className="tk-rd-gl" cx="200" cy="200" rx="88" ry="118" />
          </g>
        </svg>
        {RING.map(({ c, s }, k) => (
          <span key={k} className="tk-rd-p tk-rd-orb-n" style={on(0.1 + k * 0.07, { "--x": n(50 + 42 * c), "--y": n(50 - 42 * s) })}>
            {String(k + 1).padStart(2, "0")}
          </span>
        ))}
        <span className="tk-rd-p tk-rd-pop tk-rd-orb-logo" style={on(0.7)}>
          <Logo width={132} height={38} />
        </span>
        <i className="tk-rd-port" data-port="in" style={{ "--px": 8, "--py": 50 } as CSSProperties} />
      </div>
      <b className="tk-rd-p tk-rd-rise tk-rd-fin-t" style={on(0.78)}>
        {label}
      </b>
    </div>
  );
}
