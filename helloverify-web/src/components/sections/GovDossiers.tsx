/** Government & International Authorities — four dossiers, the MOM COMPASS
    case, and premium services (homepage v2).

    Hand-ported from the top of the canvas board `Desktop2.dc.html`: the four
    tabbed dossiers (`assemble_gov.py`) as the "minimal read" pass left them
    (`assemble_dos.py`: a row's description opens on hover or focus, the chain
    of trust sits at the foot of the sheet, the sheet is 700px tall), then the
    calmer MOM block and the premium band (`assemble_mom.py`, here
    `./GovMom`). The tabs are the client island `./GovDossierTabs`.

    NOT PORTED: each sheet's verdict line and chain caption. The minimal-read
    pass sets both to `display: none`; porting them as hidden text would put
    words in the page no sighted visitor can reach.

    One tree at every width. The board had no 390px artboard; below 1081px
    `govdossier.css` stacks each sheet, cover over contents, and the tabs
    become a sideways row. */
import { Fragment } from "react";
import Image from "next/image";

import { Arrow } from "@/components/brand/Arrow";
import { Tick } from "@/components/brand/Tick";
import { AppLink } from "@/components/chrome/AppLink";
import { copy } from "@/lib/copy/request";
import { SECTIONS, type GovDossierId } from "@/lib/copy/sections";
import { tint } from "@/lib/img";
import "@/app/v2/govdossier.css";
import { Watermark } from "./GovArt";
import { GovAuthorityMenu, GovDossierTabs } from "./GovDossierTabs";
import { GovMom } from "./GovMom";
import { InkFilter, StampOct, StampOval, StampRect, StampRound, type StampWords } from "./GovStamps";

/** `.gv-photo` — the cover column is 5/12 of the 1200px sheet, less 88px of
 *  padding: 412px at 1440 (28.6vw). Below 1081 it is the sheet's width less
 *  gutters and padding: 306px at 390 (78vw), 684px at 768 (89vw). */
const SIZES_GV_PHOTO = "(max-width: 1080px) 90vw, 29vw";

type Cta = "talk" | "authority" | "mom";

/** Per dossier: its photograph and focal point, its stamp's shape, the call
 *  to action the old page carried, and where "Explore More" goes — each
 *  vertical's own page in `lib/seo/routes.ts`. */
const DOSSIERS: {
  id: GovDossierId;
  img: string;
  pos: string;
  Stamp: (w: StampWords) => React.ReactNode;
  cta: Cta;
  href: string;
}[] = [
  { id: "health", img: "/img/02-nurse-abudhabi.jpg", pos: "50% 30%", Stamp: StampRound, cta: "talk", href: "/governments/health" },
  { id: "immigration", img: "/img/14-visa-counter.jpg", pos: "50% 40%", Stamp: StampRect, cta: "authority", href: "/governments/immigration" },
  { id: "manpower", img: "/img/19-singapore.jpg", pos: "50% 35%", Stamp: StampOct, cta: "mom", href: "/governments/manpower-education" },
  { id: "trade", img: "/img/13-factory-floor.jpg", pos: "50% 45%", Stamp: StampOval, cta: "talk", href: "/governments/trade" },
];

const MOM_PAGE = "/governments/manpower-education/ministry-of-manpower";

export async function GovDossiers() {
  const t = (await copy(SECTIONS)).govDossiers;

  const ctas = (cta: Cta) => {
    if (cta === "talk") {
      return <AppLink href="/contact" className="btn btn-ink btn-sm">{t.talk}</AppLink>;
    }
    if (cta === "mom") {
      return (
        <AppLink href={MOM_PAGE} className="gv-mom-cta">
          <Image src="/img/mom.jpg" alt="" width={22} height={22} />
          <span>{t.momCta}</span>
          <Arrow />
        </AppLink>
      );
    }
    // There is no page per embassy yet; both lead to the immigration page.
    return (
      <GovAuthorityMenu label={t.selectAuthority}>
        <AppLink href="/governments/immigration">{t.authorities.latvia}</AppLink>
        <AppLink href="/governments/immigration">{t.authorities.italy}</AppLink>
      </GovAuthorityMenu>
    );
  };

  const panels = DOSSIERS.map(({ id, img, pos, Stamp, cta, href }) => {
    const d = t.items[id];
    const chain = Object.values(d.chain);
    return (
      <Fragment key={id}>
        <Watermark id={id} />
        <div className="gv-cover">
          <div className="gv-cover-k"><span>{d.n}</span><span>{d.tab}</span></div>
          <h3 className="gv-title">{d.title}</h3>
          <p className="gv-sub">{d.sub}</p>
          <div className="gv-photo ph" style={{ background: tint(img) }}>
            <Image className="pimg" src={img} alt="" fill sizes={SIZES_GV_PHOTO} style={{ objectPosition: pos }} />
            <div className="scrim" />
            <div className="gv-chips">
              {Object.values(d.chips).map((c) => <span key={c} className="gv-chip">{c}</span>)}
            </div>
            <div className="gv-stamp-wrap"><Stamp {...d.stamp} /></div>
          </div>
          <div className="gv-proof">
            {cta === "mom" ? <Image src="/img/mom.jpg" alt="" width={26} height={26} /> : <span className="gv-proof-dot" />}
            <span>{d.proof}</span>
          </div>
        </div>
        <div className="gv-contents">
          <div className="k">{d.k}</div>
          <div className="gv-rows">
            {Object.values(d.rows).map((r, j) => (
              // Focusable so the description a pointer opens by hovering is
              // open to the keyboard too (WCAG 2.1.1); no role, as it does
              // nothing when activated.
              <div key={r.t} className="gv-row" tabIndex={0} style={{ animationDelay: `${(0.25 + j * 0.07).toFixed(2)}s` }}>
                <Tick />
                <div>
                  <div className="gv-row-t">{r.t}</div>
                  <div className="gv-row-p">{r.p}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="gv-chain-box">
            <ol className="gv-chain">
              {chain.map((c, j) => (
                <li key={c} className="gv-node" style={{ animationDelay: `${(0.45 + j * 0.28).toFixed(2)}s` }}>
                  <i aria-hidden="true" />
                  {j < chain.length - 1 && (
                    <span className="gv-link" aria-hidden="true" style={{ animationDelay: `${(0.6 + j * 0.28).toFixed(2)}s` }} />
                  )}
                  <b>{c}</b>
                </li>
              ))}
            </ol>
          </div>
          <div className="gv-foot">
            <div className="gv-ctas">
              <AppLink href={href} className="btn btn-ghost gv-explore">
                <span>{t.explore}</span>
                <Arrow />
              </AppLink>
              {ctas(cta)}
            </div>
          </div>
        </div>
      </Fragment>
    );
  });

  return (
    <section className="wrap hair-top gv" aria-labelledby="gv-h">
      <InkFilter />
      <div className="gv-mast">
        <div className="gv-mast-k"><span className="k">{t.kicker}</span><span className="gv-sheet">{t.sheet}</span></div>
        <div className="sec-head gv-head">
          <h2 className="h2" id="gv-h">
            {t.heading} <em className="gv-it">{t.headingEm}</em>
          </h2>
          <p className="lede gv-lede">{t.lede}</p>
        </div>
      </div>
      <GovDossierTabs
        tabs={DOSSIERS.map(({ id }) => t.items[id].tab)}
        counts={DOSSIERS.map(({ id }) => t.items[id].count)}
        panels={panels}
        label={t.tabsLabel}
        prevLabel={t.prev}
        nextLabel={t.next}
      />
      <GovMom />
    </section>
  );
}
