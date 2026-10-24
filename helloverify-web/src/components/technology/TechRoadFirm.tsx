/** The trust road's seventh stop (`./TechRoad`): the company itself, and
    the counterparty it deals with. A few floating pieces round a hero
    (`./TechRoadKit`). */
import { Glyph, HAND, OFFICE, PERSON, n, type TechArt } from "./TechPillarKit";
import { Board, Chip, Piece, Tick, gr, on, run } from "./TechRoadKit";

/* 07 · Business verification. The company's tower rises, a lens runs
   due diligence up its face while its filings check out, and a bridge of
   trust reaches across to the counterparty. */
const lit = (r: number, c: number) => (r * 3 + c * 5) % 11 === 3;

/** A tower `w` wide and `h` tall, its side face receding half as deep again. */
function Tower({ w, h, cols, rows }: { w: number; h: number; cols: number; rows: number }) {
  const side = w * 0.5;
  const rise = side * 0.36;
  const top = 18 + rise;
  const cw = (w - 8) / cols;
  const rh = (h - top - 40) / rows;
  const sideWin = Array.from({ length: rows * 2 }, (_, i) => {
    const r = Math.floor(i / 2);
    const x = w + 6 + (i % 2) * side * 0.46;
    return `M${n(x)} ${n(top + 20 + r * rh - (x - w) * 0.72)}l${n(side * 0.34)} ${n(-side * 0.34 * 0.72)}v${n(rh - 6)}l${n(-side * 0.34)} ${n(side * 0.34 * 0.72)}z`;
  }).join("");
  return (
    <>
      <path className="tk-rd-post" d={`M${n(w * 0.66)} 2v${n(top - 2)}`} />
      <circle cx={n(w * 0.66)} cy="4" r="3.5" className="tk-rd-red" />
      <path className="tk-rd-ft" d={`M0 ${n(top)}l${n(side)} ${n(-rise)}h${w}l${n(-side)} ${n(rise)}z`} />
      <rect x="0" y={n(top)} width={w} height="12" fill={gr("red")} />
      <path className="tk-rd-redk" d={`M${w} ${n(top)}l${n(side)} ${n(-rise)}v12l${n(-side)} ${n(rise)}z`} />
      <rect x="0" y={n(top + 12)} width={w} height={n(h - top - 12)} fill={gr("card")} className="tk-rd-edge" />
      <path className="tk-rd-side" d={`M${w} ${n(top + 12)}l${n(side)} ${n(-rise)}V${n(h - rise)}l${n(-side)} ${n(rise)}z`} />
      {Array.from({ length: rows * cols }, (_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        return <rect key={i} className={lit(r, c) ? "tk-rd-tint" : undefined} fill={lit(r, c) ? undefined : gr("glass")} x={n(6 + c * cw)} y={n(top + 20 + r * rh)} width={n(cw - 6)} height={n(rh - 6)} rx="1.5" />;
      })}
      <path className="tk-rd-sidewin" d={sideWin} />
      <rect x={n(w * 0.34)} y={h - 22} width={n(w * 0.32)} height="22" className="tk-rd-ink2" />
      <rect x={n(w * 0.28)} y={h - 28} width={n(w * 0.44)} height="6" fill={gr("red")} />
    </>
  );
}

const FILINGS: { x: number; y: number; at: number }[] = [{ x: 54, y: 104, at: 0.42 }, { x: 74, y: 204, at: 0.48 }, { x: 56, y: 312, at: 0.54 }];
const LEADS = [[182, 146, 228, 170], [202, 250, 228, 250], [184, 348, 228, 330]];
const BARS = [18, 26, 22, 36, 46];

