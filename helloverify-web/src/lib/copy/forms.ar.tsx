/** Arabic form copy, annotated. UI only — Zoho still receives the English
 *  labels in `lib/leads/constraints.ts`. */
import type { FormsCopy } from "./forms";

export const ar: FormsCopy = {
  kicker: "تحدّثوا إلى المبيعات",
  who: "من يسأل",
  interest: "الخدمات المطلوبة",
  message: "الرسالة",
  submit: "إرسال",
  sending: "جارٍ الإرسال…",

  segments: {
    business: "أعمال",
    government: "حكومة",
    individual: "فرد",
  },

  interests: {
    enterprise: "التحقق المؤسسي من الخلفية",
    smb: "باقات SMB",
    "employee-verification": "تحقق الموظفين",
    "customer-kyc": "KYC العملاء / الثقة والسلامة",
    certifier: "العناية الواجبة بالمورّدين (Certifier)",
    governments: "برنامج حكومي / سلطة",
    hellov: "فرد / HelloV",
  },

  fields: {
    name: { label: "الاسم الكامل", placeholder: "Priya Menon" },
    mobile: { label: "الجوال", placeholder: "+91" },
  },

  audiences: {
    business: {
      company: { label: "الشركة", placeholder: "اسم الشركة" },
      email: { label: "البريد المهني", placeholder: "name@company.com" },
      interestPlaceholder: "تحقق الموظفين، KYC، Certifier، الأفراد…",
      prompt: "كم فحصاً في الشهر، وأين؟",
    },
    government: {
      company: { label: "الوزارة أو الجهة", placeholder: "وزارة أو دائرة أو هيئة" },
      email: { label: "البريد الرسمي", placeholder: "name@department.gov" },
      interestPlaceholder: "برنامج حكومي / سلطة",
      prompt: "لأي برنامج، ونحو كم متقدّماً في السنة؟",
    },
    individual: {
      email: { label: "البريد", placeholder: "you@example.com" },
      interestPlaceholder: "فرد / HelloV",
      prompt: "من تريدون تحققه — مستأجر، مربية، سائق؟",
    },
  },

  consent: {
    lead: "بإرسال النموذج، توافقون على معالجة HelloVerify لبياناتكم لتوليد العملاء والتواصل ذي الصلة، وفق",
    policy: "سياسة الخصوصية",
    end: ". لن نشارك علامتكم أبداً.",
  },

  success: {
    lead: "في الأثناء، تسرد",
    pack: "حزمة الامتثال",
    mid: "ما يمكننا إرساله قبل المكالمة، وتغطي",
    library: "مكتبة الفحوصات",
    end: "مدد الإنجاز لكل فحص.",
  },

  status: {
    invalid: "راجعوا الحقول المظلَّلة وأرسلوا مجدداً.",
    ok: "شكراً — وصل استفساركم. سيردّ من يُجري الفحوصات فعلاً، عادة خلال يوم عمل.",
    disposable:
      "يبدو هذا بريداً مؤقتاً. استخدموا عنواناً تصلكم عليه الردود — سنرسل جواباً حقيقياً لا حملة تنقيط.",
    undeliverable:
      "لا نجد خادم بريد لهذا النطاق، فسيرتدّ الرد. راجعوا إملاء العنوان.",
    suspicious: (fallbackEmail: string) =>
      `تعذّر قبول هذا الإرسال. راسلوا ${fallbackEmail} وسيتولّاه شخص من هناك.`,
    rateLimited: (retryAfterSeconds: number, fallbackEmail: string) => {
      const minutes = Math.ceil(retryAfterSeconds / 60);
      const wait = minutes <= 1 ? "دقيقة" : `${minutes} دقائق`;
      return `هذا عدّة إرسالات من هنا. انتظروا ${wait} ثم أعيدوا المحاولة، أو راسلوا ${fallbackEmail} إن كان الأمر عاجلاً.`;
    },
    degraded: (fallbackEmail: string) =>
      `وصلت بياناتكم، لكن تعذّر حفظها تلقائياً. احتفظنا بنسخة — لضمان وصولها إلى شخص، راسلوا ${fallbackEmail}.`,
  },
};
