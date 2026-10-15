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
    name: "Helloverify",
    verified: "نشاط تجاري موثَّق",
    clock: "12:17",
    today: "اليوم",
    message: "رسالة",
    hello: { text: "HelloV", ts: "12:17 PM" },
    menu: {
      welcome: "مرحباً بك في Helloverify.",
      brand: "Helloverify",
      pick: "يرجى اختيار وكتابة 1 أو 2 أو 3 أو 4 أو 5 أو 6 أو 7 أو 8 أو 9 من الخيارات التالية:",
      price: "السعر",
      items: {
        nanny: { t: "التحقق من المربية", amount: "₹1499", p: "اطمئن إلى أن طفلك في أيدٍ أمينة." },
        driver: { t: "التحقق من السائق", amount: "₹1499", p: "اجعل تنقلات عائلتك اليومية أكثر أماناً." },
        help: { t: "التحقق من العمالة المنزلية/حارس الأمن", amount: "₹1499", p: "ابنِ بيئة أكثر أماناً لعائلتك." },
        anyone: { t: "التحقق من أي شخص", amount: "₹1499", p: "اعرف المستأجر أو المدرّس أو مقدّم الرعاية أو أي شخص آخر." },
        identity: { t: "اعرف الهوية", amount: "₹849", p: "احمِ نفسك من احتيال الهوية عبر الإنترنت." },
        date: { t: "تحقّق من شريك المواعدة", amount: "₹849", p: "احمِ نفسك من المحتالين والحسابات المزيّفة على الإنترنت. تحقّق من شريكك." },
        cyber: { t: "وثّق هويتك الرقمية", amount: "₹1499", p: "أثبت هويتك في المعاملات عبر الإنترنت وأظهر مصداقيتك" },
      },
      more: "اقرأ المزيد",
      ts: "12:17 PM",
    },
    choice: { text: "1", ts: "12:18 PM" },
    pay: {
      title: "طلب دفع بقيمة INR 1499.00",
      sub: "انقر على هذا الرابط للدفع",
      host: "rzp.io",
      thanks: "شكراً لاختيارك التحقق من المربية - التحقق من الهوية والسجل الجنائي.",
      service: "التحقق من المربية - التحقق من الهوية والسجل الجنائي.",
      click: "يرجى النقر على الرابط أدناه لإتمام الدفع.",
      link: "https://rzp.io/rzp/Qd2jl3a",
      noteK: "ملاحظة:",
      note: "الرابط صالح لمدة 30 دقيقة فقط.",
      noteBold: "30 دقيقة",
      ts: "12:18 PM",
    },
  },
};
