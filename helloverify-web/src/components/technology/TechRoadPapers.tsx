/** The trust road's third and fourth stops (`./TechRoad`): the bank
    account a verified identity opens, and the papers it carries. Each is
    a few floating pieces round a hero (`./TechRoadKit`). */
import { Glyph, HASH, ID, INST, SHIELD, n, type TechArt } from "./TechPillarKit";
import { Board, CHART, Chip, Coin, HOME, Piece, Tick, gr, on, run, star } from "./TechRoadKit";

/* 03 · Financial onboarding. The bank runs its KYC checks one by one;
   the vault's wheel spins, its bolts draw back and the door swings open
   on an approved account, and a new card slides out. */
const BOLTS = Array.from({ length: 12 }, (_, i) => i * 30);
const SPOKES = [0, 120, 240];
const KYC: [string, number][] = [[ID, 70], [HOME, 98], [SHIELD, 126], [CHART, 154]];
const DIAL = Array.from({ length: 36 }, (_, i) => {
  const t = (i * Math.PI) / 18;
  const o = i % 3 ? 29 : 31.5;
  return `M${n(100 + Math.cos(t) * 26)} ${n(98 + Math.sin(t) * 26)}L${n(100 + Math.cos(t) * o)} ${n(98 + Math.sin(t) * o)}`;
}).join("");
const RIVETS = [[26, 24], [174, 24], [26, 172], [174, 172]];

function Vault() {
  return (
    <>
      <rect x="2" y="5" width="196" height="195" rx="34" className="tk-rd-ink2" />
      <rect x="2" width="196" height="196" rx="34" fill={gr("steel")} className="tk-rd-edge" />
      <rect className="tk-rd-lnh" x="12" y="10" width="176" height="176" rx="27" />
      {RIVETS.map(([x, y]) => (
        <circle key={`${x}-${y}`} className="tk-rd-rivet" cx={x} cy={y} r="3.4" />
      ))}
      <circle cx="100" cy="98" r="82" className="tk-rd-ink" />
      <g className="tk-rd-p tk-rd-fade" style={on(0.66)}>
        <circle cx="100" cy="98" r="76" fill={gr("card")} />
        <circle cx="100" cy="98" r="76" fill={gr("okglow")} />
        <path className="tk-rd-lnh" d="M44 70h112M38 126h124" />
        <circle cx="100" cy="98" r="24" fill={gr("ok")} />
        <path className="tk-rd-lnw tk-rd-thick5 tk-uf" d="M89 98.5l8 8 15-16" />
      </g>
      <g className="tk-rd-t tk-rd-door" style={run(0.66, 0.16)}>
        <circle cx="100" cy="101" r="77" className="tk-rd-ink2" />
        <circle cx="100" cy="98" r="77" fill={gr("disc")} className="tk-rd-edge" />
        <circle className="tk-rd-lnh tk-rd-w2" cx="100" cy="98" r="64" />
        <g className="tk-rd-t tk-rd-bolts" style={run(0.56, 0.1)}>
          {BOLTS.map((d) => (
            <rect key={d} className="tk-rd-bolt" x="96" y="26" width="8" height="12" rx="3" transform={`rotate(${d} 100 98)`} />
          ))}
        </g>
        <circle cx="100" cy="98" r="32" fill={gr("steel")} className="tk-rd-edge" />
        <path className="tk-rd-ticks" d={DIAL} />
        <g className="tk-rd-t tk-rd-wheel" style={run(0.22, 0.38)}>
          {SPOKES.map((d) => (
            <g key={d} transform={`rotate(${d} 100 98)`}>
              <rect className="tk-rd-ink2" x="96.5" y="46" width="7" height="52" rx="3.5" />
              <circle cx="100" cy="46" r="8" fill={gr("red")} />
            </g>
          ))}
          <circle cx="100" cy="98" r="13" fill={gr("red")} />
          <circle className="tk-rd-white tk-rd-faint" cx="96" cy="94" r="4" />
        </g>
        <circle cx="100" cy="36" r="4" className="tk-rd-red" />
        <circle className="tk-rd-p tk-rd-pop tk-rd-okf" style={on(0.6)} cx="100" cy="36" r="4" />
        <circle className="tk-rd-t tk-rd-doorshade" style={run(0.66, 0.16)} cx="100" cy="98" r="77" />
      </g>
      <rect x="4" y="62" width="16" height="24" rx="4" fill={gr("ink")} />
      <rect x="4" y="110" width="16" height="24" rx="4" fill={gr("ink")} />
    </>
  );
}

