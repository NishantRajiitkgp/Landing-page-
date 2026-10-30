/** The four authorities on the `/technology` future-of-trust board
    (`./TechFuture`), drawn in isometric on a 180 × 200 box: a slab, and
    on it a domed capitol, a glass tower, a hospital and a college, each
    built from boxes. `u` runs down to the right, `v` down to the left and
    `z` up, from the slab's centre; the faces that can be seen are the top,
    the one facing down-left (`v` at its most) and the one facing
    down-right (`u` at its most). */
import { n } from "./TechPillarKit";

type R = [number, number];
const O = { x: 90, y: 142 };
const iso = (u: number, v: number, z: number) => [n(O.x + (u - v) * 0.866), n(O.y + (u + v) * 0.5 - z)];
const P = (...pts: number[][]) => `M${pts.map((p) => p.join(" ")).join("L")}Z`;

function Block({ u: [u0, u1], v: [v0, v1], z: [z0, z1], tone = "" }: { u: R; v: R; z: R; tone?: string }) {
  return (
    <>
      <path className={`tk-ft-fl${tone}`} d={P(iso(u0, v1, z1), iso(u1, v1, z1), iso(u1, v1, z0), iso(u0, v1, z0))} />
      <path className={`tk-ft-fr${tone}`} d={P(iso(u1, v0, z1), iso(u1, v1, z1), iso(u1, v1, z0), iso(u1, v0, z0))} />
      <path className={`tk-ft-ft${tone}`} d={P(iso(u0, v0, z1), iso(u1, v0, z1), iso(u1, v1, z1), iso(u0, v1, z1))} />
    </>
  );
}

/** A grid of windows on the down-left face at `v`, or the down-right face at `u`. */
const grid = (face: "l" | "r", at: number, [a0, a1]: R, [b0, b1]: R, cols: number, rows: number, gap = 2.4) => {
  const cw = (a1 - a0) / cols;
  const rh = (b1 - b0) / rows;
  const pt = (a: number, z: number) => (face === "l" ? iso(a, at, z) : iso(at, a, z));
  let d = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const a = a0 + c * cw + gap / 2;
      const b = a + cw - gap;
      const zt = b1 - r * rh - gap / 2;
      const zb = zt - rh + gap;
      d += P(pt(a, zt), pt(b, zt), pt(b, zb), pt(a, zb));
    }
  }
  return d;
};

/** A drum standing at the centre, `r` round, and the dome on it. */
const ring = (z: number, r: number) => {
  const [x, y] = iso(0, 0, z);
  return { x, y, rx: n(r * 1.2247), ry: n(r * 0.7071) };
};
function Drum({ r, z: [z0, z1] }: { r: number; z: R }) {
  const b = ring(z0, r);
  const t = ring(z1, r);
  return (
    <>
      <path className="tk-ft-fr" d={`M${t.x - t.rx} ${t.y}L${b.x - b.rx} ${b.y}A${b.rx} ${b.ry} 0 0 0 ${b.x + b.rx} ${b.y}L${t.x + t.rx} ${t.y}A${t.rx} ${t.ry} 0 0 1 ${t.x - t.rx} ${t.y}z`} />
      <ellipse className="tk-ft-ft" cx={t.x} cy={t.y} rx={t.rx} ry={t.ry} />
    </>
  );
}
function Dome({ r, z, h }: { r: number; z: number; h: number }) {
  const t = ring(z, r);
  return <path className="tk-ft-dome" d={`M${t.x - t.rx} ${t.y}A${t.rx} ${h} 0 0 1 ${t.x + t.rx} ${t.y}A${t.rx} ${t.ry} 0 0 1 ${t.x - t.rx} ${t.y}z`} />;
}
/** A flag on a pole from `z` at board point (`u`, `v`). */
function Flag({ u = 0, v = 0, z }: { u?: number; v?: number; z: number }) {
  const [x, y] = iso(u, v, z);
  return (
    <>
      <path className="tk-ft-pole" d={`M${x} ${y}v-16`} />
      <path className="tk-ft-flag" d={`M${x + 0.6} ${y - 16}h12l-3 3.6 3 3.6h-12z`} />
    </>
  );
}

/** The slab every authority stands on. */
export function Slab() {
  const t = 40;
  return (
    <g className="tk-ft-slab">
      <ellipse className="tk-ft-slab-sh" cx={O.x} cy={O.y + 26} rx="80" ry="24" />
      <path className="tk-ft-sl" d={P(iso(-t, t, 0), iso(t, t, 0), iso(t, t, -9), iso(-t, t, -9))} />
      <path className="tk-ft-sr" d={P(iso(t, -t, 0), iso(t, t, 0), iso(t, t, -9), iso(t, -t, -9))} />
      <path className="tk-ft-st" d={P(iso(-t, -t, 0), iso(t, -t, 0), iso(t, t, 0), iso(-t, t, 0))} />
      <path className="tk-ft-slab-in" d={P(iso(-31, -31, 0), iso(31, -31, 0), iso(31, 31, 0), iso(-31, 31, 0))} />
    </g>
  );
}

