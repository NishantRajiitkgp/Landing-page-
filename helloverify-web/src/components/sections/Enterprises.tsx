/** Enterprises - Background checks for every part of your organization.

    Homepage v2, desktop only (the Business board, Sep 2026). New on the
    homepage: no generated section preceded it, so there is no `.mob` tree
    to keep and nothing renders under 1081px until the phone gets its own
    part (the v2 boards have no 390px artboard).

    Three pieces, one band:
    - the trust perimeter: pills and canvas rings that pick one of three
      panels (`./EnterprisePerimeter`, a client island; the panels are
      rendered here and passed in),
    - four stats,
    - the client letters (`./ClientLetters`, a client island).

    `MotionStage` (`./BizMotion`) wraps the band so one "Pause motion"
    control stops both the canvas and the letter shuffle (WCAG 2.2.2). */
import { Arrow } from "@/components/brand/Arrow";
import { Tick } from "@/components/brand/Tick";
import { AppLink } from "@/components/chrome/AppLink";
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
import "@/app/v2/enterprises.css";
import { MotionButton, MotionStage } from "./BizMotion";
import { ClientLetters } from "./ClientLetters";
import { EnterprisePerimeter } from "./EnterprisePerimeter";

function Chips({ items }: { items: Record<string, string> }) {
  return (
    <div className="en-chips">
      {Object.entries(items).map(([k, v]) => (
        <span key={k} className="en-chip">
          {v}
        </span>
      ))}
    </div>
  );
}

/** Numbered step cards; each rises in 80 ms after the last, from 150 ms. */
function Steps({ items, cols }: { items: Record<string, string>; cols: 4 | 6 }) {
  return (
    <ol className={`en-steps en-steps-${cols}`}>
      {Object.entries(items).map(([k, v], i) => (
        <li key={k} style={{ animationDelay: `${(0.15 + i * 0.08).toFixed(2)}s` }}>
          <span className="en-sn">{String(i + 1).padStart(2, "0")}</span>
          <span>{v}</span>
        </li>
      ))}
    </ol>
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
      <div className="en-two">
        {[e.white, e.blue].map((col) => (
          <div key={col.t} className="en-col">
            <div className="en-ct">{col.t}</div>
            <p className="en-cp">{col.p}</p>
            <Chips items={col.chips} />
          </div>
        ))}
      </div>
      <div className="en-int">
        <span className="en-int-k">{e.intK}</span>
        {Object.entries(e.ints).map(([k, v]) => (
          <span key={k}>
            <Tick />
            {v}
          </span>
        ))}
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
      <Steps items={c.steps} cols={6} />
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
      <div className="en-sub-k">{b.stepsK}</div>
      <Steps items={b.steps} cols={4} />
      <div className="en-pts">
        {Object.entries(b.pts).map(([k, p]) => (
          <div key={k}>
            <b>{p.b}</b>
            <span>{p.s}</span>
          </div>
        ))}
      </div>
      <Chips items={b.chips} />
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
