/** Hindi business copy, annotated, not in registry, Part 9b.4.
 *
 *  `export const hi: BusinessCopy` — recipe step 1b in `./index`. Without
 *  the annotation a stray key typechecks and is never rendered. `en` stays
 *  the unannotated schema. Not in `BUSINESS`; `routing.locales` is `["en"]`.
 *  Both sides move in Part 9b.7.
 *
 *  Brand names (HelloVerify, HelloV, Certifier), acronyms, figures, prices
 *  and JSX `{link}` / `{n}` slots stay as in English.
 */
import type { BusinessCopy } from "./business";

export const hi: BusinessCopy = {
  crumb: "व्यवसाय",

  hub: {
    hero: {
      k: "व्यवसाय के लिए",
      h1: (
        <>
          हर नियुक्ति, सत्यापित <em>पहले दिन से पहले।</em>
        </>
      ),
      sub:
        "आप जिस भी भूमिका में नियुक्ति करते हैं — राइडर से निदेशक तक — एक पाइपलाइन। AI दस्तावेज़ पढ़ता है, " +
        "हमारी टीम जारीकर्ता से पुष्टि करती है, और उत्तर इंडक्शन वीडियो खत्म होने से पहले पहुँच जाता है।",
      cta: "बिक्री से संपर्क",
      plans: "पैकेज और मूल्य देखें",
    },

    strip: {
      checks: (<><b>20M+</b> जाँच, 2018 से</>),
      clients: (<><b>2,000+</b> व्यापारिक ग्राहक</>),
      package: (<><b>30 मिनट</b> ब्लू-कॉलर पैकेज</>),
      countries: (<><b>120+</b> देश</>),
      certs: (<><span className="dot" /> ISO 27001 · GDPR · PBSA</>),
    },

    paths: {
      "/products/bgv-enterprise": {
        tag: "एंटरप्राइज़",
        from: "2,000+ ग्राहक",
        h: "एंटरप्राइज़ BGV",
        p: "SLA के साथ उच्च-मात्रा नियुक्ति। API, बल्क अपलोड, और जवाब देने वाली टीम।",
      },
      "/products/bgv-smb": {
        tag: "लघु और मध्यम व्यवसाय",
        from: "30 मिनट से",
        h: "SMB पैकेज",
        p: "पैकेज चुनें, दस्तावेज़ अपलोड करें, उत्तर पाएँ। सार्वजनिक मूल्य, बिक्री कॉल की ज़रूरत नहीं।",
      },
      "/employee-verification": {
        tag: "HR और संचालन",
        from: "60 मिनट",
        h: "कर्मचारी सत्यापन",
        p: "मौजूदा स्टाफ, ठेकेदार और गिग कार्यबल — सत्यापित और पुनः सत्यापित।",
      },
      "/products/customer-kyc": {
        tag: "ट्रस्ट और सुरक्षा",
        from: "साइनअप पर",
        h: "ग्राहक KYC",
        p: "ग्राहकों को साइनअप के क्षण सत्यापित करें, नुकसान पहुँचाने से पहले।",
      },
      "/products/certifier": {
        tag: "प्रोक्योरमेंट",
        from: "2 दिन",
        h: "विक्रेता ड्यू डिलिजेंस",
        p: "Certifier: व्यापार लाइसेंस, निदेशक, क्रेडिट और आपराधिक रिकॉर्ड — सप्लायर पर हस्ताक्षर से पहले।",
      },
    },

    fiveWays: {
      k: "पाँच रास्ते",
      h: "आपके व्यवसाय को कौन सा पृष्ठभूमि सत्यापन उत्पाद चाहिए?",
      lede:
        "HelloVerify एक प्लेटफ़ॉर्म पर पाँच व्यापार पाइपलाइन चलाता है: SLA के साथ एंटरप्राइज़ BGV, " +
        "30 मिनट से SMB पैकेज, कर्मचारी पुनः सत्यापन, साइनअप पर ग्राहक KYC, और दो दिनों में " +
        "Certifier विक्रेता ड्यू डिलिजेंस। एक अपलोड, एक रिपोर्ट — बदलता केवल यह है कि कौन-सी जाँच चलती हैं।",
    },

    pipeline: {
      k: "एक पाइपलाइन",
      h: "पृष्ठभूमि सत्यापन कैसे काम करता है?",
      lede:
        "हर HelloVerify जाँच चार चरणों से गुज़रती है: उम्मीदवार दस्तावेज़ का चित्र लेता है, " +
        "AI हर फ़ील्ड कैप्चर करता है और जारीकर्ता कार्यालय ढूँढता है, अनुरोध उस जारीकर्ता तक जाता है, " +
        "और एक रिपोर्ट वापस आती है जिसमें हर परिणाम के साथ स्रोत का नाम होता है।",
    },

    steps: {
      upload: {
        n: "01",
        t: "अपलोड",
        p: "दस्तावेज़ का चित्र लें। किनारों, चमक और फ़ोकस की जाँच शटर के पहले होती है।",
      },
      read: {
        n: "02",
        t: "पढ़ें",
        p: "AI हर फ़ील्ड कैप्चर करता है, दस्तावेज़ की स्वयं से जाँच करता है, और जारी करने वाला कार्यालय ढूँढता है।",
      },
      confirm: {
        n: "03",
        t: "पुष्टि",
        p: "अनुरोध जारीकर्ता तक जाता है। डिग्री के लिए वह रजिस्ट्रार है — कोई ऐसी वेबसाइट नहीं जो वैसी दिखती हो।",
      },
      report: {
        n: "04",
        t: "रिपोर्ट",
        p: "एक रिपोर्ट, हर परिणाम के साथ स्रोत का नाम। आपके ATS या इनबॉक्स से जुड़ी।",
      },
    },

    integrate: {
      k: "एक बार जोड़ें",
      h: "HelloVerify हमारी नियुक्ति टूल्स से कैसे जुड़ता है?",
      lede:
        "HelloVerify REST API, वेबहुक, बल्क CSV अपलोड, ATS इंटीग्रेशन और SSO/SAML से जुड़ता है। " +
        "उम्मीदवार WhatsApp या लिंक से अपलोड करते हैं, और परिणाम वहीं आते हैं जहाँ आपकी नियुक्ति टीम पहले से काम करती है — " +
        "जो भी व्यापार उत्पाद आप खरीदें, पाइपलाइन वही रहती है।",
    },

    services: {
      api: "REST API",
      webhooks: "वेबहुक",
      csv: "बल्क CSV अपलोड",
      ats: "ATS इंटीग्रेशन",
      whatsapp: "WhatsApp उम्मीदवार प्रवाह",
      sso: "SSO / SAML",
    },
    explore: "प्लेटफ़ॉर्म देखें",

    certs: {
      iso27001:
        "सूचना सुरक्षा प्रबंधन, स्वतंत्र ऑडिट। रिपोर्ट NDA के तहत उपलब्ध।",
      pbsa: "स्क्रीनिंग उद्योग की वैश्विक मानक संस्था के सदस्य।",
      pbsaLink: "सुरक्षा और अनुपालन →",
    },
  },

  /** `/products/bgv-enterprise` — the old `enterprise.base.json`, word for
   *  word, in its order: hero, trust strip (title, subtitle, six partner
   *  logos), the Employees / Businesses / Customers screening tabs. The old
   *  `titleBold` was empty in every locale and is not carried. */
  enterprise: {
    crumb: "Enterprise",
    hero: {
      h1: (<>भारत की सबसे बड़ी एंटरप्राइज़ द्वारा भरोसेमंद AI-संचालित स्क्रीनिंग। <br /><em>गलत हायरिंग शुरू होने से पहले रोकें।</em></>),
      cta: "सेल्स से बात करें",
    },
    trust: {
      before: "भारत की शीर्ष",
      after: "IT/ITES कंपनियों द्वारा भरोसेमंद",
      second: "बैकग्राउंड वेरिफिकेशन",
      sub: "AI और समर्पित इन-हाउस वेरिफिकेशन विशेषज्ञों का संयोजन धोखाधड़ी को रोकता है और वास्तविक उपयोगकर्ताओं के लिए सहज अनुभव सुनिश्चित करता है।",
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
      h: (<>आपके संगठन के हर हिस्से के लिए बैकग्राउंड चेक <br /><em>स्क्रीनिंग के लिए चुनें</em></>),
      tabs: { employees: "कर्मचारी", businesses: "व्यवसाय", customers: "ग्राहक" },
    },
    employees: {
      h: "सभी के लिए बैकग्राउंड चेक",
      p: "HelloVerify एकमात्र डिजिटल परत है जो बैकग्राउंड चेक प्रक्रिया को स्वचालित कर धोखाधड़ी कम करती है और सबसे तेज़ ऑनबोर्डिंग सुनिश्चित करती है।",
      values: {
        fast: { t: "तेज़", tag: "उद्योग औसत से 3× तेज़", p: "HelloVerify कृत्रिम बुद्धिमत्ता और मशीन लर्निंग से सबसे तेज़ बैकग्राउंड स्क्रीनिंग सेवा प्रदान करता है।" },
        accurate: { t: "सटीक", tag: "99.2% सत्यापित रिपोर्ट दर", p: "हमारी त्वरित बैकग्राउंड चेक प्रक्रिया धोखाधड़ी वाले दस्तावेज़ हटाकर सही उम्मीदवार को हायर करने में मदद करती है।" },
        compliant: { t: "अनुपालक", tag: "ISO 27001 + GDPR प्रमाणित", p: "HelloVerify उच्च स्तर का अनुपालन करता है और बैंक-स्तरीय सुरक्षा सुनिश्चित करता है।" },
      },
      explore: "और जानें",
      checksH: "हमारे चेक",
      stats: {
        checks: { a: "30+", b: "चेक" },
        countries: { a: "120+", b: "देश" },
        tat: { a: "1 से 7", b: "कार्य दिवस TAT" },
        api: { a: "REST API + बल्क", b: "अपलोड" },
      },
      groups: {
        enterprise: {
          h: "एंटरप्राइज़ चेक",
          a: ["पहचान जाँच", "शिक्षा जाँच", "शैक्षणिक संस्थान जाँच", "रोजगार जाँच", "बैंक स्टेटमेंट जाँच", "व्यवसाय पंजीकरण प्रमाणपत्र", "3D प्रोफाइलिंग और चेहरा पहचान"],
          b: ["पेशेवर लाइसेंस जाँच", "आपराधिक जाँच", "पता जाँच", "वैश्विक डेटाबेस जाँच", "कंपनी जाँच", "सभी ड्रग पैनल"],
        },
        tampering: {
          h: "दस्तावेज़ छेड़छाड़",
          a: ["लाइसेंस सत्यापन", "प्रमाणपत्र", "दस्तावेज़", "बैंक स्टेटमेंट"],
        },
      },
    },
    businesses: {
      h: "सही वेंडर्स के साथ पार्टनर करने के लिए\nव्यवसाय सत्यापन और ड्यू डिलिजेंस",
      p: "HelloVerify के Certifier के साथ, क्लाइंट्स प्रमाणित प्रोफाइल पा सकते हैं जिनमें सेल्फी, लोकेशन कन्फर्मेशन, साइट विज़ुअल्स, स्क्रीनिंग, क्लीयरेंस, एग्रीमेंट और डिजिटल सिग्नेचर शामिल हैं।",
      features: {
        dueDiligence: "व्यापक वेंडर\nड्यू डिलिजेंस",
        kyc: "वेंडर KYC और\nदस्तावेज़ सत्यापन",
        criminal: "कानूनी, आपराधिक और\nकोर्ट रिकॉर्ड स्क्रीनिंग",
        financial: "वित्तीय जोखिम और\nक्रेडिट मूल्यांकन",
        compliance: "अनुपालन और\nनियामक स्क्रीनिंग",
        reference: "संदर्भ और पिछले प्रदर्शन\nसत्यापन",
      },
      explore: "और जानें",
    },
    customers: {
      brand: "ट्रस्ट और सेफ्टी",
      sub: "तेज़, सटीक और अनुपालित व्यवसाय वृद्धि के लिए ट्रस्ट इन्फ्रास्ट्रक्चर",
      pillar: "सभी हितधारकों के लिए वित्तीय धोखाधड़ी से आगे रहने का भरोसेमंद साझीदार",
      body: ["ट्रस्ट और सेफ्टी प्लेटफ़ॉर्म एक व्यापक KYC समाधान है जो डिजिटल ऑनबोर्डिंग और धोखाधड़ी पहचान की प्रक्रियाओं को सरल बनाता है।", "नियामक-अनुपालित समाधानों से अपना व्यवसाय मजबूत करें और डिजिटल ऑनबोर्डिंग व सत्यापन के हर चरण में भरोसा बनाएं—PEP स्क्रीनिंग और ड्यू डिलिजेंस से प्रतिष्ठा विश्लेषण, अनुपालन और आपराधिक वॉचलिस्ट तक, हर ऑनबोर्डिंग सुरक्षित और विश्वसनीय रहे।"],
      explore: "और जानें",
      advH: "हमारे ग्राहकों ने जो प्रमुख लाभ देखे हैं",
      adv: {
        cost: { v: "90%", sub: "ऑनबोर्डिंग में लागत में कमी।" },
        time: "ऑनबोर्डिंग का समय घंटों से मिनटों में कम करें।",
        fraud: "हमारी 3D प्रोफाइलिंग, फेस मैच और AML जाँच से धोखाधड़ी पहचान में 90% तक वृद्धि।",
        paperless: "कागज़रहित, स्वचालित प्रक्रियाएँ कानूनी आवश्यकताओं का आसान अनुपालन सुनिश्चित करती हैं।",
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
    crumb: "SMB के लिए BGV",
    hero: {
      h1: (<>छोटे और मध्यम व्यवसायों के लिए <br /><em>बैकग्राउंड चेक</em></>),
      sub: "हमारी AI और ML सक्षम स्वामित्व वाली तकनीक स्टार्टअप्स और छोटे व मध्यम व्यवसायों के लिए वन‑स्टॉप स्क्रीनिंग समाधान प्रदान करती है।",
      cta: "सेल्स से बात करें",
      talkFirst: "बिक्री से बात करें",
    },
    strip: {
      checks: (<><b>1200+</b> SMB HelloVerify पर भरोसा करते हैं</>),
      subscription: (<><b>60 मिनट</b> बेसिक, स्टैंडर्ड और प्रीमियम के लिए</>),
      invoice: (<><span className="dot" /> औसत TAT 9 दिन</>),
    },
    closing: {
      ctaLabel: "पैकेज देखें",
    },
    trust: { h: "पृष्ठभूमि सत्यापन के लिए 1,200+ लघु और मध्यम व्यवसायों का भरोसा" },
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
      h: "यह कैसे काम करता है?",
      steps: {
        select: { n: "01", t: "चेक चुनें", p: "हमारे व्यापक चेक्स में से अपनी आवश्यकता के अनुसार अपना ऑर्डर कस्टमाइज़ करें" },
        fill: { n: "02", t: "जानकारी भरें", p: "वेरिफिकेशन के लिए व्यक्ति की सहमति और आवश्यक जानकारी प्रदान करें" },
        fast: { n: "03", t: "24 घंटे जितनी तेज़", p: "निर्णय लेने के लिए सहज रिपोर्ट प्राप्त करें" },
      },
    },
    packages: {
      h: "वेरिफिकेशन पैकेज चुनें या कस्टमाइज़ करें",
      checksInclude: "चेक्स में शामिल",
      buy: "अभी खरीदें",
      items: {
        basic: {
          t: "बेसिक पैकेज",
          price: "₹1799",
          ready: "60 मिनट",
          p: "सरकारी पहचान पत्र सत्यापित करता है, आपराधिक रिकॉर्ड जाँचता है, और छिपे जोखिमों के लिए वैश्विक वॉचलिस्ट से मिलान करता है।",
          checks: ["आइडेंटिटी चेक", "क्रिमिनल चेक", "ग्लोबल डेटाबेस चेक"],
        },
        standard: {
          t: "स्टैंडर्ड पैकेज",
          price: "₹2199",
          ready: "60 मिनट",
          p: "बेसिक के सभी चेक के साथ पता सत्यापन, ताकि आपको अधिक पूर्ण बैकग्राउंड तस्वीर मिले।",
          checks: ["आइडेंटिटी चेक", "क्रिमिनल चेक", "ग्लोबल डेटाबेस चेक", "वर्तमान पता चेक"],
        },
        premium: {
          t: "प्रीमियम पैकेज",
          price: "₹2399",
          ready: "60 मिनट",
          p: "स्टैंडर्ड के सभी चेक के साथ मूनलाइटिंग जाँच, ताकि किसी भी अघोषित द्वितीयक रोजगार का पता चले।",
          checks: ["आइडेंटिटी चेक", "वर्तमान पता चेक", "क्रिमिनल चेक", "ग्लोबल डेटाबेस चेक", "मूनलाइटिंग चेक"],
        },
      },
      customize: "अपना पैकेज कस्टमाइज़ करें",
    },
    table: {
      h: "अपने चेक्स चुनें",
      cols: { check: "चेक", pricing: "कीमत", action: "एक्शन" },
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
          n: "Education Check-Highest Education (Extra University Chargesapplicable)",
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
      more: "और जानें",
      exploreLess: "Explore Less",
    },
    summary: {
      h: "अपना पैकेज कस्टमाइज़ करें",
      p: "आप जिन लोगों को नियुक्त करते हैं उनकी विश्वसनीयता जाँचें और किसी भी अपराध के जोखिम से अपने घर/बच्चे/कार की सुरक्षा करें।",
      checksInclude: "चेक्स में शामिल",
      empty: "अपना पैकेज बनाने के लिए टेबल से चेक्स चुनें।",
      buy: "अभी खरीदें",
    },
    trusted: {
      h: "व्यवसायों और व्यक्तियों द्वारा भरोसेमंद",
      stats: {
        smbs: { v: "1200+", l: "SMBs HelloVerify पर भरोसा करते हैं" },
        tat: { v: "9 Day TAT", l: "औसत TAT" },
        start: { v: "₹649", l: "प्रति चेक शुरुआती कीमत" },
      },
      stars: "4 out of 5 stars",
      people: {
        rohit: {
          name: "Rohit Sharma",
          role: "रेस्टोरेंट ओनर",
          quote: "“पहले स्टाफ हायर करना जोखिम भरा लगता था, लेकिन HelloVerify ने इसे आसान और भरोसेमंद बना दिया। अब हम पूरी आत्मविश्वास के साथ ऑनबोर्ड करते हैं।„",
          alt: "Rohit Sharma",
        },
        anjali: {
          name: "Anjali Mehta",
          role: "स्टार्टअप फाउंडर",
          quote: "“तेज़, सटीक और बिना रुकावट वेरिफिकेशन। HelloVerify ने बिना देरी के हायरिंग स्केल करने में मदद की।„",
          alt: "Anjali Mehta",
        },
        neha: {
          name: "Neha Verma",
          role: "घरेलू नियोक्ता",
          quote: "“भरोसेमंद मदद मिलना बहुत ज़रूरी है। HelloVerify के साथ हर बार हायर करते समय मुझे सुरक्षा और भरोसा महसूस होता है।„",
          alt: "Neha Verma",
        },
      },
    },
    solutions: {
      h: "हमारे समाधान",
      sub: "छोटे और मध्यम व्यवसायों की ज़रूरतों के अनुरूप हमारी पेशकशें",
      tabs: { employee: "कर्मचारी वेरिफिकेशन", vendor: "वेंडर स्क्रीनिंग" },
      employee: {
        trust: { t: "हर हायर में भरोसा", p: "पहले क्लिक से लेकर अंतिम हायर तक—हमारे AI‑ड्रिवन ऑनबोर्डिंग और ऑटोमेटेड वर्कफ़्लोज़ हर कदम पर गति और सटीकता देते हैं।" },
        decision: { t: "हर निर्णय, भरोसे के साथ", p: "नैनी, हाउस स्टाफ, ड्राइवर और टेनेंट—जिन्हें आप अपने घर पर भरोसा करते हैं—उनका पूरा वेरिफिकेशन ज़रूरी है। 100% डिजिटल, तेज़ और सटीक—ताकि आपको कभी संदेह न रहे।" },
        instant: { t: "इंस्टेंट चेक्स, कॉन्फिडेंट हायर", p: "हर हायर में जोखिम होता है। HelloVerify के इंस्टेंट बैकग्राउंड चेक्स अनुमान को हटाते हैं—और रेड फ्लैग्स को पहले ही उजागर करते हैं।" },
      },
      vendor: {
        h: "सही वेंडर्स के साथ पार्टनर करने के लिए बिज़नेस वेरिफिकेशन और ड्यू डिलिजेंस",
        p: "HelloVerify के Certifier के साथ, क्लाइंट्स को प्रमाणित प्रोफाइल मिलते हैं जिनमें सेल्फी, लोकेशन कन्फर्मेशन, साइट विज़ुअल्स, स्क्रीनिंग, क्लीयरेंस, एग्रीमेंट और डिजिटल सिग्नेचर जैसी चीज़ें शामिल होती हैं।",
        features: {
          dueDiligence: "व्यापक वेंडर\nड्यू डिलिजेंस",
          kyc: "वेंडर KYC और\nदस्तावेज़ सत्यापन",
          criminal: "कानूनी, आपराधिक और\nकोर्ट रिकॉर्ड स्क्रीनिंग",
          financial: "वित्तीय जोखिम और\nक्रेडिट मूल्यांकन",
          compliance: "अनुपालन और\nनियामक स्क्रीनिंग",
          reference: "संदर्भ और पिछले प्रदर्शन\nसत्यापन",
        },
        offer: {
          h: "हम क्या ऑफर करते हैं",
          cards: {
            fast: { t: "वेंडर्स 10x तेज़ ऑनबोर्ड करें", p: "यह प्लेटफ़ॉर्म वेंडर परफ़ॉर्मेंस पर डेटा‑ड्रिवन निर्णय में मदद करता है—ताकि कंपनियाँ टॉप‑परफ़ॉर्मिंग वेंडर्स पहचानकर चयन प्रक्रिया बेहतर कर सकें।" },
            regulatory: { t: "नियामक अनुपालन बनाए रखें", p: "Certifier विश्वसनीय और योग्य इकाइयों की पहचान में मदद करता है जो कंपनी और कम्प्लायंस आवश्यकताओं के अनुरूप हों—जिससे हाई‑रिस्क/नॉन‑कम्प्लायंट वेंडर्स से जुड़ने की संभावना कम होती है।" },
            monitoring: { t: "निरंतर मॉनिटरिंग से जोखिम कम करें", p: "फोटो/वीडियो/वॉइस नोट्स के जरिए वेंडर गतिविधियों की रियल‑टाइम अपडेट्स और कॉन्ट्रैक्ट अनुपालन—बेहतर प्रोजेक्ट मैनेजमेंट और प्रोएक्टिव इश्यू रेज़ोल्यूशन के लिए।" },
            reputation: { t: "अपने व्यवसाय की प्रतिष्ठा की रक्षा करें", p: "Certifier की एडवांस्ड AI‑ML क्षमताएँ मानव हस्तक्षेप के साथ लगातार बेहतर होती रहती हैं—प्रामाणिक वेंडर वेरिफिकेशन सुनिश्चित करती हैं और गलत तत्वों को दूर रखती हैं।" },
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
    crumb: "कर्मचारी सत्यापन",
    hero: {
      h1: (<>हर वर्कफोर्स सेगमेंट के लिए <br /><em>ऑल‑इन‑वन बैकग्राउंड वेरिफिकेशन।</em></>),
      cta: "सेल्स से बात करें",
    },
    banner: "कर्मचारी सत्यापन समाधान",
    white: {
      h: "व्हाइट‑कॉलर वेरिफिकेशन",
      p: "व्हाइट‑कॉलर वेरिफिकेशन एक व्यापक प्रक्रिया है जो उन पेशेवर भूमिकाओं के लिए क्रेडेंशियल, बैकग्राउंड और पहचान को सत्यापित करती है जहाँ विशेषज्ञता और भरोसा जरूरी होता है। HelloVerify एक सुव्यवस्थित समाधान देता है जो हायरिंग रिस्क कम करता है, कम्प्लायंस सुनिश्चित करता है और भरोसेमंद वर्कफोर्स बनाने में मदद करता है।",
      checks: {
        education: { n: "शिक्षा जाँच", p: "आवेदक की शैक्षणिक और पेशेवर योग्यताओं का सत्यापन, जिसमें जारी करने वाले संस्थान की प्रामाणिकता भी शामिल है।" },
        identity: { n: "पहचान जाँच", p: "सरकारी दस्तावेज़ों से नाम, जन्मतिथि, पिता का नाम और आईडी नंबर मिलाकर आवेदक की पहचान सत्यापित करें।" },
        employment: { n: "रोज़गार जाँच", p: "कंपनी का नाम, कार्यकाल और पदनाम सहित आवेदक के रोजगार इतिहास का सत्यापन करें।" },
        criminalRecords: { n: "आपराधिक रिकॉर्ड जाँच", p: "सुप्रीम कोर्ट, हाई कोर्ट, जिला अदालतों और ट्रिब्यूनल सहित विभिन्न न्यायक्षेत्रों में कोर्ट रिकॉर्ड सत्यापित कर आवेदक के खिलाफ आपराधिक आरोपों की पहचान करें।" },
        reference: { n: "रेफरेंस जाँच", p: "पिछले नियोक्ताओं के रेफरेंस के माध्यम से आवेदक के पेशेवर आचरण, प्रदर्शन और अन्य योग्यताओं का सत्यापन करता है।" },
        drugTest: { n: "ड्रग टेस्ट जाँच", p: "Panel-1 से Panel-10 तक सभी पैनलों में ड्रग टेस्ट करें।" },
        globalDatabase: { n: "ग्लोबल डेटाबेस जाँच", p: "ग्लोबल डेटाबेस के माध्यम से अंतरराष्ट्रीय सैंक्शन लिस्ट, वॉचलिस्ट और रेग्युलेटरी रिकॉर्ड सत्यापित कर प्रतिकूल जानकारी चिह्नित करें और जोखिम कम करें।" },
        address: { n: "पता जाँच", p: "पात्र एड्रेस प्रूफ दस्तावेज़ों को आवेदक के लाइव जियोलोकेशन से मिलाकर डिजिटल रूप से पता सत्यापित करें। भौतिक साइट विज़िट आवश्यक नहीं।" },
        company: { n: "कंपनी जाँच", p: "संगठन के पंजीकरण, परिचालन स्थिति और प्रमुख व्यावसायिक विवरणों की पुष्टि करके आवेदक के पिछले नियोक्ता की वैधता सत्यापित करता है।" },
        credit: { n: "क्रेडिट जाँच", p: "क्रेडिट स्कोर, क्रेडिट इतिहास और संबंधित जोखिम मापदंडों का आकलन कर क्रेडिट ब्यूरो के माध्यम से आवेदक की क्रेडिट प्रोफ़ाइल सत्यापित करता है।" },
        criminalLawFirm: { n: "लॉ फ़र्म के माध्यम से आपराधिक जाँच", p: "विश्वसनीय लॉ फ़र्म पार्टनर के माध्यम से कोर्ट रिकॉर्ड सत्यापित कर आपराधिक रिकॉर्ड की पहचान करता है।" },
        directorship: { n: "डायरेक्टरशिप जाँच", p: "पहचानता है कि आवेदक वर्तमान में पंजीकृत कंपनियों में निदेशक पद पर है या पहले रहा है।" },
        form16: { n: "फ़ॉर्म 16 जाँच", p: "नियोक्ता द्वारा जारी फ़ॉर्म 16 सत्यापित कर आवेदक के वेतन, टैक्स कटौती और रोजगार विवरणों की पुष्टि करता है।" },
        resume: { n: "रेज़्यूमे वैलिडेशन", p: "आवेदक के रेज़्यूमे में दी गई शिक्षा, रोजगार, स्किल्स और अन्य क्रेडेंशियल्स की जानकारी सत्यापित करता है।" },
      },
      cta: "सेल्स से बात करें",
      alt: "व्हाइट‑कॉलर वेरिफिकेशन और कम्प्लायंस का प्रतिनिधित्व करते पेशेवर",
    },
    whiteWhy: {
      h: "व्हाइट‑कॉलर वेरिफिकेशन क्यों महत्वपूर्ण है?",
      cards: {
        integrity: { t: "वर्कफोर्स इंटीग्रिटी बढ़ाएँ", p: "आवेदकों में फर्जी अकादमिक, पेशेवर या पहचान दावों के जोखिम को पहचानें और हटाएँ। इससे सटीक हायरिंग, कम जोखिम और भरोसेमंद व कम्प्लायंट वर्कफोर्स बनती है।" },
        hiring: { t: "विश्वास के साथ हायरिंग तेज़ करें", p: "AI‑ड्रिवन ऑनबोर्डिंग और ऑटोमेटेड वर्कफ़्लो हायरिंग प्रक्रिया को एंड‑टू‑एंड सरल बनाते हैं—मैनुअल प्रयास कम, त्रुटियाँ कम और टर्नअराउंड तेज़।" },
        compliance: { t: "पूर्ण रेग्युलेटरी कम्प्लायंस सुनिश्चित करें", p: "हमारा इंटीग्रेटेड फ्रेमवर्क डेटा प्राइवेसी और सुरक्षा के लिए वैश्विक मानकों के अनुरूप है, और मजबूत प्रोटोकॉल व नियंत्रित एक्सेस के साथ जानकारी को सुरक्षित रखता है।" },
      },
    },
    results: {
      h: "HR और स्टाफिंग संगठनों ने HelloVerify के साथ बेहतर परिणाम देखे",
      stats: {
        workflow: "स्क्रीनिंग वर्कफ़्लो सरल हुआ",
        accuracy: "बैकग्राउंड चेक में बेहतर सटीकता",
        experience: "कैंडिडेट एक्सपीरियंस में सुधार",
      },
    },
    blue: {
      h: "ब्लू‑कॉलर वेरिफिकेशन",
      p: "मैन्युफैक्चरिंग, लॉजिस्टिक्स, कंस्ट्रक्शन, फ़ूड एंड बेवरेज—छोटे चिप्स के रूप में ताकि खरीदार अपने उद्योग को स्पष्ट रूप से पहचान सकें।",
      checks: {
        pan: { n: "पैन कार्ड जाँच", p: "पैन कार्ड वेरिफिकेशन आधिकारिक डेटाबेस के माध्यम से आवेदक के स्थायी खाता संख्या (PAN) को सत्यापित कर पहचान की पुष्टि करता है, विसंगतियों का पता लगाता है और कम्प्लायंस में सहायता करता है।" },
        registration: { n: "रजिस्ट्रेशन सर्टिफिकेट जाँच", p: "वाहन के रजिस्ट्रेशन विवरण—मालिकाना हक और रजिस्ट्रेशन स्टेटस सहित—की प्रामाणिकता सत्यापित करता है।" },
        drivingLicense: { n: "ड्राइविंग लाइसेंस सत्यापन", p: "आधिकारिक डेटाबेस के माध्यम से उम्मीदवार के ड्राइविंग लाइसेंस की प्रामाणिकता—लाइसेंस नंबर, वैधता और जारी करने वाला प्राधिकरण—सत्यापित करता है।" },
        criminalRecords: { n: "आपराधिक रिकॉर्ड जाँच", p: "कोर्ट रिकॉर्ड चेक कई न्यायक्षेत्रों में आधिकारिक ई-कोर्ट रिकॉर्ड खोजकर उम्मीदवार के खिलाफ आपराधिक मामलों की पहचान करता है। उपलब्ध होने पर सहायक केस विवरण क्लाइंट के साथ साझा किए जाते हैं।" },
        pennyDrop: { n: "पेनी ड्रॉप जाँच", p: "पेनी ड्रॉप वेरिफिकेशन एक नाममात्र राशि ट्रांसफर कर और खाताधारक के नाम को दिए गए विवरण से मिलाकर बैंक खाते की वैधता की पुष्टि करता है।" },
        liveness: { n: "लाइवनेस जाँच", p: "लाइवनेस चेक पहचान सत्यापन के दौरान व्यक्ति की भौतिक उपस्थिति सुनिश्चित करता है, ताकि फ़ोटो, वीडियो या मास्क से होने वाले धोखाधड़ी को रोका जा सके।" },
      },
      cta: "सेल्स से बात करें",
      alt: "ब्लू‑कॉलर वेरिफिकेशन का प्रतिनिधित्व करते सुरक्षा गियर में कर्मचारी",
    },
    blueWhy: {
      h: "ब्लू‑कॉलर वर्कर वेरिफिकेशन क्यों महत्वपूर्ण है?",
      cards: {
        trust: { t: "मिनटों में भरोसा, दिनों में नहीं", p: "हमारा प्लेटफ़ॉर्म सत्यापन को तेज़ बनाता है—सटीक, समय पर रिपोर्ट देकर डेटा को वास्तविक भरोसे में बदलता है, ताकि हर हायरिंग निर्णय प्रमाण‑आधारित हो।" },
        smart: { t: "स्मार्ट वेरिफाई करें, तेज़ भरोसा करें", p: "AI‑ड्रिवन ऑनबोर्डिंग और ऑटोमेटेड वर्कफ़्लो देरी हटाते हैं, त्रुटियाँ कम करते हैं और सही हायर तेज़ी से संभव बनाते हैं।" },
        compliance: { t: "कम्प्लायंस बनाए रखें", p: "कई उद्योगों में रेग्युलेटरी आवश्यकताएँ होती हैं जिनके लिए गहन बैकग्राउंड चेक जरूरी है—यह संगठन और हितधारकों दोनों की सुरक्षा करता है।" },
      },
    },
    automate: {
      h: "कर्मचारी और वर्कर ऑनबोर्डिंग ऑटोमेट करें",
      p: "बैकग्राउंड स्क्रीनिंग समाधान के वैश्विक प्रदाता के रूप में, हम सभी आकार की संस्थाओं को सही अवसरों के लिए सही लोगों को नियुक्त करने में मदद करते हैं। हमारे साथ जुड़ें और हायरिंग को मॉडर्नाइज़ करें।",
      tabs: {
        smooth: { t: "स्मूद एक्सपीरियंस", p: "हमारे प्लेटफ़ॉर्म तेज़ और सटीक रिपोर्ट के साथ डेटा को भरोसे में बदलते हैं। प्रमाण‑आधारित ट्रस्ट—बिना किसी समझौते के।", alt: "HelloVerify डैशबोर्ड और स्मूद ऑनबोर्डिंग अनुभव" },
        hrms: { t: "HRMS API और इंटीग्रेशन", p: "HelloVerify का HRMS API अपने सिस्टम में इंटीग्रेट करें और बैकग्राउंड चेक, कर्मचारी सत्यापन व कम्प्लायंस टास्क ऑटोमेट करें। रियल‑टाइम डेटा सिंक के साथ दक्षता और सटीकता बढ़ाएँ।", alt: "HRMS वर्कफ़्लो के साथ API‑ड्रिवन इंटीग्रेशन" },
        rules: { t: "रूल इंजन", p: "HelloVerify के रूल इंजन से निर्णय‑प्रक्रिया ऑटोमेट और ऑप्टिमाइज़ करें। वर्कफ़्लो कस्टमाइज़ करें, क्राइटेरिया सेट करें और कम्प्लायंस स्टैंडर्ड लागू करें।", alt: "रूल इंजन कॉन्फ़िगरेशन" },
        tracking: { t: "रियल‑टाइम ट्रैकिंग", p: "सत्यापन की स्थिति पर तुरंत अपडेट पाएं। प्रोग्रेस मॉनिटर करें और नोटिफिकेशन प्राप्त करें ताकि कोई महत्वपूर्ण अपडेट मिस न हो।", alt: "रियल‑टाइम ट्रैकिंग" },
        support: { t: "बेहतरीन सपोर्ट", p: "हमारी डेडिकेटेड टीम आपके सवालों और चुनौतियों में मदद के लिए हमेशा उपलब्ध है—तेज़ और प्रभावी समाधान के साथ।", alt: "कस्टमर सपोर्ट" },
        security: { t: "एंटरप्राइज़‑ग्रेड सुरक्षा", p: "HelloVerify एंटरप्राइज़‑ग्रेड सुरक्षा के साथ संवेदनशील डेटा की रक्षा करता है—मजबूत एन्क्रिप्शन, मानकों के अनुरूप कम्प्लायंस और प्रोएक्टिव मॉनिटरिंग के साथ।", alt: "एंटरप्राइज़‑ग्रेड सुरक्षा नियंत्रण" },
      },
    },
    psv: {
      h: "प्राइमरी सोर्स वेरिफिकेशन",
      items: {
        education: "शिक्षा सत्यापन",
        institute: "संस्थान मान्यता जाँच",
        employment: "रोज़गार सत्यापन",
        dualEmployment: "ड्यूल एम्प्लॉयमेंट सत्यापन",
        criminal: "आपराधिक रिकॉर्ड सत्यापन",
        identity: "पहचान सत्यापन",
        address: "पता सत्यापन",
        bank: "बैंक खाता सत्यापन",
      },
    },
  },

  /** `/products/customer-kyc` — the old `customerKyc.base.json`, word for
   *  word, in its order: hero (title, subtitle, Talk to Sales), the six-step
   *  How it Works grid with Talk to Sales, Solutions We Offer (six cards).
   *  Step numbers and icons live in the page. */
  customerKyc: {
    crumb: "ट्रस्ट और सुरक्षा — KYC",
    hero: {
      h1: (<>KYC <em>प्लेटफ़ॉर्म</em></>),
      sub: "तेज़ी से ऑनबोर्ड करें। पहले ही फ्रॉड पहचानें। हमारा समग्र KYC समाधान डिजिटल ऑनबोर्डिंग की हर स्टेप को एक साथ लाकर एक सहज अनुभव बनाता है, जिससे धोखेबाज़ बाहर रहते हैं और वास्तविक ग्राहक आगे बढ़ते हैं।",
      cta: "सेल्स से संपर्क",
    },
    how: {
      h: "हम ऑनलाइन पहचान धोखाधड़ी के खिलाफ मजबूत सुरक्षा प्रदान करते हैं—शक्तिशाली, सहज और हमेशा सक्रिय।",
      steps: {
        upload: { t: "यूज़र अपनी ID की फोटो अपलोड करता है", body: ["\"एंटिटी वेरिफिकेशन\" (MCA, GST, Company Check)", "\"फाइनेंशियल चेक्स\" (Bank Statement, Credit, Global DB)", "\"डायरेक्टर और ओनरशिप\" (Identity, Directorship)"], alt: "Step 1" },
        selfie: { t: "यूज़र सेल्फी लेता है", body: ["किसी भी सरकारी ID पर कैमरा रखें—हमारा AI डॉक्युमेंट टाइप अपने‑आप पहचान लेता है, मैन्युअल चयन की ज़रूरत नहीं।"], alt: "Step 2" },
        face: { t: "फेसियल रिकग्निशन", body: ["HelloVerify रियल‑टाइम गाइडेंस और स्मार्ट डॉक्युमेंट डिटेक्शन के साथ अनुभव को आसान बनाता है, डॉक्युमेंट टाइप स्वतः पहचानकर मैन्युअल एंट्री हटाता है—जिससे प्रोसेसिंग तेज़ होती है और त्रुटियाँ काफी कम होती हैं।"], alt: "Step 3" },
        liveness: { t: "लाइवलिनेस चेक", body: ["HelloVerify रियल‑टाइम गाइडेंस और इंटेलिजेंट डॉक्युमेंट रिकग्निशन के साथ मैन्युअल एंट्री हटाकर तेज़ प्रोसेसिंग और अधिक सटीकता सुनिश्चित करता है।"], alt: "Step 4" },
        decision: { t: "निर्णय प्राप्त करें", body: ["HelloVerify रियल‑टाइम गाइडेंस और स्मार्ट रिकग्निशन के साथ मैन्युअल इनपुट हटाकर तेज़ प्रोसेसिंग, बेहतर सटीकता और कम त्रुटियाँ सुनिश्चित करता है।"], alt: "Step 5" },
        onboard: { t: "कस्टमर को ऑनबोर्ड करें", body: ["HelloVerify रियल‑टाइम गाइडेंस और ऑटोमैटिक डॉक्युमेंट डिटेक्शन के साथ मैन्युअल एंट्री हटाकर वर्कफ़्लो तेज़ करता है, त्रुटियाँ घटाता है और कुल सटीकता बढ़ाता है।"], alt: "Step 6" },
      },
      cta: "सेल्स से संपर्क",
    },
    solutions: {
      h: "हमारे समाधान",
      sub: "डिजिटल ऑनबोर्डिंग और फ्रॉड डिटेक्शन की प्रक्रियाओं को सरल बनाने के लिए एक समग्र KYC समाधान।",
      cards: {
        kyc: { t: "KYC", items: ["पहचान सत्यापन", "लोकेशन कन्फर्मेशन", "लाइवलिनेस चेक", "फेसियल रिकग्निशन"] },
        kyb: { t: "KYB", items: ["GST सत्यापन", "MCA सत्यापन", "उद्योग/उद्यम आधार", "कंपनी PAN"] },
        underwriting: { t: "अंडरराइटिंग", items: ["GST-Lite व एडवांस्ड", "बैंक स्टेटमेंट विश्लेषण", "ITR चेक", "MCA डेटा पुल"] },
        fraud: { t: "फ्रॉड व रिस्क", items: ["कोर्ट रिकॉर्ड चेक", "PAN-आधार लिंक", "ईमेल रिस्क एनालिसिस", "1:N फेस-मैच"] },
        execute: { t: "एक्सिक्यूट", items: ["बैंक अकाउंट वैलिडेशन", "ई-साइन", "डिवाइस फिंगरप्रिंटिंग", "ई-स्टैम्प"] },
        aml: { t: "AML", items: ["कम्प्लायंस सुनिश्चित करें और जोखिम कम करें", "रियल-टाइम स्क्रीनिंग करें", "लेन-देन की लगातार निगरानी करें", "समग्र जोखिम आकलन करें"] },
      },
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
      sub: "हम B2B व्यवसायों के लिए थर्ड‑पार्टी वेरिफिकेशन को नए सिरे से परिभाषित कर रहे हैं — आधुनिक एंटरप्राइज़ की ज़रूरत के अनुसार पहचान और दस्तावेज़ों का तेज़, भरोसेमंद प्रमाणीकरण।",
      cta: "सेल्स से बात करें",
    },
    checks: {
      h: "We Verify What Matters Most",
      sub: "Our advance verification checks help you to onboard trustworthy vendors and minimise the risk across your supply chain.",
      tabs: {
        business: {
          label: "Business License & Promoter Verification",
          cards: {
            tradeLicense: { t: "Trade License Check", p: "This check involves verifying a candidate's educational and professional qualifications, along with confirming the authenticity of the university, college, or academic institution from which the qualifications were obtained." },
            defaultingDirectors: { t: "Defaulting Directors Check", p: "Defaulting Directors Check identifies whether a candidate has been listed as a defaulting director in any company due to non compliance, financial defaults or regulatory violations." },
            criminalRecords: { t: "Criminal Records Check", p: "This check involves searching court records across jurisdictions, including the Supreme Court, High Court, District Courts and tribunals to identify any criminal charges against the candidate." },
            creditCompany: { t: "Credit & Company Check", p: "A Credit & Company Check in background verification evaluates a candidate's credit profile and verifies the legitimacy and status of associated companies through official and financial records." },
          },
        },
        vendor: {
          label: "Vendor, Credit & Financial Verification",
          cards: {
            financialAssessment: { t: "Financial\nAssessment Check", p: "Financial Assessment in business due diligence involves evaluating a company's financial health by reviewing its financial statements, credit profile, and key financial indicators to assess stability and risk." },
            gstScreening: { t: "GST\nScreening Check", p: "GST Screening in business due diligence involves verifying a company's GST registration, status, and compliance through official records." },
            creditCheck: { t: "Credit\nCheck", p: "The credit check involves verifying the candidate's credit score and risk parameters through a Credit Bureau. A credit score is generated based on the individual's credit history." },
            promoterCriminal: { t: "Promoter Criminal\nHistory Check", p: "A Promoter Criminal History Check in business due diligence involves verifying whether company promoters have any criminal records through court and legal databases." },
          },
        },
      },
    },
    how: {
      h: "व्यवसायों के लिए Certifier कैसे काम करता है?",
      intro: ["मुफ़्त शुरू करें—Certifier HelloVerify का वेंडर स्क्रीनिंग प्लेटफ़ॉर्म है।", "रियल‑टाइम अनुपालन मॉनिटरिंग के साथ वेंडर्स को 10× तेज़ ऑनबोर्ड करें।"],
      slides: ["वेंडर सत्यापन वर्कफ़्लो", "वेंडर स्क्रीनिंग पर सहयोगी टीम", "सत्यापन विवरण की समीक्षा", "व्यवसाय योजना और अनुपालन"],
      tabs: { onboarding: "वर्चुअल ऑनबोर्डिंग", monitoring: "वेंडर मॉनिटरिंग", statutory: "स्टैच्यूटरी स्क्रीनिंग्स", agreement: "वर्चुअल एग्रीमेंट और ई‑साइन" },
      onboarding: {
        h: "वर्चुअल ऑनबोर्डिंग — 4 स्टेप्स में वेरिफाइड, बिना पेपरवर्क",
        sub: "अपने सभी वेंडर विवरण वर्चुअली कस्टमाइज़ और अपलोड करें।",
        steps: ["इनवाइट भेजें", "व्यक्तिगत जानकारी भरें", "लोकेशन कैप्चर", "सेल्फी और ID प्रूफ अपलोड"],
      },
      monitoring: {
        h: "वेंडर मॉनिटरिंग — जोखिम बदलाव पर ऑटोमैटिक अलर्ट",
        items: [
          (<><b>{"वर्चुअली अपलोड करें"}</b>{" – जिस साइट की तस्वीरें आप देखना/रिकॉर्ड रखना चाहते हैं, उसे वर्चुअली अपलोड करें।"}</>),
          (<>{"वॉइस नोट्स प्राप्त करें ताकि "}<b>{"तुरंत फीडबैक मिल सके।"}</b></>),
          (<>{"मौजूदा साइट/प्रोजेक्ट के वीडियो प्राप्त करें ताकि "}<b>{"आप अपडेटेड रहें "}</b>{"और प्रोग्रेस की जानकारी रहे।"}</>),
        ],
      },
      statutory: {
        h: "स्टैच्यूटरी स्क्रीनिंग्स — अपने‑आप अनुपालक रहें",
        intro: ["सभी आवश्यक दस्तावेज़ अपलोड करें और तुरंत सत्यापित करें।", "हम AI और ML क्षमताओं से सबसे तेज़ स्क्रीनिंग सेवा प्रदान करते हैं।"],
        items: ["Global WatchList", "Company Screening", "Identity Screening", "GST Screening", "Financial Screening", "Credit Suit Default Screening"],
      },
      agreement: {
        h: "वर्चुअल एग्रीमेंट और ई‑साइन — सुरक्षित और विश्वसनीय तरीके से डिजिटल बनें",
        intro: "हमारे साथ डिजिटल बनें और अपने व्यवसाय को सुरक्षित व भरोसेमंद तरीके से आगे बढ़ाएँ।",
        items: ["नया एग्रीमेंट बनाएँ", "डिजिटल सिग्नेचर जोड़ें", "एग्रीमेंट साइन करें और शेयर करें"],
      },
    },
    industries: {
      h: "हम किन उद्योगों को सेवा देते हैं",
      p: "एक प्लेटफ़ॉर्म जो विभिन्न उद्योगों में वेरिफिकेशन, वैलिडेशन और कम्प्लायंस को सक्षम बनाता है। हमारे हर उद्योग की कस्टम ज़रूरतों के अनुसार अनुकूल।",
      cards: {
        realEstate: { t: "रियल एस्टेट, कंस्ट्रक्शन और मैन्युफैक्चरिंग कंपनियाँ", alt: "हार्ड हैट पहने प्रोफेशनल और आर्किटेक्चरल मॉडल" },
        ecommerce: { t: "ई‑कॉमर्स और वेंडर डिस्कवरी प्लेटफ़ॉर्म", alt: "ऑनलाइन शॉपिंग और वेंडर डिस्कवरी के लिए स्मार्टफोन/लैपटॉप" },
        it: { t: "IT और हेल्थकेयर कंपनियाँ", alt: "हेल्थकेयर प्रोफेशनल्स दस्तावेज़ समीक्षा करते हुए" },
        retail: { t: "FMCG और रिटेल चेन", alt: "स्टोर में रिटेल एसोसिएट और शॉपिंग कार्ट" },
      },
    },
    why: {
      h: "व्यवसायों को Certifier क्यों चुनना चाहिए?",
      p: "विश्वसनीय, सुरक्षित और कुशल वेरिफिकेशन — आधुनिक व्यवसायों के लिए बनाया गया। समय और ऑपरेशनल प्रयास बचाते हुए अनुपालन बनाए रखने में मदद करता है।",
      cards: {
        fast: { t: "वेंडर ऑनबोर्डिंग 10x तेज़ करें", p: "वेंडर मूल्यांकन से अंतिम चयन तक, हमारा प्लेटफ़ॉर्म परफ़ॉर्मेंस डेटा को सार्थक निर्णयों में बदलता है — ताकि कंपनियाँ अपने सबसे मजबूत वेंडर्स पहचान सकें और तथ्य‑आधारित चयन प्रक्रिया बना सकें।" },
        blacklist: { t: "पहले से ब्लैकलिस्टेड वेंडर्स को रोकें", p: "Certifier वेंडर क्वालिफिकेशन का मानक ऊँचा करता है — केवल उन्हीं को पहचानता है जो पूर्णतः अनुपालक, भरोसेमंद और आपकी कंपनी के मानकों के अनुरूप हों।" },
        monitoring: { t: "निरंतर मॉनिटरिंग से जोखिम कम करें", p: "कभी भी अचानक न रहें। रियल‑टाइम वेंडर अपडेट्स (फोटो, वीडियो, वॉइस नोट्स) आपको हर गतिविधि और संभावित समस्या की पूरी दृश्यता देते हैं।" },
        brand: { t: "अपने ब्रांड की अखंडता की रक्षा करें", p: "Certifier की AI/ML क्षमताएँ हर वेरिफिकेशन के साथ स्मार्ट होती जाती हैं — मशीन इंटेलिजेंस और मानव निर्णय को मिलाकर केवल प्रामाणिक वेंडर्स को आगे बढ़ाती हैं।" },
      },
    },
    api: {
      h: "API‑आधारित काउंटरपार्टी प्लेटफ़ॉर्म",
      p: "किसी थर्ड पार्टी को आपके behalf पर सभी कम्प्लायंस चेक्स करने दें। व्यवसाय अपनी प्रतिष्ठा की रक्षा कर सकते हैं, संभावित कानूनी परिणामों को कम कर सकते हैं और कानूनी व नैतिक दिशानिर्देशों के अनुरूप रह सकते हैं।",
      cards: {
        mca: { t: "कॉर्पोरेट मामले मंत्रालय", p: "तेज़, उच्च‑दक्षता सत्यापन से बेहतर कर्मचारी अनुभव—ऑनबोर्डिंग समय कम और परिचालन लागत 75% तक कम।" },
        gst: { t: "वस्तु एवं सेवा कर (GST)", p: "GST सत्यापन GSTIN की वैधता और कानूनी नाम, इकाई प्रकार, पंजीकरण स्थिति जैसे विवरण देता है—धोखाधड़ी वाले GST रिकॉर्ड पहचानने में मदद करता है।" },
        owner: { t: "मालिक और निदेशक सत्यापन", p: "यह सत्यापन PAN, आधार, मतदाता ID या ड्राइविंग लाइसेंस जैसे आधिकारिक दस्तावेज़ों से कंपनी मालिक/निदेशक की पहचान जारीकर्ता डेटाबेस से मिलाकर पुष्टि करता है।" },
        company: { t: "कंपनी जाँच", p: "इसमें कंपनी का साइट विज़िट, Rolodex (नकली कंपनी सूची), MoCA, NASSCOM और रिवर्स डोमेन क्रॉस‑रेफ़रेंस, फिर डिकॉय कॉल, मिस्ट्री शॉपिंग और ऑन‑साइट सत्यापन शामिल है।" },
        bank: { t: "बैंक स्टेटमेंट सत्यापन", p: "यह जाँच निर्दिष्ट बैंक खाते की प्रामाणिकता और स्वामित्व सत्यापित करती है।" },
        global: { t: "वैश्विक डेटाबेस", p: "यह जाँच व्यक्तियों और संस्थाओं को वैश्विक डेटाबेस में स्क्रीन कर संभावित जोखिम, वॉचलिस्ट या प्रतिकूल रिकॉर्ड पहचानती है।" },
        directorship: { t: "निदेशक पद जाँच", p: "यह जाँच MCA डेटाबेस पोर्टल के माध्यम से नाम, जन्मतिथि या पिता का उपनाम जैसे पहचानकर्ताओं से उम्मीदवार विवरण सत्यापित करती है और रिकॉर्ड को कॉर्पोरेट मामलों के मंत्रालय के आधिकारिक डेटाबेस से मिलाती है।" },
        credit: { t: "कंपनी क्रेडिट जाँच", p: "क्रेडिट ब्यूरो से रिपोर्ट मिलती है जिसमें Credit/CIBIL स्कोर, जोखिम पैरामीटर, आवेदक का नाम और PAN सत्यापन, तथा सक्रिय/बंद ऋण का विवरण शामिल होता है।" },
      },
    },
  },
};
