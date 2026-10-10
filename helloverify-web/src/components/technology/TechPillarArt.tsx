/** The first two drawings on the `/technology` pillars stage (`./TechPillars`;
    the third is `./TechRouteArt`), all on a 560 × 360 board so they scale
    together. Each acts
    out its paragraph, beat by beat, in the paragraph's order; no text, so
    every board mirrors whole under `dir="rtl"` (ticks are counter-flipped).

    Motion lives in `tech.css` as `tk-a-*` classes that only run while their
    board is the active one; `--d` is a beat's start, `--t` its length. The
    resting state is the finished frame, and every board is done inside five
    seconds. */
import { CAL, CAP, CASE, Glyph, HASH, INST, Ok, PERSON, UPLOAD, d } from "./TechPillarKit";

/* ── 01 · Onboarding: documents are uploaded; AI captures each detail,
   structures it into one record, validates it, and the record is ready. ── */

/** A detail's capture box on its document, the record row it fills, and the
    row's glyph: name, ID number, degree, date, employer. */
const FIELDS = [
  { box: [115, 87, 82, 17], g: PERSON, w: 104, at: 1.0 },
  { box: [63, 146, 158, 12], g: HASH, w: 120, at: 1.12 },
  { box: [101, 195, 106, 17], g: CAP, w: 92, at: 1.45 },
  { box: [101, 225, 68, 15], g: CAL, w: 64, at: 1.58 },
  { box: [63, 297, 82, 24], g: CASE, w: 98, at: 1.9 },
];
const ROW_Y = [156, 192, 228, 264, 300];

export function CaptureArt() {
  return (
    <svg className="tk-art tk-mirror" viewBox="20 40 560 360" fill="none">
      {/* Uploaded */}
      <rect className="tk-zone tk-a-fade" x="44" y="58" width="196" height="336" rx="18" style={d(0)} />
      <g className="tk-a-pop" style={d(0.05)}>
        <circle className="tk-node" cx="142" cy="58" r="13" />
        <Glyph g={UPLOAD} x={142} y={58} s={0.58} />
      </g>

      <g className="tk-a-drop" style={d(0.15)}>
        <rect className="tk-sheet" x="56" y="74" width="172" height="92" rx="10" />
        <rect className="tk-paperfill" x="68" y="86" width="40" height="52" rx="6" />
        <circle className="tk-soft" cx="88" cy="105" r="8" />
        <path className="tk-soft" d="M76 133a12 9 0 0 1 24 0z" />
        <rect className="tk-inkbar" x="120" y="92" width="72" height="7" rx="3.5" />
        <rect className="tk-bar" x="120" y="108" width="52" height="5" rx="2.5" />
        <rect className="tk-bar" x="120" y="120" width="62" height="5" rx="2.5" />
        <path className="tk-mrz" d="M68 152H216" />
      </g>
      <g className="tk-a-drop" style={d(0.3)}>
        <rect className="tk-sheet" x="56" y="182" width="172" height="92" rx="10" />
        <circle className="tk-paperfill" cx="82" cy="208" r="13" />
        <Glyph g={INST} x={82} y={208} s={0.55} />
        <rect className="tk-inkbar" x="106" y="200" width="96" height="7" rx="3.5" />
        <rect className="tk-bar" x="106" y="215" width="70" height="5" rx="2.5" />
        <rect className="tk-bar" x="106" y="230" width="58" height="5" rx="2.5" />
        <path className="tk-sign" d="M146 258c6-9 10-9 12-3s5 6 9-1 7-6 9 0" />
        <circle className="tk-ringl" cx="208" cy="254" r="9" />
      </g>
      <g className="tk-a-drop" style={d(0.45)}>
        <rect className="tk-sheet" x="56" y="290" width="172" height="92" rx="10" />
        <rect className="tk-red" x="68" y="303" width="66" height="6" rx="3" />
        <rect className="tk-soft" x="68" y="314" width="44" height="4" rx="2" />
        {[60, 48, 54].map((w, i) => (
          <g key={i}>
            <rect className="tk-bar" x="68" y={330 + i * 14} width={w} height="5" rx="2.5" />
            <rect className="tk-inkbar tk-faint" x="176" y={330 + i * 14} width={i === 1 ? 34 : 40} height="5" rx="2.5" />
          </g>
        ))}
      </g>

      {/* AI captures: each document is read, each detail boxed */}
      {[76, 184, 292].map((y, i) => (
        <path key={y} className="tk-scanl tk-a-scan" d={`M58 ${y}H226`} style={d([0.85, 1.3, 1.75][i], { "--dy": "88px", "--t": ".45s" })} />
      ))}
      {FIELDS.map((f, i) => (
        <rect key={i} className="tk-fbox tk-a-draw" x={f.box[0]} y={f.box[1]} width={f.box[2]} height={f.box[3]} rx="4" pathLength="1" style={d(f.at, { "--t": ".3s" })} />
      ))}

      {/* …structures it: each detail runs to its row */}
      {FIELDS.map((f, i) => {
        const [bx, by, bw, bh] = f.box;
        const x1 = bx + bw;
        const y1 = by + bh / 2;
        const p = `M${x1} ${y1}C${x1 + 56} ${y1} 278 ${ROW_Y[i]} 334 ${ROW_Y[i]}`;
        return (
          <g key={i}>
            <path className="tk-wire tk-a-draw" d={p} pathLength="1" style={d(f.at + 0.15)} />
            <path className="tk-comet tk-a-comet" d={p} pathLength="1" style={d(f.at + 0.15)} />
          </g>
        );
      })}

      {/* The record */}
      <g className="tk-a-in" style={d(0.35)}>
        <rect className="tk-sheet" x="322" y="66" width="238" height="310" rx="16" />
        <circle className="tk-paperfill" cx="350" cy="100" r="15" />
        <Glyph g={PERSON} x={350} y={100} s={0.6} />
        <rect className="tk-inkbar" x="374" y="92" width="88" height="7" rx="3.5" />
        <rect className="tk-soft" x="374" y="106" width="56" height="5" rx="2.5" />
        <circle className="tk-pend" cx="536" cy="100" r="9" />
        <path className="tk-hair" d="M322 128H560" />
        {FIELDS.map((f, i) => (
          <g key={i}>
            <rect className="tk-paperfill" x="334" y={ROW_Y[i] - 14} width="214" height="28" rx="8" />
            <Glyph g={f.g} x={352} y={ROW_Y[i]} s={0.6} />
            <rect className="tk-soft" x="372" y={ROW_Y[i] - 3.5} width={f.w} height="7" rx="3.5" />
            <path className="tk-val tk-a-draw" d={`M375.5 ${ROW_Y[i]}h${f.w - 7}`} pathLength="1" style={d(f.at + 0.55, { "--t": ".35s" })} />
          </g>
        ))}
        <path className="tk-track" d="M340 348H542" />
      </g>

      {/* …validates every row; the record is verification-ready */}
      {FIELDS.map((_, i) => (
        <Ok key={i} x={532} y={ROW_Y[i]} at={2.65 + i * 0.12} />
      ))}
      <path className="tk-ready tk-a-draw" d="M340 348H542" pathLength="1" style={d(3.25, { "--t": ".55s" })} />
      <rect className="tk-ready-ring tk-a-fade" x="322" y="66" width="238" height="310" rx="16" style={d(3.8)} />
      <Ok x={536} y={100} r={9} at={3.8} />
    </svg>
  );
}

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
