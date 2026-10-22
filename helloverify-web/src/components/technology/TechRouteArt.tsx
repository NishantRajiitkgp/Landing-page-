/** The third pillar on the `/technology` stage. The picture is the orchestration
    map: requests come in, HelloVerify routes them, and each one lands at the
    right institution abroad. The result is delivered underneath.

      0s    the queue of requests
      0.6s  they join at HelloVerify
      1.3s  the engine and the four things it does
      1.8s  each case leaves for its country
      3.1s  the verification is delivered */
import Image from "next/image";
import { Logo } from "@/components/brand/Logo";
import { CAP, CASE, DOC, ID, INST, PERSON, d, type TechArt } from "./TechPillarKit";

const X = (n: number) => `${n / 10}%`;
const Y = (n: number) => `${(n * 100) / 700}%`;

const REQ = { x: 12, w: 292, h: 62, ys: [100, 172, 244] };
const MORE = { x: 12, y: 316, w: 128, h: 40 };
const HUB = { x: 400, y: 138, w: 188, h: 156 };
const CTY = { x: 708, w: 278, h: 60, ys: [100, 172, 244, 316] };
const DONE = { x: 250, y: 560, w: 500, h: 92 };

const hubCx = HUB.x + HUB.w / 2;
const hubCy = HUB.y + HUB.h / 2;
const join = { x: HUB.x - 6, y: hubCy };

const ROUTE = "M4 12h6M10 12c3 0 4-5 8-5M10 12c3 0 4 5 8 5";
const LAND = "640,70 654,58 668,66 660,82 646,94 678,74 692,56 706,68 720,50 734,62 748,48 762,64 774,52 788,70 772,84 756,78 740,94 724,88 708,104 694,96 680,112 666,104 800,54 814,46 828,58 842,48 856,64 844,80 828,88 812,76 798,94 816,106 834,100 850,114 866,98 878,116 860,130 842,124 824,138 848,148 870,142 892,156 910,136 928,150 944,140 900,168 882,160 864,176 846,166 920,80 934,70 948,86 936,100 952,112";
const COUNTRIES = [
  { flag: "/flags/ae.svg", name: "uae", role: "uaeRole" },
  { flag: "/flags/us.svg", name: "usa", role: "usaRole" },
  { flag: "/flags/gb.svg", name: "uk", role: "ukRole" },
  { flag: "/flags/sg.svg", name: "sg", role: "sgRole" },
] as const;

function curve(x1: number, y1: number, x2: number, y2: number) {
  const c = x1 + (x2 - x1) * 0.55;
  return `M${x1} ${y1}C${c} ${y1} ${c} ${y2} ${x2} ${y2}`;
}

function Ico({ g, hot }: { g: string; hot?: boolean }) {
  return (
    <svg className={hot ? "tk-orch-ico tk-orch-ico-hot" : "tk-orch-ico"} viewBox="0 0 24 24" aria-hidden="true">
      <path d={g} />
    </svg>
  );
}

function Tick({ at }: { at: number }) {
  return (
    <svg className="tk-orch-tick tk-a-pop" viewBox="0 0 16 16" style={d(at)} aria-hidden="true">
      <circle cx="8" cy="8" r="8" className="tk-red" />
      <path d="M4.2 8.2 6.8 10.8 11.8 5.4" className="tk-tick-white" />
    </svg>
  );
}

function Pin({ x, y, at }: { x: number; y: number; at: number }) {
  return (
    <g className="tk-a-pop" style={d(at)} transform={`translate(${x} ${y})`}>
      <path className="tk-orch-pin" d="M0-9.5c-3.8 0-6.4 2.8-6.4 6 0 4.6 6.4 11 6.4 11s6.4-6.4 6.4-11c0-3.2-2.6-6-6.4-6z" />
      <circle cx="0" cy="-3.2" r="2" className="tk-orch-pin-h" />
    </g>
  );
}

