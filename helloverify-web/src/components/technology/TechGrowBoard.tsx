/** The scene of the `/technology` compounding story (`./TechCompound`):
    every part of all three acts, drawn once, for `./techGrow` to place.
    Until it does (and without script) the scene rests on act two's
    network, so each part carries its place there: `--x`/`--y`, in scene
    units, of the wide layout (`./techGrowPlan`); `./techGrow` moves them
    to the tall one on a phone. Every card has one chip, the institution or
    the fraud its check gives up. Each bond is two strands braided round a
    curve, with a glow under it and a pulse each way; trusted nodes knit
    into a web, and rings of trust gather round the hub. The first
    candidate, the look-alike and four of the cities are the pillar story's
    and the hero's. Nothing here is read out. */
import Image from "next/image";
import type { CSSProperties } from "react";
import { Logo } from "@/components/brand/Logo";
import type { PlatformCopy } from "@/lib/copy/platform";
import { CAP, DB as DB_ICON, INST, OFFICE, PERSON, SEAL, SHIELD, type TechArt } from "./TechPillarKit";
import { TechGrowCrowd } from "./TechGrowCrowd";
import { CARDS, CHIP, FRAUDS, INSTS, MESH, ROWS, SH, WIDE as L, curveD, hubOf, rowAt, slotAt, strands, tieOf } from "./techGrowPlan";

type G = PlatformCopy["technology"]["compound"]["grow"];
const CROSS = "M9.5 4.5h5v5h5v5h-5v5h-5v-5h-5v-5h5z";
const GLYPH = { uni: CAP, firm: OFFICE, council: CROSS, regulator: SHIELD } as const;
const FRAUD_GLYPH = { lookalike: INST, seal: SEAL } as const;
const TICK = "M4.4 8.3 6.9 10.8 11.6 5.6";
const NO = "M5.6 5.6l4.8 4.8M10.4 5.6l-4.8 4.8";
/** Case numbers for the rows the database already held. */
const CASES = ["#20418", "#31077", "#48212", "#52906", "#60133"];
/** The rings of trust round the hub: radii across and down. */
const AURA = [[104, 54], [134, 72], [164, 90]] as const;

const at = (p: { x: number; y: number }, more: Record<string, number> = {}) => ({ "--x": p.x, "--y": p.y, ...more }) as CSSProperties;

function Ico({ g }: { g: string }) {
  return (
    <svg viewBox="0 0 24 24">
      <path d={g} />
    </svg>
  );
}

function Mark({ bad }: { bad?: boolean }) {
  return (
    <span className={bad ? "tk-cx-mk tk-cx-mk-bad" : "tk-cx-mk"}>
      <svg viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="8" />
        <path d={bad ? NO : TICK} />
      </svg>
    </span>
  );
}

function Flag({ cc }: { cc: string }) {
  return <Image className="tk-cx-flag" src={`/flags/${cc}.svg`} alt="" width={11} height={8} unoptimized />;
}

