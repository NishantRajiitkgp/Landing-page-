/** The trust road's fifth and sixth stops (`./TechRoad`), the
    institutions a trusted person works within: the regulator, then the
    supply chain. Each is a few floating pieces round a hero
    (`./TechRoadKit`); the company is `./TechRoadFirm`. */
import { DOC, GLOBE, Glyph, OFFICE, SHIELD, type TechArt } from "./TechPillarKit";
import { BOX, Board, Chip, Piece, TRUCK, Tick, gr, on, run, star, type Pt } from "./TechRoadKit";

/* 05 · Compliance and regulatory. The regulator's building rises column
   by column under its pediment, the scales swing level, the rule book
   opens and the seals of standards worldwide are met. */
const COLS = [22, 54, 86, 116, 148, 180];
const DENTILS = Array.from({ length: 25 }, (_, i) => `M${12 + i * 8} 62h4v4h-4z`).join("");

function Regulator() {
  return (
    <>
      <rect x="0" y="174" width="220" height="10" rx="2" fill={gr("card")} className="tk-rd-edge" />
      <rect x="4" y="165" width="212" height="9" rx="1.5" fill={gr("card")} className="tk-rd-edge" />
      <rect x="10" y="156" width="200" height="9" rx="1.5" fill={gr("card")} className="tk-rd-edge" />
      <rect className="tk-rd-hairf" x="16" y="70" width="188" height="86" />
      {COLS.map((x, k) => (
        <g key={x} className="tk-rd-p tk-rd-grow" style={on(0.08 + k * 0.03)}>
          <rect x={x - 3} y="150" width="24" height="6" rx="1.5" fill={gr("card")} className="tk-rd-edge" />
          <rect x={x} y="76" width="18" height="74" fill={gr("card")} className="tk-rd-edge" />
          <path className="tk-rd-lnh" d={`M${x + 5} 79v68M${x + 9} 79v68M${x + 13} 79v68`} />
          <rect x={x - 3} y="70" width="24" height="6" rx="1.5" fill={gr("card")} className="tk-rd-edge" />
        </g>
      ))}
      <g className="tk-rd-p tk-rd-drop" style={on(0.3)}>
        <rect x="4" y="54" width="212" height="16" rx="2" fill={gr("card")} className="tk-rd-edge" />
        <path className="tk-rd-hair" d={DENTILS} />
        <path d="M8 54 110 8l102 46z" fill={gr("card")} className="tk-rd-edge" />
        <path className="tk-rd-lnh" d="M30 48 110 15l80 33z" />
        <circle cx="110" cy="36" r="9" fill={gr("red")} />
        <path className="tk-rd-white" d={star(110, 36, 5, 2.2, 5)} />
      </g>
    </>
  );
}

const SEALS: [Pt, string][] = [[[84, 150], SHIELD], [[150, 58], GLOBE], [[326, 64], DOC]];