export function RouteArt({ l }: { l: TechArt }) {
  const o = l.orch;
  const reqRight = REQ.x + REQ.w;
  const rows = [
    { g: PERSON, t: o.kyc, y: REQ.ys[0] },
    { g: CAP, t: o.student, y: REQ.ys[1] },
    { g: CASE, t: o.employment, y: REQ.ys[2] },
  ];
  const cRight = CTY.x + CTY.w;
  const doneTop = DONE.y;

  return (
    <div className="tk-orch">
      <div className="tk-orch-in">
        <svg className="tk-orch-wires tk-mirror" viewBox="0 0 1000 700" preserveAspectRatio="none" fill="none" aria-hidden="true">
          {LAND.split(" ").map((p, i) => {
            const [cx, cy] = p.split(",");
            return <circle key={i} className="tk-orch-land" cx={cx} cy={cy} r="2.1" />;
          })}
          <circle className="tk-orch-halo" cx={hubCx} cy={hubCy} r="168" />
          {[108, 156, 208].map((r, i) => (
            <circle key={r} className="tk-orch-ring tk-a-fade" cx={hubCx} cy={hubCy} r={r} style={d(0.55 + i * 0.08)} />
          ))}
          {rows.map((row, i) => (
            <path key={row.t} className="tk-p-link tk-a-draw" d={curve(reqRight, row.y + REQ.h / 2, join.x, join.y)} pathLength="1" style={d(0.55 + i * 0.08, { "--t": ".45s" })} />
          ))}
          <path className="tk-edge2 tk-a-draw" d={curve(MORE.x + MORE.w, MORE.y + MORE.h / 2, join.x, join.y + 8)} pathLength="1" style={d(0.8, { "--t": ".4s" })} />
          <circle className="tk-orch-node tk-a-pop" cx={join.x} cy={join.y} r="5" style={d(1.05)} />
          {CTY.ys.map((y, i) => {
            const mid = y + CTY.h / 2;
            return (
              <g key={y}>
                <path className="tk-p-link tk-a-draw" d={curve(HUB.x + HUB.w, hubCy + (i - 1.5) * 10, CTY.x - 2, mid)} pathLength="1" style={d(1.7 + i * 0.08, { "--t": ".5s" })} />
                <Pin x={CTY.x - 22} y={mid - 8} at={2.15 + i * 0.06} />
                <path className="tk-orch-head tk-a-pop" d={`M${CTY.x - 10} ${mid - 3.5}l8 3.5-8 3.5z`} style={d(2.05 + i * 0.08)} />
              </g>
            );
          })}
          <path className="tk-orch-dotline tk-a-fade" d={`M${cRight} ${CTY.ys[0] + CTY.h / 2}C${cRight + 28} 80 ${cRight + 28} 300 ${cRight} ${CTY.ys[3] + CTY.h / 2}`} style={d(2.4)} />
          <path className="tk-orch-dash tk-a-fade" d={`M${hubCx} ${HUB.y + HUB.h}C${hubCx} 430 ${hubCx - 30} 490 ${hubCx} ${doneTop - 8}`} style={d(2.7)} />
          <path className="tk-orch-head tk-a-pop" d={`M${hubCx - 5} ${doneTop - 16}l5 9 5-9z`} style={d(3)} />
        </svg>

        {rows.map((row, i) => (
          <div key={row.t} className="tk-orch-card tk-a-in" style={{ ...d(i * 0.08), insetInlineStart: X(REQ.x), top: Y(row.y), width: X(REQ.w) }}>
            <Ico g={row.g} />
            <span>
              <b>{row.t}</b>
              {i === 0 && (
                <span className="tk-orch-mini">
                  <Ico g={PERSON} />
                  <i />
                  <i />
                </span>
              )}
            </span>
            {i > 0 && <Ico g={DOC} />}
          </div>
        ))}
        <div className="tk-orch-card tk-orch-more tk-a-in" style={{ ...d(0.28), insetInlineStart: X(MORE.x), top: Y(MORE.y), width: X(MORE.w) }}>
          <i /><i /><i />
        </div>
        <p className="tk-orch-cap tk-a-fade" style={{ ...d(0.4), insetInlineStart: X(REQ.x), top: Y(368), width: X(REQ.w) }}>
          <b>{o.requests}</b>
          <span>{o.requestsSub}</span>
        </p>

        <div className="tk-orch-pill tk-orch-p1 tk-a-pop" style={{ ...d(1.25), insetInlineStart: "1.5%", top: Y(4) }}>
          <Ico g={DOC} hot />
          <span>{o.understand}</span>
        </div>
        <div className="tk-orch-pill tk-orch-p2 tk-a-pop" style={{ ...d(1.35), insetInlineEnd: "34%", top: Y(4) }}>
          <Ico g="M12 3.5 19 6v5.5c0 4.3-2.9 7.6-7 9-4.1-1.4-7-4.7-7-9V6z" hot />
          <span>{o.risk}</span>
        </div>
        <div className="tk-orch-pill tk-orch-p3 tk-a-pop" style={{ ...d(1.45), insetInlineStart: "12%", top: Y(452) }}>
          <Ico g={DOC} hot />
          <span>{o.policy}</span>
        </div>
        <div className="tk-orch-pill tk-orch-p4 tk-a-pop" style={{ ...d(1.55), insetInlineEnd: "14%", top: Y(452) }}>
          <Ico g={ROUTE} hot />
          <span>{o.routing}</span>
        </div>

        <div className="tk-orch-hub tk-a-pop" style={{ ...d(0.95), insetInlineStart: X(HUB.x), top: Y(HUB.y), width: X(HUB.w), height: Y(HUB.h) }}>
          <span className="tk-orch-spark tk-a-pop" style={d(1.15)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="12" className="tk-red" />
              <path className="tk-orch-star" d="M12 5.2 13.3 10 18.2 11.2 13.3 12.5 12 17.4 10.7 12.5 5.8 11.2 10.7 10Z" />
            </svg>
          </span>
          <Logo width={92} height={27} />
          <span>{o.ml}</span>
        </div>

        {COUNTRIES.map((c, i) => (
          <div key={c.name} className="tk-orch-card tk-orch-country tk-a-in" style={{ ...d(1.9 + i * 0.08), insetInlineStart: X(CTY.x), top: Y(CTY.ys[i]), width: X(CTY.w) }}>
            <Image src={c.flag} alt="" width={22} height={15} unoptimized />
            <Ico g={INST} />
            <span>
              <b>{o[c.name]}</b>
              <small>{o[c.role]}</small>
            </span>
            <Tick at={2.45 + i * 0.08} />
          </div>
        ))}

        <div className="tk-orch-done tk-a-in" style={{ ...d(3.15), insetInlineStart: X(DONE.x), top: Y(DONE.y), width: X(DONE.w) }}>
          <svg viewBox="0 0 36 36" aria-hidden="true">
            <circle cx="18" cy="18" r="18" fill="#E5F8EE" />
            <path d="M10 18.6 15.2 24.2 26.6 12" fill="none" stroke="#12945C" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>
            <b>{o.done}</b>
            <small>{o.doneSub}</small>
          </span>
          <span className="tk-orch-proof">
            <Ico g={DOC} />
            <Ico g={ID} />
          </span>
        </div>
      </div>
    </div>
  );
}
