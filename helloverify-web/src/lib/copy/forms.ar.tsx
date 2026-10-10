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
    "white-collar": "تحقق الوظائف المكتبية",
    "blue-collar": "تحقق الوظائف الميدانية",
    international: "الفحص الدولي والقدرة",
    "vendor-due-diligence": "العناية الواجبة بالمورّدين",
    partnership: "شراكة (طلب عرض توضيحي)",
    "immigration-authority": "هيئة الهجرة",
    "healthcare-authority": "هيئة الرعاية الصحية",
    "education-authority": "هيئة التعليم",
    "business-trade-authority": "هيئة الأعمال والتجارة",
    nanny: "التحقق من المربية",
    driver: "التحقق من السائق",
    "home-staff": "العمالة المنزلية",
    tenant: "التحقق من المستأجر",
    "other-verification": "تحقق آخر",
  },

  forWhom: {
    label: "لمن هذا الطلب",
    self: "لنفسي",
    other: "لشخص آخر",
    promptSelf: "لأي جهة هذا الطلب، وما الذي يلزم التحقق منه؟",
  },
  selectedCount: "{n} محددة",

  fields: {
    name: { label: "الاسم الكامل", placeholder: "Priya Menon" },
    mobile: { label: "الجوال", placeholder: "9876543210" },
    countryCode: "رمز الدولة",
  },

  checks: {
    nameMissing: "أدخلوا الاسم الكامل.",
    nameInvalid: "استخدموا حروفاً في الاسم.",
    emailMissing: "أدخلوا عنوان البريد.",
    emailInvalid: "أدخلوا بريداً يمكننا الرد عليه.",
    phoneMissing: "أدخلوا رقم الجوال.",
    phoneInvalid: "استخدموا أرقاماً فقط، بحد أقصى 15.",
    countryMissing: "اختاروا رمز الدولة.",
    companyInvalid: "استخدموا حروفاً وأرقاماً في اسم الجهة.",
  },

  audiences: {
    business: {
      company: { label: "الشركة", placeholder: "اسم الشركة" },
      email: { label: "البريد المهني", placeholder: "name@company.com" },
      interestPlaceholder: "اختاروا نوع الخدمة",
      prompt: "كم فحصاً في الشهر، وأين؟",
    },
    government: {
      company: { label: "الوزارة أو الجهة", placeholder: "وزارة أو دائرة أو هيئة" },
      email: { label: "البريد الرسمي", placeholder: "name@department.gov" },
      interestPlaceholder: "اختاروا نوع الخدمة",
      prompt: "لأي برنامج، ونحو كم متقدّماً في السنة؟",
    },
    individual: {
      email: { label: "البريد", placeholder: "you@example.com" },
      interestPlaceholder: "اختاروا نوع الخدمة",
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
