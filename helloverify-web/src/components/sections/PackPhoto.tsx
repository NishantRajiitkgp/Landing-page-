import Image from "next/image";

import { Arrow } from "@/components/brand/Arrow";
import { Tick } from "@/components/brand/Tick";
import { AppLink } from "@/components/chrome/AppLink";
import { tint } from "@/lib/img";
import { copy } from "@/lib/copy/request";
import { SECTIONS, type PackId, type PackLineId } from "@/lib/copy/sections";

/** One v2 package card: a photograph that carries the package's name,
 *  segment and turnaround on glass, and a check list below it whose ticks
 *  fill in, one after another, on hover (already filled on a touch screen).
 *  Pure CSS — `app/v2/packages.css` — so this stays a Server Component.
 *  Rendered by `./Packages.tsx`, in a grid on desktop and a scroll-snap row
 *  on a phone. */

/** Desktop: three columns of 381px in the 1200px wrap (381 / 1440 = 26.5vw).
 *  Phone and tablet: the row's `min(78vw, 300px)` column, written as two
 *  queries because 300 / .78 = 385px is where the cap takes over. Not
 *  `SIZES_BENTO_NARROW`, which is the same desktop number for a different
 *  box — two boxes that happen to agree should not share a constant. */
const SIZES_PKG = "(max-width: 385px) 78vw, (max-width: 1080px) 300px, 27vw";

export type PackPhotoProps = {
  k: PackId;
  lines: readonly PackLineId[];
  buy?: boolean;
  src: string;
  /** The board's focal point for this photograph (`object-position`). */
  focus: string;
  href: string;
};

export async function PackPhoto({ k, lines, buy, src, focus, href }: PackPhotoProps) {
  const t = (await copy(SECTIONS)).packages;
  const pk = t.packs[k];
  const title = `pq-t-${k}`;

  return (
    <article className="pq-card">
      <div className="pq-ph" style={{ background: tint(src) }}>
        <Image src={src} alt="" fill sizes={SIZES_PKG} style={{ objectPosition: focus }} />
        <div className="pq-scrim" />
        <span className="pq-seg">{pk.hd}</span>
        <div className="pq-time">
          <span>{t.readyIn}</span>
          <b>{pk.ready}</b>
        </div>
        <div className="pq-cap">
          <h3 id={title}>{pk.tt}</h3>
          <p>{pk.sub}</p>
        </div>
      </div>
      <div className="pq-body">
        <div className="pq-bk">
          <span>{t.count(lines.length)}</span>
          <span className="pq-bar"><i /></span>
        </div>
        <ul className="pq-list">
          {lines.map((l, i) => (
            <li key={l} style={{ "--i": i } as React.CSSProperties}>
              <span className="pq-tk"><Tick /></span>
              {t.lines[l]}
            </li>
          ))}
        </ul>
        <div className="pq-foot">
          <span className="pq-who">{pk.who}</span>
          {/* Five links read "Explore"; the package name tells them apart. */}
          <AppLink href={href} className={buy ? "pq-buy" : "pq-more"} aria-describedby={title}>
            {buy ? t.buy : t.explore}
            <Arrow size="14" />
          </AppLink>
        </div>
      </div>
    </article>
  );
}
