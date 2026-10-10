/** `/products/certifier` — the four How Certifier Works panels, in the old
 *  CMS tab order: Virtual Onboarding (four STEP boxes), Vendor Monitoring
 *  (tick list), Statutory Screenings (tick list + id-card grid), Virtual
 *  Agreement (one tick line + id-card grid). */
import type { BusinessCopy } from "@/lib/copy/business";

type How = BusinessCopy["certifier"]["how"];

function Tick() {
  return (
    <span className="tk" aria-hidden="true">
      <svg viewBox="0 0 16 16">
        <path d="m3.5 8.5 3 3 6-7" />
      </svg>
    </span>
  );
}

function IdCard() {
  return (
    <span className="idc" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="11" r="2" />
        <path d="M6 16c.6-1.5 1.7-2.2 3-2.2s2.4.7 3 2.2M14.5 10h4M14.5 13.5h3" />
      </svg>
    </span>
  );
}

function Ids({ items }: { items: readonly string[] }) {
  return (
    <ul className="cert3-ids">
      {items.map((x) => (
        <li key={x}>
          <IdCard />
          <p>{x}</p>
        </li>
      ))}
    </ul>
  );
}

export function howPanels(h: How) {
  return [
    <div key="onboarding" className="cert3-col">
      <h3>{h.onboarding.h}</h3>
      <p className="cs">{h.onboarding.sub}</p>
      <ol className="cert3-steps">
        {h.onboarding.steps.map((t, i) => (
          <li key={t}>
            <span className="badge" aria-hidden="true">{`0${i + 1}`}</span>
            <p>{t}</p>
          </li>
        ))}
      </ol>
    </div>,
    <div key="monitoring" className="cert3-col">
      <h3>{h.monitoring.h}</h3>
      <ul className="cert3-card cert3-ticks">
        {h.monitoring.items.map((x, i) => (
          <li key={i}>
            <Tick />
            <p>{x}</p>
          </li>
        ))}
      </ul>
    </div>,
    <div key="statutory" className="cert3-col">
      <h3>{h.statutory.h}</h3>
      <div className="cert3-card">
        <ul className="cert3-ticks">
          {h.statutory.intro.map((x) => (
            <li key={x}>
              <Tick />
              <p>{x}</p>
            </li>
          ))}
        </ul>
        <Ids items={h.statutory.items} />
      </div>
    </div>,
    <div key="agreement" className="cert3-col">
      <h3>{h.agreement.h}</h3>
      <div className="cert3-card">
        <ul className="cert3-ticks">
          <li>
            <Tick />
            <p>{h.agreement.intro}</p>
          </li>
        </ul>
        <Ids items={h.agreement.items} />
      </div>
    </div>,
  ];
}