/** One of the company's filings: its register entry, its books, its directors. */
function Filing({ k }: { k: number }) {
  if (k === 0) {
    return (
      <>
        <rect x="12" y="12" width="26" height="26" rx="7" className="tk-rd-tint" />
        <Glyph g={OFFICE} x={25} y={25} s={0.62} cls="tk-ic tk-ic-r" />
        <rect className="tk-rd-ink2" x="46" y="15" width="54" height="5" rx="2.5" />
        <rect className="tk-rd-off" x="46" y="26" width="38" height="4" rx="2" />
        <rect className="tk-rd-off" x="12" y="50" width="76" height="4" rx="2" />
        <rect className="tk-rd-off" x="12" y="60" width="60" height="4" rx="2" />
        <circle className="tk-rd-lnr tk-rd-dotted" cx="104" cy="60" r="11" />
      </>
    );
  }
  if (k === 1) {
    return (
      <>
        <rect className="tk-rd-ink2" x="12" y="13" width="48" height="5" rx="2.5" />
        <path className="tk-rd-lnh" d="M12 78h104" />
        <g className="tk-rd-t tk-rd-bars" style={run(0.5, 0.2)}>
          {BARS.map((h, i) => (
            <rect key={i} className={i === 4 ? "tk-rd-red" : "tk-rd-tint"} x={18 + i * 20} y={78 - h} width="12" height={h} rx="2" />
          ))}
        </g>
        <path className="tk-rd-p tk-rd-draw tk-rd-trend" style={on(0.6)} d="M24 56 44 48l20 4 20-14 20-10" pathLength={1} />
      </>
    );
  }
  return (
    <>
      {[26, 44, 62].map((cx) => (
        <g key={cx}>
          <circle className="tk-rd-paperc tk-rd-ringw" cx={cx} cy="36" r="13" />
          <Glyph g={PERSON} x={cx} y={36} s={0.62} cls="tk-ic tk-ic-m" />
        </g>
      ))}
      <rect className="tk-rd-ink2" x="84" y="28" width="32" height="5" rx="2.5" />
      <rect className="tk-rd-off" x="84" y="40" width="24" height="4" rx="2" />
    </>
  );
}

export function Business({ a }: { a: TechArt }) {
  return (
    <Board
      id="biz"
      hub={[226, 300, 352, 300]}
      back={
        <>
          {LEADS.map(([x0, y0, x1, y1], k) => (
            <path key={k} className="tk-rd-p tk-rd-draw tk-rd-link" style={on(0.5 + k * 0.06)} d={`M${x0} ${y0}C${x0 + 24} ${y0} ${x1 - 20} ${y1} ${x1} ${y1}`} pathLength={1} />
          ))}
          <path className="tk-rd-p tk-rd-draw tk-rd-okline" style={on(0.7)} d="M356 210Q400 140 444 222" pathLength={1} />
        </>
      }
      front={
        <>
          <g className="tk-rd-p tk-rd-pop" style={on(0.78)}>
            <circle cx="400" cy="178" r="15" fill={gr("ok")} />
            <Glyph g={HAND} x={400} y={178} s={0.78} cls="tk-ic tk-ic-w" />
          </g>
          <g className="tk-rd-p tk-rd-pop" style={on(0.24)}>
            <g className="tk-rd-t tk-rd-lens" style={run(0.26, 0.34)}>
              <path className="tk-rd-handle" d="M266 336l20 20" />
              <circle className="tk-rd-glass" cx="250" cy="320" r="24" />
              <path className="tk-rd-lnw tk-rd-faint" d="M238 312a14 14 0 0 1 10-8" />
            </g>
          </g>
        </>
      }
      chips={
        <>
          <Chip x={118} y={86} at={0.46}>{a.road.diligence}</Chip>
          <Chip x={456} y={130} at={0.84} tone="ok">{a.road.counterparty}</Chip>
        </>
      }
    >
      <Piece x={226} y={104} w={128} vb="0 0 194 300" at={0.04} ph={0.3} bob={3} a="grow">
        <Tower w={130} h={300} cols={4} rows={13} />
      </Piece>
      <Piece x={404} y={214} w={90} vb="0 0 134 180" at={0.14} z={0.9} ph={0.6} a="grow">
        <Tower w={90} h={180} cols={3} rows={7} />
      </Piece>
      {FILINGS.map(({ x, y, at }, k) => (
        <Piece key={y} x={x} y={y} w={128} vb={`0 0 128 ${k === 2 ? 72 : 84}`} at={at} z={0.85 + k * 0.2} ph={0.1 + k * 0.32} a="pop">
          <rect width="128" height={k === 2 ? 72 : 84} rx="10" fill={gr("card")} className="tk-rd-edge" />
          <Filing k={k} />
          <Tick x={118} y={10} r={8} at={at + 0.14} />
        </Piece>
      ))}
    </Board>
  );
}
