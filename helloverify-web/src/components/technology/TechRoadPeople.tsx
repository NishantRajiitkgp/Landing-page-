/** The trust road's first two stops (`./TechRoad`), one person's own
    trust: crossing a border, then an identity of their own. Each is a few
    floating pieces round a hero (`./TechRoadKit`). */
import { Glyph, PERSON, n, type TechArt } from "./TechPillarKit";
import { Board, Chip, PLANE, Piece, Professional, Tick, gr, on, run, star } from "./TechRoadKit";

/* 01 · Workforce mobility. A professional, passport and boarding pass in
   hand: the plane flies the route from one country to the next, the visa
   is stamped and the pass comes back verified. */
const FLIGHT = { x0: 96, y0: 150, x1: 305, y1: -40, x2: 514, y2: 130 };
const FLIGHT_D = `M${FLIGHT.x0} ${FLIGHT.y0}Q${FLIGHT.x1} ${FLIGHT.y1} ${FLIGHT.x2} ${FLIGHT.y2}`;
const BARCODE = [2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 2].reduce<[number, number][]>(
  (bars, w) => [...bars, [bars.length ? bars[bars.length - 1][0] + bars[bars.length - 1][1] + 1.6 : 158, w]],
  [],
);

function Pin({ x, y, at }: { x: number; y: number; at: number }) {
  return (
    <g className="tk-rd-p tk-rd-drop" style={on(at)}>
      <circle className="tk-rd-t tk-rd-ripple" style={run(at + 0.02, 0.14)} cx={x} cy={y} r="16" />
      <ellipse className="tk-rd-shadeo" cx={x} cy={y} rx="9" ry="3" />
      <path d={`M${x} ${y}C${x - 4} ${y - 9} ${x - 13} ${y - 17} ${x - 13} ${y - 27}a13 13 0 1 1 26 0c0 10-9 18-13 27z`} fill={gr("red")} />
      <circle className="tk-rd-white" cx={x} cy={y - 27} r="5" />
    </g>
  );
}

