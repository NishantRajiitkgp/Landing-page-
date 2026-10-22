/** The second pillar drawing on the `/technology` stage (`./TechPillars`). */
import { Glyph, INST, Ok, PERSON, d } from "./TechPillarKit";

/* ── 02 · Research: the engine finds the right authorised contact, rules
   out the institutions on the fraud database, and learns from the result. ── */

/** Institutions in the directory, each with its own mark. The document's
    issuer shares its mark; two others are on the fraud database. */
const MARKS = [
  "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z",
  "M12 6l6 6-6 6-6-6z",
  "M12 6.5 17.5 16.5h-11z",
  "M12 6l5.2 3v6L12 18l-5.2-3V9z",
  "M7.5 7.5h9v9h-9z",
];
const DIR_Y = [122, 174, 226, 278, 330];
const DIR_W = [
  [78, 50],
  [64, 58],
  [84, 46],
  [70, 54],
  [60, 40],
];
const ISSUER = 2;
const FRAUD: Record<number, number> = { 1: 2.45, 3: 2.55 };
const DB_SIDE = "c0 6 16 11 36 11s36-5 36-11";

export function ResearchArt() {
  return (
    <svg className="tk-art tk-mirror" viewBox="20 40 560 360" fill="none">
      {/* The fraud database, above the engine */}
      <g className="tk-a-in" style={d(0.15)}>
        <path className="tk-db" d={`M226 86V122${DB_SIDE}V86`} />
        <path className="tk-hair" d={`M226 98${DB_SIDE}M226 110${DB_SIDE}`} />
        <ellipse className="tk-db-top" cx="262" cy="86" rx="36" ry="10" />
      </g>
      <ellipse className="tk-rip tk-a-rip" cx="262" cy="86" rx="36" ry="10" style={d(2.25)} />
      <g className="tk-a-drop" style={d(4)}>
        <path className="tk-db" d={`M226 74V86${DB_SIDE}V74`} />
        <ellipse className="tk-db-top" cx="262" cy="74" rx="36" ry="10" />
      </g>
      <Ok x={300} y={114} at={0.5} bad />

      <path className="tk-edge2 tk-a-draw" d="M262 192V134" pathLength="1" style={d(0.4)} />
      <path className="tk-comet tk-a-comet" d="M262 192V134" pathLength="1" style={d(1.95, { "--t": ".3s" })} />
      <path className="tk-comet tk-a-back" d="M262 192V134" pathLength="1" style={d(2.25, { "--t": ".3s" })} />
      <path className="tk-comet tk-a-comet" d="M262 192V134" pathLength="1" style={d(3.8, { "--t": ".3s" })} />

      {/* The case */}
      <g className="tk-a-in" style={d(0)}>
        <rect className="tk-sheet" x="44" y="152" width="124" height="148" rx="12" />
        <rect className="tk-paperfill" x="58" y="166" width="32" height="32" rx="9" />
        <Glyph g={MARKS[ISSUER]} x={74} y={182} s={0.75} />
        <rect className="tk-inkbar" x="100" y="174" width="52" height="7" rx="3.5" />
        <rect className="tk-soft" x="100" y="188" width="38" height="5" rx="2.5" />
        {[96, 78, 88].map((w, i) => (
          <rect key={i} className="tk-bar" x="58" y={218 + i * 14} width={w} height="5" rx="2.5" />
        ))}
        <circle className="tk-ringl" cx="146" cy="280" r="9" />
      </g>
      <path className="tk-wire tk-a-draw" d="M168 226H228" pathLength="1" style={d(0.45, { "--t": ".3s" })} />
      <path className="tk-comet tk-a-comet" d="M168 226H228" pathLength="1" style={d(0.55, { "--t": ".35s" })} />

      {/* The engine reaches into the directory */}
      {DIR_Y.map((y, i) => (
        <path key={i} className="tk-edge2 tk-a-draw" d={`M296 226L348 ${y}`} pathLength="1" style={d(0.9 + i * 0.05)} />
      ))}
      <g className="tk-a-in" style={d(0.1)}>
        <circle className="tk-arc-track" cx="262" cy="226" r="44" />
        <circle className="tk-arc tk-a-grow" cx="262" cy="226" r="44" pathLength="1" style={d(3.8, { "--t": ".8s", "--from": ".42" })} />
        <circle className="tk-node" cx="262" cy="226" r="34" />
        <circle className="tk-spinr tk-a-spin" cx="262" cy="226" r="24" pathLength="60" style={d(0.6, { "--t": "2.2s" })} />
        <circle className="tk-dot-red" cx="262" cy="226" r="6" />
      </g>

      {/* The directory of institutions and their authorised contacts */}
      <g className="tk-a-in" style={d(0.2)}>
        <rect className="tk-sheet" x="336" y="52" width="224" height="336" rx="16" />
        <Glyph g={INST} x={362} y={76} s={0.6} />
        <rect className="tk-soft" x="380" y="73" width="70" height="6" rx="3" />
        <path className="tk-hair" d="M336 96H560" />
        {DIR_Y.map((y, i) => (
          <g key={i}>
            <rect className="tk-paperfill" x="348" y={y - 20} width="200" height="40" rx="10" />
            {i === ISSUER && <rect className="tk-row-hi tk-a-fade" x="348" y={y - 20} width="200" height="40" rx="10" style={d(2.75)} />}
            <g className={i in FRAUD ? "tk-dim tk-a-dim" : undefined} style={i in FRAUD ? d(FRAUD[i]) : undefined}>
              <rect className="tk-mk-tile" x="356" y={y - 15} width="30" height="30" rx="8" />
              <Glyph g={MARKS[i]} x={371} y={y} s={0.62} />
              <rect className="tk-inkbar" x="398" y={y - 8} width={DIR_W[i][0]} height="6" rx="3" />
              <rect className="tk-soft" x="398" y={y + 4} width={DIR_W[i][1]} height="5" rx="2.5" />
            </g>
          </g>
        ))}
      </g>
      <rect className="tk-band tk-a-scan" x="348" y="102" width="200" height="40" rx="10" style={d(1.05, { "--dy": "208px", "--t": "1s" })} />

      {/* Ruled out: on the fraud database */}
      {Object.entries(FRAUD).map(([k, at]) => (
        <g key={k}>
          <path className="tk-strike tk-a-draw" d={`M394 ${DIR_Y[+k]}H494`} pathLength="1" style={d(at, { "--t": ".3s" })} />
          <Ok x={530} y={DIR_Y[+k]} at={at + 0.05} bad />
        </g>
      ))}

      {/* The right one: its mark matches the document's; its contact answers */}
      <path className="tk-p-link tk-a-draw" d="M306 226H352" pathLength="1" style={d(2.7, { "--t": ".3s" })} />
      <path className="tk-comet tk-a-back" d="M306 226H352" pathLength="1" style={d(3.45, { "--t": ".3s" })} />
      <rect className="tk-hi-ring tk-a-pop" x="352" y={DIR_Y[ISSUER] - 19} width="38" height="38" rx="11" style={d(2.85)} />
      <rect className="tk-hi-ring tk-a-pop" x="54" y="162" width="40" height="40" rx="12" style={d(2.85)} />
      <g className="tk-a-pop" style={d(2.95)}>
        <circle className="tk-node" cx="526" cy={DIR_Y[ISSUER]} r="13" />
        <Glyph g={PERSON} x={526} y={DIR_Y[ISSUER]} s={0.52} />
      </g>
      <Ok x={537} y={DIR_Y[ISSUER] - 10} r={6} at={3.15} />
    </svg>
  );
}
