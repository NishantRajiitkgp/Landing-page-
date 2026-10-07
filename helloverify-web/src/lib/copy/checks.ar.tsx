/** Arabic checks copy for `app/[locale]/checks/**` — the page SHELL only.
 *
 *  Annotated `: ChecksCopy` — recipe step 1b in `./index`. Not in
 *  the CHECKS registry. Part 9b.6.
 *
 *  Catalogue values (`name`, `group`, `source`, `time`, `countries`,
 *  `answers`, `caveat`, `fields[]`, `usedBy[]`) stay in
 *  `lib/content/checks.ts`. Eight leaves take a node or a string so
 *  grammar can place those values.
 */
import type { ReactNode } from "react";
import type { ChecksCopy } from "./checks";

export const ar: ChecksCopy = {
  crumbs: {
    resources: "الموارد",
    library: "مكتبة الفحوصات",
  },

  closing: {
    heading: (name: ReactNode) => (
      <>
        شغّلوا فحص {name} <em>هذا الأسبوع.</em>
      </>
    ),
    sub: (source: string, time: string) => `مؤكد مع ${source}، عادة خلال ${time}.`,
  },

  hero: {
    kicker: (group: ReactNode) => <>فحص · {group}</>,
    h1: (name: ReactNode) => <>تحقق {name}</>,
    talkToSales: "اتصل بالمبيعات",
  },

  strip: {
    turnaround: (time: ReactNode) => <><b>{time}</b> مدة إنجاز معتادة</>,
    confirmedWith: (source: ReactNode) => <>مؤكد مع <b>{source}</b></>,
    fast: <><span className="dot" /> عادة خلال الساعة</>,
  },

  answer: {
    kicker: "باختصار",
    h2: (name: ReactNode) => (
      <>
        كم يستغرق تحقق {name}؟
      </>
    ),
    lede: (
      name: ReactNode,
      source: ReactNode,
      time: ReactNode,
      countries: ReactNode,
      answers: ReactNode,
    ) => (
      <>
        يُؤكَّد {name} مقابل {source}، بمدة إنجاز معتادة {time}.
        {" "}التغطية: {countries}. {answers}
      </>
    ),
  },

  fields: {
    kicker: "ما الذي يعود",
    h: (name: string) => `ماذا في تقرير ${name}؟`,
    lede: "كل حقل يحمل المصدر الذي أكده وتاريخ التأكيد.",
  },

  caveat: {
    kicker: "ما لا يمكنه أن يخبركم",
    h2: (name: ReactNode) => (
      <>
        ماذا لا يستطيع فحص {name} تأكيده؟
      </>
    ),
    aside: (
      <>
        النتيجة واحدة من ثلاث، وليست درجة أبداً: <em>موثَّق</em> — أكّد المصدر
        ذلك؛ <em>غير موثَّق</em> — لا يوجد مثل هذا السجل لدى المصدر؛ <em>غير قابل للتحقق</em> — تعذر
        الوصول إلى المصدر، ويسمي التقرير المسار الذي جُرِّب.
      </>
    ),
  },

  who: {
    kicker: "من يطلبه",
    h2: "من يحتاج هذا الفحص؟",
  },

  related: {
    kicker: "ذات صلة",
    h2: "أي فحوصات تُطلب عادة معه؟",
    all: "مكتبة الفحوصات كاملة",
  },
};
