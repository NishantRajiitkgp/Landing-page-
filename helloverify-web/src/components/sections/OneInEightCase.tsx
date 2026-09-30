"use client";

/** The case file that opens under the evidence table for the document last
    checked (`./OneInEightTable`). The forged sheet, three ways to look at
    it, a magnified detail and the findings, each drawn on the document
    where it was made; previous / next walks the eight.

    - **Every specimen is really forged.** Each scan was altered the way a
      forger alters a sheet — one trick per document, recorded in
      `tools/img/specimens/` — so the marks drawn here sit on real altered
      pixels, and each heatmap is its edits' own mask.
    - **Views.** Scan, UV and heatmap are three photographs of the same sheet
      at the same size, stacked; the view buttons cross-fade them. A finding
      is marked in the views that can see it, and choosing a finding switches
      to the one that shows it best and lights its marks.
    - **Marks** are drawn in the render's own pixel grid (2400 long), so they
      stay on their ink at every width.
    - **Switching case** remounts this component by key (the table does it),
      so the view and the lit finding start fresh. */

import Image from "next/image";
import { useState } from "react";

import type { SectionsCopy } from "@/lib/copy/sections";

import { DOCS, ORDER as DOC_ORDER, type CertId } from "./OneInEightDocs";

type C = SectionsCopy["oneInEight"]["case"];
type View = keyof C["views"];
type Box = readonly [number, number, number, number];
/** The views that show a finding (the first is the one choosing it switches
 *  to) and its boxes. The number sits left of the first box, or right of it
 *  (`end`) where the left is printed text. */
type Mark = { views: readonly View[]; boxes: readonly Box[]; end?: boolean };

/** Every case's findings, keyed as its copy is — a finding without its mark
 *  (or a mark without its copy) does not compile. Measured from the ink. */
const MARKS: { [K in CertId]: Record<keyof C["files"][K]["findings"], Mark> } = {
  be: {
    f1: { views: ["scan", "heat"], boxes: [[962, 834, 484, 54]] },
    f2: { views: ["uv"], boxes: [[984, 89, 432, 432]] },
    f3: { views: ["scan"], boxes: [[236, 1516, 418, 54]], end: true },
  },
  ae: {
    f1: { views: ["scan", "heat"], boxes: [[1370, 1252, 60, 48], [1370, 1359, 60, 48]] },
    f2: { views: ["uv"], boxes: [[1380, 1252, 28, 30], [1381, 1359, 28, 30]] },
    f3: { views: ["scan"], boxes: [[184, 718, 664, 54]] },
  },
  ph: {
    f1: { views: ["uv", "scan", "heat"], boxes: [[1300, 1352, 52, 54]] },
    f2: { views: ["scan"], boxes: [[1306, 1356, 88, 42]], end: true },
    f3: { views: ["scan"], boxes: [[196, 1356, 1400, 46]] },
  },
  eg: {
    f1: { views: ["scan", "heat"], boxes: [[815, 1239, 324, 324]] },
    f2: { views: ["uv"], boxes: [[815, 1239, 324, 324], [2040, 1345, 190, 245]] },
    f3: { views: ["scan"], boxes: [[504, 730, 470, 104]] },
  },
  uk: {
    f1: { views: ["uv", "scan", "heat"], boxes: [[1012, 1362, 356, 356]] },
    f2: { views: ["uv"], boxes: [[1010, 160, 380, 380]] },
    f3: { views: ["scan"], boxes: [[512, 615, 1376, 85]] },
  },
  xii: {
    f1: { views: ["scan", "uv", "heat"], boxes: [[856, 1168, 96, 56]] },
    f2: { views: ["uv", "scan", "heat"], boxes: [[838, 1230, 136, 86]] },
    f3: { views: ["uv", "scan", "heat"], boxes: [[844, 1476, 120, 60]] },
    f4: { views: ["scan"], boxes: [[1100, 1168, 240, 56], [1100, 1245, 290, 56], [1100, 1480, 505, 56]] },
    f5: { views: ["scan"], boxes: [[346, 708, 186, 54]], end: true },
  },
  sg: {
    f1: { views: ["scan", "uv", "heat"], boxes: [[436, 1058, 80, 72]] },
    f2: { views: ["scan"], boxes: [[1980, 1616, 232, 38], [392, 1064, 118, 60]] },
    f3: { views: ["scan"], boxes: [[190, 610, 420, 60]] },
  },
  pk: {
    f1: { views: ["scan", "heat"], boxes: [[1140, 1950, 394, 92]] },
    f2: { views: ["uv"], boxes: [[1140, 1950, 394, 92]] },
    f3: { views: ["scan"], boxes: [[232, 240, 540, 48]], end: true },
  },
};

/** The zoom's pixel size (`pipeline.cjs` prints it). The marksheet's is a
 *  tall column crop that sits beside its first finding; the rest are wide
 *  and run under it. */
