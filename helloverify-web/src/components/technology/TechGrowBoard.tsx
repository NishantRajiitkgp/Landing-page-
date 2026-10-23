/** The board of the `/technology` compounding story (`./TechCompound`):
    every part of all three acts, drawn once, for `./techGrow` to place.
    Until it does (and without script) the board rests on act two's
    network, so each part carries its place there: `--x`/`--y`, in board
    units (`./techGrowPlan`). The candidate, look-alike, institutions and
    cities are the pillar story's and the hero's. Nothing here is read out. */
import Image from "next/image";
import type { CSSProperties } from "react";
import { Logo } from "@/components/brand/Logo";
import type { PlatformCopy } from "@/lib/copy/platform";
import { CAP, DB as DB_ICON, INST, OFFICE, PERSON, SEAL, SHIELD, type TechArt } from "./TechPillarKit";
import { CARDS, DB, FRAUDS, HC, HUB, INSTS, ROWS, SH, SLOTS, SW, cardAt, rowAt } from "./techGrowPlan";

type G = PlatformCopy["technology"]["compound"]["grow"];
const CROSS = "M9.5 4.5h5v5h5v5h-5v5h-5v-5h-5v-5h5z";
const GLYPH = { uni: CAP, firm: OFFICE, council: CROSS, regulator: SHIELD } as const;
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
  return <Image className="tk-cx-flag" src={`/flags/${cc}.svg`} alt="" width={12} height={8} unoptimized />;
}

export function TechGrowBoard({ g, art }: { g: G; art: TechArt }) {
  const s = art.story;
  const gl = art.globe;
  const who = { person: s.person, p2: g.p2, p3: g.p3, p4: g.p4, p5: g.p5, p6: g.p6 };
  const check = { degree: s.degreeKey, employment: s.employment, licence: g.licence, registration: g.registration };
  const city = { delhi: g.delhi, singapore: gl.singapore, london: gl.london, dubai: gl.dubai, boston: gl.boston };
  const rows = [
    { label: s.blacklisted, id: g.p4 },
    { label: g.seal, id: g.p6 },
    { label: g.dates, id: CASES[0] },
    { label: g.employer, id: CASES[1] },
    { label: g.grades, id: CASES[2] },
  ].slice(0, ROWS);

  return (
    <div className="tk-cx-board" aria-hidden="true">
      <div className="tk-cx-art" data-act="1">
        <div className="tk-cx-world">
          <svg className="tk-cx-bonds" viewBox={`0 0 ${SW} ${SH}`}>
            <line className="tk-cx-dblink" x1={HC.x} y1={HC.y} x2={HC.x} y2={DB.y} />
            {SLOTS.map((p) => (
              <line key={p.cx} className="tk-cx-bond" x1={HC.x} y1={HC.y} x2={p.cx} y2={p.cy} pathLength={1} />
            ))}
            {SLOTS.map((p) => (
              <circle key={p.cx} className="tk-cx-pulse" r={3.2} cx={HC.x} cy={HC.y} />
            ))}
            <circle className="tk-cx-pulse tk-cx-pulse-bad" r={3.2} cx={HC.x} cy={HC.y} />
          </svg>

          {CARDS.map((c, i) => (
            <div key={c.who} className="tk-cx-at tk-cx-card" data-card={i} data-bad={c.bad ? "" : undefined} style={at(cardAt(i))}>
              <span className="tk-cx-who">
                <span className="tk-cx-face">
                  <Ico g={PERSON} />
                </span>
                <span className="tk-cx-tx">
                  <b>{who[c.who]}</b>
                  <small>{check[c.check]}</small>
                </span>
                <Mark bad={c.bad} />
              </span>
              <span className="tk-cx-doc">
                <i />
                <i />
                <i />
                <b className="tk-cx-seal" />
              </span>
              <i className="tk-cx-beam" />
            </div>
          ))}

          <div className="tk-cx-at tk-cx-db" data-safe="" style={at(DB)}>
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

          <div className="tk-cx-at tk-cx-hub" style={at(HUB)}>
            <Logo width={100} height={29} />
          </div>

          {INSTS.map((c, k) => (
            <div key={c.city} className="tk-cx-at tk-cx-chip" data-inst={k} data-s="trusted" style={at(SLOTS[k], { "--trust": 1 })}>
              <span className="tk-cx-ico">
                <Ico g={GLYPH[c.kind]} />
              </span>
              <span className="tk-cx-tx">
                <b>{g[c.kind]}</b>
                <small>
                  <Flag cc={c.flag} />
                  {city[c.city]}
                </small>
              </span>
              <Mark />
              <i className="tk-cx-trust" />
            </div>
          ))}

          {FRAUDS.map((f, r) => (
            <div key={f.kind} className="tk-cx-at tk-cx-chip" data-fraud={r} data-s="fraud" style={at(rowAt(r))}>
              <span className="tk-cx-ico">
                <Ico g={f.kind === "seal" ? SEAL : INST} />
              </span>
              <span className="tk-cx-tx">
                <b>{f.kind === "seal" ? g.seal : s.fake}</b>
                <small className="tk-cx-swap">
                  <span>{f.kind === "seal" ? g.sealSub : g.uni}</span>
                  <span>{f.kind === "seal" ? g.sealSub : s.blacklisted}</span>
                </small>
              </span>
              <Mark bad />
            </div>
          ))}
        </div>

        <canvas className="tk-cx-cv" />

        <div className="tk-cx-tag">
          <span data-a="0">
            <i className="tk-cx-live" />
            {g.live}
          </span>
          <span data-a="1">
            {g.since}
            <b className="tk-cx-year">{g.today}</b>
          </span>
          <span data-a="2">
            <i data-k="u" />
            {g.candidates}
            <i data-k="i" />
            {g.institutions}
            <i data-k="f" />
            {g.fraud}
          </span>
        </div>

        <div className="tk-cx-tally">
          {[g.read, g.found, g.patterns].map((l, i) => (
            <span key={l}>
              <b data-tally={i}>{[CARDS.length, INSTS.length, FRAUDS.length][i]}</b>
              <small>{l}</small>
            </span>
          ))}
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
