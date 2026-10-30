/** 03 · ML-driven workflow orchestration, the last card of the `/technology`
    story (`./TechPillars`). The researched case comes in on the thread and
    leaves as one record. Head positions, in card units:

      -70   the verification requests the case opens, as it arrives
      290   HelloVerify's ML orchestration takes them in
      490   each one is routed to the right authority, country by country
      740   each authority confirms, one after the other
      990   the checks close into one verified record */
import Image from "next/image";
import { Logo } from "@/components/brand/Logo";
import { At, Cap, Count, Entry, HANDED, Ico, R, Tick, Wires, link, thread, v, type Story } from "./TechStoryKit";
import { CAP, CASE, DOC, ID } from "./TechPillarKit";

/** Row centres of the three lists, in card units (see `.tk-sy-list`). */
const REQ_Y = [123, 175, 227];
const ROW_Y = [122, 170, 218, 266];

const REQS = [
  { g: ID, t: "kyc", p: "kycSub" },
  { g: CAP, t: "edu", p: "eduSub" },
  { g: CASE, t: "job", p: "jobSub" },
] as const;
const ROUTES = [
  { flag: "/flags/ae.svg", t: "toUae", p: "edu", inst: "moe" },
  { flag: "/flags/us.svg", t: "toUsa", p: "degreeCheck", inst: "nsc" },
  { flag: "/flags/gb.svg", t: "toUk", p: "edu", inst: "hesa" },
  { flag: "/flags/sg.svg", t: "toSg", p: "jobCheck", inst: "mom" },
] as const;

export function RouteCard({ s }: { s: Story }) {
  return (
    <>
      <Wires
        id="tk-sy3"
        wires={[
          thread(0, 36),
          ...REQ_Y.map((y, i) => link(250, y, 296, 172 + i * 8)),
          ...ROW_Y.map((y) => link(452, 180, 492, y)),
          ...ROW_Y.map((y) => link(718, y, 750, y, "ok")),
          ...ROW_Y.map((y, i) => link(972, y, 1000, 168 + i * 8, "ok")),
          thread(1170, 1200),
        ]}
      >
        <g className="tk-sy-r tk-sy-fade" style={v({ "--at": 290 })}>
          <circle className="tk-sy-halo" cx="375" cy="180" r="112" />
          <circle className="tk-sy-orbit" cx="375" cy="180" r="96" />
        </g>
      </Wires>
      <Count i={2} />
      <Entry x={20} />

      {/* Verification requests */}
      <At x={36} y={64} w={214} h={232} at={HANDED}>
        <span className="tk-sy-list">
          <b className="tk-sy-k">{s.requests}</b>
          {REQS.map((r, i) => (
            <R key={r.t} at={HANDED + 30 + i * 30} fx="tk-sy-slide tk-sy-item">
              <span className="tk-sy-tile">
                <Ico g={r.g} />
              </span>
              <span>
                <b>{s[r.t]}</b>
                <small>{s[r.p]}</small>
              </span>
              <Ico g={DOC} cls="tk-sy-doc-ico" />
            </R>
          ))}
          <R at={60} fx="tk-sy-fade tk-sy-more">
            <i />
            <i />
            <i />
          </R>
        </span>
      </At>

      {/* ML orchestration */}
      <At x={298} y={104} w={154} h={152} at={290} fx="tk-sy-pop tk-sy-hub">
        <svg className="tk-sy-layers" viewBox="0 0 40 34" aria-hidden="true">
          <path className="tk-sy-l3" d="M20 20 36 26 20 32 4 26z" />
          <path className="tk-sy-l2" d="M20 11 36 17 20 23 4 17z" />
          <path className="tk-sy-l1" d="M20 2 36 8 20 14 4 8z" />
        </svg>
        <Logo width={104} height={30} />
        <small className="tk-sy-k">{s.ml}</small>
      </At>

      {/* Intelligent routing */}
      <At x={494} y={64} w={224} h={232} at={490}>
        <span className="tk-sy-list tk-sy-list4">
          <b className="tk-sy-k">{s.routing}</b>
          {ROUTES.map((r, i) => (
            <R key={r.t} at={520 + i * 30} fx="tk-sy-slide tk-sy-item">
              <Image className="tk-sy-flag" src={r.flag} alt="" width={22} height={15} unoptimized />
              <span>
                <b>{s[r.t]}</b>
                <small>{s[r.p]}</small>
              </span>
              <Ico g={DOC} cls="tk-sy-doc-ico" />
            </R>
          ))}
        </span>
      </At>

      {/* Global institutions: each confirms in turn */}
      <At x={752} y={64} w={220} h={232} at={740}>
        <span className="tk-sy-list tk-sy-list4">
          <b className="tk-sy-k">{s.institutions}</b>
          {ROUTES.map((r, i) => (
            <R key={r.inst} at={760 + i * 40} fx="tk-sy-slide tk-sy-item tk-sy-auth">
              <b>{s[r.inst]}</b>
              <i className="tk-sy-r tk-sy-spin" style={v({ "--at": 800 + i * 40 })} />
              <Tick at={800 + i * 40} />
              <R at={810 + i * 40} fx="tk-sy-pop tk-sy-pill tk-sy-pill-ok">
                {s.verified}
              </R>
            </R>
          ))}
        </span>
      </At>

      {/* Verification complete */}
      <At x={1002} y={72} w={168} h={216} at={990} fx="tk-sy-rise tk-sy-done">
        <R at={1040} fx="tk-sy-seal-ok">
          <svg viewBox="0 0 56 56" aria-hidden="true">
            <circle cx="28" cy="28" r="27" />
            <path pathLength="1" d="M17 28.8 24.6 36.4 39.6 20.6" />
          </svg>
        </R>
        <b>{s.done}</b>
        <small>{s.doneSub}</small>
      </At>

      <Cap x={143} at={HANDED}>{s.requests}</Cap>
      <Cap x={375} at={290}>{s.ml}</Cap>
      <Cap x={606} at={490}>{s.routing}</Cap>
      <Cap x={862} at={740}>{s.institutions}</Cap>
      <Cap x={1086} at={990}>{s.done}</Cap>
    </>
  );
}
