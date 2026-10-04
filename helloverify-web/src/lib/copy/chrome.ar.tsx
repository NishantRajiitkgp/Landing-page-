/** Arabic copy for `components/chrome/**`.
 *
 *  Annotated `: ChromeCopy` — recipe step 1b in `./index`. Same shipping
 *  rule as `./chrome.hi.tsx`: the file exists, the registry does not name
 *  it yet. MSA, not a dialect. Brand names, certification marks and
 *  `{open}` stay Latin.
 *
 *  Provenance: old-IA wording from `public/cms/ar/globals.base.json` in the
 *  old repo; new hub labels written here.
 */
import type { ChromeCopy } from "./chrome";

export const ar: ChromeCopy = {
  nav: {
    logoHome: "HelloVerify — الرئيسية",
    primary: "رئيسي",
    primaryMobile: "رئيسي، الجوّال",
    links: {
      "/governments": "الحكومات",
      "/business": "الأعمال",
      "/individuals": "الأفراد",
      "/platform": "المنصة",
      "/resources": "الموارد",
    },
    menus: {
      solutions: {
        label: "الحلول",
        cols: {
          gov: "الجهات الحكومية",
          biz: "المؤسسات والشركات الصغيرة",
          consumer: "خدمة المستهلك",
        },
      },
      products: { label: "المنتجات", all: "استعرض كل الفحوصات الـ 33" },
      premium: {
        label: "الخدمات المميزة",
        lede: "دعم فردي مباشر لتحقق سلس وتقديم الطلبات.",
      },
      support: { label: "الدعم", col: "تواصل معنا" },
    },
    items: {
      govHealth: { t: "الجهات الصحية", d: "التحقق من مؤهلات المهنيين الصحيين من المصدر الأصلي" },
      govImmigration: { t: "جهات الهجرة", d: "فحص مسبق وتحقق مبسَّط لطلبات التأشيرة" },
      govEducation: { t: "جهات القوى العاملة والتعليم", d: "المؤهلات التعليمية موثَّقة من المصدر الأصلي" },
      govTrade: { t: "جهات الأعمال والتجارة", d: "التحقق من الكيانات والمديرين للامتثال التنظيمي" },
      forBusiness: { t: "للأعمال", d: "تحقق من الموظفين والموردين والشركاء، مع مراقبة مستمرة" },
      forSmb: { t: "للشركات الصغيرة", d: "باقات تحقق موثوقة للشركات النامية" },
      employee: { t: "التحقق من الموظفين", d: "للعاملين المكتبيين والميدانيين والعاملين بنظام العمل الحر" },
      kyc: { t: "اعرف عميلك (KYC)", d: "التحقق من الهوية بالتعرّف على الوجه وفحص الحيوية" },
      individuals: { t: "التحقق من الأفراد", d: "السائقون وموظفو المنازل والمستأجرون والمربيات — خلال 30 دقيقة" },
      visa: { t: "ابدأ فحص التأشيرة", d: "فحص مسبق لوثائق تأشيرات السياحة والدراسة والعمل" },
      global: { t: "التحقق العالمي", d: "فحوصات تحقق دولية في أكثر من 120 دولة" },
      bgvEnterprise: { t: "التحقق من الخلفية للمؤسسات", d: "لاحتياجات القوى العاملة الكبيرة والمتنوعة" },
      bgvSmb: { t: "التحقق للشركات الصغيرة والمتوسطة", d: "فحوصات سريعة وموثوقة للشركات النامية" },
      certifier: { t: "Certifier — العناية الواجبة بالموردين", d: "إعداد الموردين بعناية منظمة وفحوصات المخاطر" },
      immigrationDocs: { t: "فحص مسبق لوثائق الهجرة", d: "مصمَّم لدعم معالجة الهجرة والتأشيرات" },
      hellov: { t: "HelloV — تحقَّق من أي شخص", d: "تحقَّق من أي شخص فوراً عبر واتساب" },
      trust: { t: "الثقة والسلامة — KYC", d: "التحقق من الهوية والإعداد بفحوصات KYC متقدمة" },
      premHealth: { t: "الأطباء وأطباء الأسنان والممارسون الصحيون", d: "تقديم دقيق لمؤهلات المهنيين الصحيين المتقدمين للجهات" },
      premImmigration: { t: "فحص مسبق لوثائق الهجرة", d: "دعم شخصي لفحص تأشيرة دقيق وبدون عناء" },
      premConsumer: { t: "خدمة المستهلك", d: "باقة متقدمة بفحوصات إضافية لمزيد من الاطمئنان" },
      enquiry: { t: "استفسار", d: "تحدث إلى فريقنا عن احتياجات التحقق لديك" },
    },
    about: "من نحن",
    technology: "التقنية",
    signUp: "إنشاء حساب",
    account: "الحساب",
    userMenu: {
      myCart: "سلتي",
      myOrders: "طلباتي",
      profileSettings: "إعدادات الملف",
      logout: "تسجيل الخروج",
    },
    cta: "اتصل بالمبيعات",
    openMenu: "فتح القائمة",
    contact: "التواصل والدعم",
  },

  footer: {
    logoHome: "HelloVerify — الرئيسية",
    blurb:
      "التحقق من الخلفية من المصدر الأصلي — للمؤسسات والحكومات والعائلات.",
    social: {
      linkedin: "LinkedIn",
      facebook: "Facebook",
      instagram: "Instagram",
    },
    about: "من نحن",
    contact: "التواصل والدعم",
    cols: {
      governments: "الحكومات",
      business: "الأعمال",
      individuals: "الأفراد",
      platform: "المنصة",
      resources: "الموارد",
    },
    links: {
      "/solutions/health-authorities": "الجهات الصحية",
      "/solutions/immigration-authorities": "جهات الهجرة",
      "/solutions/manpower-and-education-authorities": "القوى العاملة والتعليم",
      "/solutions/trade-authorities": "التجارة والأعمال",
      "/solutions/manpower-and-education-authorities/ministry-of-manpower": "قصة وزارة القوى العاملة",
      "/products/bgv-enterprise": "التحقق للمؤسسات",
      "/products/bgv-smb": "الشركات الصغيرة والمتوسطة",
      "/employee-verification": "التحقق من الموظفين",
      "/products/customer-kyc": "اعرف عميلك · الثقة والسلامة",
      "/products/certifier": "العناية الواجبة بالموردين · Certifier",
      "/products/hellov": "HelloV — تحقَّق من أي شخص",
      "/products/immigration": "فحص التأشيرة والهجرة",
      "/individuals/home-family": "فحوصات المنزل والعائلة",
      "/technology": "التقنية وواجهات API",
      "/platform/security-compliance": "الأمن والامتثال",
      "/international": "تغطية عالمية — أكثر من 120 دولة",
      "/resources/checks": "كل الفحوصات الـ 33",
      "/checks/identity": "الهوية",
      "/checks/employment": "العمل",
      "/checks/education": "التعليم",
      "/checks/criminal": "السجل الجنائي",
      "/checks/global-database": "قاعدة البيانات العالمية",
      "/resources/countries": "أدلة الدول",
      "/resources/glossary": "المعجم",
      "/resources/blog": "المدونة",
    },
    certs: {
      iso: "ISO 27001",
      gdpr: "GDPR",
      pbsa: "PBSA",
      nsr: "NSR",
      mom: "وزارة القوى العاملة، سنغافورة",
    },
    certline: "ISO 27001 · GDPR · PBSA · NSR · وزارة القوى العاملة (SG)",
    copyright: "© 2026 جميع الحقوق محفوظة. Hello Verify India Private Ltd.",
    legal: {
      privacy: "سياسة الخصوصية",
      terms: "شروط الخدمة",
      cookies: "سياسة ملفات الارتباط",
    },
    offices: "الهند · الإمارات · سنغافورة · الفلبين · مصر · الولايات المتحدة",
    v2: {
      sheet: "الورقة 12 / 12",
      end: "موثَّق من المصدر،",
      endEm: "في دقائق.",
      backToTop: "العودة إلى الأعلى",
      backRing: "العودة إلى الأعلى · موثَّق من المصدر ·",
      officesHead: "ستة مكاتب. تفصل بينها اثنتا عشرة ساعة.",
      openNow: "{open} من 6 مكاتب مفتوحة الآن",
      atDesk: "على المكتب الآن",
      closed: "مغلق",
      cities: {
        noida: { city: "نيودلهي", country: "الهند" },
        dubai: { city: "دبي", country: "الإمارات العربية المتحدة" },
        singapore: { city: "سنغافورة", country: "سنغافورة" },
        manila: { city: "مانيلا", country: "الفلبين" },
        cairo: { city: "القاهرة", country: "مصر" },
        newYork: { city: "نيويورك", country: "الولايات المتحدة" },
      },
      seals: {
        iso: "ISO 27001",
        gdpr: "GDPR",
        pbsa: "PBSA",
        nsr: "NSR",
        mom: "وزارة القوى العاملة (SG)",
      },
      markHint: "UV · حرِّك المؤشر فوق العلامة",
      microtext:
        "HELLO VERIFY INDIA PRIVATE LTD · موثَّق من المصدر · أكثر من 20 مليون فحص منذ 2018 · أكثر من 120 دولة · ISO 27001 · GDPR · PBSA · NSR · الهند · الإمارات · سنغافورة · الفلبين · مصر · الولايات المتحدة ·",
    },
  },

  breadcrumb: {
    label: "مسار التنقل",
    home: "الرئيسية",
  },

  closingCta: {
    region: "ابدأ",
    heading: (
      <>
        كل رحلة عظيمة تستحق بداية <em>موثَّقة</em>.
      </>
    ),
    sub: "اتخذ الخطوة الأولى. سنتولى الباقي.",
    cta: "اتصل بالمبيعات",
    plans: "اطّلع على الخطط والأسعار",
  },

  consent: {
    title: "ملفات الارتباط في هذا الموقع",
    body:
      "ملفات الارتباط الضرورية تُبقي الموقع يعمل وهي مفعَّلة دائماً. ملفات التحليلات " +
      "والتسويق تُضبط فقط إذا وافقت — لا يعمل أي شيء غير ضروري قبل أن تختار، ويمكنك " +
      "تغيير رأيك في أي وقت.",
    policy: "سياسة ملفات الارتباط",
    accept: "قبول",
    reject: "رفض",
    reopenRegion: "اختيارك لملفات الارتباط",
    reopen: "تفضيلات ملفات الارتباط",
  },

  faq: {
    kicker: "أسئلة",
  },

  checkTable: {
    check: "الفحص",
    turnaround: "المدة",
    confirmedWith: "مؤكَّد لدى",
  },

  login: {
    ariaLabel: "تسجيل الدخول",
    title: "تسجيل الدخول",
    welcome: "مرحبًا بك في",
    brand: "HelloVerify!",
    mobileLabel: "رقم الجوال",
    mobilePlaceholder: "أدخل 10 أرقام",
    loginViaOtp: "تسجيل الدخول عبر OTP",
    pleaseWait: "يرجى الانتظار…",
    verifyTitle: "أدخل رمز التحقق",
    mockHint:
      "وضع تجريبي: OTP هو 123456. استخدم 9111111111 للتسجيل؛ أي رقم آخر يدخل كمستخدم تجريبي.",
    otpSentTo: "تم إرسال OTP إلى",
    edit: "تعديل",
    resendOtp: "إعادة إرسال OTP",
    verifying: "جارٍ التحقق…",
    verifyOtp: "تحقق من OTP",
    otpInvalid: "OTP غير صالح، يرجى التحقق مرة أخرى",
    registerTitle: "التسجيل",
    nameLabel: "الاسم *",
    emailLabel: "البريد الإلكتروني *",
    mobileNoLabel: "رقم الجوال",
    genderLabel: "الجنس *",
    genderMale: "ذكر",
    genderFemale: "أنثى",
    genderOther: "آخر",
    saving: "جارٍ الحفظ…",
    registerNow: "سجّل الآن",
    success: "تم تسجيل الدخول بنجاح!",
    accountCreatedSuccess: "تم إنشاء حسابك بنجاح!",
    close: "إغلاق",
    errors: {
      mobileDigits: "يجب أن يكون رقم الجوال 10 أرقام",
      otpDigits: "يجب أن يكون OTP 6 أرقام",
      nameInvalid: "يجب أن يكون الاسم 3 أحرف على الأقل ويحتوي على أحرف ومسافات فقط",
      requiredFields: "يرجى إكمال جميع الحقول المطلوبة",
      sendOtp: "خطأ في إرسال OTP",
      saveProfile: "فشل حفظ الملف الشخصي",
    },
  },
};
