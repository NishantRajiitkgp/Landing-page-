/** "Building the Future of Digital Trust" on `/technology`: one board,
    standing still, under the heading and over the three layers.

    Five records (identity, employment, education, criminal, business) send
    their wires through four panes of glass (verify, validate, monitor,
    update) into a glass sphere holding HelloVerify's shield: the
    persistent trust layer. It sits on HelloVerify's platform, and from it
    wires run out to four authorities on their slabs: trusted access.

    Pointing at a layer, or at its part of the board, lights that part and
    quiets the rest (`./TechFutureStage`): the records, checks and sphere
    for the persistent layer; the authorities for trusted access; the
    platform and every wire for the infrastructure. The board is
    decoration (`aria-hidden`); its parts are `./TechFutureArt`. */
import "@/app/v2/tech.css";
import type { TechArt } from "./TechPillarKit";
import { TechFutureStage } from "./TechFutureStage";
import { Core, FutureDefs, Panes, Records, Sites } from "./TechFutureArt";
import { ENDS, PIERCE, PORTS, WIRES_IN, WIRES_OUT, type Pt } from "./techFuturePlan";

/** A wire: a soft glow, a fine companion strand, the line itself, and the
    current that runs along it while its layer is lit. */
function Wire({ d, d2, g }: { d: string; d2: string; g: string }) {
  return (
    <g className="tk-ft-wire" data-g={g}>
      <path className="tk-ft-glow" d={d} />
      <path className="tk-ft-ln2" d={d2} />
      <path className="tk-ft-ln" d={d} />
      <path className="tk-ft-flow" d={d} pathLength={1} />
    </g>
  );
}
const Dots = ({ pts, g, s }: { pts: Pt[]; g: string; s?: boolean }) => (
  <g data-g={g}>
    {pts.map((p, i) => (
      <circle key={i} className={s ? "tk-ft-dot tk-ft-dot-s" : "tk-ft-dot"} cx={p.x} cy={p.y} r={s ? 3 : 4} />
    ))}
  </g>
);

/** The heading, its closing stop picked out in red. */
function Heading({ h }: { h: string }) {
  const stop = /[.।]$/.test(h);
  return (
    <h2 className="h2 tk-ft-h">
      {stop ? h.slice(0, -1) : h}
      {stop && <span className="tk-ft-stop">{h.slice(-1)}</span>}
    </h2>
  );
}

export function TechFuture({ h, cards, art }: { h: string; cards: { t: string; p: string }[]; art: TechArt }) {
  const f = art.future;
  return (
    <TechFutureStage>
      <FutureDefs />
      <Heading h={h} />

      <div className="tk-ft-stage" aria-hidden="true">
        <div className="tk-ft-board">
          <svg className="tk-ft-wires tk-mirror" viewBox="0 0 1200 520" fill="none">
            {WIRES_IN.map((w, k) => (
              <Wire key={k} {...w} g="0 2" />
            ))}
            {WIRES_OUT.map((w, k) => (
              <Wire key={k} {...w} g="1 2" />
            ))}
          </svg>
          <Records names={[f.identity, f.employment, f.education, f.criminal, f.business]} />
          <Panes names={[f.verify, f.validate, f.monitor, f.update]} />
          <Core tag={cards[0].t} />
          <Sites names={[f.gov, f.enterprise, f.medical, f.edu]} tag={cards[1].t} />
          <svg className="tk-ft-wires tk-ft-front tk-mirror" viewBox="0 0 1200 520" fill="none">
            <Dots pts={PORTS} g="0 2" />
            <Dots pts={PIERCE} g="0 2" s />
            <Dots pts={ENDS} g="1 2" />
          </svg>
        </div>
      </div>

      <ol className="tk-ft-items">
        {cards.map((c, i) => (
          <li key={c.t} className="tk-ft-item" data-hg={i}>
            <span className="tk-ft-rule" aria-hidden="true">
              <span className="tk-ft-num">{String(i + 1).padStart(2, "0")}</span>
              <i />
            </span>
            <h3>
              <button type="button" className="tk-ft-go" aria-pressed="false">
                {c.t}
              </button>
            </h3>
            <p>{c.p}</p>
          </li>
        ))}
      </ol>
    </TechFutureStage>
  );
}
