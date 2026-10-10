/** Hindi MOM applicant flow. Annotated - recipe step 1b. */
import type { MomApplyCopy } from "./momApply";

export const hi: MomApplyCopy = {
  meta: {
    register: "अपना खाता बनाएँ",
    signIn: "साइन इन करें",
    apply: "आपका आवेदन",
  },
  crumbs: {
    register: "खाता बनाएँ",
    signIn: "साइन इन",
    apply: "आवेदन",
  },
  tabs: {
    aria: "खाता",
    register: "खाता बनाएँ",
    signIn: "साइन इन",
  },
  demo: {
    code: "डेमो · कोड {code}",
    account: "डेमो खाता · {email} · {password}",
  },
  register: {
    title: (
      <>
        अपना <em>सत्यापन</em> शुरू करें
      </>
    ),
    first: "पहला नाम",
    last: "उपनाम",
    namePlaceholder: "पासपोर्ट के अनुसार",
    email: "ईमेल",
    emailPlaceholder: "you@example.com",
    phone: "मोबाइल",
    phonePlaceholder: "मोबाइल नंबर",
    dial: "देश कोड",
    password: "पासवर्ड",
    passwordPlaceholder: "पासवर्ड बनाएँ",
    consent: "मैं {terms} और {privacy} से सहमत हूँ।",
    terms: "सेवा की शर्तों",
    privacy: "गोपनीयता नीति",
    submit: "खाता बनाएँ",
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
        फिर से <em>स्वागत है</em>
      </>
    ),
    email: "ईमेल",
    password: "पासवर्ड",
    passwordPlaceholder: "आपका पासवर्ड",
    forgot: "पासवर्ड भूल गए?",
    submit: "आगे बढ़ें",
    codeTitle: (
      <>
        अपना <em>ईमेल</em> देखें
      </>
    ),
    codeSent: "{to} पर भेजा गया कोड डालें",
    expiresIn: "{t} में समाप्त",
    expired: "यह कोड समाप्त हो गया है।",
    resend: "नया कोड भेजें",
    other: "दूसरा खाता इस्तेमाल करें",
  },
  forgot: {
    title: (
      <>
        अपना <em>पासवर्ड</em> रीसेट करें
      </>
    ),
    lede: "हम आपको नया पासवर्ड बनाने का लिंक ईमेल करेंगे।",
    email: "ईमेल",
    submit: "लिंक भेजें",
    sentTitle: (
      <>
        अपना <em>इनबॉक्स</em> देखें
      </>
    ),
    sent: "अगर {to} का खाता है, तो लिंक भेज दिया गया है।",
    back: "साइन इन पर लौटें",
  },
  aside: {
    k: "आपका आवेदन",
    title: (
      <>
        एक बैठक में, <em>शुरू से जमा करने तक।</em>
      </>
    ),
    now: "अभी",
    steps: [
      { t: "खाता", m: "2 मिनट" },
      { t: "आपके बारे में", m: "पासपोर्ट" },
      { t: "योग्यताएँ", m: "प्रमाणपत्र" },
      { t: "जाँचें", m: "स्वतः मिलान" },
      { t: "समीक्षा और हस्ताक्षर", m: "ई-हस्ताक्षर" },
      { t: "भुगतान", m: "SGD" },
    ],
    from: "शुरुआत",
    unit: "प्रति योग्यता + 9% GST",
    ready: "तैयार रखें",
    readyItems: ["पासपोर्ट", "डिग्री प्रमाणपत्र", "अंकपत्र"],
  },
  apply: {
    loading: "आपका आवेदन खुल रहा है…",
    hello: "नमस्ते {name}",
    signOut: "साइन आउट",
    progress: "आवेदन की प्रगति",
    step: "चरण {n} / {total}",
  },
  errors: {
    required: "आवश्यक।",
    name: "पासपोर्ट के अनुसार अक्षरों का उपयोग करें।",
    email: "मान्य ईमेल डालें।",
    phone: "मान्य मोबाइल नंबर डालें।",
    password: "तीनों नियम पूरे करें।",
    consent: "आगे बढ़ने के लिए टिक करें।",
    nameFirst: "पहले अपना पहला नाम और उपनाम डालें।",
    verifyEmail: "आगे बढ़ने के लिए ईमेल सत्यापित करें।",
    verifyPhone: "आगे बढ़ने के लिए मोबाइल सत्यापित करें।",
    codeLength: "सभी 6 अंक डालें।",
    invalid_input: "हाइलाइट किया गया फ़ील्ड जाँचें।",
    invalid_code: "यह कोड सही नहीं है।",
    code_expired: "यह कोड समाप्त हो गया है। नया कोड भेजें।",
    unverified: "इसे फिर से सत्यापित करें।",
    duplicate: "इस ईमेल का खाता पहले से है।",
    duplicateAction: "साइन इन करें",
    rate_limited: "बहुत अधिक प्रयास। {s} सेकंड बाद फिर कोशिश करें।",
    wrong_credentials: "ईमेल या पासवर्ड गलत है।",
    no_session: "आपका सत्र समाप्त हो गया। फिर से साइन इन करें।",
    not_connected: "यह अभी उपलब्ध नहीं है। बाद में कोशिश करें।",
    upstream: "कुछ गलत हो गया। फिर से कोशिश करें।",
  },
};
