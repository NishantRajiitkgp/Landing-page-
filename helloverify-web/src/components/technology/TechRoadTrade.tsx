/** The trust road's next three stops (`./TechRoad`), the institutions a
    trusted person works within: the regulator, the supply chain, the
    company. Drawn from `./TechRoadKit`. */
import { DOC, GLOBE, Glyph, SEARCH, SHIELD, n, type TechArt } from "./TechPillarKit";
import { Board, Box, Chip, Tick, face, iso, line, on, poly, run, type Pt } from "./TechRoadKit";

/* 05 · Compliance and regulatory. The regulator's building rises column
   by column, its scales swing level, the rule book lands and the seals of
   standards worldwide are met. */
const COLS = [-108, -84, -60, -36, -12];
const SEALS: Pt[] = [[148, 160], [204, 86], [392, 52]];

export function Compliance({ a }: { a: TechArt }) {
  return (
    <Board
      id="reg"
      chips={
        <>
          <Chip x={296} y={62} at={0.36}>{a.globe.regulator}</Chip>
          <Chip x={152} y={334} at={0.8} tone="ok">{a.road.standards}</Chip>
        </>
      }
    >
      <g className="tk-rd-p tk-rd-rise" style={on(0.03)}>
        <Box x={-118} y={-118} w={130} d={80} h={10} />
        <Box x={-112} y={-112} w={118} d={68} h={8} z={10} />
        <Box x={-100} y={-100} w={94} d={44} h={64} z={18} l="tk-rd-fl2" r="tk-rd-fr2" />
      </g>
      {COLS.map((x, k) => (
        <g key={x} className="tk-rd-p tk-rd-grow" style={on(0.08 + k * 0.035)}>
          <Box x={x} y={-54} w={9} d={9} h={64} z={18} />
        </g>
      ))}
      <g className="tk-rd-p tk-rd-drop" style={on(0.3)}>
        <Box x={-114} y={-114} w={122} d={72} h={10} z={82} />
        <path className="tk-rd-ft" d={poly(iso(-114, -42, 92), iso(-53, -42, 126), iso(-53, -114, 126), iso(-114, -114, 92))} />
        <path className="tk-rd-fr" d={poly(iso(-53, -42, 126), iso(8, -42, 92), iso(8, -114, 92), iso(-53, -114, 126))} />
        <path className="tk-rd-fl" d={poly(iso(-114, -42, 92), iso(8, -42, 92), iso(-53, -42, 126))} />
        <circle className="tk-rd-red" cx="289" cy="149" r="5.5" />
      </g>
      <g className="tk-rd-p tk-rd-rise" style={on(0.4)}>
        <ellipse className="tk-rd-shade" cx="474" cy="282" rx="22" ry="6" />
        <path className="tk-rd-post" d="M474 136V278M458 280h32" />
        <g className="tk-rd-t tk-rd-arm" style={run(0.46, 0.26)}>
          <path className="tk-rd-post" d="M436 136H512" />
          {[436, 512].map((x) => (
            <g key={x} className="tk-rd-pan">
              <path className="tk-rd-ln" d={`M${x} 136L${x - 13} 172M${x} 136L${x + 13} 172`} />
              <path className="tk-rd-panf" d={`M${x - 17} 172Q${x} 188 ${x + 17} 172Z`} />
            </g>
          ))}
        </g>
        <circle className="tk-rd-red" cx="474" cy="136" r="5.5" />
      </g>
      <g className="tk-rd-p tk-rd-drop" style={on(0.56)}>
        <Box x={40} y={24} w={52} d={36} h={13} t="tk-rd-red" l="tk-rd-pages" r="tk-rd-pages" />
        <path className="tk-rd-wline" d={line(iso(46, 30, 13), iso(86, 30, 13))} />
      </g>
      {SEALS.map(([x, y], k) => (
        <g key={x} className="tk-rd-p tk-rd-pop" style={on(0.6 + k * 0.06)}>
          <circle className="tk-rd-node" cx={x} cy={y} r="17" />
          <Glyph g={k === 1 ? GLOBE : SHIELD} x={x} y={y} s={0.75} cls="tk-ic" />
          <Tick x={x + 13} y={y - 13} r={6} />
        </g>
      ))}
    </Board>
  );
}

