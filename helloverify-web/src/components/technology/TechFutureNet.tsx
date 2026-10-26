/** Act three of the `/technology` future-of-trust scene (`./TechFuture`):
    digital trust infrastructure. As the view pulls back the core's hub
    shrinks to the middle of a network standing on a ground of rings and
    spokes, every node waiting in outline. Ripples run out from the core
    and traces carry its current to the inner ring, then the outer, each
    node lit and ticked as it is reached, out to the nodes beyond the
    board. Over it all sits HelloVerify, its caption telling the story:
    verified once and used by four, then the verification provider struck
    through for the trust infrastructure. */
import type { CSSProperties } from "react";
import { Logo } from "@/components/brand/Logo";
import { CARD, CAP, CASE, GLOBE, INST, OFFICE, SHIELD, type TechArt } from "./TechPillarKit";
import { on, run } from "./TechRoadKit";
import { Tile } from "./TechFutureKit";
import { C, GRID, MESH, NODES, ORGS, pc } from "./techFuturePlan";

const KINDS = [INST, OFFICE, CARD, CAP, SHIELD, CASE, GLOBE];

/** The network, behind the hub. */
export function TechFutureNet() {
  return (
    <div className="tk-ft-lay tk-ft-net tk-ft-a3">
      <svg className="tk-ft-svg tk-ft-ground tk-mirror" viewBox="0 0 800 700" fill="none" aria-hidden="true">
        <path className="tk-ft-grid" d={GRID} />
      </svg>
      <svg className="tk-ft-svg tk-mirror" viewBox="0 0 800 700" fill="none" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <ellipse key={i} className="tk-rd-t tk-ft-wave" style={run(0.02 + i * 0.16, 0.42)} cx={C.x} cy={C.y} rx="120" ry="78" />
        ))}
        <path className="tk-rd-p tk-ft-mesh" style={on(0.8)} d={MESH} />
        {NODES.map(({ d, t0, far }, k) => (
          <g key={k} className={far ? "tk-ft-farl" : undefined}>
            <path className="tk-ft-tr" d={d} />
            <path className="tk-rd-t tk-ft-tr-on" style={run(t0, 0.12)} d={d} pathLength={1} />
            {!far && <path className="tk-rd-p tk-ft-flow" style={on(t0 + 0.12)} d={d} pathLength={1} />}
          </g>
        ))}
        {NODES.map(({ p, t0, far }, k) => (
          <Tile key={k} p={p} g={KINDS[k % KINDS.length]} t={t0 + 0.12} far={far} />
        ))}
      </svg>
    </div>
  );
}

const BADGE = { x: C.x, y: 480 };

/** HelloVerify, under the core, and the caption that tells each act. It
    rises under the shrinking core as the view pulls back. */
export function Badge({ a }: { a: TechArt }) {
  return (
    <div className="tk-ft-badge" style={pc(BADGE) as CSSProperties}>
      <span className="tk-ft-logo">
        <Logo width={92} height={27} />
      </span>
      <span className="tk-ft-cap">
        <span className="tk-ft-a2 tk-ft-cap-once">
          <span className="tk-rd-p tk-rd-rise tk-ft-chip" style={on(0.02)}>
            {a.once}
            <span className="tk-ft-dots">
              {ORGS.map((o) => (
                <i key={o.a} className="tk-rd-p" style={on(o.a + 0.2)} />
              ))}
            </span>
          </span>
        </span>
        <span className="tk-ft-a3 tk-ft-cap-was">
          <span className="tk-rd-p tk-ft-gone" style={on(0.8)}>
            <span className="tk-rd-p tk-rd-rise tk-ft-chip" style={on(0.04)}>
              <span className="tk-rd-p tk-ft-x" style={on(0.7)}>{a.road.start}</span>
            </span>
          </span>
        </span>
        <span className="tk-ft-a3">
          <span className="tk-rd-p tk-rd-rise tk-ft-chip tk-ft-chip-on" style={on(0.82)}>
            {a.future.infra}
          </span>
        </span>
      </span>
    </div>
  );
}
