/** Arabic Italy visa partner programme. */
import type { ItalyPartnerCopy } from "./italyPartner";

export const ar: ItalyPartnerCopy = {
  meta: {
    join: "انضم كشريك",
    signIn: "دخول الشريك",
    home: "حساب الشريك",
  },
  crumbs: {
    italy: "سفارة إيطاليا",
    join: "انضم",
    signIn: "دخول",
    home: "الشريك",
  },
  tabs: {
    aria: "الحساب",
    join: "انضم",
    signIn: "دخول",
  },
  demo: {
    code: "تجريبي · الرمز {code}",
    account: "حساب تجريبي · {email} · {password}",
  },
  join: {
    title: (
      <>
        انضم كـ<em>شريك</em>
      </>
    ),
    first: "الاسم الأول",
    last: "اسم العائلة",
    namePlaceholder: "اسمك",
    email: "البريد المهني",
    emailPlaceholder: "you@agency.com",
    phone: "الجوال",
    phonePlaceholder: "رقم الجوال",
    dial: "رمز الدولة",
    password: "كلمة المرور",
    passwordPlaceholder: "أنشئ كلمة مرور",
    consent: "أوافق على {terms} و{privacy}.",
    terms: "شروط الخدمة",
    privacy: "سياسة الخصوصية",
    submit: "إنشاء الحساب",
    call: "أو اتصل",
    phoneDisplay: "+91 9289 6276 22",
    tel: "+919289627622",
  },
  password: {
    show: "إظهار كلمة المرور",
    hide: "إخفاء كلمة المرور",
    rules: {
      length: "8 أحرف فأكثر",
      letter: "حرف",
      number: "رقم",
    },
  },
  verify: {
    send: "تأكيد",
    sentTo: "أُرسل الرمز إلى {to}",
    code: "رمز من 6 أرقام",
    resend: "إعادة الإرسال",
    resendIn: "إعادة الإرسال خلال {s} ث",
    change: "تغيير",
    verified: "تم التأكيد",
    checking: "جارٍ التحقق…",
  },
  signIn: {
    title: (
      <>
        أهلًا <em>بعودتك</em>
      </>
    ),
    email: "البريد المهني",
    password: "كلمة المرور",
    passwordPlaceholder: "كلمة مرورك",
    forgot: "نسيت كلمة المرور؟",
    submit: "متابعة",
    codeTitle: (
      <>
        راجع <em>بريدك</em>
      </>
    ),
    codeSent: "أدخل الرمز المُرسل إلى {to}",
    expiresIn: "ينتهي خلال {t}",
    expired: "انتهت صلاحية هذا الرمز.",
    resend: "إرسال رمز جديد",
    other: "استخدام حساب آخر",
  },
  forgot: {
    title: (
      <>
        أعد تعيين <em>كلمة المرور</em>
      </>
    ),
    lede: "سنرسل رابطًا لتعيين كلمة جديدة.",
    submit: "إرسال الرابط",
    sentTitle: (
      <>
        راجع <em>صندوق الوارد</em>
      </>
    ),
    sent: "إذا كان لـ {to} حساب، فالرابط في الطريق.",
    back: "العودة إلى الدخول",
  },
  aside: {
    k: "تأشيرة إيطاليا · الشركاء",
    title: (
      <>
        عملاؤك، <em>يُتحقَّق منهم أولًا.</em>
      </>
    ),
    now: "الآن",
    steps: [
      { t: "الحساب", m: "دقيقتان" },
      { t: "الوكالة", m: "مكتبك" },
      { t: "المستندات", m: "PAN، البنك" },
      { t: "الاتفاق", m: "التوقيع" },
      { t: "الانطلاق", m: "رمز الوكيل" },
    ],
    ready: "جهّز معك",
    readyItems: ["PAN", "إثبات العنوان", "إثبات البنك", "GST، إن وُجد"],
  },
  home: {
    loading: "جارٍ فتح حسابك…",
    hello: "مرحبًا {name}",
    signOut: "تسجيل الخروج",
    progress: "التسجيل",
    step: "الخطوة {n} من {total}",
  },
  agency: {
    title: (
      <>
        <em>وكالتك</em>
      </>
    ),
    lede: "كيف تقدّمون تأشيرات إيطاليا الوطنية.",
    name: "اسم الوكالة",
    namePlaceholder: "Sunrise Travels",
    city: "المدينة",
    cityPlaceholder: "نيودلهي",
    volume: "عملاء تأشيرة إيطاليا الوطنية شهريًا",
    volumes: [
      { id: "under10", t: "أقل من 10" },
      { id: "10-25", t: "10–25" },
      { id: "26-75", t: "26–75" },
      { id: "76+", t: "76+" },
    ],
    save: "حفظ",
    saved: "تم الحفظ",
  },
  nav: {
    back: "رجوع",
    next: "متابعة",
  },
  docs: {
    title: (
      <>
        <em>مستنداتك</em>
      </>
    ),
    lede: "صورة واضحة أو مسح ضوئي.",
    pan: "PAN",
    address: "إثبات العنوان",
    bank: "إثبات البنك",
    gst: "شهادة GST",
    optional: "اختياري",
    hints: {
      pan: "PAN الخاص بالوكالة",
      address: "فاتورة أو عقد إيجار",
      bank: "شيك ملغى أو كشف حساب",
      gst: "فقط إذا كانت الوكالة مسجّلة",
    },
    rule: "PDF أو JPG أو PNG · حتى {mb} ميغابايت",
    choose: "رفع",
    replace: "استبدال",
    remove: "إزالة {name}",
    cancel: "إلغاء",
    uploading: "جارٍ الرفع · {p}%",
    drop: "أفلت للرفع",
    hold: "لدينا. حتى يومَي عمل.",
    tooLarge: "أكبر من {mb} ميغابايت.",
    badType: "استخدم PDF أو JPG أو PNG.",
    missing: "ارفع هذا المستند.",
  },
  agree: {
    title: (
      <>
        <em>الاتفاق</em>
      </>
    ),
    lede: "وقّع واختم، ثم ارفع الصورة.",
    download: "تنزيل",
    upload: "الاتفاق الموقّع",
    hint: "الموقّع المفوّض، مع الختم",
    missing: "ارفع الاتفاق الموقّع.",
    received: "تم الاستلام.",
    pending: "لدينا. حتى يومَي عمل.",
    letter: {
      k: "اتفاق الشريك",
      parties: "{agency}، {city}",
      with: "وHelloVerify India Private Limited",
      lines: [
        "التحقق من مستندات طالبي التأشيرة الوطنية الإيطالية في اختصاص شمال الهند.",
        "أنتم ترشدون العميل. نحن نجري الفحوص ونصدر المرجع.",
        "يدفع العميل الرسم إلى HelloVerify.",
        "تُدفع العمولة عن كل ملف مكتمل، بسعر وكالتكم.",
        "لا نقدّم التأشيرة ولا نقرر نتيجتها.",
      ],
      sign: "الموقّع المفوّض",
      stamp: "ختم الوكالة",
    },
  },
  live: {
    title: (
      <>
        <em>الانطلاق</em>
      </>
    ),
    lede: "ضعوه على كل ملف إيطالي.",
    who: "{agency}، {city}",
    code: "رمز الوكيل",
    copy: "نسخ",
    copied: "تم النسخ",
  },
  errors: {
    required: "مطلوب.",
    name: "استخدم حروفًا.",
    email: "أدخل بريدًا صالحًا.",
    phone: "أدخل رقم جوال صالحًا.",
    password: "استوفِ القواعد الثلاث.",
    consent: "ضع العلامة للمتابعة.",
    nameFirst: "أضف الاسم الأول واسم العائلة أولًا.",
    verifyEmail: "أكّد بريدك للمتابعة.",
    verifyPhone: "أكّد جوالك للمتابعة.",
    codeLength: "أدخل الأرقام الستة.",
    place: "استخدم حروفًا.",
    invalid_input: "راجع الحقل المميّز.",
    invalid_code: "هذا الرمز غير صحيح.",
    code_expired: "انتهت صلاحية الرمز. أرسل رمزًا جديدًا.",
    unverified: "أكّد هذا مرة أخرى.",
    duplicate: "لهذا البريد حساب بالفعل.",
    duplicateAction: "ادخل بدلًا من ذلك",
    rate_limited: "محاولات كثيرة. أعد المحاولة خلال {s} ث.",
    wrong_credentials: "البريد أو كلمة المرور غير صحيحة.",
    no_session: "انتهت جلستك. ادخل مرة أخرى.",
    not_connected: "هذا غير متاح بعد. حاول لاحقًا.",
    upstream: "حدث خطأ. حاول مرة أخرى.",
  },
};
