/** Act two of the `/technology` future-of-trust scene (`./TechFuture`):
    trusted access. A government, an enterprise, a bank and a hospital rise
    at the corners, each beside the repeat check it would otherwise run.
    In turn each sends a key down its line to the core, the core pings, and
    the validated credential rides back in green: the organisation is
    ticked, its repeat check is struck off and fades, and the line stays
    live. */
import { Glyph, KEY, REFRESH, type TechArt } from "./TechPillarKit";
import { Tick, gr, on, run } from "./TechRoadKit";
import { At, Bank, Capitol, Hospital, Tower, Word, ride } from "./TechFutureKit";
import { BEAMS, CONSENT, ORGS, back, qd } from "./techFuturePlan";

/** Each organisation's drawing, its box and how wide it stands, and where its tick sits. */
const ART = [
  { Draw: Capitol, vb: [132, 124], w: 118, tick: [112, 34] },
  { Draw: Tower, vb: [112, 150], w: 92, tick: [96, 28] },
  { Draw: Bank, vb: [132, 112], w: 118, tick: [114, 22] },
  { Draw: Hospital, vb: [122, 124], w: 104, tick: [106, 26] },
];
/** When each organisation is answered: its tick, its line turning green. */
const DONE = ORGS.map((o) => o.a + 0.2);

/** The lines, the keys and the credentials, under the organisations. */
export function AccessBack() {
  return (
    <g className="tk-ft-a2">
      {BEAMS.map((q, k) => {
        const a0 = ORGS[k].a;
        const { x, y } = ORGS[k].gh;
        return (
          <g key={k}>
            <path className="tk-rd-p tk-rd-fade tk-ft-beam" style={on(a0)} d={qd(q)} />
            <path className="tk-rd-t tk-ft-req" style={run(a0 + 0.04, 0.08)} d={qd(q)} pathLength={1} />
            <path className="tk-rd-t tk-ft-ok" style={run(a0 + 0.13, 0.07)} d={qd(back(q))} pathLength={1} />
            <path className="tk-rd-p tk-ft-flow tk-ft-flow-ok" style={on(DONE[k])} d={qd(back(q))} pathLength={1} />
            <g className="tk-rd-t tk-ft-ride" style={ride(a0 + 0.05, 0.08, q)}>
              <circle className="tk-ft-tok" r="11" />
              <Glyph g={KEY} x={0} y={0} s={0.56} cls="tk-ic tk-ic-r" />
            </g>
            <g className="tk-rd-t tk-ft-ride" style={ride(a0 + 0.13, 0.07, back(q))}>
              <rect x="-11" y="-8" width="22" height="16" rx="3.5" fill={gr("ok")} />
              <path className="tk-rd-lnw tk-uf" d="M-4.6 .3l3 3 6-6.2" />
            </g>
            <g className="tk-rd-p tk-ft-gone" style={on(DONE[k] + 0.02)}>
              <g className="tk-rd-p tk-rd-fade" style={on(a0 + 0.03)}>
                <circle className="tk-ft-gh" cx={x} cy={y} r="16" />
                <Glyph g={REFRESH} x={x} y={y} s={0.62} cls="tk-ic tk-ic-m" />
                <path className="tk-rd-p tk-rd-draw tk-ft-strike" style={on(DONE[k] - 0.01)} d={`M${x - 15} ${y - 15}l30 30`} pathLength={1} />
              </g>
            </g>
          </g>
        );
      })}
    </g>
  );
}

/** The organisations themselves, and the words for them. */
export function Orgs({ a }: { a: TechArt }) {
  const names = [a.future.gov, a.future.enterprise, a.future.bank, a.future.hospital];
  return (
    <div className="tk-ft-a2">
      {ORGS.map((o, k) => {
        const { Draw, vb, w, tick } = ART[k];
        return (
          <At key={k} p={o} w={w} ph={0.15 + k * 0.27} cls="tk-ft-org">
            <div className="tk-rd-p tk-rd-rise" style={on(o.a)}>
              <i className="tk-rd-pc-sh" />
              <svg className="tk-ft-pcs tk-mirror" viewBox={`0 0 ${vb[0]} ${vb[1]}`} fill="none" aria-hidden="true">
                <Draw />
                <Tick x={tick[0]} y={tick[1]} r={10} at={DONE[k]} />
              </svg>
            </div>
          </At>
        );
      })}
      <div className="tk-ft-zf">
        {ORGS.map((o, k) => (
          <Word key={k} p={o.nm} at={o.a + 0.02}>{names[k]}</Word>
        ))}
        <Word p={{ x: CONSENT.x, y: CONSENT.y - 20 }} at={ORGS[0].a + 0.06}>{a.consent}</Word>
        {ORGS.map(({ gh, a: a0 }, k) => (
          <div key={k} className="tk-rd-p tk-ft-gone" style={on(DONE[k] + 0.02)}>
            <Word p={{ x: gh.x + (gh.x < 400 ? 86 : -86), y: gh.y }} at={a0 + 0.04}>
              <span className="tk-rd-p tk-ft-x" style={on(DONE[k] - 0.01)}>{a.future.repeat}</span>
            </Word>
          </div>
        ))}
      </div>
    </div>
  );
}