export function Finance({ a }: { a: TechArt }) {
  return (
    <Board
      id="fin"
      hub={[204, 286, 396, 286]}
      chips={
        <>
          <Chip x={116} y={114} at={0.3}>{a.story.kyc}</Chip>
          <Chip x={438} y={404} at={0.86} tone="ok">{a.road.account}</Chip>
        </>
      }
    >
      <Piece x={40} y={132} w={150} vb="0 0 150 178" at={0.1} z={0.8} ph={0.15}>
        <rect width="150" height="178" rx="14" fill={gr("card")} className="tk-rd-edge" />
        <rect x="14" y="14" width="28" height="28" rx="8" className="tk-rd-tint" />
        <Glyph g={ID} x={28} y={28} s={0.7} cls="tk-ic tk-ic-r" />
        <rect className="tk-rd-ink2" x="50" y="18" width="62" height="6" rx="3" />
        <rect className="tk-rd-off" x="50" y="31" width="40" height="4" rx="2" />
        <path className="tk-rd-lnh" d="M14 54h122" />
        {KYC.map(([g, y], i) => (
          <g key={y}>
            <circle className="tk-rd-paperc" cx="26" cy={y} r="11" />
            <Glyph g={g} x={26} y={y} s={0.55} cls="tk-ic tk-ic-m" />
            <rect className="tk-rd-ink2 tk-rd-faint" x="44" y={y - 7} width="58" height="5" rx="2.5" />
            <rect className="tk-rd-off" x="44" y={y + 2} width="40" height="4" rx="2" />
            <circle className="tk-rd-ringbg2" cx="128" cy={y} r="8" />
            <Tick x={128} y={y} r={8} at={0.3 + i * 0.08} />
          </g>
        ))}
      </Piece>
      <Piece x={418} y={120} w={74} vb="0 0 74 74" at={0.12} z={0.75} ph={0.5} a="pop">
        <circle cx="37" cy="37" r="35" fill={gr("card")} className="tk-rd-edge" />
        <Glyph g={INST} x={37} y={38} s={1.3} cls="tk-ic" />
        <path d="M21.4 33 37 24.6 52.6 33z" fill={gr("red")} />
      </Piece>
      <Piece x={204} y={186} w={192} vb="0 0 200 200" at={0.06} ph={0.3} bob={3}>
        <Vault />
      </Piece>
      <Piece x={350} y={270} w={176} vb="0 0 172 108" at={0.8} z={1.35} ph={0.7} a="emerge">
        <rect y="4" width="172" height="108" rx="12" className="tk-rd-redk" />
        <rect width="172" height="108" rx="12" fill={gr("red")} />
        <path className="tk-rd-white tk-rd-gloss" d="M0 72C50 42 110 32 172 36V12A12 12 0 0 0 160 0H12A12 12 0 0 0 0 12z" />
        <rect x="18" y="30" width="28" height="21" rx="4" fill={gr("steel")} />
        <path className="tk-rd-ln tk-rd-faint" d="M18 40.5h28M27 30v21M37 30v21" />
        <path className="tk-rd-lnw" d="M58 34a10 10 0 0 1 0 14M63.5 30.5a15 15 0 0 1 0 21M69 27a20 20 0 0 1 0 28" />
        {[0, 1, 2, 3].map((k) => (
          <rect key={k} className="tk-rd-white tk-rd-faint" x={18 + k * 34} y="68" width="26" height="5" rx="2.5" />
        ))}
        <rect className="tk-rd-white tk-rd-faint" x="18" y="86" width="56" height="5" rx="2.5" />
        <circle className="tk-rd-white tk-rd-faint" cx="138" cy="88" r="10" />
        <circle className="tk-rd-white tk-rd-faint" cx="152" cy="88" r="10" />
      </Piece>
      <Piece x={186} y={360} w={34} vb="0 0 40 40" at={0.84} z={1.5} ph={0.2} a="pop">
        <Coin />
      </Piece>
      <Piece x={512} y={196} w={28} vb="0 0 40 40" at={0.88} z={0.7} ph={0.45} a="pop">
        <Coin />
      </Piece>
      <Piece x={198} y={58} w={26} vb="0 0 40 40" at={0.9} z={0.6} ph={0.8} a="pop">
        <Coin />
      </Piece>
    </Board>
  );
}

/* 04 · Verified credentials. The degree comes up with the licence and the
   transcript behind it, is sealed, and its hash joins a chain; the
   credential goes into a wallet, and a forged copy is struck out. */
