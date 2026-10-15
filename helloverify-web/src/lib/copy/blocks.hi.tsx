/** Hindi blocks copy, annotated, not in registry, Part 9b.6.
 *
 *  `export const hi: BlocksCopy` — recipe step 1b in `./index`. Not in
 *  `BLOCKS`; `routing.locales` is `["en"]`. Both sides move in Part 9b.7.
 *
 *  Specimen names, plates and timestamps stay Latin.
 */
import type { BlocksCopy } from "./blocks";

export const hi: BlocksCopy = {
  helloVPhone: {
    name: "Helloverify",
    verified: "सत्यापित व्यवसाय",
    clock: "12:17",
    today: "आज",
    message: "संदेश",
    hello: { text: "HelloV", ts: "12:17 PM" },
    menu: {
      welcome: "Helloverify में आपका स्वागत है।",
      brand: "Helloverify",
      pick: "कृपया नीचे दिए विकल्पों में से 1, 2, 3, 4, 5, 6, 7, 8 या 9 चुनकर टाइप करें:",
      price: "कीमत",
      items: {
        nanny: { t: "नैनी का सत्यापन", amount: "₹1499", p: "पक्का करें कि आपका बच्चा सुरक्षित हाथों में है।" },
        driver: { t: "ड्राइवर का सत्यापन", amount: "₹1499", p: "परिवार का रोज़ का सफ़र और सुरक्षित बनाएँ।" },
        help: { t: "घरेलू सहायक/सुरक्षा गार्ड का सत्यापन", amount: "₹1499", p: "अपने परिवार के लिए सुरक्षित माहौल बनाएँ।" },
        anyone: { t: "किसी का भी सत्यापन", amount: "₹1499", p: "अपने किरायेदार, ट्यूटर, देखभाल करने वाले या किसी और को जानें।" },
        identity: { t: "पहचान जानें", amount: "₹849", p: "ऑनलाइन पहचान धोखाधड़ी से खुद को बचाएँ।" },
        date: { t: "अपनी डेट की प्रोफ़ाइल जाँचें", amount: "₹849", p: "ऑनलाइन धोखेबाज़ों और नकली प्रोफ़ाइल से बचें। अपने साथी का सत्यापन करें।" },
        cyber: { t: "अपनी साइबर पहचान सत्यापित कराएँ", amount: "₹1499", p: "ऑनलाइन लेन-देन के लिए अपनी पहचान साबित करें और अपनी विश्वसनीयता दिखाएँ" },
      },
      more: "और पढ़ें",
      ts: "12:17 PM",
    },
    choice: { text: "1", ts: "12:18 PM" },
    pay: {
      title: "INR 1499.00 के भुगतान का अनुरोध",
      sub: "भुगतान के लिए इस लिंक पर क्लिक करें",
      host: "rzp.io",
      thanks: "नैनी का सत्यापन - पहचान और आपराधिक रिकॉर्ड की जाँच चुनने के लिए धन्यवाद।",
      service: "नैनी का सत्यापन - पहचान और आपराधिक रिकॉर्ड की जाँच",
      click: "भुगतान करने के लिए कृपया नीचे दिए लिंक पर क्लिक करें।",
      link: "https://rzp.io/rzp/Qd2jl3a",
      noteK: "ध्यान दें:",
      note: "यह लिंक केवल 30 मिनट के लिए मान्य है।",
      noteBold: "30 मिनट",
      ts: "12:18 PM",
    },
  },
};
