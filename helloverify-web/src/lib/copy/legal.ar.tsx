/** Arabic legal shell copy, annotated, not in registry, Part 9b.6.
 *
 *  `export const ar: LegalCopy` — recipe step 1b in `./index`. Not in
 *  `LEGAL_COPY`; `routing.locales` is `["en"]`. Both sides move in Part 9b.7.
 *
 *  Policy body text stays in `lib/content/legal.ts` and is not translated here.
 */
import type { ReactNode } from "react";
import type { LegalCopy } from "./legal";

export const ar: LegalCopy = {
  crumb: "قانوني",
  closing: {
    heading: (
      <>
        أسئلة حول هذا؟ <em>اسألوا شخصاً.</em>
      </>
    ),
    sub: "أسئلة الخصوصية وحماية البيانات والعقود تصل إلى جهة اتصال مسماة.",
  },
  kicker: "قانوني",
  nav: {
    label: "الأقسام",
    heading: "الأقسام",
  },
  doc: {
    effective: (date: ReactNode) => <>ساري · {date}</>,
    pending: {
      title: "بانتظار النص القانوني.",
      counted: (drafted: number, total: number) =>
        `${drafted} من ${total} أقسام تحمل نص الموقع الحالي، ` +
        `منقولاً حرفياً؛ والمتبقي ${total - drafted} غير مسوَّد هنا.`,
      blank:
        "بنية هذه الوثيقة وتنقّلها وطباعتها نهائية؛ النص التشغيلي غير مسوَّد هنا.",
      note:
        "وفق مواصفات البناء، يُنقل النص القانوني حرفياً من الموقع القائم ويُنشر " +
        "فقط بعد مراجعة المستشار — النقل يعيد التكافؤ مع الإنتاج، وليس تلك المراجعة.",
    },
    sectionPending: "[ نص القسم بانتظار المراجعة القانونية ]",
  },
  other: {
    heading: "وثائق قانونية أخرى",
    sections: (count: ReactNode) => <>{count} أقسام</>,
  },
};
