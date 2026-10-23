/** The parts the `/technology` story cards are built from (`./TechPillars`).

    Every card is drawn on one 1200 × 380 grid, in card units, and the red
    thread crosses it at y 180. `At` places a box on that grid. Anything
    carrying `tk-sy-r` and an `--at` shows once the head (`--h`, written per
    card by `./TechPillarsStage`) has passed that point, so a card fills in
    from left to right as it is scrolled through, and empties if scrolled
    back. Without the stage, `--h` is unset and every card rests finished. */
import type { CSSProperties, ReactNode } from "react";
import { CAL, CAP, CASE, ID, PERSON, type TechArt } from "./TechPillarKit";

export type Story = TechArt["story"];

export const W = 1200;
export const H = 380;
export const MID = 180;

export const v = (o: Record<string, number | string>) => o as CSSProperties;

/** A cubic from one point to another that leaves and lands level, so an
    arrowhead at the end can always point along the inline axis. */
export function curve(x1: number, y1: number, x2: number, y2: number) {
  const c = x1 + (x2 - x1) * 0.55;
  return `M${x1} ${y1}C${c} ${y1} ${c} ${y2} ${x2} ${y2}`;
}

/** A box on the card grid; `fx` names how it arrives (see `tk-sy-*` in tech.css). */
export function At({ x, y, w, h, at, fx = "tk-sy-rise", children }: { x: number; y: number; w: number; h?: number; at: number; fx?: string; children?: ReactNode }) {
  const box: Record<string, number> = { "--ax": x, "--ay": y, "--aw": w, "--at": at };
  if (h !== undefined) box["--ah"] = h;
  return (
    <div className={`tk-sy-at tk-sy-r ${fx}`} style={v(box)}>
      {children}
    </div>
  );
}

/** Any element that shows when the head passes `at`. */
export function R({ at, fx = "", children }: { at: number; fx?: string; children?: ReactNode }) {
  return (
    <span className={`tk-sy-r ${fx}`} style={v({ "--at": at })}>
      {children}
    </span>
  );
}

export function Ico({ g, cls = "" }: { g: string; cls?: string }) {
  return (
    <svg className={`tk-sy-ico ${cls}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d={g} />
    </svg>
  );
}

/** Verified, or (with `bad`) refused. Pops in at `at`. */
export function Tick({ at, bad }: { at: number; bad?: boolean }) {
  return (
    <svg className={bad ? "tk-sy-tick tk-sy-tick-bad tk-sy-r tk-sy-pop" : "tk-sy-tick tk-sy-r tk-sy-pop"} viewBox="0 0 16 16" style={v({ "--at": at })} aria-hidden="true">
      <circle cx="8" cy="8" r="8" />
      <path d={bad ? "M5.4 5.4l5.2 5.2M10.6 5.4l-5.2 5.2" : "M4.4 8.3 6.9 10.8 11.6 5.6"} />
    </svg>
  );
}

/** The caption under a node, lit once its node is reached. */
export function Cap({ x, at, children }: { x: number; at: number; children: string }) {
  return (
    <span className="tk-sy-cap tk-sy-r" style={v({ "--ax": x, "--at": at })}>
      {children}
    </span>
  );
}

/** `01 / 03`, top corner of the card. */
export function Count({ i }: { i: number }) {
  return (
    <span className="tk-sy-n">
      <b>0{i + 1}</b> / 03
    </span>
  );
}

/** Where the thread comes in: a red node on the inline-start edge, lit as
    the case reaches the card. */
export function Entry({ x }: { x: number }) {
  return <i className="tk-sy-entry tk-sy-r tk-sy-pop" style={v({ "--ax": x, "--at": -30 })} />;
}

/** Where a card's first node arrives: with the case, before the head is on the card. */
export const HANDED = -70;

/** `to` is where an arrowhead goes; the path must arrive there level. */
export type Wire = { d: string; tone?: "line" | "ok" | "bad"; to?: readonly [number, number] };

/** A dashed connector from one node to the next, with its arrowhead. */
export const link = (x1: number, y1: number, x2: number, y2: number, tone?: Wire["tone"]): Wire => ({ d: curve(x1, y1, x2, y2), tone, to: [x2, y2] });

/** The solid thread, between the card edge and its first or last node. */
export const thread = (x1: number, x2: number): Wire => ({ d: `M${x1} ${MID}L${x2} ${MID}`, tone: "line" });

/** The connectors of one card, twice over: a faint dashed route that is
    always there, and the live one on top, wiped in by the head so it runs
    left to right exactly as far as the story has got. */
export function Wires({ id, wires, children }: { id: string; wires: Wire[]; children?: ReactNode }) {
  return (
    <svg className="tk-sy-wires tk-mirror" viewBox={`0 0 ${W} ${H}`} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-f`}>
          <stop offset=".985" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
          <rect className="tk-sy-wipe" x={-1300} y="0" width={W + 1300} height={H} fill={`url(#${id}-f)`} />
        </mask>
      </defs>
      <g className="tk-sy-ghost">
        {wires.map((w) => (
          <path key={w.d} d={w.d} />
        ))}
      </g>
      <g mask={`url(#${id}-m)`}>
        {wires.map((w) => (
          <g key={w.d} className={`tk-sy-w tk-sy-w-${w.tone ?? "flow"}`}>
            <path d={w.d} />
            {w.to && <path className="tk-sy-head" d={`M${w.to[0] - 8} ${w.to[1] - 4.5}L${w.to[0]} ${w.to[1]}L${w.to[0] - 8} ${w.to[1] + 4.5}Z`} />}
          </g>
        ))}
      </g>
      {children}
    </svg>
  );
}

