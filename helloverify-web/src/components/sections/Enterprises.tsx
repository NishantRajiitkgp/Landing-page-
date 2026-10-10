/** Enterprises - Background checks for every part of your organization.

    Homepage v2 (the Business board, Sep 2026), one tree at every width:
    the boards have no 390px artboard, so the phone layout is
    `enterprises.css`'s `max-width: 1080px` block — the perimeter shrinks
    to the column, the panels size to their content and stack.

    Two pieces, one band:
    - the trust perimeter: pills and canvas rings that pick one of three
      panels (`./EnterprisePerimeter`, a client island; the panels are
      rendered here and passed in). The Employees panel's two workforces
      are ID badges on lanyards (`./EnterpriseBadges`); Customers is a phone
      running the six KYC steps and Businesses a Certifier certificate that
      fills in over its four, both on `./StepCycler`. Each panel ends on
      three figures (`Nums`) before its buttons,
    - the client letters (`./ClientLetters`, a client island).

    `MotionStage` (`./BizMotion`) wraps the band so one "Pause motion"
    control stops both the canvas and the letter shuffle (WCAG 2.2.2). */
import Image from "next/image";
import { Fragment } from "react";

import { Arrow } from "@/components/brand/Arrow";
import { Tick } from "@/components/brand/Tick";
import { AppLink } from "@/components/chrome/AppLink";
import { tint } from "@/lib/img";
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
import "@/app/v2/enterprises.css";
import { MotionButton, MotionStage } from "./BizMotion";
import { ClientLetters } from "./ClientLetters";
import { EnterpriseBadges } from "./EnterpriseBadges";
import { EnterprisePerimeter } from "./EnterprisePerimeter";
import { StepCycler } from "./StepCycler";

/** The KYC selfie, used on four of the phone's six screens. */
const SELFIE = "/img/v2/en-selfie.jpg";
/** The vendor on the Certifier certificate. */
const VENDOR = "/img/v2/en-vendor.jpg";
/** Faces on the phone and the certificate: 90px at most, 7vw at 1440. */
const SIZES_EN_FACE = "(max-width: 1080px) 30vw, 7vw";

/** The three letters are the About page's client voices, in the same order.
 *  Logos are the marks that page already shows beside each quote. */
const LETTER_LOGOS = {
  hrShared: { src: "/img/clients/hcl.png", alt: "HCL", w: 300, h: 43 },
  people: { src: "/img/clients/cognizant.png", alt: "Cognizant", w: 300, h: 54 },
  associate: { src: "/img/clients/herofincorp.png", alt: "Hero Fincorp", w: 270, h: 104 },
} as const;

function Face({ src, className }: { src: string; className: string }) {
  return (
    <span className={className} style={{ background: tint(src) }}>
      <Image className="pimg" src={src} alt="" fill sizes={SIZES_EN_FACE} />
    </span>
  );
}

/** Skeleton text: `n` bars, the last one short. */
function Bars({ n, className = "kx-bars" }: { n: number; className?: string }) {
  return (
    <span className={className}>
      {Array.from({ length: n }, (_, i) => (
        <i key={i} />
      ))}
    </span>
  );
}

/** A panel's case in three figures (the sales pass, 1 Oct 2026). Each
    figure runs into its line — "₹349 is where a HelloVerify check starts" —
    so the space between them is what a screen reader joins them with. */