export function Mobility({ a }: { a: TechArt }) {
  return (
    <Board
      id="mob"
      hub={[196, 300, 406, 300]}
      back={
        <>
          <Pin x={FLIGHT.x0} y={FLIGHT.y0} at={0.06} />
          <Pin x={FLIGHT.x2} y={FLIGHT.y2} at={0.1} />
          <path className="tk-rd-p tk-rd-fade tk-rd-route" style={on(0.12)} d={FLIGHT_D} />
          <path className="tk-rd-t tk-rd-flown" style={run(0.2, 0.46)} d={FLIGHT_D} pathLength={1} />
          <circle className="tk-rd-t tk-rd-ripple" style={run(0.64, 0.16)} cx={FLIGHT.x2} cy={FLIGHT.y2} r="16" />
        </>
      }
      front={
        <g className="tk-rd-t tk-rd-plane" style={run(0.2, 0.46, FLIGHT)}>
          <path d={PLANE} fill={gr("red")} />
        </g>
      }
      chips={
        <>
          <Chip x={FLIGHT.x0} y={FLIGHT.y0 - 62} at={0.08}>{a.globe.singapore}</Chip>
          <Chip x={FLIGHT.x2} y={FLIGHT.y2 - 62} at={0.12}>{a.globe.london}</Chip>
          <Chip x={300} y={386} at={0.72} tone="ok">{a.story.verified}</Chip>
        </>
      }
    >
      <Piece x={84} y={190} w={94} vb="0 0 96 126" at={0.04} z={0.7} ph={0.1} rot={-8}>
        <rect x="3" y="3" width="93" height="123" rx="10" className="tk-rd-redk" />
        <rect width="92" height="124" rx="10" fill={gr("red")} />
        <rect width="12" height="124" rx="6" className="tk-rd-redk tk-rd-faint" />
        <circle className="tk-rd-lnw" cx="50" cy="50" r="20" />
        <ellipse className="tk-rd-lnw tk-rd-faint" cx="50" cy="50" rx="8.5" ry="20" />
        <path className="tk-rd-lnw tk-rd-faint" d="M30 50h40M33.5 40h33M33.5 60h33" />
        <rect className="tk-rd-white" x="28" y="86" width="44" height="5" rx="2.5" />
        <rect className="tk-rd-white tk-rd-faint" x="34" y="96" width="32" height="3.5" rx="1.75" />
        <path className="tk-rd-white tk-rd-gloss" d="M22 0h58C50 22 34 56 26 124H12V10A10 10 0 0 1 22 0z" />
      </Piece>
      <Piece x={196} y={246} w={210} vb="0 0 210 108" at={0.08} ph={0.3}>
        <rect width="210" height="108" rx="12" fill={gr("card")} className="tk-rd-edge" />
        <path d="M12 0h186a12 12 0 0 1 12 12v16H0V12A12 12 0 0 1 12 0z" fill={gr("red")} />
        <path className="tk-rd-white" d={PLANE} transform="translate(18 14) scale(.55)" />
        <rect className="tk-rd-white tk-rd-faint" x="34" y="11.5" width="46" height="5" rx="2.5" />
        <rect className="tk-rd-white tk-rd-faint" x="160" y="11.5" width="34" height="5" rx="2.5" />
        <circle className="tk-rd-paperc" cx="28" cy="60" r="15" />
        <Glyph g={PERSON} x={28} y={60} s={0.85} cls="tk-ic tk-ic-m" />
        <rect className="tk-rd-ink2" x="50" y="47" width="64" height="6" rx="3" />
        <rect className="tk-rd-off" x="50" y="59" width="44" height="4" rx="2" />
        <circle className="tk-rd-red" cx="54" cy="86" r="4" />
        <path className="tk-rd-dash" d="M62 86h48" />
        <circle className="tk-rd-ink" cx="118" cy="86" r="4" />
        <path className="tk-rd-red" d={PLANE} transform="translate(86 86) scale(.36)" />
        <path className="tk-rd-perf" d="M146 34v70" />
        <circle className="tk-rd-notch" cx="146" cy="0" r="7" />
        <circle className="tk-rd-notch" cx="146" cy="108" r="7" />
        {BARCODE.map(([x, w]) => (
          <rect key={x} className="tk-rd-ink2" x={n(x)} y="42" width={w} height="44" />
        ))}
        <g className="tk-rd-p tk-rd-stamp" style={on(0.68)}>
          <circle cx="196" cy="96" r="13" fill={gr("ok")} />
          <path className="tk-rd-lnw tk-rd-thick tk-uf" d="M190 96.4l4 4 8-8.4" />
        </g>
      </Piece>
      <Piece x={128} y={266} w={60} vb="0 0 64 120" at={0.03} z={1.15} ph={0.55}>
        <Professional />
      </Piece>
      <Piece x={420} y={232} w={112} vb="0 0 112 88" at={0.18} z={1.3} ph={0.75}>
        <rect width="112" height="88" rx="10" fill={gr("card")} className="tk-rd-edge" />
        <rect className="tk-rd-ink2" x="62" y="22" width="36" height="5" rx="2.5" />
        <rect className="tk-rd-off" x="62" y="34" width="28" height="4" rx="2" />
        <rect className="tk-rd-off" x="62" y="44" width="32" height="4" rx="2" />
        <rect className="tk-rd-off" x="62" y="54" width="22" height="4" rx="2" />
        <g className="tk-rd-p tk-rd-stamp" style={on(0.56)}>
          <circle className="tk-rd-lnr tk-rd-thick" cx="34" cy="44" r="23" />
          <circle className="tk-rd-lnr tk-rd-dotted" cx="34" cy="44" r="17" />
          <path className="tk-rd-red" d={star(34, 44, 9, 4, 5)} />
        </g>
        <Tick x={98} y={74} r={8} at={0.62} />
      </Piece>
    </Board>
  );
}

/* 02 · Digital identity. The ID card is scanned, its data streams into
   the phone, the holder's face is matched and their fingerprint read, and
   the shield of a verified digital identity rises. */
