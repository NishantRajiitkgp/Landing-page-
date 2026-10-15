/** Arabic individuals copy for `app/[locale]/individuals/**`.
 *
 *  Annotated `: IndividualsCopy` — recipe step 1b in `./index`. Not in
 *  the INDIVIDUALS registry. Part 9b.5.
 *
 *  MSA, consumer/family tone. Brand names, figures, prices and `{coverage}` stay Latin.
 */
import type { IndividualsCopy } from "./individuals";

export const ar: IndividualsCopy = {
  crumb: "الأفراد",

  hub: {
    closing: {
      heading: (
        <>
          الثقة جميلة. <em>والدليل أفضل.</em>
        </>
      ),
      sub: "صورة واحدة، وثلاثون دقيقة، وتعرف.",
      ctaLabel: "ابدأ فحصاً",
    },
    hero: {
      k: "للأفراد & العائلات",
      h1: (
        <>
          تحقَّق من أي شخص. <em>من هاتفك.</em>
        </>
      ),
      sub:
        "التحقق نفسه الذي تعتمد عليه الوزارات، للأشخاص في حياتك. أرسل صورة " +
        "الوثيقة عبر WhatsApp، فيعود التقرير إلى المحادثة نفسها — غالباً خلال نصف ساعة.",
      cta: "ابدأ فحصاً",
      plans: "اطّلع على الخطط & الأسعار",
    },
    strip: {
      thirtyMin: <><b>30 دقيقة</b> لمعظم الفحوصات</>,
      noApp: <><b>بلا</b> تطبيق للتثبيت</>,
      since2018: <><b>20M+</b> فحصاً منذ 2018</>,
      consent: <><span className="dot" /> الموافقة أولاً، دائماً</>,
    },
    paths: {
      hellov: {
        tag: "HelloV",
        from: "30 دقيقة",
        h: "تحقَّق من أي شخص",
        p: "سائق، أو عاملة منزل، أو مستأجر، أو موعد. أرسل صورة الوثيقة عبر WhatsApp — فيعود التقرير إلى المحادثة نفسها.",
      },
      immigration: {
        tag: "التأشيرة & الهجرة",
        from: "قبل أن تقدّم",
        h: "افحص أوراقك بنفسك",
        p: "اكتشف المشكلة في وثائقك قبل أن تكتشفها السفارة — وقبل أن تُدفَع رسوم الطلب.",
      },
      homeFamily: {
        tag: "المنزل & العائلة",
        from: "30 دقيقة",
        h: "من يعيش في بيتك",
        p: "المربيات، والسائقون، والطبّاخون، ومقدّمو الرعاية، والمعلّمون. من تأتمنهم على أطفالك ومفاتيحك.",
      },
      tenants: {
        tag: "المستأجرون & الصفقات",
        from: "30 دقيقة",
        h: "قبل أن تسلّم المفاتيح",
        p: "مستأجر، أو مشترٍ، أو شريك عمل — تُفحص الهوية والسجل قبل أن ينتقل المال أو العقار.",
      },
    },
    whatPeopleCheck: {
      k: "ما الذي يفحصه الناس",
      h: "على من يمكنني إجراء فحص خلفية؟",
      lede:
        "تفحص HelloVerify أي شخص أنت على وشك ائتمانه: سائق لتوصيل المدرسة، أو " +
        "مربية، أو مستأجر، أو مشترٍ، أو شريك عمل — أو وثائقك أنت قبل مقابلة " +
        "تأشيرة. معظم الفحوصات تعود خلال نحو 30 دقيقة، عبر WhatsApp.",
    },
    howItWorks: {
      k: "كيف يعمل",
      h: "كيف أُجري فحص خلفية من هاتفي؟",
      lede:
        "تراسل HelloV على WhatsApp وتصوّر وثيقة الشخص؛ ويعطي موافقته على " +
        "هاتفه هو. ثم تسأل HelloVerify هيئة النقل أو المحكمة أو السجل الذي " +
        "أصدرها، ويعود التقرير بلغة واضحة إلى المحادثة نفسها — بلا تطبيق، وبلا حساب.",
    },
    steps: {
      you: {
        n: "01 · أنت",
        t: "أرسل صورة",
        p: "راسل HelloV على WhatsApp وصوّر وثيقة الشخص. ويعطي موافقته على هاتفه هو.",
      },
      us: {
        n: "02 · نحن",
        t: "نفحص المصدر",
        p: "ليست قاعدة بيانات من نسخ — هيئة النقل، أو المحكمة، أو السجل الذي أصدرها.",
      },
      chat: {
        n: "03 · المحادثة",
        t: "التقرير",
        p: "نتيجة بلغة واضحة مع تسمية المصدر، في المحادثة نفسها.",
      },
    },
    consent: {
      k: "مسؤوليتك، ومسؤوليتنا",
      h: "هل يمكنني فحص شخص دون إخباره؟",
      lede:
        "لا. كل فحص من HelloVerify يحتاج موافقة الشخص المراد التحقق منه، تُعطى على " +
        "هاتفه هو قبل أن يبدأ أي شيء — في كل مرة. لا يمكنك فحص أحد من خلف ظهره، " +
        "وHelloVerify لن تساعدك على المحاولة.",
    },
    certs: {
      consent: {
        alt: "GDPR",
        h: "يوافقون، ثم نفحص",
        p: "يرى الشخص ما يُتحقَّق منه ويوافق عليه قبل أن يبدأ أي شيء.",
      },
      retention: {
        alt: "ISO 27001",
        h: "تُحذف الوثائق وفق جدول",
        p: "تخزين حاصل على شهادة ISO 27001، مشفَّر، وحدود احتفاظ — لا تُحفَظ إلى الأبد.",
      },
    },
  },

  /** `/products/hellov` — the old `hellov.base.json`, word for word, in its
   *  order: hero, intro, the Packages / Single Checks tabs (the AI Travel tab
   *  was switched off, `showAi: false`), the Advanced Package cards.
   *  `checksInclude` is the old `common.checksInclude` label; `stepLabel`,
   *  `banner` and `mins` were hard-coded English in the old components and
   *  stay English in every locale, as the old page showed them. `pager` is
   *  the old pager's aria labels. */
  hellov: {
    crumb: "HelloV",
    hero: {
      h1: (<>تأكد من أنك وعائلتك <em>بأمان!</em></>),
      sub: "التحقق أصبح سهلًا على WhatsApp بواسطة HelloVerify.",
      cta: "تحدث إلى المبيعات",
    },
    intro: "من المربيات وطاقم المنزل إلى السائقين والمستأجرين — تحققنا رقمي 100% وسريع ودقيق. لأن كل من في منزلك يستحق أن يتم التحقق منه بدقة.",
    tabs: { packages: "الباقات", single: "فحوصات صغيرة" },
    packages: {
      h: "الباقات",
      sub: "العملية سهلة جدًا ويمكنك القيام بها بنفسك",
      stepLabel: "STEP",
      steps: {
        scan: { t: "امسح رمز QR", p: "بكاميرا WhatsApp" },
        select: { t: "اختر", p: "من تريد التحقق منه" },
        photo: { t: "أرسل صورة", p: "للوثيقة" },
      },
      checksInclude: "الفحوصات المشمولة",
      buy: "اشترِ الآن",
      items: {
        driver: {
          t: "التحقق من السائق",
          p: "تحقق سريع من رخصة القيادة والهوية لتأكيد الأصالة والأهلية، لمساعدتك على اتخاذ قرارات أكثر أمانًا وثقة عبر فحص رقمي سريع وآمن وسهل الاستخدام.",
          pills: ["Driving License Check", "Address Check"],
        },
        homeStaff: {
          t: "طاقم المنزل",
          p: "تحقق من العمالة المنزلية وموظفي الأمن قبل التوظيف. ابنِ بيئة أكثر أمانًا لعائلتك عبر فحوصات رقمية موثوقة يمكنك الاعتماد عليها بسرعة.",
          pills: ["Criminal Check", "Identity Check"],
        },
        tenant: {
          t: "التحقق من المستأجر",
          p: "قبل اتخاذ القرار، اعرف من تسمح له بالدخول. تحقق من المستأجر أو المدرس أو مقدم الرعاية أو أي شخص آخر بهوية واضحة وموقع موثوق.",
          pills: ["Identity Check", "Address Check"],
        },
        nanny: {
          t: "التحقق من المربية",
          p: "تأكد أن طفلك في أيدٍ أمينة. تحقق من المربيات ومقدمي الرعاية عبر فحوصات تعكس حجم الثقة التي تمنحها لشخص ما.",
          pills: ["Criminal Check", "Identity Check"],
        },
        verifyAnyone: {
          t: "التحقق من أي شخص",
          p: "قبل اتخاذ قرارك، تحقق من أي شخص تحتاج إلى الوثوق به. أكد الهوية والسجل الجنائي عبر فحوصات رقمية سريعة وآمنة يمكنك الاعتماد عليها.",
          pills: ["Identity Check", "Criminal Check"],
        },
        cyberIdentity: {
          t: "التحقق من الهوية السيبرانية",
          p: "احمِ نفسك من الاحتيال وانتحال الهوية عبر الإنترنت. تحقق من الهوية السيبرانية بفحوصات سريعة وآمنة تساعدك على الثقة بالتفاعلات الرقمية.",
          pills: ["Identity Check", "Criminal Check"],
        },
        knowIdentity: {
          t: "تعرّف على الهوية",
          p: "احمِ نفسك من الاحتيال على الهوية عبر الإنترنت. تحقق من المستندات وقواعد البيانات بفحوصات سريعة ودقيقة تؤكد هوية الشخص الحقيقية.",
          pills: ["Identity Check"],
        },
        knowContact: {
          t: "تعرّف على جهة الاتصال",
          p: "قبل أن تثق بجهة اتصال جديدة، اعرف من تتعامل معه. تحقق من الصورة والهوية والسجل عبر فحوصات سريعة وموثوقة يمكنك التصرف بناءً عليها بسرعة.",
          pills: ["Identity Check", "Criminal Check"],
        },
      },
      promo: {
        brand: "HelloV",
        tagline: "تحقق من أي شخص فورًا على WhatsApp",
        qrAlt: "امسح لفتح HelloV على WhatsApp",
        caption: "التحقق أصبح سهلًا على WhatsApp بواسطة HelloVerify.",
        cta: "ابدأ التحقق",
      },
    },
    singles: {
      intro: "جرّب فحوصاتنا الفردية لاحتياجاتك الشخصية. احصل على تقرير مُتحقق منه وفق فحص الخلفية الذي تختاره.",
      banner: "Verification in just",
      mins: "mins",
      buy: "Buy Now",
      cards: {
        age: {
          t: "Age Verification",
          p: "Establishes candidate's age by verifying government-issued documents containing date of birth.",
          imgAlt: "Age verification: confirming eligibility and preventing misuse with a digital check",
        },
        employment: {
          t: "Digital Employment Check",
          p: "Verifies applicant's previous employer name, dates of joining and relieving instantly",
          imgAlt: "Digital employment check: verifying applicant date of joining and relieving",
        },
        licence: {
          t: "Driving License Check",
          p: "Verifies driver name, license number and validity of license instantly",
          imgAlt: "Driving licence check: detecting invalid licences before onboarding drivers",
        },
        pan: {
          t: "Pan Card Check",
          p: "Authenticate PAN card information to confirm identity and prevent fraud",
          imgAlt: "PAN card check: authenticating PAN details to confirm identity and prevent fraud",
        },
        criminal: {
          t: "Criminal Record Check",
          p: "Checks court records for any cases against the candidate",
          imgAlt: "Criminal record check: reviewing court records for cases against a candidate",
        },
        address: {
          t: "Digital Address Check",
          p: "Verifies address digitally through documents & live geo location",
          imgAlt: "Digital location check: verifying addresses for accurate and trustworthy location details",
        },
      },
      pager: { prev: "الفحوصات الفردية السابقة", next: "الفحوصات الفردية التالية" },
    },
    advanced: {
      h: "الباقة المتقدمة",
      buy: "Buy Now",
      badge: "MOST POPULAR",
      cards: {
        homeStaff: {
          t: "Home Staff Verification",
          price: "INR ₹1399",
          checks: ["Voter Id Check", "Criminal Check", "Address Check"],
        },
        nanny: {
          t: "Nanny Verification",
          price: "INR ₹1399",
          checks: ["Identity Check", "Criminal Check", "Address Check"],
        },
        driver: {
          t: "Driver Verification",
          price: "INR ₹1799",
          checks: ["Driving License Check", "Criminal Check", "Voter Id Check", "Address Check"],
        },
        tenant: {
          t: "Tenant Verification",
          price: "INR ₹1799",
          checks: ["Credit Check", "Criminal Check", "Aadhaar Check"],
        },
      },
    },
  },

  homeFamily: {
    crumb: "المنزل & العائلة",
    eyebrow: "الأفراد · المنزل & العائلة",
    h1: (
      <>
        تأكد أنك وعائلتك<br />
        <em>في أمان.</em>
      </>
    ),
    sub:
      "التحقق سهل على WhatsApp من HelloVerify. من المربيات والعاملين في المنزل إلى السائقين " +
      "والمستأجرين — تحققنا رقمي بالكامل، سريع ودقيق.",
    primary: "اطّلع على باقات HelloV",
    secondary: "اطّلع على الفحوصات المفردة",
    strip: {
      thirtyMin: <><b>30 دقيقة</b> مدة إنجاز معتادة</>,
      price: <><b>₹499</b> الباقات تبدأ من</>,
      whatsapp: <><b>WhatsApp</b> — بلا تطبيق للتثبيت</>,
      consent: <><span className="dot" /> يوافقون أولاً، دائماً</>,
    },
    verifyHead: "أي باقات HelloV تغطي مربية أو سائقاً؟",
    verifyLede:
      "باقات الأسرة من HelloV تبدأ من ₹499: التحقق من السائق هو Driving License Check و Address Check؛ " +
      "العاملون في المنزل ₹599 لـ Criminal Check و Identity Check؛ المربية والمستأجر ₹549. الفحوصات المفردة من ₹199.",
    lanes: {
      identity: { gt: "01 — الهوية", gh: "Identity Check" },
      record: { gt: "02 — السجل", gh: "Criminal Check" },
      address: { gt: "03 — أين يعيشون", gh: "Address Check" },
    },
    pills: {
      identity: { n: "Identity Check", t: "₹1099" },
      photoMatch: { n: "Pan Card Check", t: "30 دقيقة" },
      age: { n: "Age Verification", t: "30 دقيقة" },
      licence: { n: "Driving License Check", t: "30 دقيقة" },
      criminal: { n: "Criminal Record Check", t: "30 دقيقة" },
      globalDatabase: { n: "Credit Check", t: "₹1799" },
      currentAddress: { n: "Digital Address Check", t: "30 دقيقة" },
      previousEmployment: { n: "Digital Employment Check", t: "60 دقيقة" },
    },
    stepsHead: "كيف أفحص مربية أو سائقاً على HelloV؟",
    stepsLede:
      "يجري فحص المنزل والعائلة من HelloV على WhatsApp: امسح رمز QR بكاميرا WhatsApp، " +
      "اختر من تريد التحقق منه، ويعطي الشخص موافقته على هاتفه هو قبل أن يبدأ أي فحص.",
    steps: {
      you: {
        n: "01 · أنت",
        t: "امسح رمز QR",
        p: "امسح رمز QR لـ HelloV بكاميرا WhatsApp.",
      },
      them: {
        n: "02 · أنت",
        t: "اختر من",
        p: "اختر من تريد التحقق منه — سائق أو عامل منزل أو مربية أو مستأجر.",
      },
      report: {
        n: "03 · هم",
        t: "يوافقون",
        p: "يعطي الشخص المراد التحقق منه موافقته على هاتفه هو. ثم يجري الفحص.",
      },
    },
    tableHead: "كم تكلفة فحوصات الأسرة من HelloV؟",
    tableLede:
      "الفحوصات المفردة من HelloV مسعَّرة وموقوتة في الكتالوج الحي: Age Verification ₹199 خلال 30 دقيقة، " +
      "Digital Employment Check ₹299 خلال 60 دقيقة، Driving License و PAN و Digital Address ₹299 خلال 30 دقيقة، " +
      "Criminal Record Check ₹899 خلال 30 دقيقة.",
    rows: {
      identity: { nm: "Age Verification", sub: "₹199 · هوية حكومية بتاريخ الميلاد", tm: "30 دقيقة", src: "السجل المُصدِر" },
      globalDatabase: { nm: "Pan Card Check", sub: "₹299 · مصادقة بيانات PAN", tm: "30 دقيقة", src: "سجلات ضريبة الدخل" },
      licence: { nm: "Driving License Check", sub: "₹299 · الاسم والرقم والصلاحية", tm: "30 دقيقة", src: "هيئة النقل في الولاية" },
      criminal: { nm: "Criminal Record Check", sub: "₹899 · سجلات المحاكم", tm: "30 دقيقة", src: "سجلات المحاكم" },
      address: { nm: "Digital Address Check", sub: "₹299 · وثائق وموقع جغرافي حي", tm: "30 دقيقة", src: "سجلات العنوان" },
      previousEmployment: { nm: "Digital Employment Check", sub: "₹299 · اسم صاحب العمل والالتحاق والمغادرة", tm: "60 دقيقة", src: "صاحب العمل السابق" },
    },
    tableNote: "الأسعار والأوقات هي كتالوج HelloV الحي · يوافق الشخص المراد التحقق منه قبل أن يبدأ أي فحص",
    complianceHead: "هل التحقق منصف للشخص المراد فحصه؟",
    complianceLede:
      "الشخص المراد فحصه عادة يبحث عن عمل: يرى بالضبط ما يُتحقَّق منه، ويعطي موافقته على هاتفه هو، " +
      "ولا يجري فحص HelloV من دون ذلك. وتُحفَظ الوثائق بحدود احتفاظ لا إلى الأبد.",
    faqHead: <>من العائلات.</>,
    faqs: {
      awkward: {
        q: "أليس الطلب محرجاً؟",
        a: "أقل مما تتوقع — التحقق صار معتاداً لموظفي المنزل، وكثير من المرشحين يفضّلونه، لأن السجل المتحقَّق منه دليل قابل للنقل للعائلة التالية أيضاً. والطلب يأتي منا، لا منك.",
      },
      noDocuments: {
        q: "ماذا لو لم تكن لديهم وثائق رسمية؟",
        a: "لدى معظم الناس هوية حكومية واحدة على الأقل، وهي ترسّخ Identity Check و Criminal Check. وإن تعذّر التحقق من شيء، يقول التقرير ذلك بوضوح — وهذه معلومة أيضاً، وهي أفضل من الافتراض.",
      },
      clean: {
        q: "هل التقرير النظيف يعني أنهم آمنون؟",
        a: "يعني أن السجلات تؤكد ما قالوه لك. هذا حد أدنى، لا ضمان — واصل الأمور الإنسانية: المراجع، وفترة تجريبية، ولقاء العائلة. يزيل التحقق خطراً محدداً، لا كل المخاطر.",
      },
      agency: {
        q: "هل يمكنني فحص موظفي وكالة؟",
        a: "نعم، بموافقة الفرد، وعلى باقات HelloV نفسها. كثيراً ما تقول الوكالات إن الموظفين «متحقَّق منهم» دون أن تقول من قِبل من أو مقابل ماذا — والتقرير يسمّي الفحص.",
      },
    },
    closing: {
      heading: (
        <>
          تحقَّق من أي شخص فوراً <em>على WhatsApp.</em>
        </>
      ),
      sub: "التحقق سهل على WhatsApp من HelloVerify.",
      ctaLabel: "ابدأ التحقق",
    },
  },

  /** `/products/immigration` - the old `immigrationMigrationService.base.json`
   *  applicant tab, word for word, in its order. The guide's extras - the FAQ
   *  categories past "process", the per-embassy How to Apply accordions, the
   *  Latvia Premium Service packages, the second-level labels - are the old
   *  SPA's `immigrationApplicantGuideExtras.ts`, which that page merged into the
   *  CMS guide; its UI lines are the old `i18n/<locale>.json`. The Latvia link
   *  labels were the English ones in every locale. The CMS embassy names are the
   *  fallback list the old page showed until the visa back office answered;
   *  cities and visa types only ever came from that back office. Document
   *  checklists differ in length per locale, so they are `lib/immigration/checklists`. */
  immigration: {
    crumb: "جهات الهجرة",
    h1: (<>الفحص المسبق <em>للمتقدم</em></>),
    sub: "نساعد على جعل عملية طلب التأشيرة كاملة سلسة وآمنة وخالية من التأخير",
    steps: {
      h: "ابدأ في 3 خطوات بسيطة",
      items: {
        upload: { t: "رفع سهل", p: "يمكن للمتقدمين رفع وتحديث المعلومات المطلوبة خلال دقائق، وسنتولى الباقي." },
        reminders: { t: "تذكيرات ذكية", p: "تذكيرات في الوقت المناسب عبر البريد والرسائل لإكمال المستندات المعلقة." },
        dashboard: { t: "لوحة تحكم فورية", p: "يمكن للمتقدم متابعة حالة الفحص في الوقت الحقيقي من أي مكان." },
      },
    },
    partners: {
      h: "شركاؤنا",
      cta: "ابدأ فحص التأشيرة",
      logos: {
        latvia: "سفارة لاتفيا",
        italy: "سفارة إيطاليا",
        britain: "المفوضية البريطانية العليا",
        switzerland: "سفارة سويسرا",
        zambia: "هيئة مؤهلات زامبيا",
      },
    },
    guide: {
      h: "دليل المعلومات",
      sub: "لطلب التأشيرة.",
      tabs: { how: "كيفية التقديم", docs: "المستندات المطلوبة", faq: "الأسئلة الشائعة" },
      fields: { applyingTo: "التقديم إلى *", applyingFrom: "التقديم من", visaType: "نوع التأشيرة", category: "فئة الطلب" },
      placeholders: { embassy: "اختر السفارة", country: "اختر الدولة", visaType: "اختر النوع", visaChild: "اختر نوع التأشيرة الفرعي" },
      cta: "ابدأ فحص التأشيرة",
      how: { t: "دليل المستخدم", p: "اختر من القائمة المنسدلة أدناه للحصول على دليل خطوة بخطوة." },
      docs: { t: "راجع المستندات المطلوبة أدناه لمعالجة فحص التأشيرة.", p: "اختر من القائمة المنسدلة أدناه لمعرفة المستندات المطلوبة." },
      destinations: {
        latvia: { name: "سفارة لاتفيا" },
        italy: { name: "سفارة إيطاليا" },
        canada: { name: "المفوضية العليا لكندا" },
        britain: { name: "المفوضية البريطانية العليا" },
        switzerland: { name: "سفارة سويسرا" },
        zambia: { name: "هيئة مؤهلات زامبيا" },
      },
      loading: "جاري التحميل…",
      errors: { embassies: "فشل تحميل السفارات", countries: "فشل تحميل الدول", visas: "فشل تحميل أنواع التأشيرة" },
      docsHeading: "المستندات المطلوبة:",
      linksIntro: "يرجى الرجوع إلى الروابط التالية لمزيد من التفاصيل:",
      accordions: {
        italy: {
          who: { t: "من يمكنه التقدم لفحص تأشيرة إيطاليا؟", p: "يُنصح المتقدمون من اختصاص شمال الهند الراغبون في إثبات موثوقيتهم لتأشيرة إيطاليا الوطنية (عمل، دراسة، لم شمل عائلي، إلخ) بإجراء التحقق من مستندات الدعم مع HelloVerify. تشمل الولايات: نيودلهي، هاريانا، هيماشال، جامو وكشمير، البنجاب، راجستان، أوتار براديش، أوتاراخند وتشانديغار." },
        },
        latvia: {
          who: { t: "من يمكنه التقدم لفحص تأشيرة لاتفيا؟", p: "تعاونت السفارة مع HelloVerify India Private Limited لفحص المتقدمين من الهند وسريلانكا لأغراض الدراسة العليا أو العمل (الهند، سريلانكا، نيبال، بنغلاديش)." },
          dependents: { t: "هل يحتاج المتقدم لتقديم طلب لـ HelloVerify للمعالين (أطفال، زوج/زوجة، والدين)؟", p: "يرجى التواصل مباشرة مع السفارة للتوضيح بشأن طلبات المعالين. تعالج HelloVerify فقط الطلبات تحت «تأشيرة طالب» و/أو «تأشيرة عمل D»." },
        },
      },
      latviaLinks: { indian: "Indian Nationals", srilankan: "Sri Lankan Nationals", nepalese: "Nepalese Nationals", bangladeshi: "Bangladeshi Nationals" },
      premium: {
        h: "خدمة مميزة",
        cta: "اختر خدماتك",
        disclaimer: "إخلاء مسؤولية — تُجرى عملية التحقق بناءً على المستندات المقدمة فقط. الخدمات المميزة تقتصر على المساعدة في تعبئة الطلب ولا تؤثر على قرار التأشيرة.",
        clearance: {
          t: "تسوية النواقص",
          sub: "(مساعدة بعد تعبئة الطلب)",
          price: "21 €",
          features: ["المساعدة في كل نقص يُثار", "دعم ذو أولوية (مكالمة وواتساب) بشأن النواقص", "مساعدة في فحص المستندات", "تحديثات سلسة للحالة (مكالمة وواتساب)"],
        },
        premium: {
          t: "مميز",
          sub: "(تعبئة الطلب)",
          price: "42 €",
          disclaimer: "إخلاء مسؤولية — تُجرى عملية التحقق بناءً على المستندات المقدمة فقط. الخدمات المميزة تقتصر على المساعدة في تعبئة الطلب ولا تؤثر على قرار التأشيرة.",
          features: ["إرشاد خطوة بخطوة", "مساعدة في تعبئة النموذج", "قائمة تحقق مستندات النموذج", "دعم مميز واحد — طلب واحد", "30 دقيقة دعم مميز/جلسة", "مكالمة فيديو", "بحد أقصى جلستان"],
        },
      },
      faqNav: {
        process: "الإجراءات",
        documents: "المستندات",
        download: "تنزيل الإيصال",
        status: "حالة الطلب",
        payment: "الدفع",
        terms: "الشروط والأحكام",
      },
      faqs: {
        process: [
          { q: "يرجى توضيح الإجراء الذي تقوم به HelloVerify؟", a: "HelloVerify شريك معتمد لدى سفارات متعددة لفحص التأشيرة. يجب على المتقدم تقديم ورفع جميع المعلومات وفق الإجراء. يبدأ التحقق الخلفي للتأشيرة بعد تقديم المستندات والدفع. نقدّم الحالة النهائية للسفارة فقط." },
          { q: "كيف أقدّم معلوماتي ومستنداتي إلى HelloVerify؟", a: "يمكنك التقديم عبر البوابة https://visa.HelloVerify.com والنقر على «كيفية التقديم» لمعرفة الخطوات التالية." },
          { q: "لماذا أحتاج لتقديم مستنداتي إلى HelloVerify؟", a: "تعاونت السفارة مع HelloVerify للتحقق من صحة جميع المستندات المقدّمة لفحص التأشيرة. راجع: https://www.mfa.gov.lv/en/newdelhi/consular-section/applying-for-a-long-stay-visa/students" },
          { q: "هل فحص التأشيرة في HelloVerify إلزامي قبل التقديم إلى VFS؟", a: "نعم، يجب التقديم أولاً في HelloVerify ثم VFS. يجري HelloVerify فحص المستندات قبل طلب التأشيرة." },
          { q: "قدّم المرشح المستندات في HelloVerify، هل يحتاج لإعادة تقديمها في VFS؟", a: "نعم، التقديم أولاً في HelloVerify ثم VFS إلزامي. يجري فحص المستندات عبر HelloVerify." },
          { q: "حصلت على تصديق HRD/SDM للمستندات التعليمية وشهادة الشرطة، هل الإجراء ما زال إلزامياً؟", a: "نعم، إجراء فحص HelloVerify ما زال إلزامياً لطلب التأشيرة." },
          { q: "هل يجب تصديق المستندات من السفارة أو جهة أخرى؟", a: "لا يلزم تصديق من السفارة للفحص الخلفي. تأكد من وضوح المسح الضوئي واكتماله. يجب أن تطابق مستندات HelloVerify ما يُقدّم إلى VFS." },
          { q: "لا أستطيع حجز موعد بعد الدفع؟", a: "بعد الدفع الناجح، صفحة «Thank You» تحتوي رابطاً لموقع VFS Global. كما يُرسل بريد إلى بريدك المسجّل برابط الحجز." },
          { q: "كيف أزيل النقص (insufficiency)؟", a: "بعد تسجيل الدخول بالبريد وكلمة المرور، اتبع الخطوات:", b: ["انقر «إزالة النقص».", "انقر «استعراض» لرفع المستندات/المعلومات المطلوبة.", "انقر «إرسال» لإزالة النقص."] },
          { q: "أواجه مشاكل مواعيد VFS Global؟", a: "لمشاكل حجز VFS استخدم روابط إعادة الجدولة/الاتصال في صفحة Thank You بعد الدفع، راجع بريدك، أو تواصل مع دعم VFS الرسمي. يكمل HelloVerify فحص المستندات بشكل منفصل عن جدولة VFS." },
        ],
        documents: [
          { q: "ما المعلومات والمستندات المطلوب تقديمها؟", a: "تعتمد المستندات المطلوبة على فئة طلبك وموقعك. يرجى اتباع إرشادات السفارة وتعليمات البوابة لحالتك." },
          { q: "ما المستند المطلوب إذا كان لدى المرشح أموال محجوزة في مخطط تحويل الأموال مع الجامعة؟", a: "يمكنك تقديم اتفاقية FTS بدلاً من ITR ورفعها على البوابة." },
          { q: "ماذا يُقدَّم لمستند ITR إذا كان الوصي القانوني/الكفيل مزارعاً أو موظفاً حكومياً؟", a: "إذا كان الكفيل موظفاً حكومياً: قدّم إثبات هوية وخطاب دخل من الجهة. إذا كان الكفيل مزارعاً: قدّم إثبات المهنة (بطاقة تموين/هوية)." },
          { q: "إذا كنت قاصراً، ما المستندات التي يجب تقديمها؟", a: "قدّم إثبات هوية واحداً (PAN / رخصة قيادة / بطاقة ناخب). إن لم يتوفر، تقدّم لـ PAN وشارك رقم إقرار طلب PAN." },
          { q: "أنا ممول ذاتياً وليس لدي ITR.", a: "ITR إلزامي عادةً. قد يُعفى في حالات معينة (موظف حكومي، مزارع، كفيل غير مقيم، أو اتفاقية FTS)." },
        ],
        download: [
          { q: "ما هي إيصال HelloVerify؟", a: "بعد تقديم الطلب بنجاح على بوابة تأشيرة HelloVerify، يُنشأ إيصال معاملة ويُرسل إلى البريد المسجّل. يمكن أيضاً تنزيل الإيصال من البوابة." },
          { q: "لماذا إيصال HelloVerify مهم؟", a: "يحتوي على تأكيد الدفع ورقم المعاملة كإثبات للدفع المقدم إلى HelloVerify لطلب التأشيرة." },
          { q: "كيف أنزّل إيصال الدفع؟", a: "زر https://visa.HelloVerify.com → Visa Screening → سجّل الدخول ببريدك وكلمة المرور → نزّل إيصال الدفع." },
        ],
        status: [
          { q: "كيف أتحقق من حالة طلبي؟", a: "زر https://visa.HelloVerify.com → Candidate Login → أدخل بياناتك → تظهر الحالة في لوحة التحكم." },
          { q: "ما مدة معالجة الطلبات المقدمة إلى HelloVerify؟", a: "تستغرق HelloVerify عادةً 14 يوم عمل؛ قد تطول عند جمع النتائج من مصادر متعددة. لا تشمل عطلات نهاية الأسبوع والعطل الرسمية." },
        ],
        payment: [
          { q: "تم خصم الدفع لكن لم أتلقَ تأكيداً منكم؟", a: "ستتلقى إيصالاً على بريدك عند اكتمال الدفع. يمكنك أيضاً تنزيل الإيصال من https://visa.helloverify.com." },
          { q: "ما رسوم فحوصات الخلفية والعملية بأكملها؟", a: "تختلف الرسوم حسب خدمات فحص التأشيرة المختارة والموقع الجغرافي." },
          { q: "لماذا أدفع لـ HelloVerify وهل الدفع إلزامي؟", a: "إذا فرضت السلطات فحص الخلفية، يكون الدفع لـ HelloVerify إلزامياً لمعالجة الطلب." },
          { q: "إذا واجهت صعوبات أثناء تعبئة نموذج الطلب عبر الإنترنت؟", a: "تحقق من اتصال الإنترنت وأعد المحاولة. يمكنك مراسلة visascreening@helloverify.com مع لقطة شاشة لرسالة الخطأ." },
        ],
        terms: [
          { q: "ما الغرض من الشروط والأحكام؟", a: "تحدد هذه الاتفاقية القواعد والإرشادات التي يجب على المستخدمين الموافقة عليها وتمنح HelloVerify الإذن بإجراء فحص التأشيرة." },
          { q: "تم رفع المستندات على بوابة HelloVerify لكن VFS غير مطلع على تحديث خدمات HelloVerify", a: "HelloVerify معتمد وفق إرشادات السفارة؛ راجع: https://www.mfa.gov.lv/en/newdelhi/consular-section/applying-for-a-long-stay-visa/students" },
          { q: "كيف أتأكد أن مستنداتي وبياناتي آمنة لدى HelloVerify؟", a: "تتبع HelloVerify معايير الخصوصية والأمان وتسعى للامتثال لقوانين خصوصية البيانات المعمول بها (بما فيها IT Act 2000 وGDPR حيث ينطبق)." },
        ],
      },
    },
    easy: {
      h: "كيف يسهل HelloVerify الأمر على المتقدمين؟",
      cards: {
        trust: { t: "فحص تأشيرة يمكنك الوثوق به", p: "تحقق مركزي وأدوات مؤتمتة ورؤى أفضل لقرارات أسرع وأذكى." },
        onboarding: { t: "انضمام رقمي", p: "منصة انضمام رقمية لإدخال الطلبات بسهولة دون عمل يدوي." },
        queues: { t: "لا مزيد من الانتظار في الطوابير!", p: "ارفع مستنداتك رقميًا في الوقت المناسب لك دون زيارات فعلية." },
        reminders: { t: "تذكيرات ذكية", p: "تذكيرات عبر البريد والرسائل لإكمال المستندات المعلقة." },
        dashboards: { t: "لوحات معلومات فورية", p: "متابعة حالة الفحص في الوقت الحقيقي من أي مكان." },
        secure: { t: "آمن ومتوافق", p: "تحديثات شاملة وفورية لحالة معلومات كل متقدم طوال عملية التحقق." },
      },
    },
    testimonials: {
      h: "ماذا يقول العملاء عنا",
      cards: {
        rohit: { name: "Rohit Sharma", quote: "كان توظيف الموظفين محفوفًا بالمخاطر، لكن HelloVerify جعل الأمر بسيطًا وموثوقًا." },
        anjali: { name: "Anjali Mehta", quote: "تحقق سريع ودقيق وسلس—ساعدنا HelloVerify على التوسع دون تأخير." },
        neha: { name: "Neha Verma", quote: "إيجاد مساعدة موثوقة أمر حاسم. مع HelloVerify أشعر بالأمان والاطمئنان في كل مرة." },
      },
    },
  },
};
