/** Arabic MOM applicant flow. Annotated - recipe step 1b. */
import type { MomApplyCopy } from "./momApply";

export const ar: MomApplyCopy = {
  meta: {
    register: "أنشئ حسابك",
    signIn: "تسجيل الدخول",
    apply: "طلبك",
  },
  crumbs: {
    register: "إنشاء حساب",
    signIn: "تسجيل الدخول",
    apply: "الطلب",
  },
  tabs: {
    aria: "الحساب",
    register: "إنشاء حساب",
    signIn: "تسجيل الدخول",
  },
  demo: {
    code: "تجريبي · الرمز {code}",
    account: "حساب تجريبي · {email} · {password}",
  },
  register: {
    title: (
      <>
        ابدأ <em>التحقق</em>
      </>
    ),
    first: "الاسم الأول",
    last: "اسم العائلة",
    namePlaceholder: "كما في جواز السفر",
    email: "البريد الإلكتروني",
    emailPlaceholder: "you@example.com",
    phone: "الجوال",
    phonePlaceholder: "رقم الجوال",
    dial: "رمز الدولة",
    password: "كلمة المرور",
    passwordPlaceholder: "أنشئ كلمة مرور",
    consent: "أوافق على {terms} و{privacy}.",
    terms: "شروط الخدمة",
    privacy: "سياسة الخصوصية",
    submit: "إنشاء الحساب",
  },
  password: {
    show: "إظهار كلمة المرور",
    hide: "إخفاء كلمة المرور",
    rules: {
      length: "8 أحرف أو أكثر",
      letter: "حرف واحد",
      number: "رقم واحد",
    },
  },
  verify: {
    send: "تحقق",
    sentTo: "أُرسل الرمز إلى {to}",
    code: "رمز من 6 أرقام",
    resend: "إعادة الإرسال",
    resendIn: "إعادة الإرسال بعد {s} ث",
    change: "تغيير",
    verified: "تم التحقق",
    checking: "جارٍ التحقق…",
  },
  signIn: {
    title: (
      <>
        مرحبًا <em>بعودتك</em>
      </>
    ),
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    passwordPlaceholder: "كلمة المرور",
    forgot: "نسيت كلمة المرور؟",
    submit: "متابعة",
    codeTitle: (
      <>
        تحقق من <em>بريدك</em>
      </>
    ),
    codeSent: "أدخل الرمز المرسل إلى {to}",
    expiresIn: "ينتهي خلال {t}",
    expired: "انتهت صلاحية هذا الرمز.",
    resend: "إرسال رمز جديد",
    other: "استخدام حساب آخر",
  },
  forgot: {
    title: (
      <>
        إعادة تعيين <em>كلمة المرور</em>
      </>
    ),
    lede: "سنرسل إليك رابطًا لتعيين كلمة مرور جديدة.",
    email: "البريد الإلكتروني",
    submit: "إرسال الرابط",
    sentTitle: (
      <>
        تحقق من <em>بريدك الوارد</em>
      </>
    ),
    sent: "إذا كان لـ {to} حساب، فالرابط في طريقه إليك.",
    back: "العودة إلى تسجيل الدخول",
  },
  aside: {
    k: "طلبك",
    title: (
      <>
        جلسة واحدة، <em>من البداية حتى الإرسال.</em>
      </>
    ),
    now: "الآن",
    steps: [
      { t: "الحساب", m: "دقيقتان" },
      { t: "بياناتك", m: "جواز السفر" },
      { t: "المؤهلات", m: "الشهادات" },
      { t: "الفحوصات", m: "مطابقة تلقائية" },
      { t: "المراجعة والتوقيع", m: "توقيع إلكتروني" },
      { t: "الدفع", m: "SGD" },
    ],
    from: "ابتداءً من",
    unit: "لكل مؤهل + 9% ضريبة السلع والخدمات",
    ready: "جهّز مسبقًا",
    readyItems: ["جواز السفر", "شهادة الدرجة العلمية", "كشوف الدرجات"],
  },
  apply: {
    loading: "جارٍ فتح طلبك…",
    hello: "مرحبًا {name}",
    signOut: "تسجيل الخروج",
    progress: "تقدم الطلب",
    step: "الخطوة {n} من {total}",
  },
  errors: {
    required: "مطلوب.",
    name: "استخدم الأحرف كما في جواز السفر.",
    email: "أدخل بريدًا إلكترونيًا صحيحًا.",
    phone: "أدخل رقم جوال صحيحًا.",
    password: "استوفِ الشروط الثلاثة.",
    consent: "ضع علامة للمتابعة.",
    nameFirst: "أضف الاسم الأول واسم العائلة أولًا.",
    verifyEmail: "تحقق من بريدك الإلكتروني للمتابعة.",
    verifyPhone: "تحقق من رقم جوالك للمتابعة.",
    codeLength: "أدخل الأرقام الستة كلها.",
    invalid_input: "راجع الحقل المحدد.",
    invalid_code: "هذا الرمز غير صحيح.",
    code_expired: "انتهت صلاحية هذا الرمز. أرسل رمزًا جديدًا.",
    unverified: "تحقق من هذا مرة أخرى.",
    duplicate: "يوجد حساب بهذا البريد الإلكتروني بالفعل.",
    duplicateAction: "سجّل الدخول بدلًا من ذلك",
    rate_limited: "محاولات كثيرة. حاول مجددًا بعد {s} ث.",
    wrong_credentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    no_session: "انتهت جلستك. سجّل الدخول مجددًا.",
    not_connected: "هذه الخدمة غير متاحة بعد. حاول لاحقًا.",
    upstream: "حدث خطأ ما. حاول مجددًا.",
  },
};
