/** The country list and per-country checks the live International page paints.
 *
 *  The SMB checks endpoint answers this environment with an HTML 404, and the
 *  live bundle ships this catalog in memory instead. `catalog.json` is that
 *  list (48 countries). Package cards stay the CMS's four countries. */
import data from "./catalog.json";

import { localise } from "@/lib/i18n/href";

export type IntlCheck = {
  id: string;
  code: string;
  name: string;
  price: string;
  tat: string;
  details?: string;
};

export type IntlCountry = { code: string; name: string };

export const INTL_COUNTRIES = data.countries as IntlCountry[];
export const INTL_CHECKS = data.checks as Record<string, IntlCheck[]>;

export const CMS_ORDER = ["uk", "uae", "philippines", "egypt"] as const;
export type CmsCountryId = (typeof CMS_ORDER)[number];

const ISO_OF: Record<string, CmsCountryId> = {
  GB: "uk",
  AE: "uae",
  PH: "philippines",
  EG: "egypt",
};

const FLAG_SRC: Record<CmsCountryId, string> = {
  uk: "/img/flags/uk.png",
  uae: "/img/flags/uae.png",
  philippines: "/img/flags/philippines.png",
  egypt: "/img/flags/egypt.png",
};

export type CmsCountryCopy = {
  name: string;
  flagAlt: string;
  checksFlagAlt: string;
};

export type IntlOption = {
  code: string;
  name: string;
  cms: boolean;
  flagSrc?: string;
  flagAlt?: string;
};

export function cmsIdFor(code: string): CmsCountryId | undefined {
  return ISO_OF[code];
}

const ALIAS: Record<string, string> = {
  uk: "GB",
  gb: "GB",
  gbr: "GB",
  "united kingdom": "GB",
  "great britain": "GB",
  uae: "AE",
  ae: "AE",
  are: "AE",
  "united arab emirates": "AE",
  philippines: "PH",
  ph: "PH",
  phl: "PH",
  egypt: "EG",
  eg: "EG",
  egy: "EG",
  us: "US",
  usa: "US",
  "united states": "US",
  "united states of america": "US",
};

/** `?country=` accepts a CMS id (`uk`), an ISO code, or a catalog name. */
export function resolveIntlCode(hint: string): string {
  const key = hint.trim().toLowerCase();
  if (!key) return "";
  const alias = ALIAS[key];
  if (alias && INTL_CHECKS[alias]) return alias;
  const byCode = INTL_COUNTRIES.find((c) => c.code.toLowerCase() === key);
  if (byCode) return byCode.code;
  const byName = INTL_COUNTRIES.find((c) => c.name.toLowerCase() === key);
  return byName?.code ?? "";
}

/** CMS countries keep their localized name and flag alt. The rest use the
 *  catalog's English name and an emoji, and are marked so the audit skips them. */
export function intlOptions(
  countries: Record<CmsCountryId, CmsCountryCopy>,
  kind: "regional" | "checks",
): IntlOption[] {
  return INTL_COUNTRIES.map((c) => {
    const id = ISO_OF[c.code];
    if (!id) return { code: c.code, name: c.name, cms: false };
    const meta = countries[id];
    return {
      code: c.code,
      name: meta.name,
      cms: true,
      flagSrc: FLAG_SRC[id],
      flagAlt: kind === "checks" ? meta.checksFlagAlt : meta.flagAlt,
    };
  });
}

export function enquiryHref(locale: string): string {
  return localise("/contact?tab=enquiry", locale);
}