/* 06 · Procurement and vendor trust. The supply chain runs out from the
   factory to every vendor's crate; each is checked in turn, one is caught
   and set aside, and the vendor file is ticked off. */
const CRATES: Pt[] = [[-80, -118], [-40, -118], [0, -118], [-40, -78], [40, -118], [0, -78]];
const FACTORY = iso(-62, -11);

export function Procurement({ a }: { a: TechArt }) {
  return (
    <Board
      id="sup"
      chips={
        <>
          <Chip x={172} y={150} at={0.18}>{a.road.supply}</Chip>
          <Chip x={456} y={378} at={0.84} tone="ok">{a.road.vendor}</Chip>
        </>
      }
    >
      {CRATES.map(([x, y], k) => (
        <path key={k} className="tk-rd-p tk-rd-draw tk-rd-feed" style={on(0.2 + k * 0.035)} d={line(FACTORY, iso(-62, y + 12), iso(x + 12, y + 12))} pathLength={1} />
      ))}
      <g className="tk-rd-p tk-rd-rise" style={on(0.04)}>
        <Box x={-122} y={-40} w={60} d={58} h={48} />
        {[0, 1, 2].map((k) => {
          const xs = -122 + k * 20;
          const xe = xs + 20;
          return (
            <g key={k}>
              <path className="tk-rd-ft" d={poly(iso(xs, -40, 64), iso(xs, 18, 64), iso(xe, 18, 48), iso(xe, -40, 48))} />
              <path className="tk-rd-fl" d={poly(iso(xs, 18, 48), iso(xs, 18, 64), iso(xe, 18, 48))} />
            </g>
          );
        })}
        <Box x={-116} y={-36} w={10} d={10} h={36} z={58} />
        <g transform={face("l", -122, 18, 48)}>
          {[8, 25, 42].map((u) => (
            <rect key={u} className="tk-rd-win" x={u} y="12" width="10" height="8" rx="1" />
          ))}
          <rect className="tk-rd-tint" x="24" y="28" width="12" height="20" rx="1" />
        </g>
      </g>
      {CRATES.map(([x, y], k) => (
        <g key={k} className="tk-rd-p tk-rd-pop" style={on(0.12 + k * 0.04)}>
          <g className={k === 3 ? "tk-rd-p tk-rd-dim" : undefined} style={k === 3 ? on(0.56) : undefined}>
            <Box x={x} y={y} w={24} d={24} h={22} />
            <path className="tk-rd-tape" d={line(iso(x + 12, y, 22), iso(x + 12, y + 24, 22))} />
          </g>
        </g>
      ))}
      {CRATES.map(([x, y], k) => {
        const [X, Y] = iso(x + 12, y + 12, 22);
        return <Tick key={k} x={X} y={Y - 14} r={7} at={0.4 + k * 0.05} bad={k === 3} />;
      })}
      <g className="tk-rd-p tk-rd-fade" style={on(0.6)}>
        <g transform={face("t", 45, 12, 0)}>
          <rect className="tk-rd-card" width="55" height="48" rx="4" />
          <rect className="tk-rd-inkfill" x="20" y="-3" width="15" height="7" rx="2" />
          {[14, 25, 36].map((v, i) => (
            <g key={v}>
              <circle className="tk-rd-paperc" cx="10" cy={v} r="3.5" />
              <circle className="tk-rd-p tk-rd-pop tk-rd-okdot" style={on(0.66 + i * 0.06)} cx="10" cy={v} r="3.5" />
              <rect className="tk-rd-bar" x="17" y={v - 2} width="30" height="4" rx="2" />
            </g>
          ))}
        </g>
      </g>
    </Board>
  );
}

/* 07 · Business verification. The company's tower rises, a lens runs
   due diligence down its face, the filings check out, and the trust
   reaches across to the counterparty next door. */
