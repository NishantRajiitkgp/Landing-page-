/** Hindi copy for `app/[locale]/countries/**` — the page SHELL of the
 *  programmatic country guide, and nothing else.
 *
 *  Annotated `: CountriesCopy` — recipe step 1b in `./index`. Not in
 *  the COUNTRIES registry. Part 9b.6.
 *
 *  No country name, region, summary, turnaround, office, `watchOut`,
 *  or `notes[]` row. Brand names, acronyms and figures stay Latin.
 */
import type { ReactNode } from "react";
import type { CountriesCopy } from "./countries";

export const hi: CountriesCopy = {
  crumbs: {
    resources: "संसाधन",
    countries: "देश गाइड",
  },

  closing: {
    heading: (name: ReactNode) => (
      <>
        {name} में सत्यापन? <em>बताएँ क्या चाहिए।</em>
      </>
    ),
    sub: "तब भी जब ईमानदार उत्तर में कोई शर्त हो।",
  },

  hero: {
    kicker: (region: ReactNode) => <>देश गाइड · {region}</>,
    h1: (name: ReactNode) => (
      <>
        सत्यापन <em>{name}.</em>
      </>
    ),
    ask: (name: ReactNode) => <>{name} के बारे में पूछें</>,
    allCountries: "सभी 120+ देश",
  },

  strip: {
    sourceConfirmed: (turnaround: ReactNode) => <><b>{turnaround}</b> स्रोत-पुष्ट</>,
    localOffice: (office: ReactNode) => <><b>{office}</b> में स्थानीय कार्यालय</>,
    partnerNetwork: <><b>पार्टनर नेटवर्क</b> से कवर</>,
    checkTypes: (count: ReactNode) => <><b>{count}</b> जाँच प्रकार प्रलेखित</>,
    inCountry: <><span className="dot" /> देश में जाँचे</>,
  },

  table: {
    kicker: "यहाँ क्या चलता है",
    heading: <>जाँचें, समय,<br />और स्थानीय वास्तविकता.</>,
    lede: (name: ReactNode) => (
      <>
        {name} में स्रोत पर पुष्ट जाँचों के संकेतात्मक समय.
      </>
    ),
    cols: {
      check: "जाँच",
      turnaround: "टर्नअराउंड",
      note: "स्थानीय टिप्पणी",
    },
  },

  trap: {
    kicker: "सावधान रहें",
    heading: <>यहाँ लोग<br />किसमें फँसते हैं.</>,
  },

  nearby: {
    kicker: "आस-पास",
    officeIn: (office: string) => `${office} में कार्यालय`,
    partnerNetwork: "पार्टनर नेटवर्क",
    all: "सभी देश गाइड",
  },
};
