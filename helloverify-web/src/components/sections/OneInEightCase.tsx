"use client";

/** The case file that opens under the evidence table once the forgery is
    found (`./OneInEightTable`). The forged marksheet, three ways to look at
    it, and the five findings, each drawn on the document where it was made.

    - **The specimen is really forged.** The scan was altered three ways a
      forger alters a sheet — a digit scraped and retyped, one washed and
      retyped, the total covered with a pasted slip — so the marks drawn here
      sit on real altered pixels, and the heatmap is those edits' own mask (the pipeline that made it is recorded in
      `tools/img/specimens/README.md`).
    - **Views.** Scan, UV and heatmap are three photographs of the same sheet
      at the same size, stacked; the view buttons cross-fade them. A finding
      is marked in the views that can see it, and choosing a finding switches
      to the one that shows it best and lights its marks.
    - **Marks** are drawn in the scan's own pixel grid (`viewBox` 1792×2400),
      so they stay on their digits at every width. */

import Image from "next/image";
import { useState } from "react";

import type { SectionsCopy } from "@/lib/copy/sections";

type C = SectionsCopy["oneInEight"]["case"];
type View = keyof C["views"];
type FindingId = keyof C["findings"];

const SRC: Record<View, string> = {
  scan: "/img/docs/ev-06-marksheet-in.jpg",
  uv: "/img/docs/ev-06-marksheet-in-uv.jpg",
  heat: "/img/docs/ev-06-marksheet-in-heat.jpg",
};
const ZOOM = "/img/docs/ev-06-marksheet-in-zoom.jpg";
const SIZES_CASE_DOC = "(max-width: 1080px) 92vw, 460px";

/** Where each finding is on the scan, in its 1792×2400 pixels (measured from
 *  the ink), and the views that show it — the first is the one choosing the
 *  finding switches to. The three alterations are in every view that can
 *  see them (each glows its own way under UV; all three are in the
 *  heatmap). The number sits left of the first box, or right of it (`end`)
 *  where the left is printed text. */
const MARKS: Record<FindingId, { views: readonly View[]; boxes: readonly [number, number, number, number][]; end?: boolean }> = {
  f1: { views: ["scan", "uv", "heat"], boxes: [[856, 1168, 96, 56]] },
  f2: { views: ["uv", "scan", "heat"], boxes: [[838, 1230, 136, 86]] },
  f3: { views: ["uv", "scan", "heat"], boxes: [[844, 1476, 120, 60]] },
  f4: { views: ["scan"], boxes: [[1100, 1168, 240, 56], [1100, 1245, 290, 56], [1100, 1480, 505, 56]] },
  f5: { views: ["scan"], boxes: [[346, 708, 186, 54]], end: true },
};
const ORDER: FindingId[] = ["f1", "f2", "f3", "f4", "f5"];
const badgeX = (id: FindingId) => {
  const [x, , w] = MARKS[id].boxes[0];
  return MARKS[id].end ? x + w + 34 : x - 34;
};
const VIEWS: View[] = ["scan", "uv", "heat"];

export function OneInEightCase({ c }: { c: C }) {
  const [view, setView] = useState<View>("scan");
  const [on, setOn] = useState<FindingId | null>(null);

  const pickFinding = (id: FindingId) => {
    setOn(on === id ? null : id);
    setView(MARKS[id].views[0]);
  };
  const shown = (id: FindingId) => MARKS[id].views.includes(view);

  return (
    <section className="ff-case" aria-labelledby="ff-case-title">
      <div className="ff-case-head">
        <span className="ff-case-k">{c.k}</span>
        <span className="ff-case-verdict">{c.verdict}</span>
      </div>
      <div className="ff-case-body">
        <div className="ff-case-viewer">
          <div className="ff-case-views" role="group" aria-label={c.viewsLabel}>
            {VIEWS.map((v) => (
              <button key={v} type="button" className={view === v ? "ff-view is-on" : "ff-view"} aria-pressed={view === v} onClick={() => setView(v)}>
                {c.views[v]}
              </button>
            ))}
          </div>
          <div className={`ff-case-doc ff-case-${view}`}>
            {VIEWS.map((v) => (
              <Image
                key={v}
                className={view === v ? "ff-case-img is-on" : "ff-case-img"}
                src={SRC[v]}
                alt={v === "scan" ? c.alt : ""}
                aria-hidden={v === "scan" ? undefined : true}
                fill
                sizes={SIZES_CASE_DOC}
              />
            ))}
            <svg className="ff-case-marks" viewBox="0 0 1792 2400" aria-hidden="true" focusable="false">
              {ORDER.filter(shown).map((id) => (
                <g key={id} className={on === id ? "ff-mk is-on" : on ? "ff-mk is-dim" : "ff-mk"}>
                  {MARKS[id].boxes.map(([x, y, w, h], i) => (
                    <rect key={i} x={x} y={y} width={w} height={h} rx={h / 2} />
                  ))}
                  <circle className="ff-mk-n" cx={badgeX(id)} cy={MARKS[id].boxes[0][1] + 28} r="26" />
                  <text x={badgeX(id)} y={MARKS[id].boxes[0][1] + 38}>{ORDER.indexOf(id) + 1}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>
        <div className="ff-case-side">
          <h3 id="ff-case-title" className="ff-case-title">{c.title}</h3>
          <ol className="ff-findings">
            {ORDER.map((id, i) => (
              <li key={id}>
                <button type="button" className={on === id ? "ff-find is-on" : "ff-find"} aria-pressed={on === id} onClick={() => pickFinding(id)}>
                  <span className="ff-find-n" aria-hidden="true">{i + 1}</span>
                  <span className="ff-find-t">{c.findings[id].t}</span>
                  <span className="ff-find-d">{c.findings[id].d}</span>
                  <span className="ff-find-by">{c.findings[id].by}</span>
                </button>
                {id === "f1" && (
                  <span className="ff-zoom">
                    <Image src={ZOOM} alt={c.zoomAlt} width={360} height={615} sizes="120px" />
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
