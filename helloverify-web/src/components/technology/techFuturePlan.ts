/** The plan of the `/technology` future-of-trust board (`./TechFuture`):
    where its parts sit on the wide board, 1200 × 520 units, and the wires
    that join them. Five records on the left stream through the four checks
    into the trust core; the core feeds the four authorities on the right.
    Wires run behind the parts, so they vanish into the core and show
    softened through the glass checks; their dots sit in front. */
import { n } from "./TechPillarKit";

export type Pt = { x: number; y: number };
const W = 1200;
const H = 520;
/** A board point as `--x`/`--y`, in % of the board. */
export const pc = (p: Pt) => ({ "--x": n((p.x / W) * 100), "--y": n((p.y / H) * 100) });

const REC_W = 236;
export const RECORDS: Pt[] = [0, 1, 2, 3, 4].map((k) => ({ x: 128, y: 100 + k * 84 }));
/** The four checks, stepping back and up like cards fanned on a table. */
export const PANES: Pt[] = [0, 1, 2, 3].map((j) => ({ x: 382 + j * 60, y: 270 - j * 12 }));
/** The core's sphere, and the centre of its drawing (400 × 330, the sphere at 200, 128). */
export const CORE: Pt = { x: 700, y: 206 };
export const CORE_BOX: Pt = { x: CORE.x, y: CORE.y + 37 };
/** The authorities' slabs; each drawing (180 × 200) has its slab's centre at 90, 142. */
export const SITES: Pt[] = [0, 1, 2, 3].map((k) => ({ x: 962, y: 150 + k * 98 }));
export const SITE_BOX = (p: Pt): Pt => ({ x: p.x, y: p.y - 42 });
export const LABEL = (p: Pt): Pt => ({ x: 1118, y: p.y + 2 });
export const ACCESS: Pt = { x: 1050, y: 26 };

/** Where each record's wire runs level through the checks, and where it ends inside the core. */
const band = (k: number) => 250 + (k - 2) * 17;
const sink = (k: number) => CORE.y + 34 + (k - 2) * 9;
const left = (k: number, o: number) => {
  const r = RECORDS[k];
  const x0 = r.x + REC_W / 2 + 4;
  const y0 = r.y + o;
  const ym = band(k) + o;
  const ye = sink(k) + o;
  return `M${x0} ${y0}C${x0 + 46} ${y0} ${300} ${ym} ${344} ${ym}H${598}C${640} ${ym} ${650} ${ye} ${CORE.x - 10} ${ye}`;
};
const right = (k: number, o: number) => {
  const s = SITES[k];
  const ys = CORE.y + 40 + (k - 1.5) * 12 + o;
  const x1 = s.x - 66;
  return `M${CORE.x + 10} ${ys}C${CORE.x + 120} ${ys} ${x1 - 90} ${s.y + o} ${x1} ${s.y + o}`;
};
export const WIRES_IN = RECORDS.map((_, k) => ({ d: left(k, 0), d2: left(k, 4) }));
export const WIRES_OUT = SITES.map((_, k) => ({ d: right(k, 0), d2: right(k, 4) }));

/** The dots: where each record's wire leaves it, where the wires pierce
    each check, and where they reach each authority. */
export const PORTS: Pt[] = RECORDS.map((r) => ({ x: r.x + REC_W / 2 + 4, y: r.y }));
export const PIERCE: Pt[] = PANES.flatMap((p) => RECORDS.map((_, k) => ({ x: p.x, y: band(k) })));
export const ENDS: Pt[] = SITES.map((s) => ({ x: s.x - 66, y: s.y }));