function Nums({ k, items }: { k: string; items: Record<string, { b: string; s: string }> }) {
  return (
    <div className="en-nums">
      <span className="en-nums-k">{k}</span>
      <ul className="en-nums-l">
        {Object.entries(items).map(([key, n]) => (
          <li key={key}>
            <b>{n.b}</b> <span>{n.s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function Foot({ href }: { href: string }) {
  const t = (await copy(SECTIONS)).enterprises;
  return (
    <div className="en-foot">
      <AppLink href={href} className="btn btn-ghost en-more">
        <span>{t.explore}</span>
        <Arrow />
      </AppLink>
      <AppLink href="/contact" className="btn btn-ink btn-sm">
        {t.sales}
      </AppLink>
    </div>
  );
}

export async function Enterprises() {
  const t = (await copy(SECTIONS)).enterprises;
  const { employees: e, customers: c, businesses: b } = t;

  const panels = [
    <div key="e" className="en-panel">
      <div className="en-pk">
        <span className="k">{e.k}</span>
        <span className="en-tag">{e.tag}</span>
      </div>
      <h3 className="en-ph">
        {e.hA} <em>{e.hB}</em>
      </h3>
      <p className="en-lead">{e.lede}</p>
      <EnterpriseBadges
        turn={e.turn}
        cols={[
          { ...e.white, photo: "/img/v2/en-white.jpg", tone: "green" },
          { ...e.blue, photo: "/img/v2/en-blue.jpg", tone: "hivis" },
        ]}
      />
      <Nums k={e.numsK} items={e.nums} />
      <Foot href="/products/bgv-enterprise" />
    </div>,
    <div key="c" className="en-panel">
      <div className="en-pk">
        <span className="k">{c.k}</span>
        <span className="en-tag">{c.tag}</span>
      </div>
      <h3 className="en-ph">
        {c.hA} <em>{c.hB}</em>
      </h3>
      <p className="en-lead">{c.lead}</p>
      <StepCycler
        className="kx"
        every={2100}
        holdLast={1.6}
        stepsLabel={c.stepsK}
        steps={Object.values(c.steps)}
        screens={[
          <Fragment key="s0">
            <span className="kx-cam">
              <span className="kx-id">
                <span className="kx-id-ph" />
                <Bars n={3} />
              </span>
            </span>
            <span className="kx-shutter" />
          </Fragment>,
          <Fragment key="s1">
            <Face src={SELFIE} className="kx-oval" />
            <span className="kx-shutter" />
          </Fragment>,
          <span key="s2" className="kx-match">
            <span className="kx-id kx-id-sm">
              <Face src={SELFIE} className="kx-id-ph" />
              <Bars n={2} />
            </span>
            <span className="kx-link">
              <i />
              <i />
              <i />
            </span>
            <Face src={SELFIE} className="kx-face" />
            <span className="kx-ok">
              <Tick tone="inverse" />
            </span>
          </span>,
          <Fragment key="s3">
            <span className="kx-live">
              <Face src={SELFIE} className="kx-oval" />
            </span>
          </Fragment>,
          <span key="s4" className="kx-seal">
            <Tick tone="inverse" />
          </span>,
          <span key="s5" className="kx-welcome">
            <Face src={SELFIE} className="kx-av" />
            <Bars n={2} />
            <span className="kx-acct">
              <Tick tone="inverse" />
              <Bars n={2} className="kx-bars kx-bars-w" />
            </span>
          </span>,
        ]}
      />
      <Nums k={c.numsK} items={c.nums} />
      <Foot href="/products/customer-kyc" />
    </div>,
    <div key="b" className="en-panel">
      <div className="en-pk">
        <span className="k">{b.k}</span>
        <span className="en-tag">{b.tag}</span>
      </div>
      <h3 className="en-ph">{b.h}</h3>
      <p className="en-lede">{b.lede}</p>
      <StepCycler
        className="bx"
        every={2000}
        holdLast={2.2}
        stepsLabel={b.stepsK}
        steps={Object.values(b.steps)}
        screens={[
          <span key="s0" className="bx-top">
            <span className="bx-tag">{b.tag}</span>
            <span className="bx-sent bx-real">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M2 4.5h12v8H2zM2.5 5l5.5 4.2L13.5 5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
              </svg>
              <Tick tone="inverse" />
            </span>
          </span>,
          <span key="s1" className="bx-who">
            <Bars n={3} className="bx-ghost kx-bars" />
            <Bars n={3} className="bx-real kx-bars bx-ink" />
          </span>,
          <span key="s2" className="bx-map">
            <span className="bx-real bx-pin" />
          </span>,
          <Fragment key="s3">
            <span className="bx-photo">
              <Face src={VENDOR} className="bx-real bx-face" />
            </span>
            <ul className="bx-cks">
              {Object.entries(b.chips).map(([k, v], i) => (
                <li key={k} style={{ ["--i" as string]: i }}>
                  <Tick tone="inverse" />
                  {v}
                </li>
              ))}
            </ul>
            <span className="bx-seal" />
          </Fragment>,
        ]}
      />
      <Nums k={b.numsK} items={b.nums} />
      <Foot href="/products/certifier" />
    </div>,
  ];

  const L = t.letters;
  const hero = (await copy(SECTIONS)).hero.motion;

  return (
    <MotionStage className="wrap en" pausedClassName="en-paused">
      <div className="en-mast">
        <MotionButton className="en-motion" pauseLabel={hero.pause} playLabel={hero.play} />
      </div>
      <div className="sec-head en-head">
        <h2 className="h2 en-h2">
          {t.headingA}
          <br />
          <em className="en-it">{t.headingB}</em>
        </h2>
        <p className="lede en-lede">{t.lede}</p>
      </div>
      <EnterprisePerimeter
        select={t.select}
        core={t.core}
        stop={
          <>
            {t.stopA} <em>{t.stopB}</em>
          </>
        }
        rings={[t.rings.employees, t.rings.customers, t.rings.businesses]}
        panels={panels}
      />
      {/* The 30+ / 120+ / 1 to 7 / REST API row went (30 Sep 2026): the
          Large Enterprises panel already carries the same four figures. */}
      <ClientLetters
        kicker={L.kicker}
        heading={
          <>
            {L.hA} <em>{L.hB}</em>
          </>
        }
        from={L.from}
        letters={(Object.keys(L.items) as (keyof typeof L.items)[]).map((k) => ({
          ...L.items[k],
          logo: LETTER_LOGOS[k],
        }))}
      />
    </MotionStage>
  );
}
