"use client";

/** The guilloche of the two government bands — seal rims, the rosette behind
    them, the dossier watermarks. Decorative throughout, `aria-hidden`.

    DRAWN AFTER MOUNT, not during SSR. `HeroPrint` renders its guilloche on the
    server too, because the hero is the first paint. These bands sit several
    screens down, and their paths are ~120 KB raw (five rims at ~14 KB, the
    rosette ~43 KB, a watermark ~6 KB): in the HTML they would cost every
    visitor the bytes whether or not they scroll there, with nothing to show
    for it at first paint. So the server and the hydration pass both render
    the empty frame, and the paths are computed from `lib/govArt.ts` once the
    page is live. `useSyncExternalStore` gives false on the server and during
    hydration and true after, which keeps hydration exact without a
    set-state-in-effect. REJECTED: a `<canvas>`; the rims recolour on the
    active seal through a CSS `stroke` transition, which a bitmap cannot. */

import { useMemo, useSyncExternalStore } from "react";

import { WATERMARKS, ringPath, rimPaths, rosettePaths } from "@/lib/govArt";

const noop = () => () => {};
function useMounted() {
  return useSyncExternalStore(noop, () => true, () => false);
}

export function SealRim({ k }: { k: number }) {
  const live = useMounted();
  const paths = useMemo(() => (live ? rimPaths(k) : []), [live, k]);
  return (
    <svg className="sv-rim" viewBox="0 0 208 208" aria-hidden="true" focusable="false">
      <circle cx="104" cy="104" r="101.5" className="sv-ln1" />
      <circle cx="104" cy="104" r="84" className="sv-ln1" />
      {paths.map((d, i) => <path key={i} className="sv-g" d={d} />)}
      <circle className="sv-prog" cx="104" cy="104" r="106" pathLength={100} />
    </svg>
  );
}

export function Rosette() {
  const live = useMounted();
  const paths = useMemo(() => (live ? rosettePaths() : []), [live]);
  return (
    <svg className="sv-rose" viewBox="0 0 1000 1000" aria-hidden="true" focusable="false">
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

/** One ring per `<path>` in `<defs>` and its rotated copies as `<use>`: the
 *  canvas repeated the full path data per copy, four to six times over. */
export function Watermark({ id }: { id: keyof typeof WATERMARKS }) {
  const live = useMounted();
  const rings = useMemo(() => (live ? WATERMARKS[id].map(([R, A, n]) => ringPath(R, A, n)) : []), [live, id]);
  return (
    <svg className="gv-wm" viewBox="-200 -200 400 400" aria-hidden="true" focusable="false">
      <defs>
        {rings.map((d, i) => <path key={i} id={`gvwm-${id}-${i}`} d={d} />)}
      </defs>
      {/* The paper's own ink, as in `HeroPrint`: artwork, drawn not tokened. */}
      <g fill="none" stroke="#DED8CC" strokeWidth="0.8">
        {rings.map((_, i) => {
          const [, , n, copies] = WATERMARKS[id][i];
          return Array.from({ length: copies }, (_, c) => (
            <use key={`${i}-${c}`} href={`#gvwm-${id}-${i}`} transform={`rotate(${((360 / n / copies) * c).toFixed(2)})`} />
          ));
        })}
      </g>
    </svg>
  );
}
