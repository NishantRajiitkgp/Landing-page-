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
    enterprise: "एंटरप्राइज़ पृष्ठभूमि सत्यापन",
    smb: "SMB पैकेज",
    "employee-verification": "कर्मचारी सत्यापन",
    "customer-kyc": "ग्राहक KYC / ट्रस्ट एंड सेफ़्टी",
    certifier: "विक्रेता उचित परिश्रम (Certifier)",
    governments: "सरकारी / प्राधिकरण कार्यक्रम",
    hellov: "व्यक्ति / HelloV",
  },

  fields: {
    name: { label: "पूरा नाम", placeholder: "Priya Menon" },
    mobile: { label: "मोबाइल", placeholder: "+91" },
  },

  audiences: {
    business: {
      company: { label: "कंपनी", placeholder: "कंपनी का नाम" },
      email: { label: "व्यावसायिक ईमेल", placeholder: "name@company.com" },
      interestPlaceholder: "कर्मचारी सत्यापन, KYC, Certifier, Consumer…",
      prompt: "महीने में कितनी जाँच, और कहाँ?",
    },
    government: {
      company: { label: "विभाग या प्राधिकरण", placeholder: "मंत्रालय, विभाग या एजेंसी" },
      email: { label: "आधिकारिक ईमेल", placeholder: "name@department.gov" },
      interestPlaceholder: "सरकारी / प्राधिकरण कार्यक्रम",
      prompt: "यह किस कार्यक्रम के लिए है, और साल में लगभग कितने आवेदक?",
    },
    individual: {
      email: { label: "ईमेल", placeholder: "you@example.com" },
      interestPlaceholder: "व्यक्ति / HelloV",
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
