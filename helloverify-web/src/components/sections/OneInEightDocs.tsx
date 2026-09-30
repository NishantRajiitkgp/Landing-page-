/** The eight scans on the evidence table and their UV twins, for
    `./OneInEightTable`. Split out to keep that island under the 300-line cap;
    imported by it, so it renders on both sides.

    - **A scan** keeps its own proportions (`--ar`) in its well, lies a few
      tenths of a degree askew, and carries whatever is placed on it
      (stamps, lens callouts) in its own left-to-right percentages.
    - **Its UV twin** is a photograph of the same sheet at the same size
      (`tools/img/specimens/pipeline.cjs`). Every sheet is forged, one trick
      each, and each trick shows its own way under the lamp. The lens rings
      each alteration and names it, with a leader line to the spot; where a
      sheet is on genuine security paper it also rings the UV-ink emblem. */
import Image from "next/image";
import type { ReactNode } from "react";

import type { SectionsCopy } from "@/lib/copy/sections";

type T = SectionsCopy["oneInEight"];
export type CertId = keyof T["certs"];
type TagId = keyof T["uv"]["tags"];

export const ORDER: CertId[] = ["be", "ae", "ph", "eg", "uk", "xii", "sg", "pk"];

/** Each scan's file stem under `/img/docs/` (`-uv`, `-heat` and `-zoom` are
 *  its other photographs), its pixel size, the few tenths of a degree it
 *  lies askew, and — on security paper — where its UV-ink emblem is: centre
 *  and radius in % of the sheet's width. */
export const DOCS: Record<CertId, { f: string; w: number; h: number; tilt: number; emblem: readonly [number, number, number] | null }> = {
  be: { f: "fx-01-be-in", w: 1000, h: 747, tilt: -0.8, emblem: null },
  ae: { f: "fx-02-transcript-ae", w: 747, h: 1000, tilt: 0.6, emblem: [50, 8.5, 11] },
  ph: { f: "fx-03-tor-ph", w: 747, h: 1000, tilt: -0.4, emblem: [50, 7, 12] },
  eg: { f: "fx-04-pharmacy-eg", w: 1000, h: 747, tilt: 0.9, emblem: [50, 47, 10] },
  uk: { f: "fx-05-mba-uk", w: 1000, h: 747, tilt: 0.5, emblem: null },
  xii: { f: "fx-06-marksheet-in", w: 1045, h: 1400, tilt: -0.7, emblem: [50, 9, 11] },
  sg: { f: "fx-07-diploma-sg", w: 1000, h: 747, tilt: -0.5, emblem: [56, 50, 10] },
  pk: { f: "fx-08-mbbs-pk", w: 747, h: 1000, tilt: 0.7, emblem: [50, 33, 12] },
};
/** A table cell is ~290px on desktop and ~45vw on a phone. */
const SIZES_DOC = "(max-width: 1080px) 45vw, 300px";

/** A lens callout: the ring round the spot (left, top, width, height, in % of
 *  the sheet) and where its label starts (left, top). `flip` hangs the label
 *  to the LEFT of that point, for rings near the sheet's right edge. */
type Tag = { id: TagId; ring: readonly [number, number, number, number]; at: readonly [number, number]; kind: "bad" | "slip" | "ok"; flip?: boolean };

/** Each sheet's alterations, from the masks `forge.cjs` and `forge-all.cjs`
 *  wrote (in % of the 2400-long render: landscape 2400×1792, portrait
 *  1792×2400). */
const TAGS: Record<CertId, readonly Tag[]> = {
  be: [
    { id: "renamed", ring: [40.1, 46.5, 20.2, 3], at: [62, 43.5], kind: "bad" },
    { id: "copied", ring: [41, 5, 18, 24.1], at: [61, 14], kind: "bad" },
  ],
  ae: [{ id: "inked", ring: [76.3, 52, 3.6, 6.8], at: [74, 50], kind: "bad", flip: true }],
  ph: [{ id: "fluid", ring: [72.4, 56.1, 3, 2.6], at: [70, 53.6], kind: "bad", flip: true }],
  eg: [
    { id: "deadSeal", ring: [34, 69.1, 13.5, 18.1], at: [49, 64], kind: "bad" },
    { id: "revenue", ring: [85, 75.1, 7.9, 13.7], at: [83, 90], kind: "ok", flip: true },
  ],
  uk: [
    { id: "sticker", ring: [42.2, 76, 14.8, 19.9], at: [58.5, 73], kind: "bad" },
    { id: "bare", ring: [42.1, 8.9, 15.8, 21.2], at: [59.5, 14], kind: "bad" },
  ],
  // The 1792×2400 render: Maths digit x 872-940 y 1172-1220; the wash halo
  // x 846-966 y 1236-1308; the slip x 846-962 y 1479-1533.
  xii: [
    { id: "scraped", ring: [48.7, 48.8, 3.8, 2.0], at: [59, 42.5], kind: "bad" },
    { id: "washed", ring: [47.2, 51.5, 6.7, 3.0], at: [59, 55], kind: "bad" },
    { id: "pasted", ring: [47.2, 61.6, 6.5, 2.25], at: [59, 66.5], kind: "slip" },
  ],
  sg: [
    { id: "lifted", ring: [18.4, 59.2, 2.9, 3.7], at: [23, 56.5], kind: "bad" },
    { id: "serial", ring: [82.7, 90.2, 9.3, 2.1], at: [81, 84.5], kind: "slip", flip: true },
  ],
  pk: [{ id: "pencil", ring: [63.6, 81.25, 22, 3.8], at: [61, 76], kind: "bad", flip: true }],
};

/** The emblem callout, on every sheet of security paper: a ring round the
 *  UV emblem and its label to the right. The emblem's radius is in % of the
 *  width, so its height in % of the sheet is scaled by the proportions. */
function emblemTag(id: CertId): Tag[] {
  const { w, h, emblem } = DOCS[id];
  if (!emblem) return [];
  const [cx, cy, r] = emblem;
  const ry = (r * w) / h;
  return [{ id: "genuine", ring: [cx - r, cy - ry, 2 * r, 2 * ry], at: [cx + r + 2, cy - 3], kind: "ok" }];
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
        {tags.map(({ id, ring: [x, y, w, h], at: [lx, ly], kind, flip }) => (
          <polyline
            key={id}
            className={`ff-tag-line ff-tag-${kind}`}
            points={flip ? `${x},${y + h / 2} ${lx + 1.5},${ly + 3} ${lx},${ly + 3}` : `${x + w},${y + h / 2} ${lx - 1.5},${ly + 3} ${lx},${ly + 3}`}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {tags.map(({ id, ring: [x, y, w, h], at: [lx, ly], kind, flip }) => (
        <span key={id} className={flip ? `ff-tag ff-tag-${kind} ff-tag-flip` : `ff-tag ff-tag-${kind}`}>
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
  return (
    <span className="ff-uvc ff-uvc-bad">
      <Doc id={id} uv>
        <Tags tags={[...TAGS[id], ...emblemTag(id)]} t={t} />
      </Doc>
      <Caption id={id} i={i} t={t} />
    </span>
  );
}
