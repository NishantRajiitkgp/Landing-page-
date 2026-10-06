/** English copy for `app/[locale]/about` — the old SPA's `about.base.json`,
 *  word for word, plus the shared `globals.base.json`
 *  `certificationsCompliance` title and line. `crumb` is the navbar's About
 *  label (`tools/test/copy.test.ts` ties the two). */

export const en = {
  crumb: "About Us",

  hero: {
    h1: (<>Building the AI-Powered Trust Infrastructure for the <em>World</em></>),
  },

  story: {
    vision: { h: "Our Vision", p: "To build the world's AI-powered trust infrastructure, enabling governments, regulators, enterprises, universities, healthcare institutions and financial organizations to verify people, businesses and credentials instantly, securely and globally." },
    mission: { h: "Our Mission", p: "To build global infrastructure for verifying people, businesses, and credentials enabling secure workforce mobility, trusted commerce, and confident decision making across every country." },
    imgAlt: "HelloVerify team working together in the office",
  },

  belief: {
    h: "Our Belief",
    q: (<>Trust is becoming the world's next critical digital infrastructure. <strong>HelloVerify</strong> is building the platform through which trust will move.</>),
  },

  investor: {
    h: "Our Investor",
    sub: "Recognized by Y Combinator as part of the top 1% of applicants, followed by scaling to 2,000+ enterprise clients.",
  },

  numbers: {
    h: "Built on trust, Proven by numbers",
    stats: {
      checks: { v: "20M+", l: "Checks completed since 2018" },
      clients: { v: "2000+", l: "Enterprise clients globally" },
      countries: { v: "120+", l: "Countries served" },
    },
  },

  values: {
    h: "Our Values",
    items: {
      integrity: {
        t: "Integrity, Always",
        p: "Trust begins with honesty. We conduct every verification diligently, communicate transparently and remain committed to doing what is right even when no one is watching.",
      },
      accuracy: {
        t: "Accuracy in Every Detail",
        p: "Our work supports important decisions. We approach every verification with diligence, consistency and attention to detail to deliver dependable information our clients can act upon.",
      },
      privacy: {
        t: "Privacy by Design",
        p: "We treat personal information with the care it deserves. Data protection, confidentiality, informed consent and responsible information handling are embedded in everything we do.",
      },
      fairness: {
        t: "Fairness and Respect",
        p: "Behind every verification is a person. We conduct our work objectively and respectfully, ensuring that candidates are treated with dignity throughout the process.",
      },
      speed: {
        t: "Speed with Responsibility",
        p: "Timely results matter, but never at the expense of accuracy or compliance. We combine efficient processes with responsible verification practices to deliver outcomes clients can trust.",
      },
      improvement: {
        t: "Continuous Improvement",
        p: "We remain curious, embrace better technology and continuously refine our processes. Every challenge is an opportunity to learn, improve and deliver greater value.",
      },
    },
  },

  clients: {
    h: "What Our Client Speak",
    items: {
      hcl: {
        role: "HR Shared Services",
        company: "@India’s largest IT company",
        quote: "We are happy to be availing the services of HelloVerify and it's been a very fruitful journey so far. They are fast and accurate in running background checks, which have always helped us to make better hiring decisions. we wish to continue working with them in the future.",
      },
      cognizant: {
        role: "People Function",
        company: "@ India’s largest IT company.",
        quote: "I would like to extend my appreciation for the effort Helloverify has put into successfully closing critical verification cases across our key accounts. Their responsiveness, commitment, and turnaround time have been exceptional , the closure of the BGV on time has helped me get appreciations. Please keep it up as we require the same support in the coming future as well.",
      },
      heroFincorp: {
        role: "Associate Lead",
        company: "@India’s largest Fintech company.",
        quote: "Thank you HelloVerify for your continuous assistance and support. Looking forward for the same support in upcoming days.",
      },
    },
  },

  certs: {
    h: "Certifications & Compliance",
    lede: "At Hello Verify, your trust is our priority. Every interaction with Hello Verify is backed by strong security controls and adherence to data privacy requirements.",
    logos: { nsr: "NSR — Credible Data, Credible People", pbsa: "PBSA — Professional Background Screening Association", iso9001: "ISO 9001", gdpr: "GDPR — General Data Protection Regulation" },
  },
};
