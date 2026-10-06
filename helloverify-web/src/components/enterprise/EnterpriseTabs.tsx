"use client";

/** `/products/bgv-enterprise` — the old screening tabs
 *  (`EnterpriseScreeningSection`): Employees (intro, three value cards,
 *  Explore More, Checks We Offer with four stats and two check groups),
 *  Businesses (intro, six feature cards, Explore More), Customers (Trust &
 *  Safety, the pillar, Explore More, the four advantages). All three panels
 *  stay in the DOM (`hidden`). The Explore More links are rendered by the
 *  server and passed in. */
import { useState, type ReactNode } from "react";
import { EnterpriseIcon, type EnterpriseIconId } from "@/components/enterprise/EnterpriseIcons";
import type { BusinessCopy } from "@/lib/copy/business";

type E = BusinessCopy["enterprise"];
type Tab = keyof E["screening"]["tabs"];

const VALUES: readonly [keyof E["employees"]["values"], EnterpriseIconId][] = [["fast", "bolt"], ["accurate", "clipboardCheck"], ["compliant", "bullhorn"]];
const STATS: readonly [keyof E["employees"]["stats"], EnterpriseIconId][] = [["checks", "penToSquare"], ["countries", "globe"], ["tat", "clockRotateLeft"], ["api", "network"]];
const FEATURES: readonly [keyof E["businesses"]["features"], EnterpriseIconId][] = [
  ["dueDiligence", "shieldCheck"],
  ["kyc", "addressBook"],
  ["criminal", "scaleBalanced"],
  ["financial", "chartLine"],
  ["compliance", "gavel"],
  ["reference", "userShield"],
];
const TABS: readonly Tab[] = ["employees", "businesses", "customers"];

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
  const g = em.groups;
  return (
    <div className="body3">
      <div className="hv3-tabs" role="tablist">
        {TABS.map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            id={`ent3-tab-${k}`}
            aria-selected={tab === k}
            aria-controls={`ent3-panel-${k}`}
            className={tab === k ? "seg on" : "seg"}
            onClick={() => setTab(k)}
          >
            {tabs[k]}
          </button>
        ))}
      </div>

      <div role="tabpanel" id="ent3-panel-employees" aria-labelledby="ent3-tab-employees" hidden={tab !== "employees"}>
        <div className="ent3-intro">
          <h3>{em.h}</h3>
          <p>{em.p}</p>
        </div>
        <ul className="smb3-cards ent3-values">
          {VALUES.map(([k, icon]) => (
            <li key={k}>
              <span className="ic">
                <EnterpriseIcon id={icon} />
              </span>
              <h4>{em.values[k].t}</h4>
              <p className="tg">{em.values[k].tag}</p>
              <p>{em.values[k].p}</p>
            </li>
          ))}
        </ul>
        <div className="ent3-cta">{explore.employees}</div>
        <div className="ent3-checks">
          <h4 className="ent3-ch">{em.checksH}</h4>
          <ul className="ent3-stats">
            {STATS.map(([k, icon]) => (
              <li key={k}>
                <span className="ic">
                  <EnterpriseIcon id={icon} />
                </span>
                <span className="tx">
                  <span>{em.stats[k].a}</span>
                  <span>{em.stats[k].b}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="ent3-groups">
            <div className="ent3-group">
              <p className="hd">
                <span className="ic">
                  <EnterpriseIcon id="listChecks" />
                </span>
                {g.enterprise.h}
              </p>
              <div className="cols">
                <ul>
                  {g.enterprise.a.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <ul>
                  {g.enterprise.b.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="ent3-group">
              <p className="hd">
                <span className="ic">
                  <EnterpriseIcon id="fileMagnifyingGlass" />
                </span>
                {g.tampering.h}
              </p>
              <div className="cols one">
                <ul>
                  {g.tampering.a.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div role="tabpanel" id="ent3-panel-businesses" aria-labelledby="ent3-tab-businesses" hidden={tab !== "businesses"}>
        <div className="ent3-intro">
          <h3>{bz.h}</h3>
          <p>{bz.p}</p>
        </div>
        <ul className="smb3-feat ent3-feat">
          {FEATURES.map(([k, icon]) => (
            <li key={k}>
              <span className="ic">
                <EnterpriseIcon id={icon} />
              </span>
              <h4>{bz.features[k]}</h4>
            </li>
          ))}
        </ul>
        <div className="ent3-cta">{explore.businesses}</div>
      </div>

      <div role="tabpanel" id="ent3-panel-customers" aria-labelledby="ent3-tab-customers" hidden={tab !== "customers"}>
        <div className="ent3-intro">
          <h3>{cu.brand}</h3>
          <p className="br">{cu.sub}</p>
        </div>
        <div className="ent3-pillar">
          <h4>{cu.pillar}</h4>
          {cu.body.map((x) => (
            <p key={x}>{x}</p>
          ))}
        </div>
        <div className="ent3-cta">{explore.customers}</div>
        <div className="ent3-adv">
          <h4>{cu.advH}</h4>
          <ul>
            <li className="hl">
              <span className="v">{cu.adv.cost.v}</span>
              <span>{cu.adv.cost.sub}</span>
            </li>
            <li>{cu.adv.time}</li>
            <li>{cu.adv.fraud}</li>
            <li>{cu.adv.paperless}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
