/** Enterprises - Background checks for every part of your organization.

    Homepage v2, desktop only (the Business board, Sep 2026). New on the
    homepage: no generated section preceded it, so there is no `.mob` tree
    to keep and nothing renders under 1081px until the phone gets its own
    part (the v2 boards have no 390px artboard).

    Three pieces, one band:
    - the trust perimeter: pills and canvas rings that pick one of three
      panels (`./EnterprisePerimeter`, a client island; the panels are
      rendered here and passed in). The Employees panel's two workforces
      are ID badges on lanyards (`./EnterpriseBadges`); Customers is a phone
      running the six KYC steps and Businesses a Certifier certificate that
      fills in over its four, both on `./StepCycler`,
    - four stats,
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
      <h3 className="en-ph">{e.h}</h3>
      <EnterpriseBadges
        turn={e.turn}
        cols={[
          { ...e.white, photo: "/img/v2/en-white.jpg", tone: "green" },
          { ...e.blue, photo: "/img/v2/en-blue.jpg", tone: "hivis" },
        ]}
      />
      <div className="en-flow">
        <span className="en-flow-k">{e.intK}</span>
        <ol className="en-flow-l">
          {Object.entries(e.ints).map(([k, v]) => (
            <li key={k}>
              <Tick />
              <span>{v}</span>
            </li>
          ))}
        </ol>
      </div>
      <Foot href="/business/enterprise" />
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
      <div className="en-grid6">
        {Object.entries(c.grid).map(([k, g]) => (
          <div key={k}>
            <b>{g.b}</b>
            <span>{g.s}</span>
          </div>
        ))}
      </div>
      <Foot href="/business/customer-kyc" />
    </div>,
    <div key="b" className="en-panel">
      <div className="en-pk">
        <span className="k">{b.k}</span>
        <span className="en-tag">{b.tag}</span>
      </div>
      <h3 className="en-ph">{b.h}</h3>
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
      <div className="en-pts">
        {Object.entries(b.pts).map(([k, p]) => (
          <div key={k}>
            <b>{p.b}</b>
            <span>{p.s}</span>
          </div>
        ))}
      </div>
      <Foot href="/business/certifier" />
    </div>,
  ];

  const L = t.letters;
  const hero = (await copy(SECTIONS)).hero.motion;

  return (
    <div className="dsk">
      <MotionStage className="wrap en" pausedClassName="en-paused">
        <div className="en-mast">
          <span className="k">{t.kicker}</span>
          <span className="en-mast-r">
            <MotionButton className="en-motion" pauseLabel={hero.pause} playLabel={hero.play} />
            <span className="en-sheet">{t.sheet}</span>
          </span>
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
        <div className="en-stats">
          {Object.entries(t.stats).map(([k, s]) => (
            <div key={k}>
              <b>{s.b}</b>
              <span>{s.s}</span>
            </div>
          ))}
        </div>
        <ClientLetters
          kicker={L.kicker}
          heading={
            <>
              {L.hA} <em>{L.hB}</em>
            </>
          }
          from={L.from}
          letters={Object.values(L.items)}
        />
      </MotionStage>
    </div>
  );
}
