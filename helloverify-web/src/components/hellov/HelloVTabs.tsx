"use client";

/** The HelloV product tabs: Packages (`./HelloVPackages`, each service's
 *  Basic and Advanced tiers) and Single Checks (three cards a page, with a
 *  pager). Every panel stays in the DOM and only the open one shows, as the
 *  old page's content was all one tab away. */
import { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { CommerceCta } from "@/components/commerce/CommerceCta";
import type { IndividualsCopy } from "@/lib/copy/individuals";

import { HelloVPackages, type Offer, type OfferLabels } from "./HelloVPackages";

export type { Offer, OfferLabels, PackageKey } from "./HelloVPackages";

type C = IndividualsCopy["hellov"];
type Tab = keyof C["tabs"];
export type SingleKey = keyof C["singles"]["cards"];

export type Single = {
  key: SingleKey;
  id: string;
  unitAmount: number;
  minutes: number;
  checkoutName: string;
  img: { src: string; w: number; h: number };
};

const PER_PAGE = 3;

function Bolt() {
  return (
    <svg viewBox="0 0 10 17" width="9" height="15" fill="currentColor" aria-hidden="true">
      <path d="M4.44 0h4.72c.2.14.26.24.12.48l-.35.55-.63 1-2.3 3.64h3.39c.15.01.25.13.25.27 0 .12-.07.19-.14.28L3.56 13.27 1.5 15.72l-.62.74c-.15.18-.32.4-.52.54H.2c-.17-.12-.24-.2-.16-.41l.28-.69.52-1.24 1.53-3.63c.26-.62.6-1.35.82-1.96H.35c-.14.03-.4-.15-.34-.31.17-.43.47-.99.67-1.39l1.26-2.51L3.5 1.73 4.26.2c.05-.1.1-.14.18-.2z" />
    </svg>
  );
}

type HelloVTabsProps = {
  c: C;
  offers: readonly Offer[];
  labels: OfferLabels;
  singles: readonly Single[];
  initial?: string | null;
};

export function HelloVTabs({ c, offers, labels, singles, initial }: HelloVTabsProps) {
  const [tab, setTab] = useState<Tab>(() => (initial && initial in c.tabs ? (initial as Tab) : "packages"));
  const [page, setPage] = useState(0);
  const pages = Math.ceil(singles.length / PER_PAGE);

  return (
    <div className="wrap sec3 hv3" id="hellov-product-tabs">
      <div className="hv3-tabs" role="tablist">
        {(Object.keys(c.tabs) as Tab[]).map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            id={`hv-tab-${k}`}
            aria-selected={tab === k}
            aria-controls={`hv-panel-${k}`}
            className={`seg${tab === k ? " on" : ""}`}
            onClick={() => setTab(k)}
          >
            {c.tabs[k]}
          </button>
        ))}
      </div>

      <div id="hv-panel-packages" role="tabpanel" aria-labelledby="hv-tab-packages" hidden={tab !== "packages"}>
        <HelloVPackages c={c} offers={offers} labels={labels} />
      </div>

      <div id="hv-panel-single" role="tabpanel" aria-labelledby="hv-tab-single" hidden={tab !== "single"}>
        <p className="hv3-intro">{c.singles.intro}</p>
        <ul className="hv3-singles">
          {singles.map((s, i) => {
            const it = c.singles.cards[s.key];
            const priceDisplay = `₹${s.unitAmount}`;
            return (
              <li key={s.key} hidden={Math.floor(i / PER_PAGE) !== page}>
                <div className="bn">
                  <span>{c.singles.banner}</span>
                  <Bolt />
                  <span>
                    {s.minutes} {c.singles.mins}
                  </span>
                </div>
                <h3>{it.t}</h3>
                <p>{it.p}</p>
                <CommerceCta
                  className="btn btn-ink btn-sm"
                  label={c.singles.buy}
                  loginRedirect="products/hellov"
                  packageDetails={{
                    packageType: "home",
                    packageId: s.id,
                    packageName: s.checkoutName,
                    description: it.p,
                    priceDisplay,
                    unitAmount: s.unitAmount,
                    includedChecks: [it.t],
                  }}
                />
                <div className="im">
                  <Image src={s.img.src} alt={it.imgAlt} width={s.img.w} height={s.img.h} sizes="(max-width: 1080px) 100vw, 380px" />
                </div>
              </li>
            );
          })}
        </ul>
        {pages > 1 ? (
          <div className="hv3-pager">
            <button type="button" aria-label={c.singles.pager.prev} disabled={page === 0} onClick={() => setPage(page - 1)}>
              <span aria-hidden="true">‹</span>
            </button>
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                type="button"
                className={`dot${i === page ? " on" : ""}`}
                aria-label={String(i + 1)}
                aria-current={i === page ? "true" : undefined}
                onClick={() => setPage(i)}
              />
            ))}
            <button type="button" aria-label={c.singles.pager.next} disabled={page === pages - 1} onClick={() => setPage(page + 1)}>
              <span aria-hidden="true">›</span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function HelloVTabsBound(props: Omit<HelloVTabsProps, "initial">) {
  return <HelloVTabs {...props} initial={useSearchParams().get("tab")} />;
}