export function Compliance({ a }: { a: TechArt }) {
  return (
    <Board
      id="reg"
      hub={[190, 300, 410, 300]}
      chips={
        <>
          <Chip x={300} y={152} at={0.36}>{a.globe.regulator}</Chip>
          <Chip x={486} y={410} at={0.86} tone="ok">{a.road.standards}</Chip>
        </>
      }
    >
      {SEALS.map(([[x, y], g], k) => (
        <Piece key={x} x={x} y={y} w={58} vb="0 0 64 64" at={0.58 + k * 0.06} z={0.7 + k * 0.1} ph={0.2 + k * 0.3} a="pop">
          <path d={star(32, 32, 30, 27, 18)} fill={gr("card")} className="tk-rd-edge" />
          <circle className="tk-rd-lnt tk-rd-w2" cx="32" cy="32" r="21" />
          <Glyph g={g} x={32} y={32} s={0.9} cls="tk-ic" />
          <Tick x={54} y={10} r={8} />
        </Piece>
      ))}
      <Piece x={190} y={176} w={220} vb="0 0 220 186" at={0.03} ph={0.3} bob={3}>
        <Regulator />
      </Piece>
      <Piece x={418} y={64} w={140} vb="0 0 140 150" at={0.38} z={1.1} ph={0.45}>
        <path d="M46 132h48l-8 12H54z" fill={gr("ink")} />
        <rect x="67.5" y="22" width="5" height="112" rx="2.5" fill={gr("ink")} />
        <circle cx="70" cy="14" r="7" fill={gr("red")} />
        <g className="tk-rd-t tk-rd-arm" style={run(0.42, 0.28)}>
          <path className="tk-rd-beam" d="M14 26Q70 18 126 26" />
          {[14, 126].map((x) => (
            <g key={x} className="tk-rd-pan">
              <path className="tk-rd-ln" d={`M${x} 26 ${x - 14} 76M${x} 26l14 50`} />
              <path d={`M${x - 20} 76Q${x} 96 ${x + 20} 76z`} fill={gr("card")} className="tk-rd-edge" />
            </g>
          ))}
        </g>
        <circle cx="70" cy="26" r="5" className="tk-rd-redk" />
      </Piece>
      <Piece x={104} y={316} w={136} vb="0 0 136 84" at={0.5} z={1.35} ph={0.7} a="drop">
        <path d="M4 18 68 26l64-8v58l-64 8-64-8z" fill={gr("red")} />
        <path d="M8 12c22-6 42-4 60 8v56C50 64 30 62 8 68z" fill={gr("card")} className="tk-rd-edge" />
        <path d="M128 12c-22-6-42-4-60 8v56c18-12 38-14 60-8z" fill={gr("card")} className="tk-rd-edge" />
        <path className="tk-rd-lnh" d="M18 28c14-3 28-2 42 4M18 38c14-3 28-2 42 4M18 48c14-3 28-2 42 4M18 58c10-2 20-1 30 2M118 28c-14-3-28-2-42 4M118 38c-14-3-28-2-42 4M118 48c-14-3-28-2-42 4" />
        <path className="tk-rd-red" d="M98 14v24l5-4 5 4V13z" />
      </Piece>
      <Piece x={430} y={300} w={112} vb="0 0 112 86" at={0.74} z={1.3} ph={0.2}>
        <rect width="112" height="86" rx="10" fill={gr("card")} className="tk-rd-edge" />
        <rect className="tk-rd-ink2" x="14" y="16" width="50" height="6" rx="3" />
        <rect className="tk-rd-off" x="14" y="28" width="38" height="4" rx="2" />
        {[46, 58, 70].map((y, i) => (
          <g key={y}>
            <Tick x={20} y={y} r={5} at={0.76 + i * 0.04} />
            <rect className="tk-rd-off" x="30" y={y - 2} width="30" height="4" rx="2" />
          </g>
        ))}
        <g className="tk-rd-p tk-rd-stamp" style={on(0.88)}>
          <circle className="tk-rd-lnk tk-rd-thick" cx="88" cy="58" r="15" />
          <path className="tk-rd-lnk tk-rd-thick tk-uf" d="M81 58.5l5 5 9-9.5" />
        </g>
      </Piece>
    </Board>
  );
}

/* 06 · Procurement and vendor trust. The factory's supply chain reaches
   out to its vendors; a check runs down every line, one vendor is caught
   and cut loose, and the vendor file is signed off. */
const VENDORS: [Pt, string][] = [[[86, 150], BOX], [[150, 72], OFFICE], [[248, 34], TRUCK], [[362, 40], BOX], [[462, 100], OFFICE]];
const HUB: Pt = [292, 214];
const reach = ([x, y]: Pt) => ({ x0: HUB[0], y0: HUB[1], x1: (HUB[0] + x) / 2, y1: Math.min(HUB[1], y) - 30, x2: x, y2: y });

function Factory() {
  return (
    <>
      <rect x="152" y="8" width="18" height="60" rx="2" fill={gr("ink")} />
      <rect className="tk-rd-red" x="152" y="18" width="18" height="6" />
      <rect x="180" y="22" width="16" height="46" rx="2" fill={gr("ink")} />
      <rect className="tk-rd-red" x="180" y="30" width="16" height="5" />
      <g className="tk-rd-t tk-rd-smoke" style={run(0.05, 0.9)}>
        <circle className="tk-rd-puff" cx="161" cy="0" r="7" />
        <circle className="tk-rd-puff" cx="171" cy="-12" r="9" />
        <circle className="tk-rd-puff" cx="188" cy="12" r="6" />
      </g>
      <rect x="140" y="60" width="80" height="108" fill={gr("card")} className="tk-rd-edge" />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={150 + (i % 2) * 32} y={72 + Math.floor(i / 2) * 20} width="22" height="12" rx="2" fill={gr("glass")} className="tk-rd-lnh" />
      ))}
      {[0, 1, 2, 3].map((k) => (
        <g key={k}>
          <path d={`M${k * 35} 88V56l35 32z`} fill={gr("card")} className="tk-rd-edge" />
          <rect x={k * 35 + 1.5} y="60" width="5" height="26" fill={gr("glass")} />
        </g>
      ))}
      <rect x="0" y="88" width="140" height="80" fill={gr("card")} className="tk-rd-edge" />
      {[0, 1, 2, 3].map((k) => (
        <rect key={k} x={12 + k * 32} y="100" width="20" height="14" rx="2" fill={gr("glass")} className="tk-rd-lnh" />
      ))}
      <rect className="tk-rd-ink2" x="44" y="126" width="48" height="42" />
      <path className="tk-rd-slats" d="M44 132h48M44 138h48M44 144h48M44 150h48M44 156h48M44 162h48" />
      <rect x="0" y="160" width="220" height="8" fill={gr("red")} />
    </>
  );
}

