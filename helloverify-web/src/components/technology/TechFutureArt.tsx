/** The parts of the `/technology` future-of-trust board (`./TechFuture`):
    the records, the four glass checks, the trust core on HelloVerify's
    platform and the authorities with their labels, each placed on the
    board (`./techFuturePlan`). Every part carries `data-g`, the layers of
    the copy it belongs to, which the stylesheet lights on hover; `data-hg`
    marks the layer pointing at it lights. Shading is the gradients drawn
    once here (`FutureDefs`). */
import type { CSSProperties, ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { CAP, CASE, OFFICE, REFRESH, SEARCH, SHIELD } from "./TechPillarKit";
import { CHART } from "./TechRoadKit";
import { Capitol, College, Hospital, Slab, Tower } from "./TechFutureKit";
import { ACCESS, CORE_BOX, LABEL, PANES, RECORDS, SITES, SITE_BOX, pc, type Pt } from "./techFuturePlan";

const lin = (id: string, stops: string[]) => (
  <linearGradient id={`tk-ft-g-${id}`} x1="0" y1="0" x2="0" y2="1">
    {stops.map((c, i) => (
      <stop key={c} className={c} offset={i / (stops.length - 1)} />
    ))}
  </linearGradient>
);
const rad = (id: string, stops: string[], cx = 0.5, cy = 0.5, r = 0.5) => (
  <radialGradient id={`tk-ft-g-${id}`} cx={cx} cy={cy} r={r}>
    {stops.map((c, i) => (
      <stop key={c} className={c} offset={i / (stops.length - 1)} />
    ))}
  </radialGradient>
);

/** The board's gradients, once per page; their colours are tokens, set on the stops. */
export function FutureDefs() {
  return (
    <svg className="tk-ft-defs" aria-hidden="true" focusable="false">
      <defs>
        {lin("pane", ["tk-ft-c-pane0", "tk-ft-c-pane1"])}
        {lin("ped", ["tk-ft-c-ped0", "tk-ft-c-ped1"])}
        {lin("shield", ["tk-ft-c-sh0", "tk-ft-c-sh1"])}
        {rad("top", ["tk-ft-c-top0", "tk-ft-c-top1"], 0.5, 0.35, 0.6)}
        {rad("sphere", ["tk-ft-c-sp0", "tk-ft-c-sp1", "tk-ft-c-sp2", "tk-ft-c-sp3"], 0.38, 0.3, 0.75)}
        {rad("dome", ["tk-ft-c-dm0", "tk-ft-c-dm1"], 0.35, 0.3, 0.8)}
        {rad("glow", ["tk-ft-c-gl0", "tk-ft-c-gl1"])}
        {rad("shade", ["tk-ft-c-sd0", "tk-ft-c-sd1"])}
      </defs>
    </svg>
  );
}

const at = (p: Pt) => pc(p) as CSSProperties;
const Ok = () => (
  <span className="tk-ft-ok" aria-hidden="true">
    <svg viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="8" />
      <path d="M4.6 8.3l2.3 2.3 4.6-4.9" />
    </svg>
  </span>
);

/** A person's picture for the identity record. */
function Avatar() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <rect width="36" height="36" rx="9" className="tk-ft-av-bg" />
      <path className="tk-ft-av-hair" d="M10.4 19c-1.2-8 2.6-12.4 7.6-12.4s8.8 4.4 7.6 12.4c-.4 2.6-1.4 4.6-1.4 4.6H11.8s-1-2-1.4-4.6z" />
      <path className="tk-ft-av-top" d="M6.5 36c1-6.6 5.4-9.6 11.5-9.6S28.5 29.4 29.5 36z" />
      <rect className="tk-ft-av-skin" x="16" y="21" width="4" height="6" rx="2" />
      <circle className="tk-ft-av-skin" cx="18" cy="16.6" r="5.8" />
      <path className="tk-ft-av-hair" d="M12.2 15.4c.5-4 2.9-6 5.8-6s5.6 2 5.8 6c-2-2-4.4-2.6-5.8-2.6s-3.8.6-5.8 2.6z" />
    </svg>
  );
}

const REC_ICONS = [null, CASE, CAP, SHIELD, OFFICE];

/** The five records on the left, each verified. */
export function Records({ names }: { names: string[] }) {
  return (
    <div className="tk-ft-recs">
      {RECORDS.map((p, k) => (
        <div key={k} className="tk-ft-rec" data-g="0" data-hg="0" style={at(p)}>
          <span className="tk-ft-rec-ic">
            {k ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={REC_ICONS[k] ?? ""} />
              </svg>
            ) : (
              <Avatar />
            )}
          </span>
          <span className="tk-ft-rec-tx">
            <b>{names[k]}</b>
            <i />
            <i />
          </span>
          <Ok />
        </div>
      ))}
    </div>
  );
}

const PANE_ICONS = [SEARCH, SHIELD, REFRESH, CHART];

/** The four checks every record passes through, as panes of glass, the
    first in front. */
export function Panes({ names }: { names: string[] }) {
  return (
    <div className="tk-ft-panes">
      {PANES.map((p, j) => (
        <div key={j} className="tk-ft-pane" data-g="0" data-hg="0" style={{ ...at(p), zIndex: PANES.length - j }}>
          <svg className="tk-ft-pane-svg tk-mirror" viewBox="0 0 90 270" fill="none" aria-hidden="true">
            <g transform="translate(10 44) skewY(-14)">
              <rect width="70" height="214" rx="12" fill="url(#tk-ft-g-pane)" className="tk-ft-glass" />
              <rect x="5" y="5" width="60" height="204" rx="8" className="tk-ft-glass-in" />
            </g>
          </svg>
          <span className="tk-ft-pane-l">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={PANE_ICONS[j]} />
            </svg>
            {names[j]}
          </span>
        </div>
      ))}
    </div>
  );
}