const FACE_DOTS: [number, number][] = [[52, 74], [68, 74], [60, 84], [50, 92], [70, 92], [60, 100], [44, 82], [76, 82]];
const PRINT = [
  "M30 60c-2.6-4-3.8-8.6-3.8-13.4a19.8 19.8 0 0 1 39.6 0",
  "M46 34.4a12 12 0 0 1 12 12c0 7.4-1.4 14-4 19.6",
  "M34.2 46.6a11.8 11.8 0 0 1 5.6-10",
  "M46 46.4c0 9-2 17.4-6 24.4",
  "M38.6 66.4c2.6-6 4-12.6 4-20a3.4 3.4 0 0 1 6.8 0c0 5.4-.6 10.6-1.8 15.4",
  "M62 59.4c-.8 3.8-2.2 7.4-4 10.6",
];
const DATA = { x0: 206, y0: 166, x1: 252, y1: 118, x2: 300, y2: 206 };

function Phone() {
  return (
    <>
      <rect width="120" height="236" rx="22" fill={gr("ink")} />
      <rect x="4" y="4" width="112" height="228" rx="19" className="tk-rd-ink" />
      <rect x="9" y="9" width="102" height="218" rx="15" fill={gr("card")} />
      <rect className="tk-rd-ink" x="44" y="15" width="32" height="8" rx="4" />
      <rect className="tk-rd-off" x="18" y="32" width="26" height="4" rx="2" />
      <circle className="tk-rd-okf" cx="101" cy="34" r="2.6" />
      <circle className="tk-rd-paperc" cx="60" cy="86" r="33" />
      <path className="tk-rd-off" d="M37.5 109.5c3.4-10.6 11.6-16 22.5-16s19.1 5.4 22.5 16a33 33 0 0 1-45 0z" />
      <circle className="tk-rd-skin" cx="60" cy="77" r="12.5" />
      <path className="tk-rd-ink2" d="M47.5 75c0-8 5.6-13 12.5-13s12.5 5 12.5 12c-3-3-7.4-4.4-12.8-4.4-4.6 0-8.8 1.6-12.2 5.4z" />
      <circle className="tk-rd-ringbg" cx="60" cy="86" r="39" />
      <circle className="tk-rd-t tk-rd-ringfg" style={run(0.36, 0.3)} cx="60" cy="86" r="39" pathLength={1} />
      <g className="tk-rd-p tk-rd-fade" style={on(0.42)}>
        {FACE_DOTS.map(([x, y]) => (
          <circle key={`${x}-${y}`} className="tk-rd-red" cx={x} cy={y} r="1.6" />
        ))}
        <path className="tk-rd-mesh" d="M52 74 60 84 68 74M44 82l6 10 10 8 10-8 6-10M50 92h20" />
      </g>
      <path className="tk-rd-p tk-rd-pop tk-rd-frame" style={on(0.34)} d="M30 62v-8h8M82 54h8v8M90 110v8h-8M38 118h-8v-8" />
      <g className="tk-rd-t tk-rd-scan" style={run(0.38, 0.28, { "--sd": 62 })}>
        <rect className="tk-rd-ray-g" x="24" y="40" width="72" height="14" />
        <rect className="tk-rd-ray" x="24" y="53" width="72" height="2" rx="1" />
      </g>
      <rect className="tk-rd-ink2" x="26" y="138" width="68" height="7" rx="3.5" />
      <rect className="tk-rd-off" x="36" y="151" width="48" height="4" rx="2" />
      <rect className="tk-rd-paperc" x="18" y="164" width="84" height="22" rx="6" />
      <rect className="tk-rd-off" x="26" y="170" width="30" height="3.5" rx="1.75" />
      <rect className="tk-rd-ink2 tk-rd-faint" x="26" y="177" width="50" height="4" rx="2" />
      <g className="tk-rd-p tk-rd-pop" style={on(0.72)}>
        <rect className="tk-rd-okpill" x="22" y="196" width="76" height="20" rx="10" />
        <Tick x={34} y={206} r={6} />
        <rect className="tk-rd-okbar" x="45" y="203.5" width="42" height="5" rx="2.5" />
      </g>
    </>
  );
}

