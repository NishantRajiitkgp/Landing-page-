/** Hindi legal shell copy, annotated, not in registry, Part 9b.6.
 *
 *  `export const hi: LegalCopy` — recipe step 1b in `./index`. Not in
 *  `LEGAL_COPY`; `routing.locales` is `["en"]`. Both sides move in Part 9b.7.
 *
 *  Policy body text stays in `lib/content/legal.ts` and is not translated here.
 */
import type { ReactNode } from "react";
import type { LegalCopy } from "./legal";

export const hi: LegalCopy = {
  crumb: "कानूनी",
  closing: {
    heading: (
      <>
        इस बारे में प्रश्न? <em>किसी व्यक्ति से पूछें।</em>
      </>
    ),
    sub: "गोपनीयता, डेटा सुरक्षा और अनुबंध के प्रश्न एक नामित संपर्क तक जाते हैं।",
  },
  kicker: "कानूनी",
  nav: {
    label: "अनुभाग",
    heading: "अनुभाग",
  },
  doc: {
    effective: (date: ReactNode) => <>प्रभावी · {date}</>,
    pending: {
      title: "कानूनी प्रतिलिपि की प्रतीक्षा।",
      counted: (drafted: number, total: number) =>
        `${total} में से ${drafted} अनुभाग वर्तमान साइट का पाठ रखते हैं, ` +
        `शब्दशः पोर्ट किया गया; शेष ${total - drafted} यहाँ ड्राफ्ट नहीं हैं।`,
      blank:
        "इस दस्तावेज़ की संरचना, नेविगेशन और टाइपोग्राफी अंतिम हैं; " +
        "प्रभावी पाठ यहाँ ड्राफ्ट नहीं है।",
      note:
        "बिल्ड स्पेक के अनुसार, कानूनी प्रतिलिपि मौजूदा साइट से शब्दशः पोर्ट होती है और " +
        "केवल काउंसल की समीक्षा के बाद प्रकाशित होती है — पोर्ट उत्पादन के साथ समता बहाल करता है, " +
        "वह समीक्षा नहीं है।",
    },
    sectionPending: "[ अनुभाग पाठ कानूनी समीक्षा लंबित ]",
  },
  other: {
    heading: "अन्य कानूनी दस्तावेज़",
    sections: (count: ReactNode) => <>{count} अनुभाग</>,
  },
};