const QR = ["111111101", "100000101", "101110101", "101110100", "101110111", "100000100", "111111101", "000000010", "111011101"];
const QR_D = QR.flatMap((row, r) => [...row].map((c, k) => (c === "1" ? `M${n(17 + k * 5.5)} ${n(72 + r * 5.5)}h5.5v5.5h-5.5z` : ""))).join("");
const CORNERS = [[13, 13], [207, 13], [13, 147], [207, 147]];

function Degree() {
  return (
    <>
      <rect width="220" height="160" rx="6" fill={gr("card")} className="tk-rd-edge" />
      <rect className="tk-rd-lnt tk-rd-w2" x="8" y="8" width="204" height="144" rx="3" />
      <rect className="tk-rd-lnh" x="13" y="13" width="194" height="134" rx="2" />
      {CORNERS.map(([x, y]) => (
        <rect key={`${x}-${y}`} className="tk-rd-tint" x={x - 4} y={y - 4} width="8" height="8" transform={`rotate(45 ${x} ${y})`} />
      ))}
      <path d="M101 20h18v11l-9 8-9-8z" fill={gr("red")} />
      <path className="tk-rd-laurel" d="M93 22c-6 4-8 10-6 17M127 22c6 4 8 10 6 17" />
      <rect className="tk-rd-ink2" x="58" y="50" width="104" height="8" rx="4" />
      <rect className="tk-rd-off" x="76" y="64" width="68" height="4" rx="2" />
      <rect className="tk-rd-ink" x="66" y="80" width="88" height="7" rx="3.5" />
      <path className="tk-rd-lnh" d="M52 94h116" />
      <rect className="tk-rd-off" x="48" y="102" width="124" height="3.5" rx="1.75" />
      <rect className="tk-rd-off" x="62" y="110" width="96" height="3.5" rx="1.75" />
      <path className="tk-rd-sign" d="M30 132c5-8 9 2 13-3s6-7 10 0 6 3 9-1" />
      <path className="tk-rd-lnh" d="M28 141h48" />
      <rect className="tk-rd-off" x="96" y="137" width="34" height="3.5" rx="1.75" />
      <g className="tk-rd-p tk-rd-stamp" style={on(0.5)}>
        <path className="tk-rd-redk" d="M170 130l-8 24 8-4 4 8 4-24zM184 130l8 24-8-4-4 8-4-24z" />
        <path d={star(177, 124, 17, 14.5, 16)} fill={gr("red")} />
        <circle className="tk-rd-lnw" cx="177" cy="124" r="10" />
        <path className="tk-rd-lnw tk-rd-thick tk-uf" d="M172 124.4l3.6 3.6 6.8-7.2" />
      </g>
    </>
  );
}

