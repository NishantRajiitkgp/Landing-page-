/** Parts of the seals band drawn the same way in two places, split out of
    `./GovSealsStage` for `max-lines`: a seal's centre inlay (which the record
    repeats as its emblem), and the record's stamp. No state; they render
    inside that client island. */
import Image from "next/image";

export type SealItem = {
  name: string;
  where: string;
  ledeName: string;
  micro: string;
  record: string;
  role: string;
  /** The challenge the authority faces: a big figure (or phrase) and its line. */
  problem: { v: string; l: string };
  h: string;
  p: string;
  facts: { k: string; v: string }[];
  /** What HelloVerify delivers, step by step, each with its benefit. */
  deliver: { t: string; p: string }[];
  /** The record's outcomes band: its label (which says when the figures are
   *  page-wide ones), three figures, and three reasons. */
  impactK: string;
  impact: { v: string; l: string }[];
  why: { t: string; p: string }[];
  /** Guilloche lobe count (distinct per seal) and the seal's rise in px. */
  k: number;
  lift: number;
  /** The authority's official logo or emblem (`public/img/`). */
  logo: string;
};

/** The centre of a seal, and the emblem on its record. The logo is `alt=""`:
 *  the seal's own label already names the authority. */
export function Inlay({ item, small }: { item: SealItem; small?: boolean }) {
  const px = small ? 48 : 78;
  return (
    <span className="sv-inlay sv-inlay-logo">
      <Image src={item.logo} alt="" width={px} height={px} />
    </span>
  );
}

export function Stamp({ id, ring }: { id: string; ring: string }) {
  return (
    <svg className="sv-stamp" viewBox="0 0 160 160" aria-hidden="true" focusable="false">
      <defs>
        <path id={id} d="M80 80 m-56 0 a56 56 0 1 1 112 0 a56 56 0 1 1 -112 0" />
      </defs>
      <circle cx="80" cy="80" r="72" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="80" cy="80" r="66" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="80" cy="80" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
      <text fontSize="10.5" letterSpacing="2.2" fill="currentColor">
        <textPath href={`#${id}`} textLength="344" lengthAdjust="spacing">{`${ring} `}</textPath>
      </text>
      <path d="M63 81l11 11 24-26" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
