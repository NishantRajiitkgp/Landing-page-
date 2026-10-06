"use client";

/** `/products/bgv-smb` — the old "Solutions We Offer" band
 *  (`BgvSmbSolutionsOfferSection`): Employee Verification / Vendor Screening
 *  tabs; the vendor panel is its intro, six feature cards and the What We
 *  Offer cards. Both panels stay in the DOM (`hidden`). */
import { useState } from "react";
import { SmbIcon, type SmbIconId } from "@/components/smb/SmbIcons";
import type { BusinessCopy } from "@/lib/copy/business";

type S = BusinessCopy["smb"]["solutions"];
type EmployeeKey = keyof S["employee"];
type FeatureKey = keyof S["vendor"]["features"];
type OfferKey = keyof S["vendor"]["offer"]["cards"];

const EMPLOYEE: readonly [EmployeeKey, SmbIconId][] = [["trust", "handshake"], ["decision", "userCheck"], ["instant", "historyClock"]];
const FEATURES: readonly [FeatureKey, SmbIconId][] = [
  ["dueDiligence", "document"],
  ["kyc", "idCard"],
  ["criminal", "tools"],
  ["financial", "chartBars"],
  ["compliance", "scales"],
  ["reference", "search"],
];
const OFFERS: readonly [OfferKey, SmbIconId][] = [["fast", "rocket"], ["regulatory", "scales"], ["monitoring", "userRefresh"], ["reputation", "shieldCheck"]];

export function SmbSolutions({ c }: { c: S }) {
  const [tab, setTab] = useState<"employee" | "vendor">("employee");
  return (
    <div className="wrap sec3" id="bgv-smb-solutions-offer">
      <div className="sec-head smb3-head">
        <h2 className="h2">{c.h}</h2>
        <p className="lede">{c.sub}</p>
      </div>
      <div className="body3">
        <div className="hv3-tabs" role="tablist">
          {(["employee", "vendor"] as const).map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              id={`smb3-tab-${k}`}
              aria-selected={tab === k}
              aria-controls={`smb3-panel-${k}`}
              className={tab === k ? "seg on" : "seg"}
              onClick={() => setTab(k)}
            >
              {c.tabs[k]}
            </button>
          ))}
        </div>

        <div role="tabpanel" id="smb3-panel-employee" aria-labelledby="smb3-tab-employee" hidden={tab !== "employee"}>
          <ul className="smb3-cards">
            {EMPLOYEE.map(([k, icon]) => (
              <li key={k}>
                <span className="ic">
                  <SmbIcon id={icon} />
                </span>
                <h3>{c.employee[k].t}</h3>
                <p>{c.employee[k].p}</p>
              </li>
            ))}
          </ul>
        </div>

        <div role="tabpanel" id="smb3-panel-vendor" aria-labelledby="smb3-tab-vendor" hidden={tab !== "vendor"}>
          <div className="smb3-vin">
            <h3>{c.vendor.h}</h3>
            <p>{c.vendor.p}</p>
          </div>
          <ul className="smb3-feat">
            {FEATURES.map(([k, icon]) => (
              <li key={k}>
                <span className="ic">
                  <SmbIcon id={icon} />
                </span>
                <h4>{c.vendor.features[k]}</h4>
              </li>
            ))}
          </ul>
          <div className="smb3-offer">
            <h3>{c.vendor.offer.h}</h3>
            <ul className="smb3-cards smb3-cards-4">
              {OFFERS.map(([k, icon]) => (
                <li key={k}>
                  <span className="ic">
                    <SmbIcon id={icon} />
                  </span>
                  <h4>{c.vendor.offer.cards[k].t}</h4>
                  <p>{c.vendor.offer.cards[k].p}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
