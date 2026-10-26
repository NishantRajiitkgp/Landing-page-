/** Act one of the `/technology` future-of-trust scene (`./TechFuture`):
    the persistent trust layer. The road the page travelled braids into
    HelloVerify's core, three layers stacked; an identity, a business and
    a credential drop onto its orbit, are scanned and ticked, and each is
    stored, a stream of data down its tether lighting its layer. Then the
    orbit is watched: a sweep turns with the scroll, each card glowing as
    it passes, their heartbeats run, and each is updated in turn, its old
    version slipping behind it. The ping rings on the core are act two's,
    one per organisation's key arriving. */
import type { CSSProperties } from "react";
import { CAP, Glyph, ID, OFFICE, PERSON, n, type TechArt } from "./TechPillarKit";
import { gr, on, run } from "./TechRoadKit";
import { At, Word, ride } from "./TechFutureKit";
import { ASSETS, BRAID, BRAID_C, C, ECG, LAYER, MONITOR, ORBIT, ORBIT_D, ORGS, TETHERS, qd } from "./techFuturePlan";

const R = ORBIT.rx;
/** The sweep's trail: thin wedges behind its leading edge, fading out. */
const TRAIL = Array.from({ length: 9 }, (_, i) => {
  const a0 = (-(i + 1) * 5 * Math.PI) / 180;
  const a1 = (-i * 5 * Math.PI) / 180;
  return { d: `M0 0L${n(R * Math.cos(a0))} ${n(R * Math.sin(a0))}A${R} ${R} 0 0 1 ${n(R * Math.cos(a1))} ${n(R * Math.sin(a1))}z`, o: n(0.15 * (1 - i / 9)) };
});
const GLYPHS = [ID, OFFICE, CAP];
/** Each layer lights once its asset's data has streamed in. */
const STORED = ASSETS.map((s) => s.at + 0.16);

/** One of the core's layers, its top face at `y`: a slab of the stack with
    its asset's glyph on its rim and a band that lights when it is filled. */
function Layer({ y, k }: { y: number; k: number }) {
  const { rx, ry, th } = LAYER;
  const x0 = C.x - rx;
  const x1 = C.x + rx;
  const rim = `M${x0} ${y}A${rx} ${ry} 0 0 0 ${x1} ${y}V${y + th}A${rx} ${ry} 0 0 1 ${x0} ${y + th}z`;
  const band = `M${x0} ${y + th / 2}A${rx} ${ry} 0 0 0 ${x1} ${y + th / 2}`;
  return (
    <g>
      <path d={rim} fill={gr("steel")} className="tk-rd-edge" />
      <path className="tk-rd-p tk-rd-draw tk-ft-band" style={on(STORED[k])} d={band} pathLength={1} />
      <ellipse cx={C.x} cy={y} rx={rx} ry={ry} fill={k ? gr("card") : gr("red")} className="tk-rd-edge" />
      {k === 0 ? (
        <>
          <ellipse className="tk-rd-lnw tk-rd-faint" cx={C.x} cy={y} rx={rx - 12} ry={ry - 4} />
          <path className="tk-rd-lnw tk-rd-thick5 tk-uf" d={`M${C.x - 15} ${y - 1}l9 7 21-12`} />
        </>
      ) : (
        <ellipse className="tk-ft-face-l" cx={C.x} cy={y} rx={rx - 14} ry={ry - 5} />
      )}
      <g className="tk-rd-p tk-ft-lit" style={on(STORED[k])}>
        <Glyph g={GLYPHS[k]} x={C.x} y={y + ry + th / 2} s={0.5} cls="tk-ic" />
      </g>
    </g>
  );
}

/** The parts of act one under the cards: the braid, the orbit and its
    sweep, the tethers and the data streaming down them. */
