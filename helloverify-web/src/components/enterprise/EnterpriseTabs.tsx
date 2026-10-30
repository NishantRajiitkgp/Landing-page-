"use client";

/** `/products/bgv-enterprise` — Employees, Businesses, Customers. The three
 *  panels stay in the DOM (`hidden`). A hash of `#employees`, `#businesses`
 *  or `#customers` opens that panel. Explore links are server-rendered. */
import { useEffect, useState, type ReactNode } from "react";
import { Tick } from "@/components/brand/Tick";
import type { BusinessCopy } from "@/lib/copy/business";

type E = BusinessCopy["enterprise"];
type Tab = keyof E["screening"]["tabs"];

const TABS: readonly Tab[] = ["employees", "businesses", "customers"];
const VALUES: readonly (keyof E["employees"]["values"])[] = ["fast", "accurate", "compliant"];
const STATS: readonly (keyof E["employees"]["stats"])[] = ["checks", "countries", "tat", "api"];
const FEATURES: readonly (keyof E["businesses"]["features"])[] = [
  "dueDiligence",
  "kyc",
  "criminal",
  "financial",
  "compliance",
  "reference",
];

function isTab(v: string): v is Tab {
  return (TABS as readonly string[]).includes(v);
}

export function EnterpriseTabs({
  tabs,
  employees: em,
  businesses: bz,
  customers: cu,
  explore,
}: {
  tabs: E["screening"]["tabs"];
  employees: E["employees"];
  businesses: E["businesses"];
  customers: E["customers"];
  explore: Record<Tab, ReactNode>;
}) {
  const [tab, setTab] = useState<Tab>("employees");

  useEffect(() => {
    const sync = () => {
      const h = location.hash.replace("#", "");
      if (isTab(h)) setTab(h);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const open = (k: Tab) => {
    setTab(k);
    const url = `${location.pathname}${location.search}#${k}`;
    history.replaceState(null, "", url);
  };

  const g = em.groups;

  return (
    <div className="ex-screen">
      <div className="ex-tabs" role="tablist">
        {TABS.map((k, i) => (
          <button
            key={k}
            type="button"
            role="tab"
            id={k}
            aria-selected={tab === k}
            aria-controls={`ex-panel-${k}`}
            className={tab === k ? "on" : undefined}
            onClick={() => open(k)}
          >
            <span className="no" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <span className="t">{tabs[k]}</span>
          </button>
        ))}
      </div>

      <div role="tabpanel" id="ex-panel-employees" aria-labelledby="employees" hidden={tab !== "employees"} className="ex-panel">
        <div className="ex-intro">
          <h3>{em.h}</h3>
          <p>{em.p}</p>
        </div>
        <ul className="ex-values">
          {VALUES.map((k) => (
            <li key={k}>
              <p className="tag">{em.values[k].tag}</p>
              <h4>{em.values[k].t}</h4>
              <p>{em.values[k].p}</p>
            </li>
          ))}
        </ul>
        <div className="ex-cta">{explore.employees}</div>
        <div className="ex-checks">
          <div className="ex-checks-hd">
            <h4>{em.checksH}</h4>
            <ul className="ex-stats">
              {STATS.map((k) => (
                <li key={k}>
                  <b>{em.stats[k].a}</b>
                  <span>{em.stats[k].b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="ex-groups">
            <section className="ex-group">
              <h5>{g.enterprise.h}</h5>
              <ul className="two">
                {[...g.enterprise.a, ...g.enterprise.b].map((x) => (
                  <li key={x}>
                    <Tick />
                    {x}
                  </li>
                ))}
              </ul>
            </section>
            <section className="ex-group">
              <h5>{g.tampering.h}</h5>
              <ul>
                {g.tampering.a.map((x) => (
                  <li key={x}>
                    <Tick />
                    {x}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>

      <div role="tabpanel" id="ex-panel-businesses" aria-labelledby="businesses" hidden={tab !== "businesses"} className="ex-panel">
        <div className="ex-intro">
          <h3>{bz.h}</h3>
          <p>{bz.p}</p>
        </div>
        <ul className="ex-feats">
          {FEATURES.map((k, i) => (
            <li key={k}>
              <span className="no" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <h4>{bz.features[k]}</h4>
            </li>
          ))}
        </ul>
        <div className="ex-cta">{explore.businesses}</div>
      </div>

      <div role="tabpanel" id="ex-panel-customers" aria-labelledby="customers" hidden={tab !== "customers"} className="ex-panel">
        <div className="ex-cust">
          <div>
            <p className="k">{cu.brand}</p>
            <h3>{cu.sub}</h3>
            <p className="pillar">{cu.pillar}</p>
            {cu.body.map((x) => (
              <p key={x}>{x}</p>
            ))}
            <div className="ex-cta">{explore.customers}</div>
          </div>
          <aside className="ex-score">
            <h4>{cu.advH}</h4>
            <p className="v">{cu.adv.cost.v}</p>
            <p className="sub">{cu.adv.cost.sub}</p>
            <ul>
              <li>{cu.adv.time}</li>
              <li>{cu.adv.fraud}</li>
              <li>{cu.adv.paperless}</li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
