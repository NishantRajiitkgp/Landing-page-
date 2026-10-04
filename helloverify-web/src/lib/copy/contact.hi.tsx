/** Hindi contact copy, annotated, not in registry, Part 9b.6.
 *
 *  `export const hi: ContactCopy` — recipe step 1b in `./index`. Not in
 *  `CONTACT`; `routing.locales` is `["en"]`. Both sides move in Part 9b.7.
 *
 *  Form field labels stay in ContactForm (unmigrated). Arrows stay inside
 *  `ways.rows.*.link` text.
 */
import type { ContactCopy } from "./contact";

export const hi: ContactCopy = {
  crumb: "संपर्क",
  closing: {
    heading: (
      <>
        सीधे <em>काम करते देखना</em> चाहेंगे?
      </>
    ),
    sub: "अपने नमूना दस्तावेज़ों के साथ वॉकथ्रू माँगें।",
    ctaLabel: "वॉकथ्रू माँगें",
  },
  hero: {
    kicker: "संपर्क",
    h1: (
      <>
        ऐसे व्यक्ति से बात करें <em>जो जाँच चलाता है।</em>
      </>
    ),
    sub:
      "कतार नहीं। बताएँ क्या सत्यापित करना है, किसके लिए, और लगभग कितने — आपको " +
      "असली उत्तर मिलेगा, जिसमें यह भी कि कभी-कभी ईमानदार उत्तर दिनों का होता है।",
  },
  tabs: {
    aria: "संपर्क विकल्प",
    enquiry: "पूछताछ",
    track: "अपना आवेदन ट्रैक करें",
  },
  track: {
    title: "ट्रैकिंग विधि चुनें",
    or: "या",
    phoneEmail: "फ़ोन नंबर / ईमेल",
    passport: "पासपोर्ट नंबर",
    reference: "संदर्भ संख्या",
    phoneHeading: "अपना फ़ोन नंबर या ईमेल दर्ज करें",
    passportHeading: "अपना विवरण दर्ज करें",
    passportNote: "आपके पंजीकृत ईमेल या फ़ोन पर OTP भेजा जाएगा।",
    referenceHeading: "अपना संदर्भ दर्ज करें",
    countryCode: "देश कोड",
    countryPlaceholder: "+91",
    phone: "फ़ोन नंबर",
    phonePlaceholder: "फ़ोन नंबर",
    email: "ईमेल",
    emailPlaceholder: "अपना ईमेल दर्ज करें",
    passportNumber: "पासपोर्ट नंबर",
    passportPlaceholder: "पासपोर्ट नंबर",
    referenceNumber: "संदर्भ संख्या",
    referencePlaceholder: "संदर्भ संख्या दर्ज करें",
    referenceExample: "संदर्भ संख्या दर्ज करें (जैसे HV2024001234)",
    sendOtp: "OTP भेजें",
    result:
      "यह पृष्ठ लाइव केस नहीं खोज सकता। अगर आपने यहाँ ऑर्डर किया है, मेरे ऑर्डर खोलें। प्राधिकरण आवेदक अपने पोर्टल का उपयोग करें। या पूछताछ भेजें, हम देख लेंगे।",
    orders: "मेरे ऑर्डर",
    enquiryInstead: "पूछताछ भेजें",
  },
  side: {
    h: (
      <>
        हर बड़ी यात्रा की शुरुआत <em>सत्यापित</em> होनी चाहिए।
      </>
    ),
    p: "पहला कदम आप उठाएँ। बाकी हम संभालेंगे।",
  },
  ways: {
    kicker: "और रास्ते",
    heading: <>इस पर निर्भर<br />आप कौन हैं।</>,
    lede:
      "बिक्री, सहायता, सुरक्षा समीक्षाएँ और व्यक्तिगत खरीदारी अलग जगहों पर जाती हैं — " +
      "यहाँ कौन-सा कहाँ है।",
    rows: {
      individual: {
        t: "व्यक्ति के रूप में एक जाँच खरीदना",
        p: "आपको हमारी ज़रूरत नहीं — HelloV WhatsApp पर चलता है और शुरू होने में लगभग एक मिनट लगता है।",
        link: "HelloV →",
      },
      smb: {
        t: "छोटा व्यवसाय, खरीदने को तैयार",
        p: "कीमतें सार्वजनिक हैं और बिना किसी से बात किए शुरू कर सकते हैं।",
        link: "SMB पैकेज →",
      },
      security: {
        t: "सुरक्षा समीक्षा, DPA या प्रश्नावली",
        p: "आर्टिफ़ैक्ट उनकी स्थिति के साथ सूचीबद्ध हैं; अधिकांश दो कार्य दिवसों में भेजे जाते हैं।",
        link: "अनुपालन पैक →",
      },
      support: {
        t: "मौजूदा ग्राहक जिसे सहायता चाहिए",
        p: "ऊपर फ़ॉर्म भरें और अपनी सेवा चुनें — सहायता पूछताछ रूट होती है, बिक्री के पीछे कतार में नहीं लगती।",
        link: "उसी कार्य दिवस",
      },
    },
  },
  offices: {
    kicker: "कार्यालय",
    heading: <>छह हैं,<br />बारह घंटे के अंतर पर।</>,
    lede:
      "हर 24 घंटे में 21 घंटे कोई डेस्क पर होता है, इसलिए रात को दायर अनुरोध " +
      "आमतौर पर सुबह कहीं न कहीं उत्तर पा जाता है।",
    list: {
      noida: { city: "नोएडा", hours: <>भारत · 09–18 IST<br />प्रधान कार्यालय</> },
      manila: { city: "मनीला", hours: "फ़िलिपींस · 09–18 PHT" },
      singapore: { city: "सिंगापुर", hours: "सिंगापुर · 09–18 SGT" },
      dubai: { city: "दुबई", hours: "यूएई · 09–18 GST" },
      cairo: { city: "काहिरा", hours: "मिस्र · 09–18 EET" },
      newYork: { city: "न्यूयॉर्क", hours: "संयुक्त राज्य अमेरिका · 09–18 ET" },
    },
  },
};