export function CoreBack() {
  return (
    <g className="tk-ft-a1">
      <path className="tk-rd-p tk-rd-fade tk-rd-orbit" style={on(0.1)} d={ORBIT_D} />
      <path className="tk-rd-t tk-rd-orbit-lit tk-ft-orbit" style={run(0.42, 0.16)} d={ORBIT_D} pathLength={1} />
      <g className="tk-rd-p tk-rd-fade" style={on(0.48)}>
        <g className="tk-ft-sweep">
          {TRAIL.map((s, i) => (
            <path key={i} className="tk-ft-trail" style={{ "--o": s.o } as CSSProperties} d={s.d} />
          ))}
          <path className="tk-ft-edge" d={`M0 0H${R}`} />
        </g>
      </g>
      {TETHERS.map((q, k) => (
        <g key={k} className="tk-ft-zf">
          <path className="tk-rd-t tk-ft-teth" data-a={k} style={run(ASSETS[k].at + 0.06, 0.06)} d={qd(q)} pathLength={1} />
          <path className="tk-rd-p tk-ft-flow" style={on(STORED[k])} d={qd(q)} pathLength={1} />
          {[0, 1, 2].map((j) => (
            <circle key={j} className="tk-rd-t tk-ft-ride tk-ft-bit" style={ride(ASSETS[k].at + 0.08 + j * 0.016, 0.06, q)} r="3.6" />
          ))}
        </g>
      ))}
    </g>
  );
}

/** The braid arriving from the road, in its own drawing so it can fade in from the edge. */
export function Braid() {
  return (
    <svg className="tk-ft-svg tk-ft-braid tk-mirror tk-ft-a1" viewBox="0 0 800 700" fill="none">
      <path className="tk-rd-t tk-ft-braid-g" style={run(0, 0.12)} d={BRAID_C} pathLength={1} />
      {BRAID.map((d, k) => (
        <path key={k} className={`tk-rd-t tk-ft-str tk-rd-s${k}`} style={run(0, 0.12)} d={d} pathLength={1} />
      ))}
    </svg>
  );
}

/** The core: three layers on a glow, standing ready before the story
    starts so the section never arrives empty, and act two's ping rings. */
export function CoreStack() {
  return (
    <>
      <g className="tk-ft-a1">
        <circle cx={C.x} cy={C.y} r="150" fill={gr("glow")} />
        <ellipse cx={C.x} cy={C.y + 74} rx="96" ry="16" fill={gr("shade")} />
        {[...LAYER.y].reverse().map((y, i) => (
          <Layer key={y} y={y} k={2 - i} />
        ))}
      </g>
      <g className="tk-ft-a2">
        {ORGS.map((o) => (
          <ellipse key={o.a} className="tk-rd-t tk-rd-ripple" style={run(o.a + 0.12, 0.08)} cx={C.x} cy={LAYER.y[0]} rx={LAYER.rx + 6} ry={LAYER.ry + 4} />
        ))}
      </g>
    </>
  );
}

const FACES = [PERSON, OFFICE, CAP];

/** The three assets as cards on the orbit, with the word for the watch.
    They fold away into the core as the view pulls back. */
export function Assets({ a }: { a: TechArt }) {
  const names = [
    [a.story.person, a.story.kyc],
    [a.future.company, a.future.business],
    [a.story.eduValue, a.story.degree],
  ];
  return (
    <div className="tk-ft-a1 tk-ft-zf">
      {ASSETS.map((s, k) => (
        <At key={k} p={s} ph={0.2 + k * 0.31} cls="tk-ft-asset" vars={{ "--ang": `${s.ang}deg`, "--up": s.up }}>
          <div className="tk-rd-p tk-rd-drop" style={on(s.at)}>
            <i className="tk-ft-ver" />
            <div className="tk-ft-card" data-a={k}>
              <span className="tk-ft-face">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d={FACES[k]} />
                </svg>
              </span>
              <span className="tk-ft-tx">
                <b>{names[k][0]}</b>
                <small>{names[k][1]}</small>
              </span>
              <span className="tk-rd-p tk-rd-pop tk-ft-mk" style={on(s.at + 0.07)}>
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="8" />
                  <path d="M4.6 8.3l2.3 2.3 4.6-4.9" />
                </svg>
              </span>
              <span className="tk-ft-row">
                <svg className="tk-ft-ecg" viewBox="0 0 120 20" aria-hidden="true">
                  <path className="tk-ft-ecg0" d={ECG} />
                  <path className="tk-ft-ecg1" d={ECG} pathLength={1} />
                </svg>
                <span className="tk-ft-st">
                  <span className="tk-rd-p tk-ft-st-v" style={on(s.at + 0.07)}>{a.story.verified}</span>
                  <span className="tk-ft-st-l">{a.future.live}</span>
                  <span className="tk-ft-st-u">{a.future.updated}</span>
                </span>
              </span>
              <i className="tk-rd-t tk-ft-scan" style={run(s.at + 0.008, 0.055)} />
            </div>
          </div>
        </At>
      ))}
      <Word p={MONITOR} at={0.52}>{a.monitored}</Word>
    </div>
  );
}