export function TechGrowBoard({ g, art }: { g: G; art: TechArt }) {
  const s = art.story;
  const gl = art.globe;
  const who: Record<string, string> = {
    person: s.person, p2: g.p2, p3: g.p3, p4: g.p4, p5: g.p5, p6: g.p6, p7: g.p7, p8: g.p8,
    p10: g.p10, p12: g.p12, p13: g.p13, p14: g.p14,
  };
  const check = { degree: s.degreeKey, employment: s.employment, licence: g.licence, registration: g.registration };
  const city = {
    delhi: g.delhi, singapore: gl.singapore, london: gl.london, dubai: gl.dubai, boston: gl.boston,
    frankfurt: g.frankfurt, sydney: g.sydney, manila: g.manila, riyadh: g.riyadh, tokyo: g.tokyo,
  };
  /** Each fraud's chip: what it read as before the check, and what it is. */
  const fraud = {
    lookalike: { was: [s.fake, g.uni], is: [s.fake, s.blacklisted] },
    seal: { was: [g.uni, gl.london], is: [g.seal, g.sealSub] },
  };
  const masked = (r: number) => who[CARDS.find((c) => c.fraud === r)?.who ?? ""];
  const rows = [
    { label: s.blacklisted, id: masked(0) },
    { label: g.seal, id: masked(1) },
    { label: g.employer, id: CASES[0] },
    { label: g.dates, id: CASES[1] },
    { label: g.grades, id: CASES[2] },
    { label: g.fakeLicence, id: CASES[3] },
    { label: g.identity, id: CASES[4] },
  ].slice(0, ROWS);
  const hub = hubOf(L);

  return (
    <div className="tk-cx-board" aria-hidden="true">
      <div className="tk-cx-art" data-act="1">
        <div className="tk-cx-world">
          <svg className="tk-cx-bonds" viewBox={`0 0 ${L.sw} ${SH}`}>
            <g className="tk-cx-far">
              {L.wider.map((w, i) => (
                <line key={i} x1={hub.cx} y1={hub.cy} x2={w.x + CHIP.w / 2} y2={w.y + CHIP.h / 2} />
              ))}
            </g>
            {AURA.map(([rx, ry], i) => (
              <ellipse key={rx} className="tk-cx-aura" data-aura={i} cx={hub.cx} cy={hub.cy} rx={rx} ry={ry} />
            ))}
            <line className="tk-cx-dblink" x1={hub.cx} y1={hub.cy} x2={hub.cx} y2={L.db.y} />
            {MESH.map(([a, b], i) => (
              <line key={i} className="tk-cx-mesh" data-mesh={i} x1={L.insts[a][0]} y1={L.insts[a][1]} x2={L.insts[b][0]} y2={L.insts[b][1]} />
            ))}
            {INSTS.map((c, k) => {
              const cv = tieOf(L, k);
              const [sa, sb] = strands(cv, 1, 1, 0);
              return (
                <g key={c.city} className="tk-cx-tie" data-tie={k}>
                  <path className="tk-cx-tie-glow" d={curveD(cv)} pathLength={1} />
                  <path className="tk-cx-tie-a" d={sa} />
                  <path className="tk-cx-tie-b" d={sb} />
                  <circle className="tk-cx-pulse" r={3} cx={hub.cx} cy={hub.cy} />
                  <circle className="tk-cx-pulse tk-cx-pulse-back" r={2.2} cx={hub.cx} cy={hub.cy} />
                </g>
              );
            })}
            <circle className="tk-cx-pulse tk-cx-pulse-bad" data-dbpulse="" r={3} cx={hub.cx} cy={hub.cy} />
          </svg>

          <TechGrowCrowd />

          {CARDS.map((c, i) => (
            <div key={c.who} className="tk-cx-at tk-cx-card" data-card={i} data-bad={c.fraud === undefined ? undefined : ""} style={at({ x: L.cards[i][0], y: L.cards[i][1] })}>
              <span className="tk-cx-who">
                <span className="tk-cx-face">
                  <Ico g={PERSON} />
                  <Mark bad={c.fraud !== undefined} />
                </span>
                <span className="tk-cx-tx">
                  <b>{who[c.who]}</b>
                  <small>{check[c.check]}</small>
                </span>
              </span>
              <i className="tk-cx-beam" />
            </div>
          ))}

          <div className="tk-cx-at tk-cx-db" data-safe="" style={at(L.db)}>
            <span className="tk-cx-db-h">
              <Ico g={DB_ICON} />
              <b>{art.fraudDb}</b>
              <span className="tk-cx-safe">
                <Ico g={SHIELD} />
                {g.safe}
              </span>
            </span>
            <ul>
              {rows.map((r, i) => (
                <li key={r.label} data-row={i}>
                  <svg className="tk-cx-x" viewBox="0 0 16 16">
                    <circle cx="8" cy="8" r="8" />
                    <path d={NO} />
                  </svg>
                  <span className="tk-cx-row-l">{r.label}</span>
                  <span className="tk-cx-id">
                    <span>{r.id}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="tk-cx-at tk-cx-hub" style={at(hub)}>
            <Logo width={100} height={29} />
            <small>
              {g.since}
              <b className="tk-cx-year">{g.today}</b>
            </small>
          </div>

          {CARDS.map((c, i) => {
            if (c.fraud !== undefined) {
              const f = fraud[FRAUDS[c.fraud]];
              return (
                <div key={c.who} className="tk-cx-at tk-cx-chip" data-chip={i} data-s="fraud" style={at(rowAt(L, c.fraud))}>
                  <span className="tk-cx-ico">
                    <Ico g={FRAUD_GLYPH[FRAUDS[c.fraud]]} />
                  </span>
                  <span className="tk-cx-tx">
                    <b className="tk-cx-swap">
                      <span>{f.was[0]}</span>
                      <span>{f.is[0]}</span>
                    </b>
                    <small className="tk-cx-swap">
                      <span>{f.was[1]}</span>
                      <span>{f.is[1]}</span>
                    </small>
                  </span>
                  <Mark bad />
                </div>
              );
            }
            const n = INSTS[c.inst ?? 0];
            return (
              <div key={c.who} className="tk-cx-at tk-cx-chip" data-chip={i} data-s="trusted" style={at(slotAt(L, c.inst ?? 0), { "--trust": 1 })}>
                <span className="tk-cx-ico">
                  <Ico g={GLYPH[n.kind]} />
                </span>
                <span className="tk-cx-tx">
                  <b>{g[n.kind]}</b>
                  <small>
                    <Flag cc={n.flag} />
                    {city[n.city]}
                  </small>
                </span>
                <Mark />
                <i className="tk-cx-trust" />
              </div>
            );
          })}
        </div>

        <div className="tk-cx-figs">
          {[g.checks, g.clients, g.countries].map((f) => (
            <span key={f.l}>
              <b data-fig={f.v}>{f.v}</b>
              <small>{f.l}</small>
            </span>
          ))}
        </div>

        <p className="tk-cx-cap">{g.cap}</p>
      </div>
    </div>
  );
}
