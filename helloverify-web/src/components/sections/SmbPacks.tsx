/** The Small & Medium Businesses panel of the business band (`./Smb`).

    Rebuilt 1 Oct 2026 ("for Small and Medium Business it's nothing"): the
    Large panel had photographs, a proof strip and an ask, and this one had
    three receipts on clips and three plain step boxes. It now follows the
    Large panel's rhythm, in the same card family (`.sg-card`):

    - three package cards, each opening on a first day at a small business
      (Higgsfield, `/img/v2/sm-*`), the checks it runs, and a torn receipt
      stub carrying the price, what that comes to per check, and Buy Now;
    - "How it works" (`./SmbHow`), the three steps played on a drawn screen;
    - a facts row and the ask, as the Large panel's stats row and Talk to
      Sales.

    Every word is the old SMB tab's, verbatim (package names, prices,
    descriptions, check names, the three steps) or the `/business/smb`
    page's (the facts row and the two actions); the new microcopy is
    `smb.demo`, listed there. REJECTED: keeping the receipts and adding
    photographs above them — two objects per package, and the page already
    shows a receipt rack in Individual Checks. The receipt survives as the
    stub. All server-rendered; the only island is the demo's step clock. */
import Image from "next/image";

import { Arrow } from "@/components/brand/Arrow";
import { Tick } from "@/components/brand/Tick";
import { AppLink } from "@/components/chrome/AppLink";
import { BUSINESS } from "@/lib/copy/business";
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
import { tint } from "@/lib/img";
import { SmbHow } from "./SmbHow";
import { PACKS } from "./smbData";

/** 386px wide at the 1440 board (three in 1200 less gaps); on a phone and a
 *  tablet a card is at most 340px of a sideways row (`smb.css`). */
const SIZES_SP_CARD = "(max-width: 1080px) 80vw, 27vw";

/** "₹2,399" over 5 checks -> "480", rounded and grouped the Indian way
 *  (no `Intl`, so server and browser print the same); the copy adds the ₹. */
function perCheck(price: string, n: number): string {
  const each = Math.round(Number(price.replace(/[^0-9]/g, "")) / n);
  return String(each).replace(/\B(?=(\d{2})*\d{3}$)/g, ",");
}

/** The turnaround, a glass chip on the photograph. */
function Tat({ label }: { label: string }) {
  return (
    <span className="sp-tat">
      <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
        <circle cx="6" cy="6" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M6 3.4V6l1.8 1.1" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      {label}
    </span>
  );
}

export async function SmbPanel() {
  const t = (await copy(SECTIONS)).smb;
  const biz = (await copy(BUSINESS)).smb;
  const B = t.build;

  return (
    <>
      <div className="sec-head sm-head">
        <h2 className="h2 sm-h2">
          {t.headingA}
          <br />
          <em className="sm-it">{t.headingB}</em>
        </h2>
        <p className="lede sm-lede">{t.lede}</p>
      </div>

      <ul className="sg-cards sp-cards">
        {PACKS.map((p, i) => {
          const pk = t.packs[p.id];
          const n = p.lines.length;
          return (
            <li key={p.id} className={p.best ? "sg-card sp-card sp-best" : "sg-card sp-card"} style={{ "--i": i } as React.CSSProperties}>
              <span className="sg-ph sp-ph" style={{ background: tint(p.photo) }}>
                <Image className="pimg" src={p.photo} alt="" fill sizes={SIZES_SP_CARD} />
                <span className="sg-tag">
                  <i>{String(i + 1).padStart(2, "0")}</i>
                  {pk.name}
                </span>
                <Tat label={t.mins} />
              </span>
              <div className="sg-body sp-body">
                <div className="sp-tt">
                  <h3 className="sg-t">{pk.tt}</h3>
                  {p.best && <span className="sm-stamp">{t.best}</span>}
                </div>
                <p className="sg-p">{pk.sub}</p>
                <ul className="sg-chips">
                  {p.lines.map((l) => (
                    <li key={l} className={p.adds.includes(l) ? "sm-add" : undefined}>
                      <Tick />
                      <span>{t.lines[l]}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* The receipt stub: torn along a perforation, the price, what it
                  comes to per check, the button, a barcode. */}
              <div className="sp-stub">
                <div className="sp-tot">
                  <span className="sp-lb">{t.tot(n)}</span>
                  <span className="sp-v">{pk.price}</span>
                </div>
                <div className="sm-each">{t.perCheck(B.rupees(perCheck(pk.price, n)))}</div>
                {/* Three links read "Buy Now"; the package names each for a
                    screen reader, as the Large panel's Explore More does. */}
                <AppLink href="/business/smb" className="btn btn-ink sp-buy" aria-label={`${t.buy}: ${pk.name}`}>
                  <span>{t.buy}</span>
                  <Arrow />
                </AppLink>
                <span className="sp-bc" aria-hidden="true" />
              </div>
            </li>
          );
        })}
      </ul>

      <SmbHow />

      <div className="sg-proof sp-proof">
        <ul className="sp-facts">
          <li>{biz.strip.checks}</li>
          <li>{biz.strip.subscription}</li>
          <li>{biz.strip.invoice}</li>
        </ul>
        <div className="sp-acts">
          <AppLink href="/contact" className="btn btn-ghost sp-talk">
            <span>{biz.hero.talkFirst}</span>
          </AppLink>
          <AppLink href="/business/smb" className="btn btn-ink sg-sales">
            <span>{biz.closing.ctaLabel}</span>
            <Arrow />
          </AppLink>
        </div>
      </div>
    </>
  );
}
