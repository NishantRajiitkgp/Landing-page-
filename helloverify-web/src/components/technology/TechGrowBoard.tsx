/** The scene of the `/technology` compounding story (`./TechCompound`):
    every part of all three acts, drawn once, for `./techGrow` to place.
    Until it does (and without script) the scene rests on act two's
    network, so each part carries its place there: `--x`/`--y`, in scene
    units, of the wide layout (`./techGrowPlan`); `./techGrow` moves them
    to the tall one on a phone. Every card has one chip, the institution or
    the fraud its check gives up. The first candidate, the look-alike and
    four of the cities are the pillar story's and the hero's. Nothing here
    is read out. */
import Image from "next/image";
import type { CSSProperties } from "react";
import { Logo } from "@/components/brand/Logo";
import type { PlatformCopy } from "@/lib/copy/platform";
import { CAP, DB as DB_ICON, INST, OFFICE, PERSON, SEAL, SHIELD, CASE, CAL, type TechArt } from "./TechPillarKit";
import { CARDS, FRAUDS, INSTS, ROWS, SH, WIDE as L, hubOf, rowAt, slotAt } from "./techGrowPlan";

type G = PlatformCopy["technology"]["compound"]["grow"];
const CROSS = "M9.5 4.5h5v5h5v5h-5v5h-5v-5h-5v-5h5z";
const GLYPH = { uni: CAP, firm: OFFICE, council: CROSS, regulator: SHIELD } as const;
const FRAUD_GLYPH = { lookalike: INST, seal: SEAL, employer: CASE, dates: CAL } as const;
const TICK = "M4.4 8.3 6.9 10.8 11.6 5.6";
const NO = "M5.6 5.6l4.8 4.8M10.4 5.6l-4.8 4.8";
/** Case numbers for the rows the database already held. */
const CASES = ["#20418", "#31077", "#48212"];

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
  return <Image className="tk-cx-flag" src={`/flags/${cc}.svg`} alt="" width={10} height={7} unoptimized />;
}

export function TechGrowBoard({ g, art }: { g: G; art: TechArt }) {
  const s = art.story;
  const gl = art.globe;
  const who: Record<string, string> = {
    person: s.person, p2: g.p2, p3: g.p3, p4: g.p4, p5: g.p5, p6: g.p6, p7: g.p7, p8: g.p8,
    p9: g.p9, p10: g.p10, p11: g.p11, p12: g.p12, p13: g.p13, p14: g.p14, p15: g.p15,
  };
  const check = { degree: s.degreeKey, employment: s.employment, licence: g.licence, registration: g.registration };
  const city = {
    delhi: g.delhi, singapore: gl.singapore, london: gl.london, dubai: gl.dubai, boston: gl.boston,
    frankfurt: g.frankfurt, sydney: g.sydney, manila: g.manila, riyadh: g.riyadh, tokyo: g.tokyo,
  };
  /** Each fraud's chip: what it is, and what it read as before the check. */
  const fraud = {
    lookalike: { b: s.fake, was: g.uni, is: s.blacklisted },
    seal: { b: g.seal, was: g.sealSub, is: g.sealSub },
    employer: { b: g.employer, was: g.shell, is: g.shell },
    dates: { b: g.dates, was: g.sealSub, is: g.sealSub },
  };
  const masked = (r: number) => who[CARDS.find((c) => c.fraud === r)?.who ?? ""];
  const rows = [
    { label: s.blacklisted, id: masked(0) },
    { label: g.seal, id: masked(1) },
    { label: g.employer, id: masked(2) },
    { label: g.dates, id: masked(3) },
    { label: g.grades, id: CASES[0] },
    { label: g.fakeLicence, id: CASES[1] },
    { label: g.identity, id: CASES[2] },
  ].slice(0, ROWS);
  const hub = hubOf(L);

  return (
    <div className="tk-cx-board" aria-hidden="true">
      <div className="tk-cx-art" data-act="1">
        <div className="tk-cx-world">
          <svg className="tk-cx-bonds" viewBox={`0 0 ${L.sw} ${SH}`}>
            <line className="tk-cx-dblink" x1={hub.cx} y1={hub.cy} x2={hub.cx} y2={L.db.y} />
            {INSTS.map((c, k) => (
              <line key={c.city} className="tk-cx-bond" x1={hub.cx} y1={hub.cy} x2={L.insts[k][0]} y2={L.insts[k][1]} pathLength={1} />
            ))}
            {INSTS.map((c) => (
              <circle key={c.city} className="tk-cx-pulse" r={3} cx={hub.cx} cy={hub.cy} />
            ))}
            <circle className="tk-cx-pulse tk-cx-pulse-bad" r={3} cx={hub.cx} cy={hub.cy} />
          </svg>

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
                    <b>{f.b}</b>
                    <small className="tk-cx-swap">
                      <span>{f.was}</span>
                      <span>{f.is}</span>
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
          {[g.checks, g.clients, g.countries, g.flagged].map((f) => (
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