const cyl = (y: number, rx: number, ry: number, th: number) =>
  `M${200 - rx} ${y}A${rx} ${ry} 0 0 0 ${200 + rx} ${y}V${y + th}A${rx} ${ry} 0 0 1 ${200 - rx} ${y + th}z`;
const ARC_DOTS = [212, 246, 294, 328].map((d) => [200 + 150 * Math.cos((d * Math.PI) / 180), 170 + 138 * Math.sin((d * Math.PI) / 180)]);

/** The trust core: a glass sphere holding HelloVerify's shield, on the
    platform with HelloVerify on its face, over rings of light. The sphere
    is the persistent layer; the platform under it is the infrastructure. */
export function Core({ tag }: { tag: string }) {
  return (
    <div className="tk-ft-core" style={at(CORE_BOX)}>
      <svg className="tk-ft-core-svg" viewBox="0 0 400 330" fill="none" aria-hidden="true">
        <g className="tk-ft-base" data-g="2" data-hg="2">
          <ellipse cx="200" cy="266" rx="204" ry="64" fill="url(#tk-ft-g-glow)" />
          <ellipse className="tk-ft-floor" cx="200" cy="268" rx="194" ry="48" />
          <ellipse className="tk-ft-floor tk-ft-floor2" cx="200" cy="268" rx="160" ry="38" />
          <path className="tk-ft-orbit" d="M40 70A190 150 0 0 0 40 250" />
          <path className="tk-ft-orbit" d="M360 70A190 150 0 0 1 360 250" />
          <path d={cyl(244, 170, 40, 12)} fill="url(#tk-ft-g-ped)" className="tk-ft-edge" />
          <ellipse cx="200" cy="244" rx="170" ry="40" fill="url(#tk-ft-g-top)" className="tk-ft-edge" />
          <path d={cyl(204, 138, 34, 44)} fill="url(#tk-ft-g-ped)" className="tk-ft-edge" />
          <ellipse cx="200" cy="204" rx="138" ry="34" fill="url(#tk-ft-g-top)" className="tk-ft-edge" />
          <ellipse className="tk-ft-inring" cx="200" cy="204" rx="114" ry="27" />
          <ellipse className="tk-ft-hot" cx="200" cy="204" rx="84" ry="19" />
          <g className="tk-ft-pedlogo" transform="translate(141 243)">
            <Logo width={118} height={34} />
          </g>
        </g>
        <g className="tk-ft-arc" data-g="0">
          <path className="tk-ft-arcp" d="M50 170A150 138 0 0 1 350 170" />
          {ARC_DOTS.map(([x, y], i) => (
            <circle key={i} className="tk-ft-dot tk-ft-dot-s" cx={+x.toFixed(1)} cy={+y.toFixed(1)} r="3" />
          ))}
        </g>
        <g className="tk-ft-orb" data-g="0 1 2" data-hg="0">
          <circle cx="200" cy="128" r="120" fill="url(#tk-ft-g-glow)" />
          <ellipse cx="200" cy="203" rx="62" ry="11" fill="url(#tk-ft-g-shade)" />
          <circle className="tk-ft-sphere" cx="200" cy="128" r="74" fill="url(#tk-ft-g-sphere)" />
          <circle className="tk-ft-sphere-in" cx="200" cy="128" r="65" />
          <path className="tk-ft-shield" d="M200 83l38 13v30c0 26-16 42-38 51-22-9-38-25-38-51V96z" fill="url(#tk-ft-g-shield)" />
          <path className="tk-ft-shield-in" d="M200 92l30 10.4V126c0 21-13 34-30 41.6-17-7.6-30-20.6-30-41.6v-23.6z" />
          <g transform="translate(186.5 106)">
            <svg width="27" height="45" viewBox="0 0 30 50">
              <Logo width={172} height={50} />
            </svg>
          </g>
          <path className="tk-ft-gloss" d="M146 102a58 58 0 0 1 42-44" />
        </g>
      </svg>
      <span className="tk-ft-tag tk-ft-tag-core" data-g="0">{tag}</span>
    </div>
  );
}

const DRAW = [Capitol, Tower, Hospital, College];

/** The four authorities on their slabs, each with its label. */
export function Sites({ names, tag }: { names: string[]; tag: ReactNode }) {
  return (
    <div className="tk-ft-sites">
      <span className="tk-ft-tag tk-ft-tag-access" data-g="1" style={at(ACCESS)}>{tag}</span>
      {SITES.map((p, k) => {
        const Draw = DRAW[k];
        return (
          <div key={k} className="tk-ft-site">
            <div className="tk-ft-org" data-g="1" data-hg="1" style={at(SITE_BOX(p))}>
              <svg className="tk-mirror" viewBox="0 0 180 200" fill="none" aria-hidden="true">
                <Slab />
                <Draw />
              </svg>
            </div>
            <div className="tk-ft-lab" data-g="1" data-hg="1" style={at(LABEL(p))}>
              <b>{names[k]}</b>
              <Ok />
            </div>
          </div>
        );
      })}
    </div>
  );
}
