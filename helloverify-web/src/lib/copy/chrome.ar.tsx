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
          consumer: "المستهلك",
        },
      },
      products: { label: "المنتجات" },
      premium: {
        label: "الخدمات المميزة",
        title: "الخدمات المميزة",
        lede: "دعم فردي مباشر لتحقق سلس وتقديم الطلبات.",
      },
      support: { label: "الدعم", col: "اتصل بنا" },
    },
    items: {
      govHealth: { t: "الجهات الصحية", d: "التحقق من مؤهلات الرعاية الصحية مباشرة مع الجهات المخولة." },
      govImmigration: { t: "جهات الهجرة", d: "تبسيط الفحص المسبق والتحقق من المتقدمين." },
      govEducation: { t: "المؤهلات التعليمية", d: "التحقق من الشهادات الأكاديمية مباشرة مع الجهات المصدرة." },
      govTrade: { t: "الجهات التجارية والتجارة", d: "توثيق الكيانات والقوى العاملة لمتطلبات الامتثال التنظيمي." },
      forBusiness: { t: "للأعمال", d: "إعداد الموردين والموظفين والفحص والمراقبة المستمرة من البداية للنهاية." },
      forSmb: { t: "للشركات الصغيرة", d: "فحوصات خلفية بسيطة وموثوقة للشركات النامية." },
      employee: { t: "التحقق من الموظفين", d: "تحقق شامل لقوى العاملة المكتبية واليدوية." },
      kyc: { t: "اعرف عميلك (KYC)", d: "التحقق من الهوية بوجه مباشر وفحوصات الحيوية." },
      individuals: { t: "التحقق من الأفراد", d: "تحقق من السائقين وموظفي المنازل والمستأجرين والمربيات فوراً خلال 30 دقيقة" },
      visa: { t: "ابدأ فحص التأشيرة", d: "فحص مسبق لسياحة ودراسة وعمل." },
      global: { t: "التحقق العالمي", d: "استكشف فحوصات التحقق الدولية عبر أكثر من 120 دولة" },
      bgvEnterprise: { t: "التحقق من الخلفية للمؤسسات", d: "تحقق شامل للقوى العاملة الكبيرة والمتنوعة" },
      bgvSmb: { t: "التحقق للشركات الصغيرة والمتوسطة", d: "فحوصات خلفية سريعة وموثوقة للشركات النامية." },
      certifier: { t: "Certifier — التحقق من الموردين", d: "التحقق من الموردين وإعدادهم بعناية وضوابط المخاطر." },
      immigrationDocs: { t: "فحص مسبق لوثائق الهجرة", d: "حلول تحقق لدعم معالجة الهجرة والتأشيرات." },
      hellov: { t: "HelloV — تحقق من أي شخص", d: "تحقق فوري عبر واتساب." },
      trust: { t: "الثقة والسلامة — KYC", d: "التحقق من الهوية والإعداد بفحوصات KYC متقدمة." },
      premHealth: { t: "الأطباء وأسنان وغيرهم من الممارسين الصحيين", d: "خدمات لضمان تقديم دقيق لمؤهلات المهنيين الصحيين المتقدمين للجهات" },
      premImmigration: { t: "فحص مسبق لوثائق الهجرة", d: "دعم مخصص لضمان فحص مسبق دقيق وسلس لوثائق التأشيرة" },
      premConsumer: { t: "التحقق من الموظفين", d: "باقة تحقق متقدمة مع فحوصات خلفية إضافية لمزيد من الثقة والسلامة وراحة البال" },
      enquiry: { t: "استفسار", d: "تواصل معنا للأسعار والشراكة والاستفسارات." },
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
    partner: "كن شريكاً لنا",
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
    },
    certline: "ISO 27001 · GDPR · PBSA · NSR",
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
