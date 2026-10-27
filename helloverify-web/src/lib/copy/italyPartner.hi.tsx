/** Hindi Italy visa partner programme. */
import type { ItalyPartnerCopy } from "./italyPartner";

export const hi: ItalyPartnerCopy = {
  meta: {
    join: "पार्टनर के रूप में जुड़ें",
    signIn: "पार्टनर साइन इन",
    home: "आपका पार्टनर खाता",
  },
  crumbs: {
    italy: "इटली का दूतावास",
    join: "जुड़ें",
    signIn: "साइन इन",
    home: "पार्टनर",
  },
  tabs: {
    aria: "खाता",
    join: "जुड़ें",
    signIn: "साइन इन",
  },
  demo: {
    code: "डेमो · कोड {code}",
    account: "डेमो खाता · {email} · {password}",
  },
  join: {
    title: (
      <>
        <em>पार्टनर</em> के रूप में जुड़ें
      </>
    ),
    first: "पहला नाम",
    last: "अंतिम नाम",
    namePlaceholder: "आपका नाम",
    email: "कार्य ईमेल",
    emailPlaceholder: "you@agency.com",
    phone: "मोबाइल",
    phonePlaceholder: "मोबाइल नंबर",
    dial: "देश कोड",
    password: "पासवर्ड",
    passwordPlaceholder: "पासवर्ड बनाएँ",
    consent: "मैं {terms} और {privacy} से सहमत हूँ।",
    terms: "सेवा की शर्तें",
    privacy: "गोपनीयता नीति",
    submit: "खाता बनाएँ",
    call: "या कॉल करें",
    phoneDisplay: "+91 9289 6276 22",
    tel: "+919289627622",
  },
  password: {
    show: "पासवर्ड दिखाएँ",
    hide: "पासवर्ड छिपाएँ",
    rules: {
      length: "8+ अक्षर",
      letter: "एक अक्षर",
      number: "एक अंक",
    },
  },
  verify: {
    send: "सत्यापित करें",
    sentTo: "कोड {to} पर भेजा गया",
    code: "6 अंकों का कोड",
    resend: "फिर भेजें",
    resendIn: "{s} सेकंड में फिर भेजें",
    change: "बदलें",
    verified: "सत्यापित",
    checking: "जाँच हो रही है…",
  },
  signIn: {
    title: (
      <>
        फिर से <em>स्वागत</em> है
      </>
    ),
    email: "कार्य ईमेल",
    password: "पासवर्ड",
    passwordPlaceholder: "आपका पासवर्ड",
    forgot: "पासवर्ड भूल गए?",
    submit: "आगे बढ़ें",
    codeTitle: (
      <>
        अपना <em>ईमेल</em> देखें
      </>
    ),
    codeSent: "{to} पर भेजा कोड दर्ज करें",
    expiresIn: "{t} में समाप्त",
    expired: "यह कोड समाप्त हो गया।",
    resend: "नया कोड भेजें",
    other: "दूसरा खाता इस्तेमाल करें",
  },
  forgot: {
    title: (
      <>
        अपना <em>पासवर्ड</em> रीसेट करें
      </>
    ),
    lede: "नया पासवर्ड सेट करने का लिंक हम ईमेल करेंगे।",
    submit: "लिंक भेजें",
    sentTitle: (
      <>
        अपना <em>इनबॉक्स</em> देखें
      </>
    ),
    sent: "अगर {to} पर खाता है, तो लिंक भेज दिया गया है।",
    back: "साइन इन पर वापस",
  },
  aside: {
    k: "इटली वीज़ा · पार्टनर",
    title: (
      <>
        आपके क्लाइंट, <em>पहले सत्यापित।</em>
      </>
    ),
    now: "अभी",
    steps: [
      { t: "खाता", m: "2 मिनट" },
      { t: "एजेंसी", m: "आपका डेस्क" },
      { t: "दस्तावेज़", m: "पैन, बैंक" },
      { t: "समझौता", m: "हस्ताक्षर" },
      { t: "शुरू करें", m: "एजेंट कोड" },
    ],
    ready: "साथ रखें",
    readyItems: ["पैन", "पते का प्रमाण", "बैंक प्रमाण", "GST, अगर है"],
  },
  home: {
    loading: "आपका खाता खुल रहा है…",
    hello: "नमस्ते {name}",
    signOut: "साइन आउट",
    progress: "ऑनबोर्डिंग",
    step: "चरण {n} / {total}",
  },
  agency: {
    title: (
      <>
        आपकी <em>एजेंसी</em>
      </>
    ),
    lede: "इटली के राष्ट्रीय वीज़ा आप कैसे फाइल करते हैं।",
    name: "एजेंसी का नाम",
    namePlaceholder: "Sunrise Travels",
    city: "शहर",
    cityPlaceholder: "नई दिल्ली",
    volume: "महीने में इटली राष्ट्रीय वीज़ा के क्लाइंट",
    volumes: [
      { id: "under10", t: "10 से कम" },
      { id: "10-25", t: "10–25" },
      { id: "26-75", t: "26–75" },
      { id: "76+", t: "76+" },
    ],
    save: "सहेजें",
    saved: "सहेजा गया",
  },
  nav: {
    back: "वापस",
    next: "आगे बढ़ें",
  },
  docs: {
    title: (
      <>
        आपके <em>दस्तावेज़</em>
      </>
    ),
    lede: "साफ़ फ़ोटो या स्कैन।",
    pan: "पैन",
    address: "पते का प्रमाण",
    bank: "बैंक प्रमाण",
    gst: "GST प्रमाणपत्र",
    optional: "वैकल्पिक",
    hints: {
      pan: "एजेंसी का पैन",
      address: "बिल या किराया समझौता",
      bank: "रद्द चेक या स्टेटमेंट",
      gst: "सिर्फ़ अगर एजेंसी पंजीकृत है",
    },
    rule: "PDF, JPG या PNG · {mb} MB तक",
    choose: "अपलोड",
    replace: "बदलें",
    remove: "{name} हटाएँ",
    cancel: "रद्द करें",
    uploading: "अपलोड हो रहा है · {p}%",
    drop: "यहाँ छोड़ें",
    hold: "हमारे पास। 2 कार्यदिवस तक।",
    tooLarge: "{mb} MB से बड़ा है।",
    badType: "PDF, JPG या PNG इस्तेमाल करें।",
    missing: "यह दस्तावेज़ अपलोड करें।",
  },
  agree: {
    title: (
      <>
        <em>समझौता</em>
      </>
    ),
    lede: "हस्ताक्षर और मुहर लगाएँ, फिर स्कैन अपलोड करें।",
    download: "डाउनलोड",
    upload: "हस्ताक्षरित समझौता",
    hint: "अधिकृत हस्ताक्षरकर्ता, मुहर के साथ",
    missing: "हस्ताक्षरित समझौता अपलोड करें।",
    received: "मिल गया।",
    pending: "हमारे पास। 2 कार्यदिवस तक।",
    letter: {
      k: "पार्टनर समझौता",
      parties: "{agency}, {city}",
      with: "और HelloVerify India Private Limited",
      lines: [
        "भारत उत्तर क्षेत्र में इटली के राष्ट्रीय वीज़ा आवेदकों का दस्तावेज़ सत्यापन।",
        "आप क्लाइंट का मार्गदर्शन करते हैं। हम जाँच करते हैं और संदर्भ जारी करते हैं।",
        "क्लाइंट शुल्क HelloVerify को भुगतान करता है।",
        "कमीशन हर पूरे फ़ाइल पर, आपकी एजेंसी की दर से।",
        "हम वीज़ा जमा नहीं करते और नतीजा नहीं तय करते।",
      ],
      sign: "अधिकृत हस्ताक्षरकर्ता",
      stamp: "एजेंसी की मुहर",
    },
  },
  live: {
    title: (
      <>
        शुरू <em>करें</em>
      </>
    ),
    lede: "इसे हर इटली फ़ाइल पर लिखें।",
    who: "{agency}, {city}",
    code: "एजेंट कोड",
    copy: "कॉपी",
    copied: "कॉपी हो गया",
  },
  errors: {
    required: "ज़रूरी।",
    name: "अक्षरों का इस्तेमाल करें।",
    email: "मान्य ईमेल दर्ज करें।",
    phone: "मान्य मोबाइल नंबर दर्ज करें।",
    password: "तीनों नियम पूरे करें।",
    consent: "आगे बढ़ने के लिए टिक करें।",
    nameFirst: "पहले अपना पहला और अंतिम नाम जोड़ें।",
    verifyEmail: "आगे बढ़ने के लिए ईमेल सत्यापित करें।",
    verifyPhone: "आगे बढ़ने के लिए मोबाइल सत्यापित करें।",
    codeLength: "सभी 6 अंक दर्ज करें।",
    place: "अक्षरों का इस्तेमाल करें।",
    invalid_input: "हाइलाइट किए फ़ील्ड की जाँच करें।",
    invalid_code: "यह कोड सही नहीं है।",
    code_expired: "यह कोड समाप्त हो गया। नया भेजें।",
    unverified: "इसे फिर से सत्यापित करें।",
    duplicate: "इस ईमेल पर पहले से खाता है।",
    duplicateAction: "इसके बजाय साइन इन करें",
    rate_limited: "बहुत अधिक प्रयास। {s} सेकंड में फिर कोशिश करें।",
    wrong_credentials: "ईमेल या पासवर्ड गलत है।",
    no_session: "आपका सत्र समाप्त हो गया। फिर साइन इन करें।",
    not_connected: "यह अभी उपलब्ध नहीं है। बाद में कोशिश करें।",
    upstream: "कुछ गलत हो गया। फिर कोशिश करें।",
  },
};
