/** The race on `/technology`'s compounding section (`./TechCompound`): the
    same eight cases from three customers, run on one clock by a system that
    keeps nothing and by HelloVerify, which keeps everything it learns.

    Each case is a tile as wide as the time it took. The static lane's tiles
    are all the same, and the forged degree in its fourth case goes through.
    HelloVerify's get narrower case by case, each one explained underneath
    and paid for by something in "What it keeps"; it catches the forgery and
    finishes all eight. Then its lane becomes the stream of every check since
    2018, and the site's figures come up.

    Positions come from `./techRaceData`; the clock (`--c`, in case units) and
    which case each lane is on are written by `./TechCompoundStage`. */
import type { CSSProperties } from "react";
import { Logo } from "@/components/brand/Logo";
import type { PlatformCopy } from "@/lib/copy/platform";
import { CAP, CASE } from "./TechPillarKit";
import { CASES, HV, KEEPS, SAY, SPAN, STATIC, type CaseKind } from "./techRaceData";

type R = PlatformCopy["technology"]["compound"]["race"];
type Lane = "st" | "hv";

const CROSS = "M9.5 4.5h5v5h5v5h-5v5h-5v-5h-5v-5h5z";
const ICON: Record<CaseKind, string> = { degree: CAP, employment: CASE, licence: CROSS };
const pc = (u: number) => `${((u / SPAN) * 100).toFixed(3)}%`;
const v = (o: Record<string, number | string>) => o as CSSProperties;

/** The stream every check since 2018 makes: thin bars, set once. */
const BARS = Array.from({ length: 150 }, (_, i) => ({ x: i * 6.6 + ((i * 7) % 3), h: 18 + ((i * 37) % 30), w: 2 + ((i * 13) % 3) }));

function Mark({ r }: { r: "ok" | "caught" | "missed" }) {
  return (
    <span className={`tk-rc-mark tk-rc-mark-${r}`}>
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="8" />
        <path d={r === "ok" ? "M4.4 8.3 6.9 10.8 11.6 5.6" : r === "caught" ? "M5.4 5.4l5.2 5.2M10.6 5.4l-5.2 5.2" : "M8 4.2v5M8 11.6v.2"} />
      </svg>
    </span>
  );
}

function Tiles({ lane, r }: { lane: Lane; r: R }) {
  const plan = lane === "st" ? STATIC : HV;
  return plan.map((t, i) => {
    const c = CASES[i];
    const res = c.forged ? (lane === "st" ? "missed" : "caught") : "ok";
    return (
      <div key={i} className={`tk-rc-t tk-rc-t-${res}`} style={{ insetInlineStart: pc(t.s), width: pc(t.d), ...v({ "--s": t.s, "--d": t.d }) }}>
        <span className="tk-rc-t-in">
          <svg className="tk-rc-ico" viewBox="0 0 24 24" aria-hidden="true">
            <path d={ICON[c.kind]} />
          </svg>
          <span className="tk-rc-t-tx">
            <b>{r[c.inst]}</b>
            <small>{r[c.kind]}</small>
          </span>
          <i className="tk-rc-from">{c.from}</i>
        </span>
        <i className="tk-rc-bar" />
        <Mark r={res} />
      </div>
    );
  });
}

function LaneRow({ lane, r }: { lane: Lane; r: R }) {
  const says = lane === "st" ? (["again", "again", "again", "passed"] as const) : SAY;
  return (
    <div className={`tk-rc-lane tk-rc-${lane}`}>
      <div className="tk-rc-who">
        {lane === "hv" ? <Logo width={112} height={33} /> : <b>{r.staticName}</b>}
        <small>{lane === "hv" ? r.hvTag : r.staticTag}</small>
      </div>
      <div className="tk-rc-run">
        <div className="tk-rc-track">
          <div className="tk-rc-tiles">
            <Tiles lane={lane} r={r} />
          </div>
          {lane === "hv" && (
            <div className="tk-rc-stream">
              <svg viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true">
                {BARS.map((b) => (
                  <rect key={b.x} x={b.x} y={(60 - b.h) / 2} width={b.w} height={b.h} rx="1" />
                ))}
              </svg>
              <b>{r.checks.v}</b>
              <small>{r.checks.l}</small>
            </div>
          )}
          <i className="tk-rc-now" />
        </div>
        <p className="tk-rc-say">
          {says.map((k, i) => (
            <span key={i} data-i={i} className={k === "passed" ? "tk-rc-say-bad" : undefined}>
              {r[k]}
            </span>
          ))}
          <span data-i="end">{lane === "st" ? r.still : r.say7}</span>
        </p>
      </div>
      <div className="tk-rc-mem">
        <span className="tk-rc-mem-k">{r.keeps}</span>
        {lane === "st" ? (
          <span className="tk-rc-none">{r.nothing}</span>
        ) : (
          <ul>
            {KEEPS.map((k) => (
              <li key={k.key} className={"bad" in k ? "tk-rc-keep tk-rc-keep-bad" : "join" in k ? "tk-rc-keep tk-rc-keep-join" : "tk-rc-keep"} style={v({ "--at": k.at })}>
                {r[k.key]}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function TechRace({ r }: { r: R }) {
  return (
    <div className="tk-net-box tk-rc-box">
      <div className="tk-rc" aria-hidden="true">
        <div className="tk-rc-top">
          <span className="tk-rc-clock">
            <i />
            {r.clock}
          </span>
          <span className="tk-rc-legend">
            <span>
              <Mark r="ok" />
              {r.verified}
            </span>
            <span>
              <Mark r="caught" />
              {r.caught}
            </span>
            <span>
              <Mark r="missed" />
              {r.missed}
            </span>
          </span>
        </div>
        <LaneRow lane="st" r={r} />
        <LaneRow lane="hv" r={r} />
        <div className="tk-rc-scale">
          <p>{r.scale}</p>
          {[r.fraud, r.countries, r.clients].map((s) => (
            <span key={s.v}>
              <b>{s.v}</b>
              <small>{s.l}</small>
            </span>
          ))}
        </div>
      </div>
      <button type="button" className="tk-gl-pause tk-rc-pause" data-fw-pause="" data-pause={r.pause} data-play={r.play} aria-label={r.pause}>
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M5 3.5h2v9H5zM9 3.5h2v9H9z" />
        </svg>
      </button>
    </div>
  );
}
