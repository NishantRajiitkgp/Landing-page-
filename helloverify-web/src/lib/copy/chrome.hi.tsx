/** Hindi copy for `components/chrome/**`.
 *
 *  Annotated `: ChromeCopy` — recipe step 1b in `./index`. Measured there:
 *  without the annotation a stray key typechecks and is silently never
 *  rendered. `en` stays the unannotated schema.
 *
 *  Not in `CHROME` yet. `routing.locales` is `["en"]`; the registry is
 *  `Record<Locale, T>`. Shipping this file into the object before `"hi"` is
 *  on that list is an excess property; shipping `"hi"` before every
 *  namespace has a file is TS2741. Both sides move in Part 9b.7.
 *
 *  Provenance: nav/footer/CTA wording that existed on the old IA is taken
 *  from `public/cms/hi/globals.base.json` in the old repo (AUDIT §F). New
 *  audience-hub labels (Governments / Business / Individuals / Platform /
 *  Resources) have no old analogue and are written here. Brand names
 *  (HelloVerify, HelloV, Certifier), certification marks and `{open}` stay
 *  Latin — they are identifiers, not prose.
 */
import type { ChromeCopy } from "./chrome";

export const hi: ChromeCopy = {
  nav: {
    logoHome: "HelloVerify — होम",
    primary: "मुख्य",
    primaryMobile: "मुख्य, मोबाइल",
    links: {
      "/governments": "सरकारें",
      "/business": "व्यवसाय",
      "/individuals": "व्यक्ति",
      "/platform": "प्लेटफ़ॉर्म",
      "/resources": "संसाधन",
    },
    menus: {
      solutions: {
        label: "समाधान",
        cols: {
          gov: "सरकारी प्राधिकरण",
          biz: "एंटरप्राइज़ और लघु व्यवसाय",
          consumer: "उपभोक्ता सेवा",
        },
      },
      products: { label: "उत्पाद", all: "सभी 33 जाँच देखें" },
      premium: {
        label: "प्रीमियम सेवाएँ",
        lede: "सहज सत्यापन और आवेदन जमा करने के लिए एक-से-एक समर्पित सहायता।",
      },
      support: { label: "सहायता", col: "संपर्क करें" },
    },
    items: {
      govHealth: { t: "स्वास्थ्य प्राधिकरण", d: "प्राथमिक स्रोत से स्वास्थ्य पेशेवरों की योग्यता सत्यापित करें" },
      govImmigration: { t: "आप्रवासन प्राधिकरण", d: "वीज़ा आवेदनों की पूर्व-स्क्रीनिंग और सत्यापन, सुव्यवस्थित" },
      govEducation: { t: "मैनपावर और शिक्षा प्राधिकरण", d: "शैक्षिक योग्यता प्राथमिक स्रोत पर सत्यापित" },
      govTrade: { t: "व्यवसाय और व्यापार प्राधिकरण", d: "नियामक अनुपालन के लिए संस्थाएँ और निदेशक सत्यापित" },
      forBusiness: { t: "व्यवसाय के लिए", d: "कर्मचारियों, वेंडरों और भागीदारों का सत्यापन, निरंतर निगरानी के साथ" },
      forSmb: { t: "SMB के लिए", d: "बढ़ते व्यवसायों के लिए विश्वसनीय पृष्ठभूमि सत्यापन पैकेज" },
      employee: { t: "कर्मचारी सत्यापन", d: "व्हाइट-कॉलर, ब्लू-कॉलर और गिग वर्कर — सभी के लिए" },
      kyc: { t: "अपने ग्राहक को जानें (KYC)", d: "चेहरे की पहचान और लाइवनेस के साथ पहचान सत्यापन" },
      individuals: { t: "व्यक्तियों का सत्यापन", d: "ड्राइवर, होम स्टाफ़, किरायेदार और नानी — 30 मिनट में" },
      visa: { t: "वीज़ा स्क्रीनिंग शुरू करें", d: "पर्यटक, छात्र और कार्य वीज़ा के दस्तावेज़ों की पूर्व-स्क्रीनिंग" },
      global: { t: "ग्लोबल वेरिफिकेशन", d: "120+ देशों में अंतर्राष्ट्रीय सत्यापन जाँच" },
      bgvEnterprise: { t: "एंटरप्राइज़ के लिए पृष्ठभूमि सत्यापन", d: "बड़े और विविध कार्यबल की ज़रूरतों के लिए" },
      bgvSmb: { t: "SMB के लिए पृष्ठभूमि सत्यापन", d: "बढ़ते व्यवसायों के लिए तेज़, विश्वसनीय जाँच" },
      certifier: { t: "Certifier — वेंडर ड्यू डिलिजेंस", d: "संरचित ड्यू डिलिजेंस और जोखिम जाँच के साथ वेंडर ऑनबोर्ड करें" },
      immigrationDocs: { t: "आप्रवासन दस्तावेज़ पूर्व-स्क्रीनिंग", d: "आप्रवासन और वीज़ा प्रक्रिया के समर्थन में बना" },
      hellov: { t: "HelloV — किसी को भी सत्यापित करें", d: "WhatsApp पर तुरंत किसी को भी सत्यापित करें" },
      trust: { t: "ट्रस्ट और सुरक्षा — KYC", d: "उन्नत KYC जाँच के साथ पहचान सत्यापन और ऑनबोर्डिंग" },
      premHealth: { t: "डॉक्टर, दंत चिकित्सक और स्वास्थ्य पेशेवर", d: "प्राधिकरणों में आवेदन करने वाले स्वास्थ्य पेशेवरों के सटीक सबमिशन" },
      premImmigration: { t: "आप्रवासन दस्तावेज़ पूर्व-स्क्रीनिंग", d: "सटीक, सहज वीज़ा पूर्व-स्क्रीनिंग के लिए व्यक्तिगत सहायता" },
      premConsumer: { t: "उपभोक्ता सेवा", d: "अधिक मानसिक शांति के लिए अतिरिक्त जाँच वाला उन्नत पैकेज" },
      enquiry: { t: "पूछताछ", d: "अपनी सत्यापन ज़रूरतों के बारे में हमारी टीम से बात करें" },
    },
    about: "हमारे बारे में",
    technology: "प्रौद्योगिकी",
    signUp: "साइन अप",
    account: "खाता",
    userMenu: {
      myCart: "मेरी कार्ट",
      myOrders: "मेरे ऑर्डर",
      profileSettings: "प्रोफ़ाइल सेटिंग",
      logout: "लॉग आउट",
    },
    cta: "बिक्री से संपर्क",
    openMenu: "मेनू खोलें",
    contact: "संपर्क और सहायता",
  },

  footer: {
    logoHome: "HelloVerify — होम",
    blurb:
      "प्राथमिक स्रोत पर पृष्ठभूमि सत्यापन — उद्यमों, सरकारों और परिवारों के लिए।",
    social: {
      linkedin: "LinkedIn",
      facebook: "Facebook",
      instagram: "Instagram",
    },
    about: "हमारे बारे में",
    contact: "संपर्क और सहायता",
    cols: {
      governments: "सरकारें",
      business: "व्यवसाय",
      individuals: "व्यक्ति",
      platform: "प्लेटफ़ॉर्म",
      resources: "संसाधन",
    },
    links: {
      "/solutions/health-authorities": "स्वास्थ्य प्राधिकरण",
      "/solutions/immigration-authorities": "आप्रवासन प्राधिकरण",
      "/solutions/manpower-and-education-authorities": "मैनपावर और शिक्षा",
      "/solutions/trade-authorities": "व्यापार और व्यवसाय",
      "/solutions/manpower-and-education-authorities/ministry-of-manpower": "Ministry of Manpower की कहानी",
      "/products/bgv-enterprise": "एंटरप्राइज़ BGV",
      "/products/bgv-smb": "लघु और मध्यम व्यवसाय",
      "/employee-verification": "कर्मचारी सत्यापन",
      "/products/customer-kyc": "ग्राहक KYC · ट्रस्ट और सुरक्षा",
      "/products/certifier": "वेंडर ड्यू डिलिजेंस · Certifier",
      "/products/hellov": "HelloV — किसी को भी सत्यापित करें",
      "/products/immigration": "वीज़ा और आप्रवासन स्क्रीनिंग",
      "/individuals/home-family": "घर और परिवार की जाँच",
      "/technology": "प्रौद्योगिकी और API",
      "/platform/security-compliance": "सुरक्षा और अनुपालन",
      "/international": "वैश्विक कवरेज — 120+ देश",
      "/resources/checks": "सभी 33 जाँच",
      "/checks/identity": "पहचान",
      "/checks/employment": "रोजगार",
      "/checks/education": "शिक्षा",
      "/checks/criminal": "आपराधिक रिकॉर्ड",
      "/checks/global-database": "ग्लोबल डेटाबेस",
      "/resources/countries": "देश गाइड",
      "/resources/glossary": "शब्दावली",
      "/resources/blog": "ब्लॉग",
    },
    certs: {
      iso: "ISO 27001",
      gdpr: "GDPR",
      pbsa: "PBSA",
      nsr: "NSR",
      mom: "Ministry of Manpower, सिंगापुर",
    },
    certline: "ISO 27001 · GDPR · PBSA · NSR · Ministry of Manpower (SG)",
    copyright: "© 2026 सर्वाधिकार सुरक्षित। Hello Verify India Private Ltd.",
    legal: {
      privacy: "गोपनीयता नीति",
      terms: "सेवा की शर्तें",
      cookies: "कुकी नीति",
    },
    offices: "भारत · यूएई · सिंगापुर · फ़िलिपींस · मिस्र · संयुक्त राज्य अमेरिका",
    v2: {
      sheet: "शीट 12 / 12",
      end: "स्रोत पर सत्यापित,",
      endEm: "कुछ ही मिनटों में।",
      backToTop: "ऊपर जाएँ",
      backRing: "ऊपर जाएँ · स्रोत पर सत्यापित ·",
      officesHead: "छह कार्यालय। बारह घंटे के अंतर पर।",
      openNow: "{open} में से 6 कार्यालय अभी खुले हैं",
      atDesk: "अभी डेस्क पर",
      closed: "बंद",
      cities: {
        noida: { city: "नई दिल्ली", country: "भारत" },
        dubai: { city: "दुबई", country: "संयुक्त अरब अमीरात" },
        singapore: { city: "सिंगापुर", country: "सिंगापुर" },
        manila: { city: "मनीला", country: "फ़िलिपींस" },
        cairo: { city: "काहिरा", country: "मिस्र" },
        newYork: { city: "न्यूयॉर्क", country: "संयुक्त राज्य अमेरिका" },
      },
      seals: {
        iso: "ISO 27001",
        gdpr: "GDPR",
        pbsa: "PBSA",
        nsr: "NSR",
        mom: "Ministry of Manpower (SG)",
      },
      markHint: "UV · निशान पर कर्सर ले जाएँ",
      microtext:
        "HELLO VERIFY INDIA PRIVATE LTD · स्रोत पर सत्यापित · 2018 से 20M+ जाँच पूर्ण · 120+ देश · ISO 27001 · GDPR · PBSA · NSR · भारत · यूएई · सिंगापुर · फ़िलिपींस · मिस्र · संयुक्त राज्य अमेरिका ·",
    },
  },

  breadcrumb: {
    label: "ब्रेडक्रंब",
    home: "होम",
  },

  closingCta: {
    region: "शुरू करें",
    heading: (
      <>
        हर महान यात्रा एक <em>सत्यापित</em> शुरुआत की हकदार है।
      </>
    ),
    sub: "पहला कदम उठाएँ। बाकी हम संभालेंगे।",
    cta: "बिक्री से संपर्क",
    plans: "योजनाएँ और मूल्य देखें",
  },

  consent: {
    title: "इस साइट पर कुकीज़",
    body:
      "ज़रूरी कुकीज़ साइट चलाती रहती हैं और हमेशा चालू रहती हैं। एनालिटिक्स और " +
      "मार्केटिंग कुकीज़ तभी लगती हैं जब आप स्वीकार करें — आपके चुनने से पहले कुछ " +
      "गैर-आवश्यक नहीं चलता, और आप कभी भी अपना निर्णय बदल सकते हैं।",
    policy: "कुकी नीति",
    accept: "स्वीकार करें",
    reject: "अस्वीकार करें",
    reopenRegion: "आपकी कुकी पसंद",
    reopen: "कुकी प्राथमिकताएँ",
  },

  faq: {
    kicker: "प्रश्न",
  },

  checkTable: {
    check: "जाँच",
    turnaround: "समय",
    confirmedWith: "पुष्टि स्रोत",
  },

  login: {
    ariaLabel: "लॉगिन",
    title: "लॉगिन",
    welcome: "स्वागत है",
    brand: "HelloVerify!",
    mobileLabel: "मोबाइल नंबर",
    mobilePlaceholder: "10 अंकों का नंबर दर्ज करें",
    loginViaOtp: "OTP से लॉगिन",
    pleaseWait: "कृपया प्रतीक्षा करें…",
    verifyTitle: "सत्यापन कोड दर्ज करें",
    mockHint:
      "मॉक मोड: OTP 123456 है। पंजीकरण के लिए 9111111111; अन्य 10 अंक डेमो यूज़र के रूप में लॉगिन।",
    otpSentTo: "OTP भेजा गया",
    edit: "संपादित करें",
    resendOtp: "OTP पुनः भेजें",
    verifying: "सत्यापित हो रहा है…",
    verifyOtp: "OTP सत्यापित करें",
    otpInvalid: "OTP अमान्य है, कृपया पुनः जाँचें",
    registerTitle: "पंजीकरण",
    nameLabel: "नाम *",
    emailLabel: "ईमेल *",
    mobileNoLabel: "मोबाइल नं.",
    genderLabel: "लिंग *",
    genderMale: "पुरुष",
    genderFemale: "महिला",
    genderOther: "अन्य",
    saving: "सहेजा जा रहा है…",
    registerNow: "अभी पंजीकरण करें",
    success: "आप सफलतापूर्वक लॉग इन हो गए!",
    accountCreatedSuccess: "आपका खाता सफलतापूर्वक बनाया गया!",
    close: "बंद करें",
    errors: {
      mobileDigits: "मोबाइल नंबर 10 अंकों का होना चाहिए",
      otpDigits: "OTP 6 अंकों का होना चाहिए",
      nameInvalid: "नाम कम से कम 3 अक्षरों का होना चाहिए और केवल अक्षर व रिक्त स्थान होने चाहिए",
      requiredFields: "कृपया सभी आवश्यक फ़ील्ड भरें",
      sendOtp: "OTP भेजने में त्रुटि",
      saveProfile: "प्रोफ़ाइल सहेजने में विफल",
    },
  },
};
