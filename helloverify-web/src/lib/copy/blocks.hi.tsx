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
    name: "HelloV",
    status: "ऑनलाइन · WhatsApp",
    licence: { title: "ड्राइविंग लाइसेंस", region: "IND" },
    msgs: {
      m1: { text: "नमस्ते Priya — आज हम किसका सत्यापन कर रहे हैं?", ts: "09:12" },
      m2: { text: "स्कूल ले जाने वाला ड्राइवर। Advanced चाहिए।", ts: "09:13" },
      m3: { text: "उनके ड्राइविंग लाइसेंस की तस्वीर भेजें, आगे और पीछे।", ts: "09:13" },
      m4: { ts: "09:15" },
      m5: {
        lead: "1.2 सेकंड में पढ़ा ·",
        plate: "MH12 •••• 3391",
        tail: ", 2031 तक वैध। अब RTO पुणे और अदालतों से जाँच हो रही है।",
        ts: "09:15",
      },
      m6: { ts: "09:42" },
    },
    report: {
      verdict: "सत्यापित",
      elapsed: "27 मि",
      rows: {
        licence: "ड्राइविंग लाइसेंस · वैध",
        criminal: "आपराधिक रिकॉर्ड · कुछ नहीं मिला",
        address: "वर्तमान पता · पुष्ट",
      },
      file: "रिपोर्ट PDF · 2 पृष्ठ",
    },
  },
};