export function Credentials({ a }: { a: TechArt }) {
  return (
    <Board
      id="cred"
      hub={[190, 292, 410, 292]}
      back={<path className="tk-rd-p tk-rd-draw tk-rd-link" style={on(0.3)} d="M376 330C430 322 440 244 478 232" pathLength={1} />}
      chips={
        <>
          <Chip x={300} y={192} at={0.12}>{a.story.degree}</Chip>
          <Chip x={500} y={92} at={0.46}>{a.road.tamper}</Chip>
          <Chip x={474} y={444} at={0.8} tone="bad">{a.story.flagged}</Chip>
        </>
      }
    >
      <Piece x={112} y={164} w={150} vb="0 0 150 96" at={0.04} z={0.6} ph={0.1} rot={-10}>
        <rect width="150" height="96" rx="10" fill={gr("card")} className="tk-rd-edge" />
        <path d="M10 0h4v96h-4A10 10 0 0 1 0 86V10A10 10 0 0 1 10 0z" fill={gr("red")} />
        <rect className="tk-rd-paperc" x="24" y="18" width="34" height="42" rx="4" />
        <circle className="tk-rd-off" cx="41" cy="33" r="8" />
        <path className="tk-rd-off" d="M28 60c1.6-7 6-10.5 13-10.5S52.4 53 54 60z" />
        <rect className="tk-rd-ink2" x="68" y="20" width="56" height="5" rx="2.5" />
        <rect className="tk-rd-off" x="68" y="32" width="44" height="4" rx="2" />
        <rect className="tk-rd-off" x="68" y="41" width="50" height="4" rx="2" />
        <circle cx="126" cy="72" r="12" fill={gr("glass")} className="tk-rd-lnt" />
        <rect className="tk-rd-off" x="24" y="72" width="70" height="4" rx="2" />
      </Piece>
      <Piece x={346} y={150} w={116} vb="0 0 116 150" at={0.1} z={0.65} ph={0.4} rot={9}>
        <rect width="116" height="150" rx="8" fill={gr("card")} className="tk-rd-edge" />
        <rect className="tk-rd-ink2" x="14" y="16" width="52" height="6" rx="3" />
        <rect className="tk-rd-off" x="14" y="28" width="36" height="4" rx="2" />
        {Array.from({ length: 7 }, (_, r) => (
          <g key={r}>
            <path className="tk-rd-lnh" d={`M14 ${46 + r * 13}h88`} />
            <rect className="tk-rd-off" x="14" y={49 + r * 13} width={30 + ((r * 7) % 14)} height="3.5" rx="1.75" />
            <rect className={r % 3 ? "tk-rd-paperc" : "tk-rd-tint"} x="82" y={48 + r * 13} width="20" height="8" rx="2" />
          </g>
        ))}
      </Piece>
      <Piece x={190} y={210} w={220} vb="0 0 220 160" at={0.06} ph={0.3} bob={4}>
        <Degree />
      </Piece>
      <Piece x={470} y={112} w={62} vb="0 0 62 236" at={0.3} z={1.1} ph={0.65} sh={false}>
        {[0, 1].map((k) => (
          <g key={k} className="tk-rd-p tk-rd-fade" style={on(0.36 + k * 0.08)}>
            <path className="tk-rd-chain" d={`M31 ${k * 96 + 44}v52`} />
            <rect className="tk-rd-linkr" x="25" y={k * 96 + 54} width="12" height="18" rx="6" />
            <rect className="tk-rd-linkr" x="25" y={k * 96 + 68} width="12" height="18" rx="6" />
          </g>
        ))}
        {[0, 1, 2].map((k) => (
          <g key={k} className="tk-rd-p tk-rd-pop" style={on(0.32 + k * 0.08)}>
            <rect x="9" y={k * 96} width="44" height="44" rx="12" fill={gr("card")} className="tk-rd-edge" />
            <rect className="tk-rd-lnr tk-rd-faint" x="9" y={k * 96} width="44" height="44" rx="12" />
            <Glyph g={HASH} x={31} y={k * 96 + 22} s={0.8} cls="tk-ic tk-ic-r" />
          </g>
        ))}
        <Tick x={52} y={194} r={9} at={0.54} />
      </Piece>
      <Piece x={92} y={282} w={84} vb="0 0 84 150" at={0.6} z={1.4} ph={0.85} a="pop">
        <rect width="84" height="150" rx="16" fill={gr("ink")} />
        <rect x="5" y="5" width="74" height="140" rx="12" fill={gr("card")} />
        <rect className="tk-rd-ink" x="30" y="10" width="24" height="6" rx="3" />
        <rect x="12" y="24" width="60" height="38" rx="6" fill={gr("red")} />
        <rect className="tk-rd-white tk-rd-faint" x="18" y="32" width="30" height="4" rx="2" />
        <rect className="tk-rd-white tk-rd-faint" x="18" y="40" width="22" height="3" rx="1.5" />
        <circle className="tk-rd-white tk-rd-faint" cx="62" cy="50" r="5" />
        <path className="tk-rd-ink" d={QR_D} />
        <rect className="tk-rd-okpill" x="16" y="128" width="52" height="10" rx="5" />
      </Piece>
      <Piece x={420} y={346} w={108} vb="0 0 110 80" at={0.66} z={1.25} ph={0.5} rot={7} a="fade">
        <rect width="110" height="80" rx="6" fill={gr("card")} className="tk-rd-edge" />
        <path className="tk-rd-off" d="M48 10h14v8l-7 6-7-6z" />
        <rect className="tk-rd-off" x="26" y="32" width="58" height="5" rx="2.5" />
        <rect className="tk-rd-off" x="34" y="44" width="42" height="4" rx="2" />
        <rect className="tk-rd-off" x="30" y="54" width="50" height="4" rx="2" />
        <path className="tk-rd-p tk-rd-draw tk-rd-strike" style={on(0.72)} d="M10 66 100 14" pathLength={1} />
        <g className="tk-rd-p tk-rd-stamp" style={on(0.78)}>
          <circle cx="92" cy="62" r="13" fill={gr("red")} />
          <path className="tk-rd-lnw tk-rd-thick" d="M87 57l10 10M97 57l-10 10" />
        </g>
      </Piece>
    </Board>
  );
}
