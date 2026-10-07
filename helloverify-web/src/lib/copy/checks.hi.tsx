/** Hindi checks copy for `app/[locale]/checks/**` — the page SHELL only.
 *
 *  Annotated `: ChecksCopy` — recipe step 1b in `./index`. Not in
 *  the CHECKS registry. Part 9b.6.
 *
 *  Catalogue values (`name`, `group`, `source`, `time`, `countries`,
 *  `answers`, `caveat`, `fields[]`, `usedBy[]`) stay in
 *  `lib/content/checks.ts`. Eight leaves take a node or a string so
 *  grammar can place those values.
 */
import type { ReactNode } from "react";
import type { ChecksCopy } from "./checks";

export const hi: ChecksCopy = {
  crumbs: {
    resources: "संसाधन",
    library: "जाँच लाइब्रेरी",
  },

  closing: {
    heading: (name: ReactNode) => (
      <>
        {name} जाँच <em>इस सप्ताह चलाएँ।</em>
      </>
    ),
    sub: (source: string, time: string) => `${source} से पुष्टि, आमतौर पर ${time} में।`,
  },

  hero: {
    kicker: (group: ReactNode) => <>जाँच · {group}</>,
    h1: (name: ReactNode) => <>{name} सत्यापन</>,
    talkToSales: "बिक्री से संपर्क",
  },

  strip: {
    turnaround: (time: ReactNode) => <><b>{time}</b> सामान्य टर्नअराउंड</>,
    confirmedWith: (source: ReactNode) => <>पुष्टि स्रोत <b>{source}</b></>,
    fast: <><span className="dot" /> आमतौर पर एक घंटे में</>,
  },

  answer: {
    kicker: "संक्षेप में",
    h2: (name: ReactNode) => (
      <>
        {name} सत्यापन में कितना समय लगता है?
      </>
    ),
    lede: (
      name: ReactNode,
      source: ReactNode,
      time: ReactNode,
      countries: ReactNode,
      answers: ReactNode,
    ) => (
      <>
        {name} की पुष्टि {source} से होती है, सामान्य टर्नअराउंड {time}।
        {" "}कवरेज: {countries}. {answers}
      </>
    ),
  },

  fields: {
    kicker: "क्या लौटता है",
    h: (name: string) => `${name} रिपोर्ट में क्या है?`,
    lede: "हर फ़ील्ड उस स्रोत को लेकर आता है जिसने पुष्टि की और जिस तारीख को पुष्टि हुई।",
  },

  caveat: {
    kicker: "यह क्या नहीं बता सकता",
    h2: (name: ReactNode) => (
      <>
        {name} जाँच क्या पुष्टि नहीं कर सकती?
      </>
    ),
    aside: (
      <>
        परिणाम तीन चीज़ों में से एक होता है, कभी स्कोर नहीं: <em>सत्यापित</em> — स्रोत ने पुष्टि
        की; <em>असत्यापित</em> — स्रोत में ऐसा कोई रिकॉर्ड नहीं; <em>असत्यापनीय</em> — स्रोत
        तक पहुँचा नहीं जा सका, और रिपोर्ट उस मार्ग का नाम बताती है जिसका प्रयास हुआ।
      </>
    ),
  },

  who: {
    kicker: "कौन ऑर्डर करता है",
    h2: "इस जाँच की ज़रूरत किसे है?",
  },

  related: {
    kicker: "संबंधित",
    h2: "इसके साथ आमतौर पर कौन-सी जाँचें ऑर्डर होती हैं?",
    all: "पूरी जाँच लाइब्रेरी",
  },
};
