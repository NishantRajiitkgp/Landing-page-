/** Hindi form copy, annotated. UI only — Zoho still receives the English
 *  labels in `lib/leads/constraints.ts`. */
import type { FormsCopy } from "./forms";

export const hi: FormsCopy = {
  kicker: "सेल्स से बात करें",
  who: "कौन पूछ रहा है",
  interest: "रुचि की सेवाएँ",
  message: "संदेश",
  submit: "भेजें",
  sending: "भेजा जा रहा है…",

  segments: {
    business: "व्यवसाय",
    government: "सरकार",
    individual: "व्यक्ति",
  },

  interests: {
    "white-collar": "व्हाइट कॉलर सत्यापन",
    "blue-collar": "ब्लू कॉलर सत्यापन",
    international: "अंतरराष्ट्रीय जाँच और क्षमता",
    "vendor-due-diligence": "विक्रेता उचित परिश्रम",
    partnership: "साझेदारी (डेमो का अनुरोध)",
    "immigration-authority": "आप्रवासन प्राधिकरण",
    "healthcare-authority": "स्वास्थ्य प्राधिकरण",
    "education-authority": "शिक्षा प्राधिकरण",
    "business-trade-authority": "व्यवसाय और व्यापार प्राधिकरण",
    nanny: "नैनी सत्यापन",
    driver: "ड्राइवर सत्यापन",
    "home-staff": "घरेलू कर्मचारी",
    tenant: "किरायेदार सत्यापन",
    "other-verification": "अन्य सत्यापन",
  },

  forWhom: {
    label: "यह किसके लिए है",
    self: "मेरे लिए",
    other: "किसी और के लिए",
    promptSelf: "यह किस प्राधिकरण के लिए है, और क्या सत्यापित करना है?",
  },
  selectedCount: "{n} चुने गए",

  fields: {
    name: { label: "पूरा नाम", placeholder: "Priya Menon" },
    mobile: { label: "मोबाइल", placeholder: "9876543210" },
    countryCode: "देश कोड",
  },

  checks: {
    nameMissing: "अपना पूरा नाम लिखें।",
    nameInvalid: "नाम में केवल अक्षर लिखें।",
    emailMissing: "ईमेल पता लिखें।",
    emailInvalid: "ऐसा ईमेल लिखें जिस पर हम जवाब भेज सकें।",
    phoneMissing: "मोबाइल नंबर लिखें।",
    phoneInvalid: "केवल अंक लिखें, अधिकतम 15।",
    countryMissing: "देश कोड चुनें।",
    companyInvalid: "संस्था के नाम में अक्षर और अंक लिखें।",
  },

  audiences: {
    business: {
      company: { label: "कंपनी", placeholder: "कंपनी का नाम" },
      email: { label: "व्यावसायिक ईमेल", placeholder: "name@company.com" },
      interestPlaceholder: "सेवा का प्रकार चुनें",
      prompt: "महीने में कितनी जाँच, और कहाँ?",
    },
    government: {
      company: { label: "विभाग या प्राधिकरण", placeholder: "मंत्रालय, विभाग या एजेंसी" },
      email: { label: "आधिकारिक ईमेल", placeholder: "name@department.gov" },
      interestPlaceholder: "सेवा का प्रकार चुनें",
      prompt: "यह किस कार्यक्रम के लिए है, और साल में लगभग कितने आवेदक?",
    },
    individual: {
      email: { label: "ईमेल", placeholder: "you@example.com" },
      interestPlaceholder: "सेवा का प्रकार चुनें",
      prompt: "किसे सत्यापित करना चाहते हैं — किरायेदार, नानी, ड्राइवर?",
    },
  },

  consent: {
    lead: "सबमिट करके, आप HelloVerify को लीड जनरेशन और संबंधित संवाद के लिए अपना डेटा संसाधित करने की सहमति देते हैं, हमारी",
    policy: "गोपनीयता नीति",
    end: "के अनुसार। हम आपका ब्रांड कभी साझा नहीं करेंगे।",
  },

  success: {
    lead: "इस बीच,",
    pack: "अनुपालन पैक",
    mid: "में वह सब है जो हम कॉल से पहले भेज सकते हैं, और",
    library: "जाँच लाइब्रेरी",
    end: "में प्रति जाँच समय-सीमा है।",
  },

  status: {
    invalid: "चिह्नित फ़ील्ड जाँचें और फिर भेजें।",
    ok: "धन्यवाद — आपकी पूछताछ हमारे पास है। कोई जो वास्तव में जाँच चलाता है जवाब देगा, आमतौर पर एक कार्य दिवस में।",
    disposable:
      "यह अस्थायी ईमेल लगता है। ऐसा पता लिखें जिस पर जवाब आ सके — हम असली उत्तर भेजेंगे, ड्रिप कैंपेन नहीं।",
    undeliverable:
      "उस डोमेन का मेल सर्वर नहीं मिला, इसलिए जवाब बाउंस होगा। पते की वर्तनी जाँचें।",
    suspicious: (fallbackEmail: string) =>
      `यह सबमिशन स्वीकार नहीं हो सका। ${fallbackEmail} पर ईमेल करें, कोई व्यक्ति वहाँ से उठाएगा।`,
    rateLimited: (retryAfterSeconds: number, fallbackEmail: string) => {
      const minutes = Math.ceil(retryAfterSeconds / 60);
      const wait = minutes <= 1 ? "एक मिनट" : `${minutes} मिनट`;
      return `यहाँ से कई सबमिशन हो चुके हैं। ${wait} प्रतीक्षा करें, या ज़रूरी हो तो ${fallbackEmail} पर ईमेल करें।`;
    },
    degraded: (fallbackEmail: string) =>
      `आपकी जानकारी हम तक पहुँची, पर स्वतः दर्ज नहीं हो सकी। एक प्रति रखी है — सुनिश्चित करने के लिए ${fallbackEmail} पर ईमेल करें।`,
  },
};
