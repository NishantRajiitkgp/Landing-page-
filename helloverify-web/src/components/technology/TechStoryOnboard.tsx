/** 01 · Seamless applicant onboarding, the first card of the `/technology`
    story (`./TechPillars`). Head positions, in card units:

      0     the case arrives on the thread
      30    a passport, a degree and an employment letter are uploaded
      340   AI frames the passport's data page and reads it top to bottom,
            boxing each detail as the scan line crosses it
      600   the details are written into one structured profile, a row at a
            time, with nobody typing them
      890   every field is validated; the record is verification-ready */
import { At, Cap, Count, Entry, PASS_NO, Profile, R, Wires, link, thread, v, type Story } from "./TechStoryKit";
import { CASE, PERSON } from "./TechPillarKit";

/** The passport's data page: scanned from 380 to 560. */
const SCAN = { from: 380, to: 560 };
const MRZ = ["P<INDMEHTA<<ROHAN<<<<<<<<<<<<<<<<<", "P1234567<6IND9201125M3105148<<<<<<<"];

const CORNERS = [
  "M356 82V58H380",
  "M542 58H566V82",
  "M566 278V302H542",
  "M380 302H356V278",
];

function Cover({ label }: { label: string }) {
  return (
    <svg className="tk-sy-art" viewBox="0 0 118 158" aria-hidden="true">
      <rect width="118" height="158" rx="10" fill="#1E2A4A" />
      <rect x="7" y="7" width="104" height="144" rx="6" fill="none" stroke="#D4B46A" strokeOpacity=".35" />
      <text x="59" y="34" textAnchor="middle" fill="#D4B46A" fontSize="11" letterSpacing="2.2" className="tk-sy-cover-t">
        {label}
      </text>
      <g fill="none" stroke="#D4B46A" strokeWidth="1.6">
        <circle cx="59" cy="86" r="21" />
        <ellipse cx="59" cy="86" rx="9" ry="21" />
        <path d="M38 86h42M41 75h36M41 97h36" />
      </g>
      <rect x="44" y="128" width="30" height="8" rx="2" fill="#D4B46A" fillOpacity=".55" />
    </svg>
  );
}

function Sign() {
  return (
    <svg className="tk-sy-sign" viewBox="0 0 48 16" aria-hidden="true">
      <path d="M2 12c5-9 8-9 10-3s5 6 8-1 6-6 8 0 4 5 7-1 6-4 11 0" />
    </svg>
  );
}

export function OnboardCard({ s, ready, manual }: { s: Story; ready: string; manual: string }) {
  return (
    <>
      <Wires id="tk-sy1" wires={[thread(0, 64), link(318, 180, 354, 180), link(570, 180, 620, 180), link(868, 180, 918, 180), thread(1168, 1200)]}>
        <g className="tk-sy-r tk-sy-frame" style={v({ "--at": 330 })}>
          {CORNERS.map((c) => (
            <path key={c} d={c} />
          ))}
        </g>
      </Wires>
      <Count i={0} />
      <Entry x={22} />

      {/* Upload documents: three uploads, as they come */}
      <At x={68} y={60} w={118} h={158} at={30} fx="tk-sy-doc tk-sy-d1">
        <Cover label={s.passport} />
      </At>
      <At x={170} y={96} w={142} h={108} at={70} fx="tk-sy-doc tk-sy-d2">
        <div className="tk-sy-sheet tk-sy-deg">
          <span className="tk-sy-crest" />
          <b>{s.degree}</b>
          <i />
          <i />
          <svg className="tk-sy-seal" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="11" fill="#D4B46A" />
            <circle cx="12" cy="12" r="7.5" fill="none" stroke="#FFFFFF" strokeOpacity=".7" strokeDasharray="2 1.6" />
          </svg>
        </div>
      </At>
      <At x={92} y={186} w={150} h={100} at={110} fx="tk-sy-doc tk-sy-d3">
        <div className="tk-sy-sheet tk-sy-let">
          <span className="tk-sy-let-h">
            <svg className="tk-sy-ico" viewBox="0 0 24 24" aria-hidden="true">
              <path d={CASE} />
            </svg>
            <b>{s.letter}</b>
          </span>
          <i />
          <i />
          <i />
          <Sign />
        </div>
      </At>

      {/* AI extracts: the data page, read line by line */}
      <At x={370} y={70} w={184} h={220} at={340} fx="tk-sy-rise tk-sy-page">
        <span className="tk-sy-pp-h">
          <small>{s.republic}</small>
          <b>{s.passport}</b>
        </span>
        <span className="tk-sy-pp-b">
          <span className="tk-sy-photo">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={PERSON} />
            </svg>
          </span>
          <span className="tk-sy-pp-f">
            <small>{s.name}</small>
            <R at={420} fx="tk-sy-hit">
              {s.person}
            </R>
            <small>{s.passportNo}</small>
            <R at={455} fx="tk-sy-hit">
              {PASS_NO}
            </R>
            <small>{s.dob}</small>
            <R at={490} fx="tk-sy-hit">
              {s.dobValue}
            </R>
          </span>
        </span>
        <R at={530} fx="tk-sy-mrz">
          {MRZ.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </R>
        <i className="tk-sy-beam" style={v({ "--s0": SCAN.from, "--s1": SCAN.to })} />
      </At>

      {/* Structured profile: one record, written row by row */}
      <At x={628} y={60} w={236} h={240} at={600}>
        <Profile s={s} fill={640} />
      </At>

      {/* Verified fields: each row validated, nobody typed any of it */}
      <At x={926} y={60} w={242} h={240} at={890}>
        <Profile s={s} title={s.fieldCheck} ticks={950}>
          <span className="tk-sy-ready">
            <R at={1110} fx="tk-sy-pop tk-sy-badge">
              {ready}
            </R>
            <R at={1140} fx="tk-sy-fade tk-sy-manual">
              {manual}
            </R>
          </span>
        </Profile>
      </At>

      <Cap x={190} at={20}>{s.upload}</Cap>
      <Cap x={462} at={330}>{s.extract}</Cap>
      <Cap x={746} at={600}>{s.structure}</Cap>
      <Cap x={1047} at={890}>{s.validate}</Cap>
    </>
  );
}
