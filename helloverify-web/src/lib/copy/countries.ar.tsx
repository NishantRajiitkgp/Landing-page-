/** Arabic copy for `app/[locale]/countries/**` — the page SHELL of the
 *  programmatic country guide, and nothing else.
 *
 *  Annotated `: CountriesCopy` — recipe step 1b in `./index`. Not in
 *  the COUNTRIES registry. Part 9b.6.
 *
 *  MSA. No country name, region, summary, turnaround, office, `watchOut`,
 *  or `notes[]` row. Brand names, acronyms and figures stay Latin.
 */
import type { ReactNode } from "react";
import type { CountriesCopy } from "./countries";

export const ar: CountriesCopy = {
  crumbs: {
    resources: "الموارد",
    countries: "أدلة الدول",
  },

  closing: {
    heading: (name: ReactNode) => (
      <>
        التحقق في {name}؟ <em>أخبرونا بما تحتاجون.</em>
      </>
    ),
    sub: "بما في ذلك حين تتضمّن الإجابة الصادقة تحفّظاً.",
  },

  hero: {
    kicker: (region: ReactNode) => <>دليل الدولة · {region}</>,
    h1: (name: ReactNode) => (
      <>
        التحقق في <em>{name}.</em>
      </>
    ),
    ask: (name: ReactNode) => <>اسألوا عن {name}</>,
    allCountries: "كل 120+ دولة",
  },

  strip: {
    sourceConfirmed: (turnaround: ReactNode) => <><b>{turnaround}</b> مؤكَّد من المصدر</>,
    localOffice: (office: ReactNode) => <>مكتب محلي في <b>{office}</b></>,
    partnerNetwork: <>مغطّى ب<b>شبكة شركاء</b></>,
    checkTypes: (count: ReactNode) => <><b>{count}</b> نوع فحص موثَّق</>,
    inCountry: <><span className="dot" /> فُحص داخل البلد</>,
  },

  table: {
    kicker: "ما يُجرى هنا",
    heading: <>الفحوصات، والأوقات،<br />والواقع المحلي.</>,
    lede: (name: ReactNode) => (
      <>
        أوقات إرشادية للفحوصات المؤكَّدة لدى مصدرها في {name}.
      </>
    ),
    cols: {
      check: "الفحص",
      turnaround: "زمن الإنجاز",
      note: "ملاحظة محلية",
    },
  },

  trap: {
    kicker: "احذروا",
    heading: <>ما يُعثِر<br />الناس هنا.</>,
  },

  nearby: {
    kicker: "بالقرب",
    officeIn: (office: string) => `مكتب في ${office}`,
    partnerNetwork: "شبكة شركاء",
    all: "كل أدلة الدول",
  },
};
