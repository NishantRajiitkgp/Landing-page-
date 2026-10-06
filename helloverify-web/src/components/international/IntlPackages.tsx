"use client";

import { useState } from "react";

import { IntlSelect } from "@/components/international/IntlSelect";
import { DriverIcon, HomeStaffIcon, TenantIcon } from "@/components/international/icons";
import {
  CMS_ORDER,
  cmsIdFor,
  enquiryHref,
  intlOptions,
  type CmsCountryCopy,
  type CmsCountryId,
} from "@/lib/international/catalog";

const ICONS = { homeStaff: HomeStaffIcon, driver: DriverIcon, tenant: TenantIcon } as const;
const CARDS = ["homeStaff", "driver", "tenant"] as const;

type CardCopy = {
  t: string;
  tags: readonly string[];
  p: Record<CmsCountryId, string>;
};

/** Regional packages. Default country is the CMS `uk` (catalog code GB).
 *  All four countries' cards stay mounted; a catalog country with no CMS
 *  bundle shows the old empty line. No prices — the live cards don't either. */
export function IntlPackages({
  locale,
  includes,
  buy,
  cards,
  countries,
  pick,
  search,
  none,
  empty,
}: {
  locale: string;
  includes: string;
  buy: string;
  cards: Record<(typeof CARDS)[number], CardCopy>;
  countries: Record<CmsCountryId, CmsCountryCopy>;
  pick: string;
  search: string;
  none: string;
  empty: string;
}) {
  const [code, setCode] = useState("GB");
  const active = cmsIdFor(code);
  const href = enquiryHref(locale);

  return (
    <>
      <IntlSelect
        label={pick}
        value={code}
        options={intlOptions(countries, "regional")}
        search={search}
        none={none}
        onChange={setCode}
      />
      {CMS_ORDER.map((id) => (
        <div key={id} hidden={active !== id}>
          <ul className="intl3-cards">
            {CARDS.map((key) => {
              const card = cards[key];
              const Icon = ICONS[key];
              return (
                <li className="intl3-card" key={key}>
                  <div className="intl3-hd">
                    <span className="intl3-disc" aria-hidden="true">
                      <Icon />
                    </span>
                    <h3>{card.t}</h3>
                  </div>
                  <p>{card.p[id]}</p>
                  <p className="intl3-inc">{includes}</p>
                  <ul className="intl3-tags">
                    {card.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <a className="btn btn-ink" href={href}>
                    {buy}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      {active ? null : (
        <p className="intl3-empty" role="status">
          {empty}
        </p>
      )}
    </>
  );
}