/** Government: a domed capitol under its flag. */
export function Capitol() {
  return (
    <>
      <Block u={[-30, 30]} v={[-21, 21]} z={[0, 4]} />
      <Block u={[-27, 27]} v={[-18, 18]} z={[4, 26]} />
      <path className="tk-ft-colon" d={grid("l", 18, [-24, 24], [7, 23], 7, 1, 3.2)} />
      <path className="tk-ft-win" d={grid("r", 27, [-14, 14], [11, 21], 3, 1, 4)} />
      <Block u={[-29, 29]} v={[-20, 20]} z={[26, 30]} />
      <Drum r={12} z={[30, 40]} />
      <path className="tk-ft-win" d={grid("l", 11, [-6, 6], [32, 38], 3, 1, 1.6)} />
      <Dome r={12} z={40} h={16} />
      <Drum r={2.6} z={[55, 59]} />
      <Flag z={59} />
    </>
  );
}

/** Enterprise: a glass tower with a low wing. */
export function Tower() {
  const [ax, ay] = iso(0, 0, 80);
  return (
    <>
      <Block u={[-18, 18]} v={[-15, 15]} z={[0, 76]} />
      <path className="tk-ft-glass-w" d={grid("l", 15, [-15, 15], [5, 72], 4, 10, 1.8)} />
      <path className="tk-ft-glass-w tk-ft-shade" d={grid("r", 18, [-12, 12], [5, 72], 3, 10, 1.8)} />
      <Block u={[-16, 16]} v={[-13, 13]} z={[76, 80]} />
      <path className="tk-ft-pole" d={`M${ax} ${ay}v-12`} />
      <circle className="tk-ft-flag" cx={ax} cy={ay - 13} r="2.2" />
      <Block u={[18, 34]} v={[-15, 8]} z={[0, 30]} />
      <path className="tk-ft-win" d={grid("l", 8, [18, 32], [6, 28], 2, 3, 2.4)} />
      <path className="tk-ft-win" d={grid("r", 34, [-11, 5], [6, 28], 2, 3, 2.4)} />
    </>
  );
}

const CROSS = (v: number, cu: number, cz: number, a: number, w: number) =>
  P(
    iso(cu - w, v, cz + a), iso(cu + w, v, cz + a), iso(cu + w, v, cz + w), iso(cu + a, v, cz + w), iso(cu + a, v, cz - w), iso(cu + w, v, cz - w),
    iso(cu + w, v, cz - a), iso(cu - w, v, cz - a), iso(cu - w, v, cz - w), iso(cu - a, v, cz - w), iso(cu - a, v, cz + w), iso(cu - w, v, cz + w),
  );

/** Medical: a hospital, its middle block forward, a red cross on its face. */
export function Hospital() {
  return (
    <>
      <Block u={[-33, 33]} v={[-16, 16]} z={[0, 36]} />
      <path className="tk-ft-win" d={grid("l", 16, [-31, -12], [6, 32], 2, 3, 3)} />
      <path className="tk-ft-win" d={grid("r", 33, [-13, 13], [6, 32], 3, 3, 3)} />
      <Block u={[-12, 12]} v={[-16, 23]} z={[0, 54]} />
      <path className="tk-ft-plaque" d={P(iso(-8.5, 23, 51), iso(8.5, 23, 51), iso(8.5, 23, 34), iso(-8.5, 23, 34))} />
      <path className="tk-ft-flag" d={CROSS(23, 0, 42.5, 6.4, 2.2)} />
      <path className="tk-ft-win" d={grid("l", 23, [-6, 6], [14, 28], 2, 2, 2.4)} />
      <path className="tk-ft-door" d={P(iso(-4.5, 23, 10), iso(4.5, 23, 10), iso(4.5, 23, 0), iso(-4.5, 23, 0))} />
      <path className="tk-ft-win" d={grid("r", 12, [-14, 21], [36, 50], 3, 1, 3)} />
    </>
  );
}

/** Education: a college, columns under a pediment, its flag at the apex. */
export function College() {
  const g = 18;
  return (
    <>
      <Block u={[-30, 30]} v={[-21, 21]} z={[0, 4]} />
      <Block u={[-27, 27]} v={[-g, g]} z={[4, 26]} />
      <path className="tk-ft-colon" d={grid("l", g, [-24, 24], [7, 23], 6, 1, 3.4)} />
      <path className="tk-ft-win" d={grid("r", 27, [-12, 12], [11, 21], 2, 1, 5)} />
      <Block u={[-28, 28]} v={[-19, 19]} z={[26, 29]} />
      <path className="tk-ft-roof" d={P(iso(0, -19, 44), iso(0, 19, 44), iso(28, 19, 29), iso(28, -19, 29))} />
      <path className="tk-ft-fl" d={P(iso(-28, 19, 29), iso(28, 19, 29), iso(0, 19, 44))} />
      <circle className="tk-ft-flag" cx={iso(0, 19, 35)[0]} cy={iso(0, 19, 35)[1]} r="2.6" />
      <Flag v={19} z={44} />
    </>
  );
}