type Row = { g: string; k: keyof Story; val: keyof Story | "pass" };

const ROWS: Row[] = [
  { g: PERSON, k: "name", val: "person" },
  { g: ID, k: "idNo", val: "pass" },
  { g: CAL, k: "dob", val: "dobValue" },
  { g: CAP, k: "education", val: "eduValue" },
  { g: CASE, k: "employment", val: "jobValue" },
];

/** The specimen passport number. A number, not a word, so not in the copy. */
export const PASS_NO = "P1234567";

/** The applicant's record, the thing that travels the whole story.

    - `fill`: rows are written in one at a time from this head position;
      otherwise they are already there.
    - `ticks`: each row is validated in turn from this head position.
    - `mark`: the two claims research has to check light up here. */
export function Profile({ s, title, fill, ticks, mark, children }: { s: Story; title?: string; fill?: number; ticks?: number; mark?: number; children?: ReactNode }) {
  return (
    <div className="tk-sy-pro">
      {title ? (
        <b className="tk-sy-k">{title}</b>
      ) : (
        <span className="tk-sy-who">
          <span className="tk-sy-face">
            <Ico g={PERSON} />
          </span>
          <span>
            <b>{s.person}</b>
            <small className="tk-sy-k">{s.profile}</small>
          </span>
        </span>
      )}
      <ul className="tk-sy-rows">
        {ROWS.map((r, i) => {
          const hot = mark !== undefined && i >= 3;
          return (
            <li key={r.k} className={hot ? "tk-sy-r tk-sy-mark" : undefined} style={hot ? v({ "--at": mark + (i - 3) * 30 }) : undefined}>
              <Ico g={r.g} />
              <span>{s[r.k]}</span>
              <R at={fill === undefined ? 0 : fill + i * 32} fx={fill === undefined ? "tk-sy-val" : "tk-sy-val tk-sy-type"}>
                {r.val === "pass" ? PASS_NO : s[r.val]}
              </R>
              {ticks !== undefined && <Tick at={ticks + i * 30} />}
            </li>
          );
        })}
      </ul>
      {children}
    </div>
  );
}