function Crate({ x, y }: { x: number; y: number }) {
  return (
    <>
      <path className="tk-rd-fr" d={`M${x + 44} ${y + 8}l10-8v38l-10 8z`} />
      <path className="tk-rd-ft" d={`M${x} ${y + 8}l10-8h44l-10 8z`} />
      <rect x={x} y={y + 8} width="44" height="38" fill={gr("card")} className="tk-rd-edge" />
      <path className="tk-rd-tape" d={`M${x + 22} ${y + 8}v38`} />
      <rect className="tk-rd-hairf" x={x + 6} y={y + 30} width="12" height="9" rx="1" />
    </>
  );
}

export function Procurement({ a }: { a: TechArt }) {
  return (
    <Board
      id="sup"
      hub={[180, 300, 400, 300]}
      back={
        <>
          {VENDORS.map(([p], k) => {
            const c = reach(p);
            return (
              <g key={k}>
                <path className="tk-rd-p tk-rd-draw tk-rd-feed" style={on(0.2 + k * 0.04)} d={`M${c.x0} ${c.y0}Q${c.x1} ${c.y1} ${c.x2} ${c.y2}`} pathLength={1} />
                {k === 3 && <path className="tk-rd-p tk-rd-fade tk-rd-cut" style={on(0.54)} d={`M${c.x0} ${c.y0}Q${c.x1} ${c.y1} ${c.x2} ${c.y2}`} />}
                <circle className={`tk-rd-t tk-rd-bit${k === 3 ? " tk-rd-bit-bad" : ""}`} style={run(0.26 + k * 0.05, 0.16, c)} r="4" />
              </g>
            );
          })}
        </>
      }
      chips={
        <>
          <Chip x={300} y={98} at={0.2}>{a.road.supply}</Chip>
          <Chip x={476} y={432} at={0.86} tone="ok">{a.road.vendor}</Chip>
        </>
      }
    >
      {VENDORS.map(([[x, y], g], k) => (
        <Piece key={x} x={x - 27} y={y - 27} w={54} vb="0 0 60 60" at={0.14 + k * 0.04} z={0.75 + (k % 3) * 0.15} ph={k * 0.21} a="pop">
          <g className={k === 3 ? "tk-rd-p tk-rd-dim" : undefined} style={k === 3 ? on(0.56) : undefined}>
            <circle cx="30" cy="30" r="27" fill={gr("card")} className="tk-rd-edge" />
            <circle className="tk-rd-paperc" cx="30" cy="30" r="19" />
            <Glyph g={g} x={30} y={30} s={0.8} cls="tk-ic" />
          </g>
          <Tick x={50} y={10} r={9} at={0.44 + k * 0.07} bad={k === 3} />
        </Piece>
      ))}
      <Piece x={180} y={172} w={220} vb="0 0 220 176" at={0.04} ph={0.3} bob={3}>
        <Factory />
      </Piece>
      <Piece x={88} y={300} w={108} vb="0 0 112 92" at={0.12} z={1.35} ph={0.6}>
        <Crate x={0} y={46} />
        <Crate x={56} y={46} />
        <Crate x={28} y={0} />
      </Piece>
      <Piece x={424} y={280} w={104} vb="0 0 104 132" at={0.62} z={1.3} ph={0.25}>
        <rect width="104" height="132" rx="10" fill={gr("ink")} />
        <rect x="8" y="12" width="88" height="112" rx="6" fill={gr("card")} />
        <rect x="34" y="2" width="36" height="16" rx="5" fill={gr("steel")} className="tk-rd-edge" />
        <rect className="tk-rd-ink2" x="18" y="28" width="48" height="5" rx="2.5" />
        {[48, 66, 84].map((y, i) => (
          <g key={y}>
            <circle className="tk-rd-paperc" cx="24" cy={y} r="6" />
            <Tick x={24} y={y} r={6} at={0.66 + i * 0.06} />
            <rect className="tk-rd-off" x="36" y={y - 2.5} width="48" height="5" rx="2.5" />
          </g>
        ))}
        <g className="tk-rd-p tk-rd-stamp" style={on(0.84)}>
          <circle className="tk-rd-lnk tk-rd-thick" cx="76" cy="106" r="13" />
          <path className="tk-rd-lnk tk-rd-thick tk-uf" d="M70 106.4l4 4 8-8.4" />
        </g>
      </Piece>
    </Board>
  );
}