export function Identity({ a }: { a: TechArt }) {
  return (
    <Board
      id="id"
      hub={[254, 300, 374, 300]}
      back={
        <>
          <path className="tk-rd-p tk-rd-fade tk-rd-route" style={on(0.26)} d={`M${DATA.x0} ${DATA.y0}Q${DATA.x1} ${DATA.y1} ${DATA.x2} ${DATA.y2}`} />
          {[0, 1, 2].map((i) => (
            <circle key={i} className="tk-rd-t tk-rd-bit" style={run(0.28 + i * 0.035, 0.16, DATA)} r="4" />
          ))}
        </>
      }
      chips={
        <>
          <Chip x={440} y={170} at={0.78}>{a.road.digitalId}</Chip>
          <Chip x={314} y={404} at={0.74} tone="ok">{a.story.verified}</Chip>
        </>
      }
    >
      <Piece x={60} y={130} w={162} vb="0 0 160 100" at={0.03} z={0.7} ph={0.05} rot={-8}>
        <rect width="160" height="100" rx="10" fill={gr("card")} className="tk-rd-edge" />
        <path d="M10 0h140a10 10 0 0 1 10 10v12H0V10A10 10 0 0 1 10 0z" fill={gr("red")} />
        <rect className="tk-rd-white tk-rd-faint" x="12" y="8" width="50" height="5" rx="2.5" />
        <rect className="tk-rd-paperc" x="12" y="32" width="38" height="48" rx="5" />
        <circle className="tk-rd-off" cx="31" cy="50" r="9" />
        <path className="tk-rd-off" d="M17 80c2-9 7-13 14-13s12 4 14 13z" />
        <rect className="tk-rd-ink2" x="60" y="36" width="62" height="6" rx="3" />
        <rect className="tk-rd-off" x="60" y="49" width="46" height="4" rx="2" />
        <rect className="tk-rd-off" x="60" y="58" width="56" height="4" rx="2" />
        <rect className="tk-rd-tint" x="126" y="34" width="22" height="17" rx="3.5" />
        <path className="tk-rd-lnr tk-rd-faint" d="M126 42.5h22M137 34v17" />
        <path className="tk-rd-mrz" d="M12 88h136M12 94h112" />
        <g className="tk-rd-t tk-rd-scan" style={run(0.05, 0.24, { "--sd": 100 })}>
          <rect className="tk-rd-ray-g" x="-4" y="-14" width="168" height="14" />
          <rect className="tk-rd-ray" x="-4" y="-1" width="168" height="2" />
        </g>
      </Piece>
      <Piece x={254} y={140} w={120} vb="0 0 120 236" at={0.1} ph={0.35} bob={4}>
        <Phone />
      </Piece>
      <Piece x={150} y={288} w={92} vb="0 0 92 92" at={0.5} z={1.35} ph={0.6} a="pop">
        <circle className="tk-rd-ringd" cx="46" cy="46" r="44" />
        <circle cx="46" cy="46" r="36" fill={gr("card")} className="tk-rd-edge" />
        {PRINT.map((d, i) => (
          <path key={i} className="tk-rd-p tk-rd-draw tk-rd-print" style={on(0.54 + i * 0.02)} d={d} pathLength={1} />
        ))}
        <Tick x={76} y={16} r={9} at={0.66} />
      </Piece>
      <Piece x={392} y={188} w={92} vb="0 0 96 110" at={0.76} z={1.25} ph={0.9} a="pop">
        <ellipse cx="48" cy="56" rx="48" ry="50" fill={gr("glow")} />
        <path d="M48 6 84 18v30c0 26-15 44-36 54C27 92 12 74 12 48V18z" fill={gr("red")} />
        <path className="tk-rd-white tk-rd-gloss" d="M48 6 84 18v8c-14 4-26 14-36 30C38 40 26 30 12 26v-8z" />
        <path className="tk-rd-p tk-rd-draw tk-rd-check tk-uf" style={on(0.8)} d="M32 52l11 11 21-23" pathLength={1} />
      </Piece>
    </Board>
  );
}
