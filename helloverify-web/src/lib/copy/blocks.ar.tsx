/** Arabic blocks copy, annotated, not in registry, Part 9b.6.
 *
 *  `export const ar: BlocksCopy` — recipe step 1b in `./index`. Not in
 *  `BLOCKS`; `routing.locales` is `["en"]`. Both sides move in Part 9b.7.
 *
 *  Specimen names, plates and timestamps stay Latin.
 */
import type { BlocksCopy } from "./blocks";

export const ar: BlocksCopy = {
  helloVPhone: {
    name: "HelloV",
    status: "متصل · WhatsApp",
    licence: { title: "رخصة القيادة", region: "IND" },
    msgs: {
      m1: { text: "مرحباً Priya — من نتحقق منه اليوم؟", ts: "09:12" },
      m2: { text: "سائق لتوصيل الأطفال إلى المدرسة. Advanced من فضلك.", ts: "09:13" },
      m3: { text: "أرسل صورة رخصة قيادته، الوجه والظهر.", ts: "09:13" },
      m4: { ts: "09:15" },
      m5: {
        lead: "قُرئت في 1.2 ث ·",
        plate: "MH12 •••• 3391",
        tail: "، صالحة حتى 2031. نتحقق الآن مع RTO بونا والمحاكم.",
        ts: "09:15",
      },
      m6: { ts: "09:42" },
    },
    report: {
      verdict: "موثَّق",
      elapsed: "27 د",
      rows: {
        licence: "رخصة القيادة · صالحة",
        criminal: "السجل الجنائي · لا شيء",
        address: "العنوان الحالي · مؤكَّد",
      },
      file: "تقرير PDF · صفحتان",
    },
  },
};
