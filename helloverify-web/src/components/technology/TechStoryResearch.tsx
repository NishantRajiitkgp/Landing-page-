/** 02 · AI-powered research intelligence, the second card of the
    `/technology` story (`./TechPillars`). The profile the first card
    finished comes in on the thread. Head positions, in card units:

      -70   the verified profile arrives with the case; at 190 its two
            claims are picked out
      300   the sources research draws on: the authorised contacts, the
            institution database, and the fraud signals
      540   HelloVerify's lens works through them
      700   the real institution is verified at its authorised contact; a
            blacklisted look-alike of the employer is flagged
      860   the flag runs back into the fraud signals, which learn one more
      960   the research result */
import { Logo } from "@/components/brand/Logo";
import { At, Cap, Count, Entry, HANDED, Ico, Profile, R, Tick, Wires, link, thread, v, type Story } from "./TechStoryKit";
import { DB, DOC, INST, SHIELD } from "./TechPillarKit";

const WARN = "M12 4 21 19.5H3zM12 10v4.5M12 17.2v.3";
const LENS = { x: 616, r: 68 };
const SRC = [
  { y: 70, at: 300, g: INST, t: "contacts", p: "contactsSub" },
  { y: 147, at: 330, g: DB, t: "database", p: "databaseSub" },
  { y: 224, at: 360, g: WARN, t: "signals", p: "signalsSub" },
] as const;
const LOOP = "M800 288C800 334 420 334 420 300";

export function ResearchCard({ s }: { s: Story }) {
  return (
    <>
      <Wires
        id="tk-sy2"
        wires={[
          thread(0, 34),
          ...SRC.map((r) => link(260, 180, 294, r.y + 33)),
          ...SRC.map((r, i) => link(496, r.y + 33, LENS.x - LENS.r - 2, 172 + i * 8)),
          link(678, 150, 720, 116, "ok"),
          link(678, 210, 720, 244, "bad"),
          link(934, 116, 960, 168, "ok"),
          link(934, 244, 960, 192, "bad"),
          thread(1168, 1200),
        ]}
      >
        <g className="tk-sy-r tk-sy-fade" style={v({ "--at": 540 })}>
          <circle className="tk-sy-halo" cx={LENS.x} cy="180" r="104" />
          <circle className="tk-sy-orbit" cx={LENS.x} cy="180" r="84" />
        </g>
        <defs>
          <mask id="tk-sy2-l" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="380">
            <path className="tk-sy-r tk-sy-loop-m" d={LOOP} pathLength="1" style={v({ "--at": 860 })} />
          </mask>
        </defs>
        <g className="tk-sy-loop" mask="url(#tk-sy2-l)">
          <path d={LOOP} />
          <path className="tk-sy-head" d="M415.5 308 420 299.5 424.5 308Z" />
        </g>
      </Wires>
      <Count i={1} />
      <Entry x={20} />

      {/* Candidate profile: what onboarding finished, two claims to research */}
      <At x={34} y={60} w={226} h={240} at={HANDED}>
        <Profile s={s} mark={190} />
      </At>

      {/* Research sources */}
      {SRC.map((r, i) => (
        <At key={r.t} x={296} y={r.y} w={200} h={66} at={r.at} fx="tk-sy-slide">
          <span className="tk-sy-src">
            <span className="tk-sy-tile">
              <Ico g={r.g} />
            </span>
            <span>
              <b>{s[r.t]}</b>
              <small>{s[r.p]}</small>
            </span>
            <Tick at={470 + i * 20} />
            {i === 2 && (
              <R at={930} fx="tk-sy-pop tk-sy-plus">
                {s.learned}
              </R>
            )}
          </span>
        </At>
      ))}

      {/* AI research intelligence: the lens */}
      <At x={LENS.x - LENS.r} y={180 - LENS.r} w={LENS.r * 2} h={LENS.r * 2} at={540} fx="tk-sy-pop tk-sy-lens">
        <span className="tk-sy-glass">
          <Logo width={92} height={27} />
        </span>
        <i className="tk-sy-handle" />
      </At>

      {/* Institution checks: the real one, and the look-alike */}
      <At x={722} y={72} w={212} h={88} at={700} fx="tk-sy-slide">
        <span className="tk-sy-inst">
          <span className="tk-sy-inst-h">
            <Ico g={INST} />
            <b>{s.real}</b>
            <R at={740} fx="tk-sy-pop tk-sy-pill tk-sy-pill-ok">
              {s.verified}
            </R>
          </span>
          <span className="tk-sy-kv">
            <small>{s.status}</small>
            <span>{s.recognised}</span>
            <small>{s.degreeKey}</small>
            <span>{s.degreeValue}</span>
          </span>
          <Ico g={DOC} cls="tk-sy-doc-ico" />
        </span>
      </At>
      <At x={722} y={200} w={212} h={88} at={760} fx="tk-sy-slide tk-sy-bad">
        <span className="tk-sy-inst">
          <span className="tk-sy-inst-h">
            <Ico g={INST} />
            <b>{s.fake}</b>
            <R at={800} fx="tk-sy-pop tk-sy-pill tk-sy-pill-bad">
              {s.flagged}
            </R>
          </span>
          <span className="tk-sy-kv tk-sy-kv-bad">
            <small>{s.status}</small>
            <span>{s.highRisk}</span>
            <small>{s.reason}</small>
            <span>{s.blacklisted}</span>
          </span>
        </span>
      </At>

      {/* Research result */}
      <At x={962} y={76} w={206} h={208} at={960}>
        <span className="tk-sy-res">
          <span className="tk-sy-tile">
            <Ico g={DOC} />
          </span>
          <b className="tk-sy-k">{s.result}</b>
          <ul>
            <li>
              <Tick at={1000} />
              <span>{s.found1}</span>
            </li>
            <li>
              <Tick at={1040} />
              <span>{s.found2}</span>
            </li>
            <li>
              <R at={1080} fx="tk-sy-pop tk-sy-shield">
                <Ico g={SHIELD} />
              </R>
              <span>{s.found3}</span>
            </li>
          </ul>
        </span>
      </At>

      <Cap x={147} at={HANDED}>{s.profile}</Cap>
      <Cap x={396} at={300}>{s.sources}</Cap>
      <Cap x={LENS.x} at={540}>{s.intel}</Cap>
      <Cap x={828} at={700}>{s.checks}</Cap>
      <Cap x={1065} at={960}>{s.result}</Cap>
    </>
  );
}
