"use client";

/** The two computed pictures on the v2 Numbers cards: the dial of 120 ticks
    and the barcode of 33 bars. Decorative — both SVGs are `aria-hidden`.

    WHY A CLIENT COMPONENT with no state, for the reason `HeroPrint.tsx`
    measured: a Server Component's output is sent twice, as HTML and again in
    the RSC flight payload. The dial's tick path is ~4.4 KB and is drawn twice
    (the grey ring and the green one masked over it), the barcode 33 `<rect>`s.
    Rendered here, SSR still paints them before any JS runs, but what ships in
    the flight payload is these few lines of formula, not their output. */

/** The dial: 120 ticks, one per country, from r=88 to r=100 about (110,110),
    starting at twelve o'clock. Same maths as the board's generator. */
const TICKS = Array.from({ length: 120 }, (_, k) => {
  const a = (2 * Math.PI * k) / 120 - Math.PI / 2;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return `M${(110 + 88 * c).toFixed(1)} ${(110 + 88 * s).toFixed(1)}L${(110 + 100 * c).toFixed(1)} ${(110 + 100 * s).toFixed(1)}`;
}).join("");

export function NumbersDial({ a, b }: { a: string; b: string }) {
  // Literal SVG colours: artwork, the exemption `hv/no-color-literal` gives
  // SVG presentation attributes. The two paper greys are the board's own and
  // sit only here.
  return (
    <svg className="nm-dial" viewBox="0 0 220 220" aria-hidden="true" focusable="false">
      <defs>
        <mask id="nm-dial-m">
          <circle className="nm-dial-sweep" cx="110" cy="110" r="50" fill="none" stroke="#FFFFFF" strokeWidth="120" pathLength="100" />
        </mask>
      </defs>
      <path d={TICKS} stroke="#DCD6CA" strokeWidth="2" strokeLinecap="round" />
      <path d={TICKS} stroke="#1B6B4A" strokeWidth="2.4" strokeLinecap="round" mask="url(#nm-dial-m)" />
      <circle cx="110" cy="110" r="66" fill="none" stroke="#E6E1D6" strokeWidth="1" />
      <text x="110" y="106" textAnchor="middle" fontFamily="geistMono, SF Mono, Menlo, monospace" fontSize="9.5" letterSpacing="1.6" fill="#6F6B62">{a}</text>
      <text x="110" y="121" textAnchor="middle" fontFamily="geistMono, SF Mono, Menlo, monospace" fontSize="9.5" letterSpacing="1.6" fill="#6F6B62">{b}</text>
    </svg>
  );
}

/** One bar per check, widths from the board. The first 13 are green: the
    checks that come back in an hour or less. */
const WIDTHS = [3, 2, 4, 2, 3, 5, 2, 3, 2, 4, 3, 2, 5, 3, 2, 4, 2, 3, 5, 2, 3, 4, 2, 3, 2, 5, 3, 2, 4, 3, 2, 3, 4];
const FAST = 13;
const BARS = WIDTHS.reduce<{ x: number; w: number }[]>((acc, w) => {
  const prev = acc[acc.length - 1];
  acc.push({ x: prev ? prev.x + prev.w + 3 : 0, w });
  return acc;
}, []);
const CODE_W = BARS[BARS.length - 1].x + BARS[BARS.length - 1].w;

export function NumbersBarcode() {
  return (
    <svg className="nm-code" viewBox={`0 0 ${CODE_W} 120`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {BARS.map(({ x, w }, k) => (
        <rect
          key={k}
          className={k < FAST ? "nm-bar nm-bar-g" : "nm-bar"}
          style={{ animationDelay: `${(0.2 + k * 0.035).toFixed(2)}s` }}
          x={x}
          y="0"
          width={w}
          height="120"
        />
      ))}
    </svg>
  );
}