function Windows({ rows, cols, w, cls, lit }: { rows: number; cols: number; w: number; cls: string; lit?: boolean }) {
  return (
    <>
      {Array.from({ length: rows * cols }, (_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        return <rect key={i} className={lit && (r * 3 + c) % 7 === 2 ? "tk-rd-litwin" : cls} x={n(6 + c * w)} y={10 + r * 15.5} width={n(w - 6)} height="8" rx="1" />;
      })}
    </>
  );
}

const MAST = iso(-52.5, -67.5, 187);
const FILINGS: Pt[] = [[150, 132], [168, 200]];

export function Business({ a }: { a: TechArt }) {
  return (
    <Board
      id="biz"
      chips={
        <>
          <Chip x={150} y={88} at={0.46}>{a.road.diligence}</Chip>
          <Chip x={478} y={88} at={0.82} tone="ok">{a.road.counterparty}</Chip>
        </>
      }
    >
      <g className="tk-rd-p tk-rd-grow" style={on(0.04)}>
        <Box x={-80} y={-95} w={55} d={55} h={180} />
        <g transform={face("l", -80, -40, 180)}>
          <Windows rows={11} cols={3} w={16.5} cls="tk-rd-win" lit />
        </g>
        <g transform={face("r", -25, -40, 180)}>
          <Windows rows={11} cols={3} w={16.5} cls="tk-rd-win2" />
        </g>
        <Box x={-80} y={-95} w={55} d={55} h={7} z={180} t="tk-rd-red" />
        <path className="tk-rd-post" d={`M${n(MAST[0])} ${n(MAST[1])}v-26`} />
        <circle className="tk-rd-red" cx={n(MAST[0])} cy={n(MAST[1] - 27)} r="3.5" />
      </g>
      <g className="tk-rd-p tk-rd-grow" style={on(0.14)}>
        <Box x={5} y={-122} w={45} d={45} h={100} />
        <g transform={face("l", 5, -77, 100)}>
          <Windows rows={6} cols={2} w={19} cls="tk-rd-win" />
        </g>
        <g transform={face("r", 50, -77, 100)}>
          <Windows rows={6} cols={2} w={19} cls="tk-rd-win2" />
        </g>
      </g>
      {FILINGS.map(([x, y], k) => (
        <g key={k}>
          <path className="tk-rd-p tk-rd-draw tk-rd-link" style={on(0.5 + k * 0.08)} d={`M${x + 28} ${y}L258 ${k ? 190 : 128}`} pathLength={1} />
          <g className="tk-rd-p tk-rd-pop" style={on(0.44 + k * 0.08)}>
            <rect className="tk-rd-card" x={x - 28} y={y - 20} width="56" height="40" rx="5" />
            <Glyph g={k ? SEARCH : DOC} x={x - 14} y={y - 3} s={0.6} cls="tk-ic tk-ic-m" />
            <rect className="tk-rd-inkbar" x={x - 2} y={y - 9} width="24" height="4" rx="2" />
            <rect className="tk-rd-bar" x={x - 2} y={y} width="18" height="3" rx="1.5" />
            <rect className="tk-rd-bar" x={x - 20} y={y + 10} width="40" height="3" rx="1.5" />
          </g>
          <Tick x={x + 24} y={y - 18} r={7} at={0.58 + k * 0.08} />
        </g>
      ))}
      <g className="tk-rd-p tk-rd-pop" style={on(0.24)}>
        <g className="tk-rd-t tk-rd-lens" style={run(0.26, 0.34)}>
          <path className="tk-rd-handle" d="M262 232l20 20" />
          <circle className="tk-rd-glass" cx="246" cy="216" r="22" />
        </g>
      </g>
      <path className="tk-rd-p tk-rd-draw tk-rd-okline" style={on(0.7)} d="M342 104Q398 62 427 156" pathLength={1} />
      <Tick x={391} y={96} r={8} at={0.78} />
    </Board>
  );
}
