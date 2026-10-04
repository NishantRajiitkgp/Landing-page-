/** Hindi templates copy, annotated, not in registry, Part 9b.6.
 *
 *  `export const hi: TemplatesCopy` — recipe step 1b in `./index`. Not in
 *  `TEMPLATES`; `routing.locales` is `["en"]`. Both sides move in Part 9b.7.
 */
import type { TemplatesCopy } from "./templates";

export const hi: TemplatesCopy = {
  talkToSales: "बिक्री से संपर्क",
  bands: {
    verify: "हम क्या सत्यापित करते हैं",
    steps: "यह कैसे काम करता है",
    table: "टर्नअराउंड & कवरेज",
    compliance: "अनुपालन & सुरक्षा",
  },
  table: {
    check: "जाँच",
    turnaround: "टर्नअराउंड",
    confirmedWith: "पुष्टि किससे",
  },
  compliance: {
    head: (
      <>
        अरोचक हिस्सा,<br />ठीक से पूरा।
      </>
    ),
    lede:
      "हर जाँच में किसी के सबसे निजी दस्तावेज़ होते हैं। सहमति पहले आती है, " +
      "संग्रह की सीमाएँ हैं, और सबकी लेखापरीक्षा हो सकती है।",
  },
  securityInFull: "सुरक्षा & अनुपालन, पूरा — DPA, रेजिडेंसी, अनुरूपता",
};
