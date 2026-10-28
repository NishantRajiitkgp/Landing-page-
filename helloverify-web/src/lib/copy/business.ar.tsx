/** Arabic business copy for `app/[locale]/business/**`.
 *
 *  Annotated `: BusinessCopy` — recipe step 1b in `./index`. Not in the
 *  BUSINESS registry. Part 9b.4.
 *
 *  MSA, government-buyer / HR-procurement tone. Brand names, certification
 *  marks, figures, prices and `{link}` / `{n}` slots stay Latin.
 */

import type { BusinessCopy } from "./business";

export const ar: BusinessCopy = {
  crumb: "الأعمال",

  hub: {
    hero: {
      k: "للأعمال",
      h1: (
        <>
          كل توظيف، موثَّق <em>قبل اليوم الأول.</em>
        </>
      ),
      sub:
        "مسار واحد لكل دور توظّفونه — من السائقين إلى المديرين. الذكاء الاصطناعي يقرأ الوثائق، " +
        "وفريقنا يؤكّد لدى الجهة المُصدِرة، ويصل الجواب قبل أن ينتهي فيديو التعريف.",
      cta: "اتصل بالمبيعات",
      plans: "اطّلع على الباقات والأسعار",
    },

    strip: {
      checks: (<><b>20M+</b> فحصاً منذ 2018</>),
      clients: (<><b>2,000+</b> عميل أعمال</>),
      package: (<><b>30 دقيقة</b> باقة العمالة الميدانية</>),
      countries: (<><b>120+</b> دولة</>),
      certs: (<><span className="dot" /> ISO 27001 · GDPR · PBSA</>),
    },

    paths: {
      "/products/bgv-enterprise": {
        tag: "المؤسسات",
        from: "2,000+ عميل",
        h: "التحقق من الخلفية للمؤسسات",
        p: "توظيف عالي الحجم باتفاقية مستوى خدمة. API، وتحميل جماعي، وفريق يجيب.",
      },
      "/products/bgv-smb": {
        tag: "الشركات الصغيرة والمتوسطة",
        from: "من 30 دقيقة",
        h: "باقات الشركات الصغيرة والمتوسطة",
        p: "اختَر باقة، ارفع الوثائق، واحصل على الإجابات. أسعار معلنة، بلا مكالمة مبيعات.",
      },
      "/employee-verification": {
        tag: "الموارد البشرية والعمليات",
        from: "60 دقيقة",
        h: "التحقق من الموظفين",
        p: "الموظفون الحاليون والمقاولون وقوى العمل الحرّة — موثَّقون ويُعاد توثيقهم.",
      },
      "/products/customer-kyc": {
        tag: "الثقة والسلامة",
        from: "عند التسجيل",
        h: "اعرف عميلك (KYC)",
        p: "تحقَّق من العملاء لحظة تسجيلهم، قبل أن يتمكّنوا من إلحاق الضرر.",
      },
      "/products/certifier": {
        tag: "المشتريات",
        from: "يومان",
        h: "العناية الواجبة بالمورّدين",
        p: "Certifier: رخص تجارية، ومديرون، وائتمان، وسجلات جنائية — قبل توقيع مورّد.",
      },
    },

    fiveWays: {
      k: "خمس مداخل",
      h: "أي منتج للتحقق من الخلفية يحتاجه عملكم؟",
      lede:
        "تشغّل HelloVerify خمسة مسارات أعمال على منصة واحدة: التحقق المؤسسي من الخلفية باتفاقية " +
        "مستوى خدمة، وباقات للشركات الصغيرة والمتوسطة من 30 دقيقة، وإعادة التحقق من الموظفين، وKYC " +
        "للعملاء عند التسجيل، وعناية Certifier الواجبة بالمورّدين خلال يومين. رفع واحد، وتقرير واحد — " +
        "وما يتغيّر هو الفحوصات التي تُنفَّذ فقط.",
    },

    pipeline: {
      k: "مسار واحد",
      h: "كيف يعمل التحقق من الخلفية؟",
      lede:
        "كل فحص في HelloVerify يمرّ بأربع مراحل نفسها: يصوّر المرشّح الوثيقة، ويلتقط الذكاء الاصطناعي " +
        "كل حقل ويجد مكتب الإصدار، ويُرسل الطلب إلى تلك الجهة المُصدِرة، ويعود تقرير واحد باسم المصدر " +
        "إلى جانب كل نتيجة.",
    },

    steps: {
      upload: {
        n: "01",
        t: "الرفع",
        p: "صوِّر الوثيقة. تُفحص الحواف والوهج والتركيز قبل أن يُغلق الغالق.",
      },
      read: {
        n: "02",
        t: "القراءة",
        p: "يلتقط الذكاء الاصطناعي كل حقل، ويراجع الوثيقة على نفسها، ويجد المكتب الذي أصدرها.",
      },
      confirm: {
        n: "03",
        t: "التأكيد",
        p: "يُرسل الطلب إلى الجهة المُصدِرة. وللشهادة يعني ذلك المسجِّل — لا موقعاً يشبهه.",
      },
      report: {
        n: "04",
        t: "التقرير",
        p: "تقرير واحد، باسم المصدر إلى جانب كل نتيجة. مربوط بنظام ATS لديكم أو بصندوق الوارد.",
      },
    },

    integrate: {
      k: "ادمجوا مرة واحدة",
      h: "كيف تتكامل HelloVerify مع أدوات التوظيف لديكم؟",
      lede:
        "تتكامل HelloVerify عبر REST API، وwebhooks، وتحميل CSV جماعي، وتكاملات ATS " +
        "وSSO/SAML. يرفع المرشّحون عبر WhatsApp أو رابط، وتعود النتائج حيث يعمل فريق التوظيف " +
        "أصلاً — المسار نفسه أيّاً كان منتج الأعمال الذي تشترونه.",
    },

    services: {
      api: "REST API",
      webhooks: "Webhooks",
      csv: "تحميل CSV جماعي",
      ats: "تكاملات ATS",
      whatsapp: "مسار المرشّح عبر WhatsApp",
      sso: "SSO / SAML",
    },
    explore: "استكشفوا المنصة",

    certs: {
      iso27001:
        "إدارة أمن المعلومات، بتدقيق مستقل. التقارير متاحة بموجب NDA.",
      pbsa: "عضو في الهيئة العالمية لمعايير صناعة الفحص.",
      pbsaLink: "الأمن والامتثال ←",
    },
  },

  /** `/products/bgv-enterprise` — the old `enterprise.base.json`, word for
   *  word, in its order: hero, trust strip (title, subtitle, six partner
   *  logos), the Employees / Businesses / Customers screening tabs. The old
   *  `titleBold` was empty in every locale and is not carried. */
  enterprise: {
    crumb: "المؤسسات",
    hero: {
      h1: (<>فحص مدعوم بالذكاء الاصطناعي تثق به أكبر المؤسسات في الهند. <br /><em>أوقف التوظيف الخاطئ قبل أن يبدأ.</em></>),
      cta: "تحدث إلى المبيعات",
    },
    trust: {
      before: "موثوق به من أفضل",
      after: "شركات IT/ITES في الهند لـ",
      second: "التحقق من الخلفية",
      sub: "يجمع مزيجنا من الذكاء الاصطناعي وخبراء التحقق الداخليين على ردع الاحتيال مع تجربة سلسة للمستخدمين الحقيقيين.",
    },
    partners: {
      cognizant: "Cognizant",
      infosys: "Infosys",
      accenture: "Accenture",
      reliance: "Reliance Retail",
      wipro: "Wipro",
      hcl: "HCL",
    },
    screening: {
      h: (<>فحوصات خلفية لكل جزء من مؤسستك <br /><em>اختر من تريد فحصه</em></>),
      tabs: { employees: "الموظفون", businesses: "الشركات", customers: "العملاء" },
    },
    employees: {
      h: "فحوصات خلفية للجميع",
      p: "HelloVerify هي الطبقة الرقمية الوحيدة التي تؤتمت عملية الفحص الخلفي لتقليل الاحتيال وضمان أسرع انضمام.",
      values: {
        fast: { t: "سريع", tag: "أسرع 3 مرات من متوسط الصناعة", p: "يستخدم HelloVerify الذكاء الاصطناعي وتعلم الآلة لتقديم أسرع خدمة فحص خلفي." },
        accurate: { t: "دقيق", tag: "معدل تقارير مُتحقق منها 99.2%", p: "عملية الفحص الفورية تساعدك على استبعاد المستندات الاحتيالية وتوظيف المرشح المناسب." },
        compliant: { t: "متوافق", tag: "معتمد ISO 27001 + GDPR", p: "يلتزم HelloVerify بمستوى عالٍ من الامتثال ويضمن أمانًا بمستوى البنوك." },
      },
      explore: "استكشف المزيد",
      checksH: "الفحوصات التي نقدمها",
      stats: {
        checks: { a: "30+", b: "فحص" },
        countries: { a: "120+", b: "دولة" },
        tat: { a: "1 إلى 7", b: "أيام عمل TAT" },
        api: { a: "REST API +", b: "رفع جماعي" },
      },
      groups: {
        enterprise: {
          h: "فحوصات المؤسسات",
          a: ["فحص الهوية", "فحص التعليم", "فحص المؤسسة التعليمية", "فحص التوظيف", "فحص كشف الحساب البنكي", "شهادة تسجيل الأعمال", "الملف ثلاثي الأبعاد والتعرف على الوجه"],
          b: ["فحص الترخيص المهني", "فحص السجل الجنائي", "فحص العنوان", "فحص قاعدة البيانات العالمية", "فحص الشركة", "جميع لوحات المخدرات"],
        },
        tampering: {
          h: "تلاعب بالمستندات",
          a: ["التحقق من الرخصة", "الشهادة", "المستندات", "كشف الحساب البنكي"],
        },
      },
    },
    businesses: {
      h: "التحقق من الأعمال والعناية الواجبة\nللشراكة مع الموردين المناسبين",
      p: "مع Certifier من HelloVerify يمكن للعملاء تحسين تجربة التقييم عبر ملفات موثقة تشمل السيلفي وتأكيد الموقع وصور الموقع والفحص والتصاريح والاتفاقيات والتواقيع الرقمية.",
      features: {
        dueDiligence: "عناية واجبة\nشاملة للموردين",
        kyc: "KYC للموردين و\nالتحقق من المستندات",
        criminal: "فحص السجلات\nالقانونية والجنائية والمحاكم",
        financial: "المخاطر المالية و\nتقييم الائتمان",
        compliance: "فحص الامتثال\nوالتنظيمي",
        reference: "التحقق من المراجع\nوالأداء السابق",
      },
      explore: "استكشف المزيد",
    },
    customers: {
      brand: "الثقة والسلامة",
      sub: "بنية ثقة لنمو أعمال سريع ودقيق ومتوافق",
      pillar: "شريك موثوق للبقاء أمام الاحتيال المالي لجميع أصحاب المصلحة",
      body: ["منصة الثقة والسلامة حل KYC شامل يبسّط عمليات الانضمام الرقمي وكشف الاحتيال.", "عزّز أعمالك بحلول متوافقة تنظيميًا تبني الثقة في كل مرحلة من الانضمام والتحقق الرقمي—من فحص الأشخاص المعرضين سياسيًا (PEP) والعناية الواجبة إلى تحليل السمعة والامتثال وقوائم المراقبة الجنائية."],
      explore: "استكشف المزيد",
      advH: "بعض المزايا الرئيسية التي لاحظها عملاؤنا",
      adv: {
        cost: { v: "90%", sub: "خفض تكلفة الانضمام." },
        time: "قلّل وقت الانضمام من ساعات إلى دقائق.",
        fraud: "زيادة تصل إلى 90% في كشف الاحتيال بفضل الملف ثلاثي الأبعاد ومطابقة الوجه وفحوصات AML.",
        paperless: "عمليات رقمية آلية بلا ورق للامتثال للمتطلبات القانونية بسهولة.",
      },
    },
  },
  /** `/products/bgv-smb` — the old `bgvSmb.base.json`, word for word, in its
   *  order: hero, How it Works?, the packages with the Select Your Checks
   *  table and its summary, Trusted by, Solutions We Offer. `exploreLess` and
   *  `stars` were hard-coded English in the old components and stay English.
   *  `trust` / `clients` are the SMB client logos added on request (5 Oct
   *  2026); the old page had no logo strip. `strip`, `hero.talkFirst` and
   *  `closing.ctaLabel` are read by the homepage only (`sections/SmbPacks.tsx`). */
  smb: {
    crumb: "BGV للشركات الصغيرة والمتوسطة",
    hero: {
      h1: (<>عمليات تحقق خلفية <br /><em>للشركات الصغيرة والمتوسطة</em></>),
      sub: "توفر تقنيتنا المملوكة والمدعومة بالذكاء الاصطناعي وتعلم الآلة حلاً شاملاً للفحص للشركات الناشئة والشركات الصغيرة والمتوسطة.",
      cta: "تحدث إلى المبيعات",
      talkFirst: "تحدثوا إلى المبيعات",
    },
    strip: {
      checks: (<><b>1200+</b> شركة صغيرة تثق بـ HelloVerify</>),
      subscription: (<><b>60 دقيقة</b> للأساسي والقياسي والمتميز</>),
      invoice: (<><span className="dot" /> متوسط الإنجاز 9 أيام</>),
    },
    closing: {
      ctaLabel: "اطّلعوا على الباقات",
    },
    trust: { h: "موثوق به لدى أكثر من 1,200 شركة صغيرة ومتوسطة في التحقق من الخلفية" },
    clients: {
      akcelerator: "Akmazo Akcelerator",
      aidenai: "Aiden AI",
      lucid: "Lucid Technology Services",
      midfin: "Midfin Wealth",
      lnp: "LNP Infotech",
      itekpeople: "iTek People Technology",
      appxcelerate: "AppXcelerate Solutions",
      ditstek: "DITSTEK Innovations",
      caone: "CA-One India",
      ibirds: "iBirds Software Services",
    },
    how: {
      h: "كيف يعمل؟",
      steps: {
        select: { n: "01", t: "اختر عمليات التحقق", p: "خصّص طلبك حسب احتياجك من مجموعة واسعة من عمليات التحقق" },
        fill: { n: "02", t: "املأ المعلومات", p: "قدّم موافقة الفرد والمعلومات اللازمة للتحقق" },
        fast: { n: "03", t: "بسرعة تصل إلى 24 ساعة", p: "احصل على تقارير واضحة تساعدك في اتخاذ القرار" },
      },
    },
    packages: {
      h: "اختر أو خصّص باقة التحقق",
      checksInclude: "تشمل عمليات التحقق",
      buy: "اشترِ الآن",
      items: {
        basic: {
          t: "الباقة الأساسية",
          price: "₹1799",
          ready: "60 دقيقة",
          p: "يتحقق من الهوية الصادرة عن الحكومة، ويفحص السجلات الجنائية، ويطابق قوائم المراقبة العالمية للكشف عن المخاطر الخفية.",
          checks: ["فحص الهوية", "الفحص الجنائي", "فحص قاعدة البيانات العالمية"],
        },
        standard: {
          t: "الباقة القياسية",
          price: "₹2199",
          ready: "60 دقيقة",
          p: "جميع فحوصات الباقة الأساسية بالإضافة إلى التحقق من العنوان، لصورة خلفية أكثر اكتمالاً.",
          checks: ["فحص الهوية", "الفحص الجنائي", "فحص قاعدة البيانات العالمية", "فحص العنوان الحالي"],
        },
        premium: {
          t: "الباقة المميزة",
          price: "₹2399",
          ready: "60 دقيقة",
          p: "جميع فحوصات الباقة القياسية بالإضافة إلى كشف العمل الإضافي غير المعلن (Moonlighting).",
          checks: ["فحص الهوية", "فحص العنوان الحالي", "الفحص الجنائي", "فحص قاعدة البيانات العالمية", "فحص العمل الإضافي"],
        },
      },
      customize: "خصّص باقاتك",
    },
    table: {
      h: "اختر عمليات التحقق",
      cols: { check: "التحقق", pricing: "السعر", action: "الإجراء" },
      rows: {
        identity: {
          n: "Identity Check",
          price: "₹349",
          info: "This check involves validation of Passport or PAN card or Driving License or Voter ID or Aadhaar Card used by candidate. For Aadhaar, only number validation will only be done. We match the name, DOB, father's name of the candidate, ID Number to document provided (Govt. restrictions incase of Aadhaar) • Screening of passport through MRZ (Machine Readable Zone) format passports. For International candidates' passport screening will only be conducted.",
        },
        employment: {
          n: "Employment Check",
          price: "₹499",
          info: "It includes verifying the candidate's claims about his/her tenure, etc. and establishment with respective employer. Hello Verify will reach out to the HR using automated email / telephone. Mode: Email/Database Additional Options for Verifications We also have verification methods via. PF/Form 16/Supervisor /UAN. These all are chargeable at an additional charge per check per method.",
        },
        education: {
          n: "Education Check-Highest Education (Extra University Charges applicable)",
          price: "₹999",
          info: "This check involves verifying the authenticity of candidate's educational & professional qualifications from the respective universities/colleges / trusted database. The names are run through Hello Verify's proprietary database of both known (trusted) and unknown (suspect) universities/institutes and organizations. Herein, TAT may vary subject to university/college (TAT) process. Mode: Database/Email Scope: 12th, Bachelors, Masters, Professional",
        },
        address: {
          n: "Address Check",
          price: "₹499",
          info: "The address is matched using a candidates documents which are either verified or eyeballed for details using original color photocopies. We accept all address proof related documents such as Aadhaar OKYC, Driving License, Voter ID, Electricity Bills, Credit Card Statement, Bank Passbook, Govt Issued Cards and other documents containing the candidates address details. We also provide latitude / longitude in the address where the candidate is actively staying. In case the candidate does not have a valid address proof we do ask for a self declaration of address or a visit can be done to the stated location (only if required). It is recommended that only current / active stay address be checked as the candidate would be residing there. Mode: Digital",
        },
        professionalReference: {
          n: "Professional Reference Check",
          price: "₹499",
          info: "An automated voice command IVR verification or email link will be conducted to obtain reference confirmation about the candidate's personal integrity, educational and professional backgrounds from professional references provided by the candidate. For fresher's, verification is taken from personal references provided by the candidate. We will attempt to reach the candidate 3 times as per defined scope . Mode: Automated IVR/ Telephonic/Email Scope: Personal / Professional",
        },
        indianDatabase: {
          n: "Indian Database Check",
          price: "₹699",
          info: "This Check includes enhanced due diligence using most comprehensive database. Some are listed below: * Central Bureau of Investigation (CBI) Most Wanted List * India Courts * Central Vigilance Commission (CVC) Corrupt Officers Database * Securities and Exchange Board of India * Most Wanted Criminals *Other Indian Databases Mode: Database",
        },
        globalDatabase: {
          n: "Global Database Check",
          price: "₹999",
          info: "This Check includes enhanced due diligence using most comprehensive database. Some are listed below: * Serious and Organized Crimes - Interpol Most Wanted. - Most Wanted Lists * Regulatory Authorities * Compliance Authorities - Office of Foreign Assets Control - Proprietary Databases * Web and Media Searches - Internet Searches - Media Searches * Bankruptcy Checks - Board of Industries and Financial Reconstruction (BIFR) Companies Mode: Database",
        },
        criminalEcourt: {
          n: "Criminal Check via E-Court",
          price: "₹799",
          info: "Search for negative records/charges against the applicant through online e-Court records of the jurisdiction, covering Magistrate Court, Session Court, District Court and High Court. Checks for any negative history or adverse records for the last 7 years. (Subject to availability of information in public or online domain). Mode: Database Scope: Criminal/Civil or Both",
        },
        criminalPolice: {
          n: "Criminal Check via Police and law Firm",
          price: "₹899",
          info: "Search for criminal records against the applicant at the police station of the stated jurisdiction, along with a court record search conducted through Certified Legal Consultants/Advocates. Checks for any negative history or adverse records for the last 7 years. TAT may vary subject to the police station and court process. (Subject to availability of information in public or online domain). Mode: Police Station/Database Scope: Criminal/Civil or Both",
        },
        criminalLawFirm: {
          n: "Criminal check via law firm",
          price: "₹999",
          info: "Search for negative records/charges against the applicant in the civil court, High Court, Magistrate Court & Session Court of the jurisdiction. Checks for any negative history or any adverse records (Civil proceeding: Original Suit /Miscellaneous Suit / Execution/ Arbitration cases for last 7 Years. Screenings are conducted via Certified Legal Consultants/ Advocates. They use their own access via legal databases to perform these checks. (Subject to availability of information in public or online domain). Mode: Database Scope: Criminal/Civil or Both",
        },
        rightToWork: {
          n: "Right/Eligibility to work",
          price: "₹359",
          info: "This check verifies whether the candidate is legally eligible to work in India, matching identity, nationality/visa status and work-authorisation documents against the details declared by the candidate. Mode: Database/Document",
        },
        uan: {
          n: "UAN Check",
          price: "₹400",
          info: "This check validates the candidate's Universal Account Number (UAN) against EPFO records, matching name, employment history and contributing establishments with the details declared by the candidate. Mode: Database",
        },
        bankAccount: {
          n: "Bank Account check (Penny Drop)",
          price: "₹199",
          info: "This check validates the candidate's bank account through a penny-drop (name-match) verification, confirming that the account number, IFSC and account-holder name match the details provided by the candidate. Mode: Database",
        },
        credit: {
          n: "Credit Check",
          price: "₹899",
          info: "This check retrieves the candidate's credit report from authorised bureaus to identify outstanding loans, defaults, write-offs or other adverse credit history recorded against the candidate. Mode: Database",
        },
        creditSuit: {
          n: "Credit suit defaulter Check",
          price: "₹699",
          info: "This check screens the candidate against defaulter and credit-suit databases to identify any civil suit, recovery proceeding or wilful-defaulter listing recorded against the candidate. Mode: Database",
        },
        resume: {
          n: "Resume Check Validation",
          price: "₹299",
          info: "Information contained in resume is used to hire a candidate. Once an offer is placed, and a background screening request is placed a candidate has to submit a Screening form along with documentation. Thus a check on validating of details on the resume submitted at time of interview and application form submitted at the time of Screening must be check for inconsistencies and highlighted back to the candidate. Mode: Online",
        },
        finra: {
          n: "FINRA Fingerprint(Pan India)",
          price: "₹10000",
          info: "To verify fingerprint, the template created from the captured fingerprint is compared with templates stored in a database. This comparison can be done using algorithms that measure the similarity between templates.",
        },
        ofac: {
          n: "OFAC Check",
          price: "₹999",
          info: "The Office of Foreign Assets Control, or OFAC, of the U.S. Department of the Treasury administers and enforces economic and trade sanctions based on US foreign policy and national security goals against targeted foreign countries, terrorists, international narcotics traffickers, and those engaged in activities related to the proliferation of weapons of mass destruction. The most recent, master list of Specially Designated Nationals and Blocked Persons that is made available by OFAC will be searched. Mode: Database",
        },
        form16: {
          n: "Form-16 Check",
          price: "₹500",
          info: "This check verifies the Form-16 issued to the candidate, matching employer name, PAN, assessment year and reported income against the employment details declared by the candidate. Mode: Document/Database",
        },
        professionalLicense: {
          n: "Professional license Check (Extra cost on actuals)",
          price: "₹799",
          info: "This check involves verifying the authenticity and current status of the professional licence, registration or membership claimed by the candidate with the issuing council, board or regulatory body. The licence number, holder name, category and validity/expiry are matched against the document provided by the candidate. Charges levied by the issuing authority are extra on actuals. Mode: Database/Email",
        },
        socialMedia: {
          n: "Social Media Check",
          price: "₹749",
          info: "This check reviews publicly available social-media profiles associated with the candidate to identify any adverse, discriminatory or reputational content relevant to employment screening. Mode: Online",
        },
        directorship: {
          n: "Directorship Check",
          price: "₹649",
          info: "This refers to a search based on matching credential of a candidate with MCA (Company) database whether candidate is a Director or not in the company where he/she has worked. If he/she is a Director, then the company name is checked against on the MCA black listed company. Mode: Database",
        },
        financialRegulatory: {
          n: "Financial Regulatory Search",
          price: "₹500",
          info: "This check screens the candidate against financial-regulatory databases, including FFIEC records, to identify any enforcement action, prohibition or adverse finding recorded by banking and financial regulators. Mode: Database",
        },
        bankStatement: {
          n: "Bank Statement - Online or PDF",
          price: "₹100",
          info: "This check validates the authenticity of the candidate's bank statement (online fetch or uploaded PDF), confirming account details and flagging signs of tampering or inconsistency with the declared information. Mode: Online/Document",
        },
        gsa: {
          n: "General Service Administration",
          price: "₹499",
          info: "This check screens the candidate against the U.S. General Services Administration (GSA) excluded-parties lists to identify any debarment, suspension or ineligibility for federal programmes. Mode: Database",
        },
        oig: {
          n: "Office of Inspector General",
          price: "₹499",
          info: "This check screens the candidate against the U.S. Office of Inspector General (OIG) exclusions database to identify any exclusion from federal healthcare programmes or related adverse listing. Mode: Database",
        },
        adverseMedia: {
          n: "Adverse Media Search",
          price: "₹1299",
          info: "This Check includes enhanced due diligence using most comprehensive database. Some are listed below: * Serious and Organized Crimes - Interpol Most Wanted. - Most Wanted Lists * Regulatory Authorities * Compliance Authorities - Office of Foreign Assets Control - Proprietary Databases * Web and Media Searches - Internet Searches - Media Searches * Bankruptcy Checks - Board of Industries and Financial Reconstruction (BIFR) Companies Mode: Database",
        },
        gap: {
          n: "Gap Check",
          price: "₹649",
          info: "This check involves identification of GAP between employment, education and address details. Mode: Online",
        },
        drug: {
          n: "Drug Test",
          price: "₹1350",
          info: "Upon receipt of request/Documents for Drug Test from client/customer, HelloVerify, with prior consent of candidate, will fix an appointment with candidate for collection of sample for Drug Test. After collection, sample for Drug test will be sent to the laboratory or Drug Test will be conducted via instant drug kits onsite. Prior notice of 48 hours must be given to arrange for visits/sample collection. Availability of visit is subject to confirmation from the lab, once Hello Verify has been informed. A date of visit | candidate name | email | phone number | Drug Test Type | must be provided in order to perform the check. Component under below-mentioned Drug Test- Panel are subject to change. Client/customer may choose specific component as per their requirements.",
        },
        alcohol: {
          n: "Alcohol Test",
          price: "₹2300",
          info: "Upon receipt of request from the client, HelloVerify, with prior consent of the candidate, will arrange collection of a sample for alcohol testing. Prior notice of 48 hours must be given to arrange visits/sample collection. Availability is subject to confirmation from the lab. A date of visit, candidate name, email, phone number and test type must be provided. Mode: Lab/Onsite",
        },
        company: {
          n: "Company Check",
          price: "₹599",
          info: "It authenticates the existence of a company, its reputation and regulatory compliances of the Company wherein the candidate has previously worked. Note: Visit may not be possible due to COVID-19 and entry Restriction. Mode: Database only/visit (Subject to COVID-19)",
        },
        faceMatch: {
          n: "Face match",
          price: "₹0",
          info: "This check captures a live selfie and matches it against the photograph on the candidate's identity document, including a liveness check to confirm the person is physically present. Mode: Online",
        },
        fda: {
          n: "Food and Drug Administration Database Verification",
          price: "₹1350",
          info: "This check screens the candidate against Food and Drug Administration (FDA) databases, including the debarment list and the disqualified/restricted investigators list, to identify any regulatory action, prohibition or adverse finding recorded against the candidate. Mode: Database",
        },
        nsr: {
          n: "National Skill of Registry",
          price: "₹799",
          info: "This check validates the candidate's profile against the National Skills Registry (NSR), confirming the ITPIN/NSR record and matching the personal, education and employment details registered against it with the details declared by the candidate. Mode: Database",
        },
        gapValidation: {
          n: "Gap Check validation",
          price: "₹900",
          info: "This is an advanced gap check that identifies unexplained gaps between employment, education and address timelines and validates supporting documents or declarations provided for those periods. Mode: Online/Document",
        },
      },
      more: "استكشف المزيد",
      exploreLess: "Explore Less",
    },
    summary: {
      h: "خصّص باقتك",
      p: "تحقق من موثوقية الأشخاص الذين توظفهم لحماية منزلك/طفلك/سيارتك من مخاطر الجرائم.",
      checksInclude: "تشمل عمليات التحقق",
      empty: "اختر عمليات التحقق من الجدول لبناء باقتك.",
      buy: "اشترِ الآن",
      cartName: "باقة مخصصة",
    },
    trusted: {
      h: "موثوق به من قبل الشركات والأفراد",
      stats: {
        smbs: { v: "1200+", l: "شركات صغيرة ومتوسطة تثق بـ HelloVerify" },
        tat: { v: "9 Day TAT", l: "متوسط مدة الإنجاز (TAT)" },
        start: { v: "₹649", l: "السعر الابتدائي لكل فحص" },
      },
      stars: "4 out of 5 stars",
      people: {
        rohit: {
          name: "Rohit Sharma",
          role: "مالك مطعم",
          quote: "“كان توظيف الموظفين محفوفًا بالمخاطر، لكن HelloVerify جعله بسيطًا وموثوقًا. الآن ننضمّ بثقة كاملة.„",
          alt: "Rohit Sharma",
        },
        anjali: {
          name: "Anjali Mehta",
          role: "مؤسسة شركة ناشئة",
          quote: "“تحقق سريع ودقيق وسلس. ساعدنا HelloVerify على توسيع التوظيف دون تأخير.„",
          alt: "Anjali Mehta",
        },
        neha: {
          name: "Neha Verma",
          role: "صاحبة عمل منزلية",
          quote: "“العثور على مساعدة موثوقة أمر بالغ الأهمية. مع HelloVerify أشعر بالأمان والاطمئنان كل مرة أوظف فيها.„",
          alt: "Neha Verma",
        },
      },
    },
    solutions: {
      h: "الحلول التي نقدمها",
      sub: "نلبي احتياجات الشركات الصغيرة والمتوسطة من خلال عروضنا التالية",
      tabs: { employee: "التحقق من الموظفين", vendor: "فحص الموردين" },
      employee: {
        trust: { t: "ثقة في كل توظيف", p: "من أول نقرة حتى التوظيف النهائي—توفر عمليات الانضمام المدعومة بالذكاء الاصطناعي وسير العمل المؤتمت لدينا السرعة والدقة في كل خطوة." },
        decision: { t: "كل قرار مدعوم بالثقة", p: "المربيات وطاقم المنزل والسائقون والمستأجرون الذين تثق بهم في منزلك يستحقون تحققًا شاملاً. رقمي 100% وسريع ودقيق—حتى لا تقلق بشأن الأشخاص الأقرب لعائلتك." },
        instant: { t: "فحوصات فورية، توظيف بثقة", p: "كل توظيف يحمل مخاطر. فحوصات الخلفية الفورية من HelloVerify تلغي التخمين—وتكشف العلامات التحذيرية قبل أن يصلوا إلى بابك." },
      },
      vendor: {
        h: "التحقق من الأعمال والعناية الواجبة للشراكة مع الموردين المناسبين",
        p: "مع Certifier من HelloVerify يمكن للعملاء تحسين تجربة التقييم عبر ملفات موثقة تشمل السيلفي وتأكيد الموقع وصور الموقع والفحص والتصاريح والاتفاقيات والتواقيع الرقمية.",
        features: {
          dueDiligence: "عناية واجبة\nشاملة للموردين",
          kyc: "KYC للموردين و\nالتحقق من المستندات",
          criminal: "فحص السجلات\nالقانونية والجنائية والمحاكم",
          financial: "المخاطر المالية و\nتقييم الائتمان",
          compliance: "فحص الامتثال\nوالتنظيمي",
          reference: "التحقق من المراجع\nوالأداء السابق",
        },
        offer: {
          h: "ما الذي نقدمه",
          cards: {
            fast: { t: "انضمام الموردين أسرع بـ 10 مرات", p: "تساعد المنصة على اتخاذ قرارات مبنية على البيانات حول أداء الموردين، لتمكين الشركات من تحديد أفضل الموردين وتحسين عملية الاختيار." },
            regulatory: { t: "الحفاظ على الامتثال التنظيمي", p: "يساعد Certifier على تحديد الكيانات الموثوقة والمؤهلة المتوافقة مع متطلبات الشركة والامتثال، مما يقلل احتمال التعامل مع موردين عاليي المخاطر أو غير متوافقين." },
            monitoring: { t: "تقليل المخاطر عبر المراقبة المستمرة", p: "تحديثات فورية لتقدم أنشطة الموردين (صور/فيديو/ملاحظات صوتية) والالتزام بالتعاقدات—لإدارة مشاريع أفضل وحل استباقي للمشكلات." },
            reputation: { t: "حماية سمعة عملك", p: "تتطور قدرات الذكاء الاصطناعي وتعلم الآلة في Certifier باستمرار مع تدخل بشري، لضمان تحقق أصيل من الموردين وإبعاد الجهات السيئة." },
          },
        },
      },
    },
  },

  /** `/employee-verification` — the old `employees.base.json`, word for word,
   *  in its order. The two sections the CMS marks `hidden` (blue-collar
   *  workforce stats, the White & Blue-Collar benefits) never rendered and are
   *  not carried; nor are the white / blue `exploreMore` labels, which the old
   *  split panel did not render. Stat values live in the page. */
  employeeVerification: {
    crumb: "التحقق من الموظفين",
    hero: {
      h1: (<>تحقق خلفية شامل <br /><em>لكل فئة من القوى العاملة.</em></>),
      cta: "تحدث مع المبيعات",
    },
    banner: "حلول التحقق من الموظفين",
    white: {
      h: "تحقق الوظائف المكتبية (White Collar)",
      p: "يُعد تحقق الوظائف المكتبية عملية شاملة للتحقق من مؤهلات وخلفية وهوية المهنيين في الأدوار التي تتطلب خبرة وثقة. يوفر HelloVerify حلاً مبسطًا يساعد الشركات على تقليل مخاطر التوظيف، وضمان الامتثال، وبناء قوة عاملة يمكن الاعتماد عليها.",
      checks: {
        education: { n: "التحقق من التعليم", p: "التحقق من المؤهلات التعليمية والمهنية لمقدم الطلب بما في ذلك أصالة الجهة المُصدِرة." },
        identity: { n: "التحقق من الهوية", p: "التحقق من هوية مقدم الطلب عبر مطابقة المستندات الحكومية الصادرة مع الاسم وتاريخ الميلاد واسم الأب ورقم الهوية." },
        employment: { n: "التحقق من العمل", p: "التحقق من سجل عمل مقدم الطلب بما في ذلك اسم الشركة ومدة العمل والمسمى الوظيفي." },
        criminalRecords: { n: "التحقق من السجل الجنائي", p: "التحقق من سجلات المحاكم عبر الاختصاصات، بما في ذلك المحكمة العليا ومحاكم الاستئناف ومحاكم المقاطعات والهيئات، لتحديد أي تهم جنائية ضد مقدم الطلب." },
        reference: { n: "التحقق من المراجع", p: "يتحقق من السلوك المهني والأداء والكفاءات الأخرى لمقدم الطلب عبر مراجع من أصحاب العمل السابقين." },
        drugTest: { n: "التحقق من اختبار المخدرات", p: "إجراء اختبار مخدرات يشمل جميع اللوحات من Panel-1 إلى Panel-10." },
        globalDatabase: { n: "التحقق عبر قواعد بيانات عالمية", p: "التحقق من قوائم العقوبات الدولية وقوائم المراقبة والسجلات التنظيمية عبر قواعد بيانات عالمية لرصد المعلومات السلبية وتخفيف المخاطر." },
        address: { n: "التحقق من العنوان", p: "التحقق الرقمي من عنوان مقدم الطلب عبر مطابقة مستندات إثبات العنوان المؤهلة مع الموقع الجغرافي المباشر. لا يلزم زيارة ميدانية." },
        company: { n: "التحقق من الشركة", p: "يتحقق من شرعية جهة العمل السابقة لمقدم الطلب عبر التحقق من تسجيل المؤسسة وحالتها التشغيلية وتفاصيل الأعمال الرئيسية." },
        credit: { n: "التحقق الائتماني", p: "يتحقق من الملف الائتماني لمقدم الطلب عبر مكتب ائتماني من خلال تقييم درجة الائتمان والتاريخ الائتماني ومعايير المخاطر المرتبطة." },
        criminalLawFirm: { n: "التحقق الجنائي عبر مكتب محاماة", p: "يحدد السجلات الجنائية عبر التحقق من سجلات المحاكم من خلال شركاء مكاتب محاماة موثوقين." },
        directorship: { n: "التحقق من عضوية مجالس الإدارة", p: "يحدد ما إذا كان مقدم الطلب يشغل حالياً أو شغل سابقاً مناصب عضوية مجلس إدارة في شركات مسجلة." },
        form16: { n: "التحقق من نموذج Form 16", p: "يتحقق من راتب مقدم الطلب والخصومات الضريبية وتفاصيل العمل عبر التحقق من نموذج Form 16 الصادر من جهة العمل." },
        resume: { n: "التحقق من السيرة الذاتية", p: "يتحقق من المعلومات الواردة في سيرة مقدم الطلب بما في ذلك التعليم والعمل والمهارات والاعتمادات الأخرى." },
      },
      cta: "تحدث مع المبيعات",
      alt: "مهنيون يمثلون التحقق من الوظائف المكتبية والامتثال",
    },
    whiteWhy: {
      h: "لماذا يُعد تحقق الوظائف المكتبية مهمًا؟",
      cards: {
        integrity: { t: "تعزيز نزاهة القوى العاملة", p: "اكتشف وخفف مخاطر الادعاءات المزيفة في التعليم أو الخبرة أو الهوية. يضمن ذلك قرارات توظيف أدق ويقلل المخاطر ويبني قوة عاملة موثوقة ومتوافقة." },
        hiring: { t: "تسريع التوظيف بثقة", p: "تعمل إجراءات الإدخال المدعومة بالذكاء الاصطناعي وسير العمل المؤتمت على تبسيط التوظيف من البداية للنهاية، وتقليل الجهد اليدوي والأخطاء وتحسين زمن الإنجاز." },
        compliance: { t: "ضمان الامتثال التنظيمي الكامل", p: "يتوافق إطارنا المتكامل مع المعايير العالمية لحماية خصوصية البيانات وأمنها، ويضمن التعامل الآمن مع المعلومات عبر بروتوكولات قوية وصلاحيات وصول مضبوطة." },
      },
    },
    results: {
      h: "حقق قسم الموارد البشرية وشركات التوظيف نتائج أفضل مع HelloVerify",
      stats: {
        workflow: "شهدوا تبسيط سير عمل الفحص",
        accuracy: "شهدوا تحسنًا في دقة الفحوصات",
        experience: "شهدوا تحسنًا في تجربة المرشح",
      },
    },
    blue: {
      h: "تحقق الوظائف الميدانية (Blue Collar)",
      p: "التصنيع واللوجستيات والإنشاءات والأغذية والمشروبات كشرائح صغيرة لمساعدة المشترين على رؤية أنفسهم بوضوح.",
      checks: {
        pan: { n: "التحقق من بطاقة PAN", p: "يتحقق التحقق من بطاقة PAN من الرقم الدائم للحساب عبر قواعد البيانات الرسمية لتأكيد الهوية واكتشاف الاختلافات ودعم الامتثال." },
        registration: { n: "التحقق من شهادة التسجيل", p: "يتحقق من أصالة بيانات تسجيل المركبة، بما في ذلك الملكية وحالة التسجيل." },
        drivingLicense: { n: "التحقق من رخصة القيادة", p: "يتحقق من أصالة رخصة قيادة المرشح، بما في ذلك رقم الرخصة والصلاحية وجهة الإصدار عبر قواعد البيانات الرسمية." },
        criminalRecords: { n: "التحقق من السجل الجنائي", p: "يبحث فحص سجلات المحاكم في سجلات e-court الرسمية عبر اختصاصات متعددة لتحديد القضايا الجنائية ضد المرشح. وتُشارك تفاصيل القضايا الداعمة مع العميل إن توفرت." },
        pennyDrop: { n: "التحقق عبر Penny Drop", p: "يؤكد التحقق عبر Penny Drop صلاحية الحساب البنكي عبر تحويل مبلغ رمزي ومطابقة اسم صاحب الحساب مع التفاصيل المقدمة." },
        liveness: { n: "التحقق من الحيوية (Liveness)", p: "يتحقق فحص الحيوية من أن الفرد حاضر فعليًا أثناء التحقق من الهوية، مما يمنع الاحتيال عبر الصور أو الفيديوهات أو الأقنعة." },
      },
      cta: "تحدث مع المبيعات",
      alt: "عمال ميدانيون يرتدون معدات سلامة يمثلون التحقق التشغيلي",
    },
    blueWhy: {
      h: "لماذا يُعد تحقق عمال الوظائف الميدانية مهمًا؟",
      cards: {
        trust: { t: "ثقة خلال دقائق لا أيام", p: "تحول منصتنا التحقق إلى سرعة—تقارير دقيقة وفي الوقت المناسب تحول البيانات إلى ثقة حقيقية، لتكون كل قرارات التوظيف مدعومة بالأدلة." },
        smart: { t: "تحقق بذكاء وثق بسرعة", p: "يُزيل الإدخال المدعوم بالذكاء الاصطناعي وسير العمل المؤتمت التأخير ويقلل الأخطاء ويوفر التوظيف الصحيح بسرعة ودقة." },
        compliance: { t: "الحفاظ على الامتثال", p: "تتطلب العديد من الصناعات فحوصات خلفية دقيقة للامتثال للأنظمة، مما يحمي المؤسسة وأصحاب المصلحة." },
      },
    },
    automate: {
      h: "أتمتة إدخال الموظفين والعمال",
      p: "بصفتنا مزودًا عالميًا لحلول فحص الخلفيات، نساعد المؤسسات بمختلف أحجامها على توظيف الأشخاص المناسبين للفرص المناسبة. انضم إلينا لتحديث طريقة التوظيف والتوسع.",
      tabs: {
        smooth: { t: "تجربة سلسة", p: "وظّف أسرع عبر منصات تحول البيانات إلى ثقة عبر تقارير دقيقة وبسرعة. ثقة دون تنازل مدعومة بالأدلة.", alt: "لوحة تحكم HelloVerify وتجربة إدخال سلسة" },
        hrms: { t: "واجهات HRMS والتكامل", p: "ادمج API القوي من HelloVerify ضمن أنظمتك لأتمتة فحوصات الخلفية والتحقق والامتثال، مع تزامن بيانات فوري لرفع الكفاءة والدقة.", alt: "تكامل مع سير عمل HRMS وتبادل بيانات عبر API" },
        rules: { t: "محرك القواعد", p: "استفد من محرك القواعد لأتمتة وتحسين اتخاذ القرار. خصص سير التحقق وحدد المعايير وطبق الامتثال لضمان نتائج دقيقة ومتسقة.", alt: "إعدادات محرك القواعد" },
        tracking: { t: "تتبع فوري", p: "ابقَ على اطلاع عبر تحديثات فورية لحالة عمليات التحقق مع إشعارات مباشرة لضمان عدم تفويت أي تحديث مهم.", alt: "تتبع فوري لحالة الطلبات" },
        support: { t: "دعم ممتاز", p: "يوفر HelloVerify دعمًا عالي الجودة لمساعدتك في أي أسئلة أو تحديات عبر حلول سريعة وفعالة لتجربة سلسة.", alt: "دعم العملاء والمساعدة" },
        security: { t: "أمن بمستوى المؤسسات", p: "يضمن HelloVerify أعلى مستوى من حماية البيانات عبر تشفير قوي وامتثال للمعايير ومراقبة استباقية لحماية المعلومات الحساسة.", alt: "ضوابط أمن بمستوى المؤسسات" },
      },
    },
    psv: {
      h: "التحقق من المصدر الأساسي",
      items: {
        education: "التحقق من التعليم",
        institute: "التحقق من اعتماد المؤسسة",
        employment: "التحقق من العمل",
        dualEmployment: "التحقق من العمل المزدوج",
        criminal: "التحقق من السجل الجنائي",
        identity: "التحقق من الهوية",
        address: "التحقق من العنوان",
        bank: "التحقق من الحساب البنكي",
      },
    },
  },

  /** `/products/customer-kyc` — the English redesign, in the same order.
   *  The case time uses «إلى» rather than →, which Arabic copy does not keep
   *  as a go-cue. */
  customerKyc: {
    crumb: "اعرف عميلك",
    hero: {
      k: "اعرف عميلك · الهند",
      h1: "اعرف من على الجهة الأخرى من الشاشة.",
      sub: "الموافقة، والسيلفي، وPAN، ومطابقة الوجه، وDigiLocker — في مسار واحد، وقرار واحد في النهاية.",
      cta: "احصل على حزمة KYC",
      cta2: "شاهد كيف تعمل",
      points: ["تحقق فوري", "موافقة تلقائية", "بلا عبء تشغيلي"],
      case: {
        id: "الحالة HV-24817",
        time: "14:02 إلى 14:05",
        name: "Ananya Mehta",
        rows: [
          { t: "الموافقة", s: "مُسجَّلة" },
          { t: "الاسم", s: "مُلتقَط" },
          { t: "سيلفي", s: "شخص حي" },
          { t: "PAN", s: "صالح · الاسم مطابق" },
          { t: "مطابقة الوجه", s: "سيلفي ↔ PAN" },
          { t: "DigiLocker", s: "آدهار · موقَّع" },
        ],
        pending: "قيد التحقق",
        result: "موافقة تلقائية",
        passed: "نجحت {n} من 6 فحوصات",
      },
    },
    why: {
      k: "لماذا KYC",
      h: "عبر الإنترنت، يستطيع أي شخص كتابة اسم. KYC يثبت صاحبه.",
      cards: {
        law: {
          t: "هذا ما يفرضه القانون",
          p: "على البنوك وجهات الإقراض وشركات التأمين والوسطاء وغيرها من الأنشطة الخاضعة للتنظيم التحقق من كل عميل قبل خدمته.",
        },
        fraud: {
          t: "يوقف الاحتيال عند التسجيل",
          p: "الهويات المزيفة والمستعارة والمؤجَّرة تدخل عبر فحوصات إلكترونية ضعيفة. في ديسمبر 2025 أوقفت عدة بنوك كبيرة فتح الحسابات رقميًا بالكامل بسبب احتيال حسابات البغال.",
          source: "المصدر:",
          sourceName: "Business Standard",
          sourceHref: "https://www.business-standard.com/finance/news/bank-accounts-digital-onboarding-fraud-prevention-mule-accounts-rbi-kyc-125121200255_1.html",
        },
        trust: {
          t: "يبني الثقة",
          p: "يثق العملاء والشركاء والجهات التنظيمية بمنصة تعرف تمامًا من عليها.",
        },
      },
    },
    how: {
      k: "كيف تعمل",
      h: "ست خطوات على هاتف العميل.",
      sub: "يجري كل فحص لحظة اكتمال خطوته.",
      steps: {
        consent: { t: "الموافقة", p: "يرى العميل ما سيُفحص ويوافق. نسجّلها قبل جلب أي شيء." },
        name: { t: "الاسم", p: "يُدخل العميل اسمه. يجب أن يطابقه كل مستند يأتي بعده." },
        selfie: { t: "سيلفي", p: "سيلفي واحدة موجهة. يؤكد فحص الحيوية أن شخصًا حقيقيًا حاضر — لا صورة ولا شاشة ولا قناع." },
        pan: { t: "التقاط PAN", p: "يصوّر العميل بطاقة PAN. نتحقق من صلاحية PAN ومن تطابق الاسم." },
        face: { t: "مطابقة الوجه", p: "نقارن السيلفي الحية بالصورة على بطاقة PAN. لا شيء على العميل أن يفعله." },
        digilocker: { t: "DigiLocker", p: "يشارك العميل آدهار من DigiLocker. يصل موقَّعًا رقميًا من الجهة المُصدِرة — بلا رفع يمكن تزويره." },
      },
      decision: {
        k: "ثم",
        h: "قرار واحد",
        approved: { t: "مقبول", p: "تنجح كل الفحوصات. موافقة فورية، بلا أحد في الحلقة." },
        flagged: { t: "مُعلَّم", p: "شيء لا يتطابق. تصل إليك الحالة مع السبب." },
      },
    },
    ops: {
      k: "بلا عبء تشغيلي",
      h: "لا مكتب KYC لتشغيله.",
      without: {
        k: "من دونه",
        items: ["أربعة مورّدين لأربعة فحوصات", "فريق يراجع كل سيلفي وكل بطاقة", "عملاء ينتظرون أيامًا للموافقة"],
      },
      with: {
        k: "مع HelloVerify",
        items: ["تكامل واحد لكل فحص", "الحالات السليمة توافق على نفسها", "فريقك لا يرى إلا الاستثناءات"],
      },
    },
    bundle: {
      k: "الحزمة",
      h: "كل فحص، في حزمة واحدة.",
      name: "حزمة KYC الفورية",
      price: "[YOUR PRICE]",
      per: "لكل KYC مكتمل",
      items: [
        "أخذ الموافقة وتسجيلها",
        "أخذ الاسم",
        "سيلفي مع فحص الحيوية",
        "التقاط PAN والتحقق منه",
        "مطابقة الوجه: سيلفي ↔ PAN",
        "آدهار عبر DigiLocker",
        "قرار تلقائي مع الأسباب",
        "سجل تدقيق لكل عميل",
      ],
      plug: "يتصل عبر [API · SDK · HOSTED LINK]",
      buy: "اشترِ الحزمة",
      sales: "تحدث إلى المبيعات",
      traits: {
        instant: { t: "فوري", p: "ينتهي العميل في دقائق. يأتي القرار مع الخطوة الأخيرة." },
        automatic: { t: "تلقائي", p: "الحالات السليمة لا تصل إلى شخص أبدًا." },
        audit: { t: "جاهز للتدقيق", p: "الموافقة والفحوصات والقرار في سجل واحد." },
      },
    },
    who: {
      k: "أين يلزم KYC",
      h: "من يحتاج إلى KYC.",
      law: {
        h: "إلزامي بحكم القانون",
        p: "هذه جهات مُبلِّغة بموجب قانون منع غسل الأموال لعام 2002، الذي يلزمها بالتحقق من هوية كل عميل (المادة 11A).",
        cards: {
          banks: { t: "البنوك", tag: "RBI", p: "كل صاحب حساب.", src: "RBI KYC Directions, 2025" },
          nbfc: { t: "شركات التمويل غير المصرفي وجهات الإقراض", tag: "RBI", p: "كل مقترض.", src: "RBI KYC Directions for NBFCs, 2025" },
          payments: { t: "المدفوعات والمحافظ", tag: "RBI", p: "كل تاجر يضمّه مجمّع مدفوعات. كل حامل محفظة بـ KYC كامل.", src: "RBI Payment Aggregator Directions, 2025 · PPI Master Directions" },
          insurance: { t: "التأمين", tag: "IRDAI", p: "كل عميل، عند بدء العلاقة.", src: "IRDAI AML/CFT Master Guidelines, 2022" },
          markets: { t: "الوساطة في الأسهم وصناديق الاستثمار", tag: "SEBI", p: "كل مستثمر، مُسجَّل لدى وكالة تسجيل KYC.", src: "SEBI KRA Regulations, 2011" },
          crypto: { t: "منصات الكريبتو (VDA)", tag: "FIU-IND", p: "كل مستخدم، منذ خضوع مزودي VDA لقانون PMLA.", src: "إخطار وزارة المالية، 7 مارس 2023" },
        },
      },
      platforms: {
        h: "موصى به للمنصات التي تضمّ أشخاصًا",
        cards: {
          gig: { t: "العمل الحر والتوصيل", p: "السائقون والشركاء" },
          marketplaces: { t: "الأسواق", p: "البائعون والمشترون" },
          rentals: { t: "الإيجار والسكن المشترك", p: "المستأجرون والمضيفون" },
          workforce: { t: "القوى العاملة", p: "المنضمّون الجدد والمتعاقدون" },
          agents: { t: "شبكات الوكلاء", p: "وكلاء الميدان والبائعون" },
        },
      },
    },
    rbi: {
      k: "للكيانات الخاضعة لتنظيم RBI",
      h: "ما نفعله، وما يتركه RBI لكم.",
      sub: "يعدّ RBI منصة DigiLocker وسيلة رقمية لضمّ العملاء الذين لا يزورون الفرع — وسيلة «غير وجهًا لوجه». ويسمح بها بشروط إضافية.",
      does: {
        k: "الحزمة تفعل هذا",
        items: [
          "تأخذ موافقة العميل",
          "تتحقق من PAN",
          "تجلب آدهار من DigiLocker كمستند إلكتروني موقَّع",
          "تفحص الحيوية وتطابق الوجه",
          "تُبقي الدليل في سجل واحد",
        ],
      },
      asks: {
        k: "ويطلب RBI من البنوك أيضًا",
        items: [
          "عرض Video KYC (V-CIP) أولًا، إن كانوا يوفّرونه",
          "جعل أول معاملة إيداعًا من حساب العميل البنكي الممتثل لـ KYC",
          "تصنيف هؤلاء العملاء عاليي المخاطر، مع مراقبة معززة",
        ],
        source: "المصدر:",
        sourceName: "RBI (Commercial Banks – KYC) Directions, 2025",
        sourceHref: "https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13141",
        sourceTail: "، الفقرة 44. وعلى الكيانات الأخرى مراجعة التوجيهات التي تنطبق عليها.",
      },
    },
    faq: {
      h: "أسئلة شائعة.",
      items: [
        { q: "هل هذا «Full KYC» أم «Minimum KYC»؟", a: "لا هذا ولا ذاك. كلاهما مصطلح معرَّف في قواعد RBI، لذلك لا نستخدمهما كتصنيف. هذا KYC قائم على الموافقة وغير وجهٍ لوجه. وما إذا كان يفي بمتطلب منتجكم فقرار فريق الامتثال لديكم." },
        { q: "كم يستغرق؟", a: "بضع دقائق للعميل. يجري كل فحص عند اكتمال خطوته، فيكون القرار جاهزًا فور مشاركة DigiLocker." },
        { q: "ماذا لو فشل فحص؟", a: "تُعلَّم الحالة بالسبب — عدم تطابق الاسم أو فشل فحص الحيوية، مثلًا — وتُرسَل إلى فريقكم." },
        { q: "هل يرفع العميل آدهار؟", a: "لا. يأتي من DigiLocker، موقَّعًا من الجهة المُصدِرة. يلتقط العميل سيلفي وصورة لبطاقة PAN فقط." },
        { q: "هل تستطيع الأنشطة غير الخاضعة للتنظيم استخدامه؟", a: "نعم. تستخدمه الأسواق ومنصات العمل الحر والإيجار والتوظيف لتعرف من تضمّه." },
      ],
    },
    close: {
      h: "تحقق من عميلك التالي في دقائق.",
      sub: "ستة فحوصات. قرار واحد. بلا مكتب عمليات.",
      cta: "احصل على حزمة KYC",
      cta2: "تحدث إلى المبيعات",
    },
  },

  /** `/products/certifier` — the old `certifier.base.json`, word for word, in
   *  its order: hero, We Verify What Matters Most (two tabs of four checks),
   *  How Certifier Works For Businesses? (image slider beside four tabs),
   *  Industries We Serve, Why Businesses Should Consider Certifier?, the
   *  API-Driven Counterparty Platform (two slides of four). Bold runs in the
   *  Vendor Monitoring lines are the old CMS `bold` parts. */
  certifier: {
    crumb: "Certifier",
    hero: {
      h1: (<><em>Certifier</em></>),
      sub: "نعيد تعريف التحقق من الطرف الثالث للشركات B2B عبر تقديم مصادقة سريعة وموثوقة للهويات والمستندات التي تتطلبها المؤسسات الحديثة.",
      cta: "تحدث إلى المبيعات",
    },
    checks: {
      h: "نتحقق مما يهم أكثر",
      sub: "تساعدك فحوصات التحقق المتقدمة لدينا على ضمّ موردين موثوقين وتقليل المخاطر عبر سلسلة التوريد بأكملها.",
      tabs: {
        business: {
          label: "التحقق من الرخصة التجارية والمؤسسين",
          cards: {
            tradeLicense: { t: "فحص الرخصة التجارية", p: "يتضمن هذا الفحص التحقق من المؤهلات التعليمية والمهنية للمرشح، إلى جانب التأكد من موثوقية الجامعة أو الكلية أو المؤسسة الأكاديمية التي مُنحت منها المؤهلات." },
            defaultingDirectors: { t: "فحص المديرين المتعثرين", p: "يحدد فحص المديرين المتعثرين ما إذا كان المرشح مُدرجًا كمدير متعثر في أي شركة بسبب عدم الامتثال أو التعثر المالي أو المخالفات التنظيمية." },
            criminalRecords: { t: "فحص السجلات الجنائية", p: "يتضمن هذا الفحص البحث في سجلات المحاكم عبر مختلف الاختصاصات، بما فيها المحكمة العليا والمحاكم العليا في الولايات ومحاكم المقاطعات والهيئات القضائية، لتحديد أي تهم جنائية بحق المرشح." },
            creditCompany: { t: "فحص الائتمان والشركات", p: "يقيّم فحص الائتمان والشركات ضمن التحقق من الخلفية الملف الائتماني للمرشح، ويتحقق من مشروعية الشركات المرتبطة به ووضعها عبر السجلات الرسمية والمالية." },
          },
        },
        vendor: {
          label: "التحقق من الموردين والائتمان والوضع المالي",
          cards: {
            financialAssessment: { t: "فحص\nالتقييم المالي", p: "يشمل التقييم المالي ضمن العناية الواجبة للأعمال تقييم الصحة المالية للشركة من خلال مراجعة قوائمها المالية وملفها الائتماني ومؤشراتها المالية الرئيسية، لتقدير الاستقرار والمخاطر." },
            gstScreening: { t: "فحص\nتسجيل GST", p: "يشمل فحص GST ضمن العناية الواجبة للأعمال التحقق من تسجيل الشركة في ضريبة السلع والخدمات ووضعها وامتثالها عبر السجلات الرسمية." },
            creditCheck: { t: "فحص\nالائتمان", p: "يتضمن فحص الائتمان التحقق من الدرجة الائتمانية للمرشح ومؤشرات المخاطر عبر مكتب ائتمان. تُحتسب الدرجة الائتمانية بناءً على التاريخ الائتماني للفرد." },
            promoterCriminal: { t: "فحص السجل الجنائي\nللمؤسسين", p: "يشمل فحص السجل الجنائي للمؤسسين ضمن العناية الواجبة للأعمال التحقق مما إذا كان لدى مؤسسي الشركة أي سجلات جنائية عبر قواعد بيانات المحاكم والجهات القانونية." },
          },
        },
      },
    },
    how: {
      h: "كيف يعمل Certifier للشركات؟",
      intro: ["ابدأ مجانًا—Certifier منصة HelloVerify لفحص الموردين.", "أدرج الموردين أسرع 10 مرات مع مراقبة الامتثال في الوقت الحقيقي."],
      slides: ["سير عمل التحقق من الموردين", "فريق يتعاون في فحص الموردين", "مراجعة تفاصيل التحقق", "تخطيط الأعمال والامتثال"],
      tabs: { onboarding: "الانضمام الافتراضي", monitoring: "مراقبة الموردين", statutory: "الفحوصات النظامية", agreement: "اتفاقية افتراضية وتوقيع إلكتروني" },
      onboarding: {
        h: "الانضمام الافتراضي — موثّق في 4 خطوات بدون أوراق",
        sub: "خصّص وارفع جميع بيانات الموردين افتراضيًا.",
        steps: ["إرسال دعوة", "إدخال المعلومات الشخصية", "التقاط الموقع", "رفع سيلفي وإثبات الهوية"],
      },
      monitoring: {
        h: "مراقبة الموردين — تنبيهات تلقائية عند تغيّر المخاطر",
        items: [
          (<><b>{"ارفع افتراضيًا"}</b>{" – ارفع أي صورة للموقع الذي ترغب برؤيته أو الاحتفاظ به كسجل."}</>),
          (<>{"استلم ملاحظات صوتية للحصول على "}<b>{"تغذية راجعة فورية."}</b></>),
          (<>{"استلم فيديوهات للمواقع/المشاريع القائمة لتبقى "}<b>{"على اطلاع "}</b>{"على التقدم الحالي."}</>),
        ],
      },
      statutory: {
        h: "الفحوصات النظامية — امتثل تلقائيًا",
        intro: ["ارفع جميع المستندات المطلوبة وتحقق فورًا.", "نستخدم قدرات الذكاء الاصطناعي وتعلم الآلة لتقديم أسرع خدمة فحص."],
        items: ["Global WatchList", "Company Screening", "Identity Screening", "GST Screening", "Financial Screening", "Credit Suit Default Screening"],
      },
      agreement: {
        h: "اتفاقية افتراضية وتوقيع إلكتروني — كن رقميًا بأمان وموثوقية",
        intro: "كن رقميًا معنا وحرك أعمالك بأمان وموثوقية.",
        items: ["إنشاء اتفاقية جديدة", "إضافة توقيع رقمي", "توقيع الاتفاقية ومشاركتها"],
      },
    },
    industries: {
      h: "القطاعات التي نخدمها",
      p: "منصة واحدة تدعم التحقق والمصادقة والامتثال عبر القطاعات. مصممة لتتكيف مع المتطلبات المخصصة لكل قطاع نخدمه.",
      cards: {
        realEstate: { t: "شركات العقارات والإنشاءات والتصنيع", alt: "محترف يرتدي خوذة وبجواره نماذج معمارية" },
        ecommerce: { t: "منصات التجارة الإلكترونية واكتشاف الموردين", alt: "شخص يستخدم الهاتف والكمبيوتر للتسوق واكتشاف الموردين" },
        it: { t: "شركات تقنية المعلومات والرعاية الصحية", alt: "مختصون صحيون يراجعون مستندات" },
        retail: { t: "سلاسل السلع الاستهلاكية السريعة (FMCG) والتجزئة", alt: "موظف تجزئة مع عربة تسوق داخل متجر" },
      },
    },
    why: {
      h: "لماذا يجب على الشركات اختيار Certifier؟",
      p: "تحقق موثوق وآمن وفعّال — مصمم للشركات الحديثة. يساعدك على الحفاظ على الامتثال مع توفير الوقت والجهد التشغيلي.",
      cards: {
        fast: { t: "تسريع انضمام الموردين بمقدار 10 أضعاف", p: "من تقييم المورد إلى الاختيار النهائي، تحول منصتنا بيانات الأداء إلى قرارات مهمة — لتحديد أفضل الموردين وبناء عملية اختيار قائمة على الحقائق." },
        blacklist: { t: "إيقاف الموردين المدرجين سابقًا في القوائم السوداء", p: "يرفع Certifier معيار تأهيل الموردين عبر تحديد الكيانات المتوافقة والموثوقة والمتوافقة تمامًا مع معايير شركتك." },
        monitoring: { t: "تقليل المخاطر عبر المراقبة المستمرة", p: "لا تفاجأ بعد الآن. تحديثات الموردين الفورية بالصور والفيديوهات والملاحظات الصوتية تمنحك رؤية كاملة قبل أن تتحول أي مشكلة إلى أزمة." },
        brand: { t: "حماية نزاهة علامتك التجارية", p: "تتطور قدرات الذكاء الاصطناعي وتعلم الآلة في Certifier مع كل تحقق — بدمج الذكاء الآلي والحكم البشري لضمان مرور الموردين الأصليين فقط." },
      },
    },
    api: {
      h: "منصة طرف مقابل قائمة على واجهات API",
      p: "دع طرفًا ثالثًا ينفذ جميع فحوصات الامتثال نيابةً عنك. يمكن للشركات حماية سمعتها وتقليل العواقب القانونية المحتملة والحفاظ على الامتثال للمعايير القانونية والأخلاقية.",
      cards: {
        mca: { t: "وزارة الشؤون المؤسسية", p: "تجربة موظف أفضل بتحقق أسرع وعالي الكفاءة—يقلل وقت الانضمام ويخفض التكاليف التشغيلية حتى 75%." },
        gst: { t: "ضريبة السلع والخدمات (GST)", p: "يؤكد تحقق GST صلاحية GSTIN ويوفر تفاصيل مثل الاسم القانوني ونوع الكيان وحالة التسجيل—لمساعدة في كشف سجلات GST الاحتيالية." },
        owner: { t: "التحقق من المالك والمدير", p: "يؤكد هوية مالكي الشركة أو مديريها عبر مستندات رسمية مثل PAN أو Aadhaar أو بطاقة الناخب أو رخصة القيادة بمطابقتها مع قواعد بيانات الجهة المصدرة." },
        company: { t: "فحص الشركة", p: "يشمل زيارة موقع الشركة والمراجعة عبر Rolodex (قائمة الشركات الوهمية) وMoCA وNASSCOM والبحث العكسي عن النطاق، ثم مكالمات وهمية وتسوق سري وتحقق ميداني." },
        bank: { t: "التحقق من كشف الحساب البنكي", p: "يتحقق هذا الفحص من أصالة ملكية حساب بنكي محدد." },
        global: { t: "قاعدة البيانات العالمية", p: "يفحص هذا الأفراد والكيانات مقابل قواعد بيانات عالمية لتحديد المخاطر المحتملة وقوائم المراقبة أو السجلات السلبية." },
        directorship: { t: "فحص المنصب الإداري", p: "يتحقق هذا الفحص من تفاصيل المرشح عبر بوابة قاعدة بيانات MCA باستخدام معرفات مثل الاسم وتاريخ الميلاد أو لقب الأب لمطابقة السجلات مع قاعدة بيانات وزارة الشؤون المؤسسية الرسمية." },
        credit: { t: "فحص ائتمان الشركة", p: "يُستخرج التقرير من مكتب ائتمان ويشمل درجة Credit/CIBIL ومؤشرات المخاطر، مع التحقق من اسم مقدم الطلب وPAN وتفاصيل القروض النشطة والمغلقة." },
      },
    },
  },
};