const ZOOM: Record<CertId, readonly [number, number]> = {
  be: [480, 112], ae: [448, 200], ph: [467, 179], eg: [480, 186],
  uk: [420, 269], xii: [360, 615], sg: [418, 230], pk: [450, 180],
};

const VIEWS: View[] = ["scan", "uv", "heat"];
const SIZES_CASE_DOC = "(max-width: 1080px) 92vw, 460px";
const R = 26;

export function OneInEightCase({ id, c, caption, onPick }: { id: CertId; c: C; caption: string; onPick: (id: CertId) => void }) {
  const [view, setView] = useState<View>("scan");
  const [on, setOn] = useState<string | null>(null);

  const doc = DOCS[id];
  const file = c.files[id];
  const marks = MARKS[id] as Record<string, Mark>;
  const findings = Object.entries(file.findings) as [string, { t: string; d: string; by: string }][];
  const [vw, vh] = doc.w > doc.h ? [2400, 1792] : [1792, 2400];
  const src = (v: View) => `/img/docs/${doc.f}${v === "scan" ? "" : `-${v}`}.jpg`;
  const [zw, zh] = ZOOM[id];
  const wide = zw > zh;
  const n = DOC_ORDER.indexOf(id);
  const nn = String(n + 1).padStart(2, "0");
  const step = (d: number) => onPick(DOC_ORDER[(n + d + DOC_ORDER.length) % DOC_ORDER.length]);

  const pickFinding = (f: string) => {
    setOn(on === f ? null : f);
    setView(marks[f].views[0]);
  };
  const shown = findings.map(([f]) => f).filter((f) => marks[f].views.includes(view));
  const badgeX = (m: Mark) => (m.end ? m.boxes[0][0] + m.boxes[0][2] + R + 8 : m.boxes[0][0] - R - 8);

  return (
    <section className="ff-case" aria-labelledby="ff-case-title">
      <div className="ff-case-head">
        <span className="ff-case-k">{`${c.k} ${nn} · ${caption}`}</span>
        <span className="ff-case-nav" role="group" aria-label={c.navLabel}>
          <span className="ff-case-verdict">{c.verdict}</span>
          <button type="button" className="ff-case-step" aria-label={c.prev} onClick={() => step(-1)}>
            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M7.5 2.5L4 6l3.5 3.5" /></svg>
          </button>
          <span className="ff-case-n" aria-hidden="true">{`${nn} / 0${DOC_ORDER.length}`}</span>
          <button type="button" className="ff-case-step" aria-label={c.next} onClick={() => step(1)}>
            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4.5 2.5L8 6l-3.5 3.5" /></svg>
          </button>
        </span>
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
          <div className={`ff-case-doc ff-case-${view}`} style={{ "--ar": `${doc.w} / ${doc.h}` } as React.CSSProperties}>
            {VIEWS.map((v) => (
              <Image
                key={v}
                className={view === v ? "ff-case-img is-on" : "ff-case-img"}
                src={src(v)}
                alt={v === "scan" ? file.alt : ""}
                aria-hidden={v === "scan" ? undefined : true}
                fill
                sizes={SIZES_CASE_DOC}
              />
            ))}
            <svg className="ff-case-marks" viewBox={`0 0 ${vw} ${vh}`} aria-hidden="true" focusable="false">
              {shown.map((f) => {
                const m = marks[f];
                return (
                  <g key={f} className={on === f ? "ff-mk is-on" : on ? "ff-mk is-dim" : "ff-mk"}>
                    {m.boxes.map(([x, y, w, h], i) => (
                      <rect key={i} x={x} y={y} width={w} height={h} rx={Math.min(h, w) / 2} />
                    ))}
                    <circle className="ff-mk-n" cx={badgeX(m)} cy={m.boxes[0][1] + 28} r={R} />
                    <text x={badgeX(m)} y={m.boxes[0][1] + 38}>{findings.findIndex(([k]) => k === f) + 1}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
        <div className="ff-case-side">
          <h3 id="ff-case-title" className="ff-case-title">{file.title}</h3>
          <ol className="ff-findings">
            {findings.map(([f, x], i) => (
              <li key={f} className={i === 0 && wide ? "ff-find-wide" : undefined}>
                <button type="button" className={on === f ? "ff-find is-on" : "ff-find"} aria-pressed={on === f} onClick={() => pickFinding(f)}>
                  <span className="ff-find-n" aria-hidden="true">{i + 1}</span>
                  <span className="ff-find-t">{x.t}</span>
                  <span className="ff-find-d">{x.d}</span>
                  <span className="ff-find-by">{x.by}</span>
                </button>
                {i === 0 && (
                  <span className="ff-zoom">
                    <Image src={`/img/docs/${doc.f}-zoom.jpg`} alt={file.zoomAlt} width={zw} height={zh} sizes={wide ? "(max-width: 1080px) 92vw, 440px" : "120px"} />
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
