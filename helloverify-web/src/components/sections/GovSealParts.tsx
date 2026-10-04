/** Parts of the seals band drawn the same way in two places, split out of
    `./GovSealsStage` for `max-lines`: a seal's centre inlay (which the record
    repeats as its emblem), the record's stamp, and the record itself
    (`RecordBody`), which the homepage stage and each authority's own page
    (`./AuthorityRecord`) both render. No state; they render inside that
    client island and on the server alike. */
import Image from "next/image";

/** One call-to-action card on a record: who it is for, what they do, and
 *  its buttons, the first the main one. Hrefs arrive localised. */
export type SealCta = { k: string; p: string; acts: { t: string; href: string }[] };

export type SealItem = {
  name: string;
  ledeName: string;
  micro: string;
  record: string;
  role: string;
  /** The challenge the authority faces: a big figure (or phrase) and its line. */
  problem: { v: string; l: string };
  h: string;
  /** A line under the heading, where the heading needs one. */
  p?: string;
  facts: { k: string; v: string }[];
  /** One card per audience the programme serves (1 Oct 2026; it replaced
   *  "What we do", the four-step chain). */
  ctas: SealCta[];
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

/** The arrow on a record's main buttons. */
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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

export type RecordLabels = { problem: string; start: string };

/** One authority's record, inside its `.sv-rec`: the problem, what
 *  HelloVerify is to it and the facts (left); the emblem, the stamp and a
 *  call-to-action card per audience (right). */
export function RecordBody({
  g,
  stampId,
  stamp,
  labels,
}: {
  g: SealItem;
  stampId: string;
  stamp: string;
  labels: RecordLabels;
}) {
  return (
    <>
      <div className="sv-rec-l">
        <div className="sv-rec-k"><span>{g.record}</span><span>{g.role}</span></div>
        <div className="sv-prob">
          <p className="sv-out-k">{labels.problem}</p>
          <p className="sv-prob-v">{g.problem.v}</p>
          <p className="sv-prob-l">{g.problem.l}</p>
        </div>
        <p className="sv-rec-h">{g.h}</p>
        {g.p && <p className="sv-rec-p">{g.p}</p>}
        <dl className="sv-facts">
          {g.facts.map((f, j) => (
            <div key={f.k} className="sv-fact" style={{ animationDelay: `${(0.25 + j * 0.07).toFixed(2)}s` }}>
              <dt>{f.k}</dt>
              <dd>{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="sv-rec-r">
        <div className="sv-emb"><Inlay item={g} small /></div>
        <p className="sv-out-k sv-start-k">{labels.start}</p>
        <div className="sv-ctas">
          {g.ctas.map((c, j) => (
            <div key={c.k} className={j === 0 ? "sv-cta sv-cta-main sv-fact" : "sv-cta sv-fact"} style={{ animationDelay: `${(0.35 + j * 0.12).toFixed(2)}s` }}>
              <p className="sv-cta-k">{c.k}</p>
              <p className="sv-cta-p">{c.p}</p>
              <div className="sv-cta-acts">
                {c.acts.map((a, n) => (
                  <a key={a.t} href={a.href} className={n === 0 ? "sv-cta-btn" : "sv-cta-btn sv-cta-alt"}>
                    {a.t}
                    {n === 0 && <ArrowIcon />}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="sv-stamp-w"><Stamp id={stampId} ring={stamp} /></div>
      </div>
    </>
  );
}
