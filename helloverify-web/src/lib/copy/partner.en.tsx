/** English copy for `app/[locale]/partner-with-us` — the HelloVerify Partner
 *  Programme page (`helloverify-partner-programme-final.html`), word for
 *  word, with headings in the site's sentence case. `crumb` is the footer's
 *  label for the page. The badge captions follow `CREDENTIALS` in
 *  `lib/content/company.ts`, which says GDPR-aligned, not compliant. */
import type { ReactNode } from "react";

export const en = {
  crumb: "Partner with us",

  phone: {
    display: "+91 9289 6276 22",
    callTo: "Call to Get Onboarded",
    call: "Call +91 9289 6276 22",
  },

  hero: {
    k: "HelloVerify Partner Programme · Earn up to 15% commission",
    h1: "Recommend with confidence.",
    h1b: "Build recurring income.",
    h1c: "Earn every time.",
    sub: "Partner with HelloVerify and earn up to 15% commission on the services your clients use — from employee background checks and visa document verification to KYC, vendor due diligence and instant consumer checks. Your clients get a verification partner trusted by governments. You build an additional revenue stream.",
    note: (phone: ReactNode) => (
      <>
        Sign up in the form here, or call {phone} and our team will get you onboarded over the phone. No forms to work out on your own. <strong>Completely digital, start to finish.</strong>
      </>
    ),
    join: "Join as a Partner",
    calc: "Calculate Your Earnings",  },

  form: {
    h: "Join as a Partner",
    sub: "Six short fields. We will call you back to complete the rest.",
    business: { label: "Business / Agency Name", placeholder: "Sunrise Consultants" },
    person: { label: "Contact Person", placeholder: "Full name" },
    mobile: { label: "Mobile Number", placeholder: "9876543210" },
    countryCode: "Country code",
    email: { label: "Work Email", placeholder: "you@company.com" },
    city: { label: "City", placeholder: "New Delhi" },
    type: {
      label: "I Am a / an",
      placeholder: "Select one",
      options: {
        travel: "Travel agent or visa consultant",
        hr: "HR or recruitment consultant",
        staffing: "Staffing or manpower agency",
        immigration: "Immigration or study-abroad consultant",
        property: "Real estate broker or property manager",
        compliance: "CA, CS or compliance firm",
        hrtech: "HR-tech or software platform",
        freelancer: "Freelancer or individual",
        client: "Existing HelloVerify client",
        other: "Other",
      },
    },
    consent: "I agree to HelloVerify processing my personal data as set out in the consent notice.",
    notice: {
      summary: "Read the consent notice",
      p1: "Hello Verify India Private Limited will process the details you enter above — name, business name, mobile number, work email, city and partner type — only to contact you about the Partner Programme, assess your application and onboard you as a partner. We will not use them for any other purpose without asking you again, and we keep them only for as long as that purpose requires.",
      p2: (email: ReactNode, policy: ReactNode) => (
        <>
          You can withdraw your consent at any time, as easily as you gave it, by emailing {email}. Write to the same address to access, correct or erase your data, nominate someone to act for you, or raise a grievance. You may also complain to the Data Protection Board of India. Read our {policy}.
        </>
      ),
      policy: "Privacy Policy",
    },
    submit: "Join as a Partner",
    sending: "Sending…",
    talk: (phone: ReactNode) => <>Would rather talk? Call {phone}</>,
    done: "Thank you — your partner application is with us. Our partner team will call you back to complete the rest.",
    checks: {
      business: "Enter your business or agency name.",
      person: "Enter the contact person's full name.",
      email: "Enter an email address we can reply to.",
      phoneMissing: "Enter a mobile number.",
      phoneInvalid: "Use digits only, up to 15.",
      countryMissing: "Choose a country code.",
      city: "Enter your city.",
      type: "Choose what describes you best.",
      consent: "Tick the box to agree to the consent notice.",
    },
  },

  trust: {
    /** `{w}` is where the client type, which rotates with the tabs, sits. */
    h: "Grow with a Brand Trusted by {w}",
    aria: "Client type",
    tabs: {
      governments: "Governments",
      enterprises: "Enterprises",
      smb: "Small & Medium Businesses",
    },
    governments: {
      logos: {
        mom: "Ministry of Manpower, Singapore",
        latvia: "Embassy of the Republic of Latvia",
        italy: "Embassy of Italy",
        mohesr: "Ministry of Higher Education & Scientific Research",
      },
      note: "Primary source verification for embassies, ministries and regulators across Asia, the Middle East and Europe.",
    },
    enterprises: {
      logos: {
        cognizant: "Cognizant",
        infosys: "Infosys",
        accenture: "Accenture",
        wipro: "Wipro",
        hcl: "HCL",
      },
      note: "2,000+ enterprise clients globally — from IT and ITES to retail, food service and financial services.",
    },
    smb: {
      logos: {
        akcelerator: "Akmazo Akcelerator",
        aidenai: "Aiden AI",
        lucid: "Lucid Technology Services",
        midfin: "Midfin Wealth",
        lnp: "LNP Infotech",
      },
      note: "1,200+ small and medium businesses run their background checks with HelloVerify.",
    },
  },

  advantages: {
    k: "Why partner",
    h: "Enjoy the advantages of the HelloVerify Partner Programme",
    sub: "Whether you run a travel agency, an HR consultancy or simply have a strong business network, the programme is built to help you earn more from the relationships you already have, without adding work to your day.",
    /** The figures drawn into three of the cards' artwork. */
    art: { rate: "15%", free: "₹0", more: "30+" },
    items: {
      commission: { t: "Earn Up to 15% Commission", p: "Earn up to 15% on the service fee of the clients you refer. Refer a client billing ₹1,00,000 and earn up to ₹15,000." },
      recurring: { t: "Recurring, Passive Income", p: "Verification is never one-and-done. Every new hire, tenant, driver or visa applicant your client verifies adds to your earnings." },
      unlimited: { t: "Unlimited Earnings", p: "No caps and no ceilings. The more clients you bring, the more you earn — and your rate rises with your volume." },
      zero: { t: "Zero Investment", p: "Registration, training and marketing material are free. No set-up cost, no inventory and no infrastructure to build." },
      minimum: { t: "No Minimum Volume", p: "Refer at your own pace. There is no target you need to hit to stay on the programme." },
      transparent: { t: "Transparent Commission", p: "Every referral, its status and the commission earned, set out in one clear statement. No hidden deductions." },
      wider: { t: "A Wider Offering", p: "Add 30+ verification checks to what you already offer your clients, without hiring a single person." },
      credibility: { t: "Built-In Credibility", p: "Recommend a Y Combinator-backed, ISO-certified platform trusted by embassies and 2,000+ enterprises." },
    },
    quote: "Your network already needs verification. Now it can pay you every time.",
  },

  proof: {
    k: "Trusted at the source",
    h: "Recommend a partner your clients can rely on.",
    p1: "Your reputation travels with every referral, so it matters who you recommend. HelloVerify has completed over 20 million checks since 2018 and works with immigration, healthcare, manpower and trade authorities to verify people and businesses before they cross borders, start work or enter regulated professions.",
    p2: "For your clients, that means faster, evidence-backed decisions. For you, it means a recommendation that reflects well on your business — every single time.",
    panel: "Built on trust, proven by numbers",
    stats: {
      checks: { v: "20M+", l: "Checks completed since 2018" },
      clients: { v: "2,000+", l: "Enterprise clients globally" },
      countries: { v: "120+", l: "Countries served" },
      catalogue: { v: "30+", l: "Verification checks" },
      rate: { v: "99.2%", l: "Verified report rate" },
      speed: { v: "3×", l: "Faster than the industry average" },
    },
    badges: {
      iso: "ISO 27001 & ISO/IEC 27701 certified",
      gdpr: "GDPR-aligned",
      pbsa: "PBSA member",
      nsr: "National Skills Registry",
    },
    backed: "Backed by",
    yc: "Y Combinator",
  },

  services: {
    k: "Every service",
    h: "One partnership. Every HelloVerify service.",
    sub: "Earn commission across our complete portfolio, so whatever your clients need to verify, you are covered.",
    ideal: "Ideal clients:",
    upTo15: "Up to 15%",
    upTo10: "Up to 10%",
    items: {
      employee: { t: "Employee Background Verification", p: "White-collar and blue-collar screening — education, employment, address, criminal, moonlighting and identity checks for enterprises and SMBs.", who: "Corporates, startups, staffing firms" },
      visa: { t: "Visa Applicant Document Verification", p: "Document verification for visa applicants before submission, tailored to each embassy's requirements — the service behind our Italian National Visa partner programme.", who: "Travel agents, visa and immigration consultants" },
      health: { t: "Healthcare Professional Verification", p: "Primary source verification of healthcare credentials, with applicant form-filling support for health authority licensing.", who: "Doctors, nurses, healthcare recruiters" },
      education: { t: "Education & Manpower Credential Checks", p: "Credential verification for global workforce mobility, supporting manpower and higher-education authorities.", who: "Study-abroad and overseas recruitment consultants" },
      international: { t: "International Background Checks", p: "Criminal, employment, education, identity and right-to-work checks across 120+ countries.", who: "Global employers, GCC and overseas recruiters" },
      kyc: { t: "KYC & Digital Onboarding", p: "Customer KYC that streamlines digital onboarding and helps detect fraud before it reaches your client's business.", who: "Fintechs, NBFCs, marketplaces" },
      certifier: { t: "Certifier — Vendor & Supplier Due Diligence", p: "Trade licence, GST, credit, financial and promoter background checks to onboard business partners with confidence.", who: "Procurement teams, distributors, manufacturers" },
      hellov: { t: "HelloV — Consumer Verification", p: "Verify drivers, home staff, tenants and nannies in as little as 30 minutes, right on WhatsApp.", who: "Households, landlords, RWAs, property brokers" },
      instant: { t: "Instant Individual Checks", p: "Single checks in minutes — age verification in 15 minutes, driving licence in 30, digital employment in 60.", who: "Gig platforms, fleet operators, HR teams" },
    },
  },

  who: {
    k: "Who it is for",
    h: "Who is this for?",
    sub: "Anyone whose clients hire, travel, rent, study abroad or onboard vendors — and every business that advises them.",
    audiences: [
      "Travel agencies",
      "Visa & documentation consultants",
      "HR & recruitment consultants",
      "Staffing & manpower agencies",
      "Immigration advisors",
      "Study-abroad counsellors",
      "Healthcare recruiters",
      "Real estate brokers & property managers",
      "CA, CS & compliance firms",
      "HR-tech, HRMS & ATS platforms",
      "Fleet operators & gig platforms",
      "RWAs & facility managers",
      "Freelancers & community leaders",
      "Existing HelloVerify clients",
    ],
    choose: "Choose how you want to partner:",
    best: "Best for:",
    models: {
      referral: { t: "Referral Partner", p: "Make the introduction — by link, email or a quick call. Our team onboards, delivers and supports the client. You earn commission on every completed service.", who: "Consultants, agents, freelancers and existing clients" },
      channel: { t: "Channel Partner", p: "Offer HelloVerify services to your own clients as part of your portfolio, backed by a named relationship manager and a co-branded marketing kit.", who: "Agencies, consultancies and service firms" },
      integration: { t: "Integration Partner", p: "Build HelloVerify checks into your HRMS, ATS or platform through our APIs and earn on every check run through it.", who: "HR-tech, SaaS and marketplaces" },
    },
    note: (
      <>
        Commission depends on the <strong>service and your monthly volume</strong>, up to a maximum of 15%. Your exact rate card and payout terms are set out in your partner agreement.
      </>
    ),
  },

  support: {
    k: "We do the work",
    h: "You introduce the client. We handle everything else.",
    p1: "Give your clients access to a complete verification partner, without adding operations, staff or technology to your business.",
    p2: "You make the introduction. HelloVerify handles onboarding, verification, reporting and support — and your commission is credited for every completed service.",
    note: (phone: ReactNode) => (
      <>
        Sign up in the form above, or call {phone} and our team will get you onboarded over the phone. <strong>Completely digital, start to finish.</strong>
      </>
    ),
    items: {
      onboarding: { t: "Client Onboarding", p: "We take your client through scope, pricing and set-up, and keep you in the loop throughout." },
      scope: { t: "Checks Within the Agreed Scope", p: "Every verification is carried out for the service your client selects, using the applicable verification process." },
      online: { t: "Completely Online, No Paperwork", p: "Upload, verification and the report all happen online. Nothing to print, courier or drop off." },
      reports: { t: "Evidence-Backed Reports", p: "Clear remarks, verification artefacts and an auditable trail for every decision your client makes." },
      clarifications: { t: "Verification-Related Clarifications", p: "We request additional information where it is needed to progress the checks, so you do not have to chase it." },
      credited: { t: "Commission Credited to You", p: "Every completed service is attributed to your partner code and shown in your commission statement." },
    },
  },

  earnings: {
    k: "Earnings",
    h: "See how much your network can earn.",
    p1: "Your commission is a percentage of the service fee your client pays, at the rate applicable to the service and your monthly volume — up to 15%.",
    p2: "Because verification is a recurring need, every client you bring can keep earning for you, month after month. That is passive income built on relationships you already have.",
    example: {
      h: "A worked example",
      p: (
        <>
          A recruitment consultant introduces 10 corporate clients who each spend ₹50,000 a month on background checks. At 15%, that is <strong>₹75,000 in commission every month</strong> — ₹9,00,000 a year, from ten introductions.
        </>
      ),
      fine: "Illustrative only. Actual commission depends on the services used, your monthly volume and the terms of your partner agreement.",
    },
    calc: {
      h: "Earnings calculator",
      sub: "Move the sliders to estimate your commission.",
      clients: "Active clients you refer",
      billing: "Average monthly spend per client",
      rate: "Your commission rate",
      rateMax: "(maximum 15%)",
      monthly: "Estimated monthly commission",
      annual: "Estimated annual income",
      /** `{n}` is the number of clients. */
      one: "{n} client",
      many: "{n} clients",
      perMonth: "a month",
      commission: "commission",
      cta: "Start Earning — Join as a Partner",
    },
  },

  process: {
    k: "Process",
    h: "Five simple steps to get you onboarded",
    sub: (phone: ReactNode) => (
      <>
        Straightforward, and you do not have to do any of it alone. Call {phone} at any step and our team will walk you through it or complete it for you over the phone.
      </>
    ),
    steps: {
      register: { t: "Register Your Interest", p: "Fill in the six-field form or call us. Your mobile number and email are confirmed with a one-time code." },
      business: { t: "Tell Us About Your Business", p: "Business name, city, the services your clients need and roughly how many clients you can refer each month. One short screen." },
      documents: { t: "Share Your Business Documents", p: "PAN, address proof, bank proof and GST if you are registered. Photograph them on your phone — no printing or couriering." },
      agreement: { t: "Sign the Partner Agreement", p: "Sign and stamp it, then upload the scan. Your service scope, commission rate and payout terms are confirmed here before you go live." },
      refer: { t: "Start Referring Clients", p: "You receive your partner code, share it with your network or introduce clients directly, and start earning from your very first referral." },
    },
    download: "Download Agreement (PDF)",
    between: (
      <>
        <strong>Between step 3 and step 4 we run the checks at our end.</strong> It takes up to two working days and there is nothing for you to do. We message you on WhatsApp the moment it clears.
      </>
    ),
    band: "You introduce the client. HelloVerify delivers the service. You earn on every completed verification.",
    offline: "Prefer to share leads offline? Send them to your relationship manager by phone, email or WhatsApp. Every lead that converts is credited to your partner code.",
  },

  included: {
    k: "Your partner account",
    h: "Everything included with your partner account",
    items: {
      manager: { t: "Named Relationship Manager", p: "One person who knows your account, on WhatsApp and email, instead of a general ticket queue." },
      kit: { t: "Co-Branded Marketing Kit", p: "Ready social creatives, WhatsApp forwards, brochures and service sheets carrying your business name, so you can announce the services to your own clients." },
      training: { t: "Training for Your Team", p: "Onboarding sessions on each service and what your clients need, plus refreshers whenever requirements change." },
      yours: { t: "Your Client Stays Yours", p: "Attribution is locked to your partner code, so every client you introduce is tracked to you from the first conversation." },
      priority: { t: "Priority Support", p: "Partner-referred clients get a dedicated escalation path when timelines are tight." },
      statement: { t: "One Commission Statement", p: "Every client, every service and every payout, rolled up into a single, easy-to-read statement." },
    },
  },

  faq: {
    h: "Questions partners ask",
    items: [
      { q: "Does joining cost anything?", a: "No. Registration, training and marketing material are free, and there is no minimum volume you need to hit to stay on the programme." },
      { q: "How much commission can I earn?", a: "Up to 15% on most services, and up to 10% on HelloV consumer verification and instant individual checks. Commission is a percentage of the service fee your client pays, at the rate applicable to the service and your monthly volume. Your exact rate card and payout terms are set out in your partner agreement." },
      { q: "Which services can I earn commission on?", a: "Every HelloVerify service: employee background verification, visa applicant document verification, healthcare and credential verification, international checks, KYC, vendor due diligence through Certifier, and HelloV consumer verification." },
      { q: "Do I need to sell or deliver the verification myself?", a: "No. You make the introduction. HelloVerify handles client onboarding, the verification itself, reporting and any verification-related clarifications." },
      { q: "How is my commission paid?", a: "Commission is calculated per completed service and paid to your registered bank account as per the payout cycle in your partner agreement. You receive one statement covering every client you refer." },
      { q: "Who can become a partner?", a: "Travel agents, visa and immigration consultants, HR and recruitment consultants, staffing agencies, property brokers, compliance firms, HR-tech platforms, freelancers and existing HelloVerify clients — anyone with a network that needs verification." },
      { q: "Can I refer clients outside India?", a: "Yes. HelloVerify serves clients in 120+ countries, with offices in India, the UAE, Singapore, the Philippines, Egypt and the USA." },
      { q: "I am already a HelloVerify travel agent partner. Can I earn on other services?", a: "Yes. Speak to your relationship manager and we will extend your existing partnership to the full HelloVerify portfolio." },
      { q: "Will you contact my clients directly?", a: "Only about their own verification — onboarding, status updates and document clarifications. Communication arrangements are agreed with you during onboarding." },
    ],
  },

  close: {
    h: "Bring your network to HelloVerify.",
    p: "Turn the trust you have built into an additional, recurring revenue stream. Fill the short form at the top of this page, or simply call us and we will do the rest with you on the line.",
    travel: "Already a travel agent partner? Speak to your relationship manager to extend your partnership.",
    own: "Looking for verification for your own business?",
    sales: "Talk to sales.",
    call: {
      h: "Prefer to get onboarded on a call?",
      p: "Our team fills in the details with you, explains the agreement and sets up your partner account while you are on the line.",
      hours: "Monday to Saturday · 10:00 to 19:00 IST",
      form: "Or fill the form instead",
    },
    disclaimer: {
      h: "Disclaimer",
      p: "HelloVerify provides background verification, identity verification, document verification and due diligence services to individuals, businesses and authorities. Partner commissions, eligibility and commercial terms are governed by the applicable partner agreement, and commission rates vary by service and monthly volume. Earnings shown on this page are illustrative only and do not guarantee any level of income.",
    },
  },
};
