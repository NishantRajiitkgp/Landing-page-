/** The eight scans on the evidence table and their UV twins, for
    `./OneInEightTable`. Split out to keep that island under the 300-line cap;
    imported by it, so it renders on both sides.

    - **A scan** keeps its own proportions (`--ar`) in its well, lies a few
      tenths of a degree askew, and carries whatever is placed on it
      (stamps, lens callouts) in its own left-to-right percentages.
    - **Its UV twin** is a photograph of the same sheet at the same size
      (`tools/img/specimens/pipeline.cjs`): fibres and a UV-ink emblem on
      every sheet, and on the forgery the three alterations, each glowing its
      own way. The lens rings each one and names it — what was done, and to
      which figure — with a leader line to the spot. */
import Image from "next/image";
import type { ReactNode } from "react";

import type { SectionsCopy } from "@/lib/copy/sections";

type T = SectionsCopy["oneInEight"];
export type CertId = keyof T["certs"];
type TagId = keyof T["uv"]["tags"];

export const ORDER: CertId[] = ["be", "ae", "ph", "eg", "uk", "xii", "sg", "pk"];
/** Application 06, the forgery. */
export const FORGED: CertId = "xii";

/** Each scan's file stem under `/img/docs/` (`-uv` is its UV photograph),
 *  its pixel size, the few tenths of a degree it lies askew, and where its
 *  UV-ink emblem is: centre and radius in % of the sheet's width. */
const DOCS: Record<CertId, { f: string; w: number; h: number; tilt: number; emblem: readonly [number, number, number] }> = {
  be: { f: "ev-01-be-in", w: 1000, h: 747, tilt: -0.8, emblem: [50, 17, 9] },
  ae: { f: "ev-02-transcript-ae", w: 747, h: 1000, tilt: 0.6, emblem: [50, 8.5, 11] },
  ph: { f: "ev-03-tor-ph", w: 747, h: 1000, tilt: -0.4, emblem: [50, 7, 12] },
  eg: { f: "ev-04-pharmacy-eg", w: 1000, h: 747, tilt: 0.9, emblem: [50, 47, 10] },
  uk: { f: "ev-05-mba-uk", w: 1000, h: 747, tilt: 0.5, emblem: [50, 13, 8] },
  xii: { f: "ev-06-marksheet-in", w: 1045, h: 1400, tilt: -0.7, emblem: [50, 9, 11] },
  sg: { f: "ev-07-diploma-sg", w: 1000, h: 747, tilt: -0.5, emblem: [56, 50, 10] },
  pk: { f: "ev-08-mbbs-pk", w: 747, h: 1000, tilt: 0.7, emblem: [50, 33, 12] },
};
/** A table cell is ~290px on desktop and ~45vw on a phone. */
const SIZES_DOC = "(max-width: 1080px) 45vw, 300px";

/** A lens callout: the ring round the spot (left, top, width, height, in % of
 *  the sheet) and where its label starts (left, top). */
type Tag = { id: TagId; ring: readonly [number, number, number, number]; at: readonly [number, number]; kind: "bad" | "slip" | "ok" };

/** The forgery's three alterations, from the masks `forge.cjs` wrote (the
 *  1792×2400 render: Maths digit x 872-940 y 1172-1220; the wash halo
 *  x 846-966 y 1236-1308; the slip x 846-962 y 1479-1533). */
const FORGED_TAGS: readonly Tag[] = [
  { id: "scraped", ring: [48.7, 48.8, 3.8, 2.0], at: [59, 42.5], kind: "bad" },
  { id: "washed", ring: [47.2, 51.5, 6.7, 3.0], at: [59, 55], kind: "bad" },
  { id: "pasted", ring: [47.2, 61.6, 6.5, 2.25], at: [59, 66.5], kind: "slip" },
];

/** The emblem callout, on every sheet: a ring round the UV emblem and its
 *  label to the right. The emblem's radius is in % of the width, so its
 *  height in % of the sheet is scaled by the sheet's proportions. */
function emblemTag(id: CertId): Tag {
  const { w, h, emblem: [cx, cy, r] } = DOCS[id];
  const ry = (r * w) / h;
  return { id: id === FORGED ? "paper" : "genuine", ring: [cx - r, cy - ry, 2 * r, 2 * ry], at: [cx + r + 2, cy - 3], kind: "ok" };
}

const pct = (v: number) => `${v}%`;

/** One scan at its own proportions in its well. `uv` swaps in the sheet's
 *  UV photograph; `children` (stamps, callouts) are placed on the sheet. */
export function Doc({ id, uv, children }: { id: CertId; uv?: boolean; children?: ReactNode }) {
  const d = DOCS[id];
  return (
    <span className="ff-well">
      <span className={d.w > d.h ? "ff-doc ff-doc-l" : "ff-doc ff-doc-p"} style={{ "--ar": `${d.w} / ${d.h}`, "--tilt": `${d.tilt}deg` } as React.CSSProperties}>
        <Image className="ff-doc-img" src={`/img/docs/${d.f}${uv ? "-uv" : ""}.jpg`} alt="" fill sizes={SIZES_DOC} />
        {children}
      </span>
    </span>
  );
}

export function Caption({ id, i, t }: { id: CertId; i: number; t: T }) {
  return (
    <span className="ff-cap">
      <b>{String(i + 1).padStart(2, "0")}</b> {t.certs[id].kind} · {t.certs[id].where}
    </span>
  );
}

/** The lens callouts on one sheet: rings, leader lines (drawn in the sheet's
 *  own 0-100 space, stroke kept at 1px by `non-scaling-stroke`), labels. */
function Tags({ tags, t }: { tags: readonly Tag[]; t: T }) {
  return (
    <>
      <svg className="ff-tag-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        {tags.map(({ id, ring: [x, y, w, h], at: [lx, ly], kind }) => (
          <polyline key={id} className={`ff-tag-line ff-tag-${kind}`} points={`${x + w},${y + h / 2} ${lx - 1.5},${ly + 3} ${lx},${ly + 3}`} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      {tags.map(({ id, ring: [x, y, w, h], at: [lx, ly], kind }) => (
        <span key={id} className={`ff-tag ff-tag-${kind}`}>
          <i className="ff-tag-ring" style={{ "--x": pct(x), "--y": pct(y), "--w": pct(w), "--h": pct(h) } as React.CSSProperties} />
          <em className="ff-tag-k" style={{ "--x": pct(lx), "--y": pct(ly) } as React.CSSProperties}>
            <b>{t.uv.tags[id].t}</b>
            <span>{t.uv.tags[id].d}</span>
          </em>
        </span>
      ))}
    </>
  );
}

/** A cell of the lamp layer, the mirror of a table cell. */
export function Uv({ id, i, t }: { id: CertId; i: number; t: T }) {
  const tags = id === FORGED ? [...FORGED_TAGS, emblemTag(id)] : [emblemTag(id)];
  return (
    <span className={id === FORGED ? "ff-uvc ff-uvc-bad" : "ff-uvc"}>
      <Doc id={id} uv>
        <Tags tags={tags} t={t} />
      </Doc>
      <Caption id={id} i={i} t={t} />
    </span>
  );
}
