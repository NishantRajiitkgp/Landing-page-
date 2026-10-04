/** 05 · Long-Term Digital Infrastructure — chapter five (`./GovWhy`).

    Same kit, same 12 s beat. The layer does not move. The years do.
    2018 is a hairline in the rock. Each year after it slams in faster
    and wider, until the bedrock is a core and 20M+ lands. Then the
    counter does not stop: it runs through the years after today and
    the rock keeps growing off the bottom of the card. Numerals are
    counted from `since` (2018 + step, fifteen of them — the roll's
    resting offset in `govwhy.css` is locked to that). Only `today`
    and `ahead` are copy. Clock: `govwhy.css` "05 · YEARS". At rest:
    the core is full, the figure is up, and the window reads ahead. */
import { Logo } from "@/components/brand/Logo";
import type { SectionsCopy } from "@/lib/copy/sections";

type V = SectionsCopy["govWhy"]["viz"];

const COUNT = 9;
/** Years after today, still counted — not copy. Then `ahead`. */
const AFTER = 6;
/** One roll step. COUNT + AFTER of them land on `ahead`. */
const STEP = 28;
/** Top and thickness. A hairline, then a slab, and today's band runs
 *  off the bottom of the card. */
const BANDS = [
  { y: 152, h: 2.2 },
  { y: 155.4, h: 2.6 },
  { y: 159.1, h: 3.1 },
  { y: 163.3, h: 3.7 },
  { y: 168.1, h: 4.5 },
  { y: 173.7, h: 5.5 },
  { y: 180.3, h: 6.8 },
  { y: 188.2, h: 8.4 },
  { y: 197.6, h: 18 },
] as const;

export function ArtYears({ since, today, ahead, big, layer }: {
  since: string;
  today: string;
  ahead: string;
  big: V["scale"]["big"];
  layer: string;
}) {
  const start = Number(since);
  const years = Number.isFinite(start)
    ? Array.from({ length: COUNT + AFTER }, (_, i) => String(start + i))
    : [since];
  const bands = years.length === COUNT + AFTER ? BANDS : [BANDS[COUNT - 1]];
  return (
    <svg className="gwt gwy" viewBox="0 0 320 210" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="gwy-soil" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path className="gwt-hatch" d="M0 0V7" />
        </pattern>
        <radialGradient id="gwy-glow">
          <stop offset="0" className="gwt-glow-a" />
          <stop offset="1" className="gwt-glow-b" />
        </radialGradient>
        <clipPath id="gwy-win">
          <rect x="96" y="14" width="128" height="28" />
        </clipPath>
      </defs>

      <rect className="gwt-rock" x="-200" y="150" width="720" height="260" />
      <rect className="gwt-soil" x="-200" y="100" width="720" height="50" />
      <rect x="-200" y="100" width="720" height="50" fill="url(#gwy-soil)" />
      <path className="gwt-strata" d="M-200 150H520" />
      <path className="gwt-ground" d="M-200 100H520" />
      <circle cx="160" cy="134" r="78" fill="url(#gwy-glow)" />

      {years.slice(0, COUNT).map((y, i) => {
        const b = bands[i] ?? BANDS[COUNT - 1];
        const w = i === COUNT - 1 ? 360 : 108 + i * 28;
        const x = 160 - w / 2;
        return (
          <g key={y}>
            <rect className={`gwy-flash gwy-fl${i}`} x={x} y={b.y - 5} width={w} height={b.h + 10} />
            <rect className={`gwy-slab gwy-b${i}`} x={x} y={b.y} width={w} height={b.h} />
          </g>
        );
      })}
      <rect className="gwy-more" x="-12" y="206" width="344" height="22" />

      <g className="gwy-fin">
        <path className="gwt-glowline" d="M-200 100H520" />
      </g>

      <g className="gwt-core-g">
        <rect className="gwt-core" x="114" y="120" width="92" height="28" rx="14" />
        <g transform="translate(127 124.5)">
          <Logo width={66} height={19} />
        </g>
      </g>
      <circle className="gwy-ring" cx="160" cy="134" r="48" />
      <text className="gwt-mono gwt-mono-hot" x="6" y="116">{layer}</text>

      <g className="gwy-chip">
        <rect className="gwp-board" x="92" y="12" width="136" height="32" rx="7" />
        <g clipPath="url(#gwy-win)">
          <g className="gwy-roll">
            {years.map((y, i) => (
              <text key={y} className="gwy-year" x="160" y={36 + i * STEP} textAnchor="middle">{y}</text>
            ))}
            <text className="gwy-ahead" x="160" y={36 + years.length * STEP} textAnchor="middle">{ahead}</text>
          </g>
        </g>
      </g>

      <g className="gwy-big">
        <text className="gwy-num" x="312" y="26" textAnchor="end">{big}</text>
        <text className="gwy-cap" x="312" y="40" textAnchor="end">{today}</text>
      </g>
    </svg>
  );
}
