/** English copy for `components/chrome/**` — the nav, the footer, the
 *  breadcrumb, the closing CTA band, the consent bar, and the two shared
 *  blocks that carry fixed headings (`FaqSection`, `CheckTable`).
 *
 *  The reasoning for every shape below — why the English object is the schema,
 *  why a label is keyed by its destination, why rich text is real JSX, why an
 *  `aria-label` stays a `string` — is in `./index`'s header and is not
 *  repeated here. What IS here is the per-decision note that only makes sense
 *  with this content in front of you.
 *
 *  NO `as const`, per the recipe: it would pin every leaf to its literal type
 *  and force `hi` to repeat the English bytes to typecheck.
 *
 *  MEASURED: 26 JSX text nodes across 7 files by the `>text<` matcher in
 *  `./index`'s opening paragraph (comments stripped first — without that the
 *  matcher scores 47 in this directory, and 20 of those are prose inside the
 *  file headers). The 24 the header quotes was run before
 *  `chrome/CheckTable.tsx` was extracted; the number in the header is left as
 *  the measurement of the day it was taken and the drift is recorded in
 *  `tools/test/copy.test.ts`. The matcher misses attribute copy entirely —
 *  this file also holds 9 `aria-label`s and 5 `alt`s, which is the
 *  "lower bound" the header warns about, quantified: 40 leaves for 26 nodes.
 */

export const en = {
  /** `chrome/SiteNav.tsx`. `links` is keyed by destination: the component owns
   *  the ORDER and the hrefs (routing), the dictionary owns the words. */
  nav: {
    /** The logo anchor's accessible name. Duplicated in `footer.logoHome`
     *  rather than shared, because they are two controls a translator sees in
     *  two places; a shared leaf would be a fourth structural rule to explain
     *  for one string. */
    logoHome: "HelloVerify — home",
    primary: "Primary",
    primaryMobile: "Primary, mobile",
    links: {
      "/governments": "Governments",
      "/business": "Business",
      "/individuals": "Individuals",
      "/platform": "Platform",
      "/resources": "Resources",
    },
    /** The four dropdowns and the two plain links, from the old site's
     *  menu (helloverify.com, Sep 2026). `SiteNav` owns the order, hrefs
     *  and icons; this owns the words, keyed by item id. */
    menus: {
      solutions: {
        label: "Solutions",
        cols: {
          gov: "GOVERNMENT AUTHORITIES",
          biz: "ENTERPRISE & SMALL BUSINESS",
          consumer: "CONSUMER SERVICE",
        },
      },
      products: { label: "Products" },
      premium: {
        label: "Premium Services",
        title: "PREMIUM SERVICES",
        lede: "Dedicated one-to-one support for seamless verification and application submission.",
      },
      support: { label: "Support", col: "CONTACT US" },
    },
    items: {
      govHealth: { t: "Health Authorities", d: "Verify healthcare professionals credentials from primary source" },
      govImmigration: { t: "Immigration Authorities", d: "Streamlining pre-screening & verification of Visa Application process" },
      govEducation: { t: "Manpower & Education Authorities", d: "Verifying education qualification from primary source" },
      govTrade: { t: "Business & Trade Authorities", d: "Verifying business entities & directors for regulatory compliance" },
      forBusiness: { t: "For Business", d: "Comprehensive verification solutions for employees, vendors & partners with continuos monitoring" },
      forSmb: { t: "For SMB", d: "Reliable background verification packages tailored for growing businesses" },
      employee: { t: "Employee Verification", d: "Comprehensive verification for both white- and blue-collar/gig workers" },
      kyc: { t: "Know Your Customer (KYC)", d: "Secure identity verification with facial recognition and liveness checks" },
      individuals: { t: "Verify Individuals", d: "Verify drivers, home staff, tenants & nannies instantly within 30 mins" },
      visa: { t: "Start Your Visa Screening Process", d: "Pre screening documents for Tourist, Student & Work visa application" },
      global: { t: "Global Verification", d: "Explore International verification checks across 120+ countries" },
      bgvEnterprise: { t: "Background verification for Enterprises", d: "Comprehensive background verification for large-scale and diverse workforce needs" },
      bgvSmb: { t: "Background verification for Small & Medium Businesses", d: "Fast and reliable background checks tailored for growing businesses" },
      certifier: { t: "Certifier - Vendor due diligence", d: "Verify and onboard vendors with structured due diligence and risk checks" },
      immigrationDocs: { t: "Immigration Documents Pre-screening", d: "Verification solutions designed to support immigration and visa processing" },
      hellov: { t: "HelloV - Verify Anyone", d: "Verify Anyone instantly via Whatsapp" },
      trust: { t: "Trust & Safety - KYC", d: "Secure identity verification and onboarding with advanced KYC checks" },
      premHealth: { t: "Doctor, Dentist & Other Health Practitioners", d: "Services designed to ensure accurate submission for healthcare professionals applying to authorities" },
      premImmigration: { t: "Immigration Documents Pre-Screening", d: "Personalized support to ensure accurate & hassle free visa pre-screening process" },
      premConsumer: { t: "Consumer Service", d: "Advanced verification package with extra background checks for greater confidence, safety, and peace of mind" },
      enquiry: { t: "Enquiry", d: "Reach our team for questions, pricing, and partnership opportunities." },
    },
    about: "About Us",
    technology: "Technology",
    signUp: "Sign Up",
    account: "Account",
    userMenu: {
      myCart: "My Cart",
      myOrders: "My Orders",
      profileSettings: "Profile Settings",
      logout: "Logout",
    },
    cta: "Talk to sales",
    /** Real text in a `.sr-only` span, not an `aria-label` — a `<label>` has
     *  no role that permits a name from `aria-label` (axe
     *  `aria-prohibited-attr`, serious). See the call site. */
    openMenu: "Open menu",
    /** Plain `&`, NOT `&amp;`. The JSX this replaced read `Contact &amp;
     *  support`; JSX decodes the entity before React sees it, and React
     *  re-escapes on the way out, so a literal `&amp;` here would emit
     *  `&amp;amp;`. Second corollary in `./index`'s byte-identity section. */
    contact: "Contact & support",
  },

  /** `chrome/SiteFooter.tsx`. Three keyed tables — `cols` by column id,
   *  `links` by destination, `certs` by credential id — because the component
   *  keys its rendered nodes on the heading text, on `href + label` and on the
   *  `alt`. Keeping those tables here means each key still resolves to the
   *  same English string it did before, which is the third corollary of the
   *  byte-identity rule. */
  footer: {
    logoHome: "HelloVerify — home",
    blurb:
      "Global leading AI-powered background verification platform enabling trusted hiring, workforce integrity, and compliance-driven onboarding across global enterprises.",
    /** Accessible names for the three icon-only anchors. Kept as copy rather
     *  than hardcoded product names: they are what a screen reader announces,
     *  and a locale that transliterates them should be able to. */
    social: {
      linkedin: "LinkedIn",
      facebook: "Facebook",
      instagram: "Instagram",
    },
    about: "About us",
    contact: "Contact & support",
    cols: {
      governments: "Governments",
      business: "Business",
      individuals: "Individuals",
      platform: "Platform",
      resources: "Resources",
    },
    links: {
      "/solutions/health-authorities": "Health authorities",
      "/solutions/immigration-authorities": "Immigration authorities",
      "/solutions/manpower-and-education-authorities": "Manpower & education",
      "/solutions/trade-authorities": "Trade & business",
      "/solutions/manpower-and-education-authorities/ministry-of-manpower": "Ministry of Manpower story",
      "/products/bgv-enterprise": "Enterprise BGV",
      "/products/bgv-smb": "Small & medium business",
      "/employee-verification": "Employee verification",
      "/products/customer-kyc": "Customer KYC · Trust & Safety",
      "/products/certifier": "Vendor due diligence · Certifier",
      "/products/hellov": "HelloV — verify anyone",
      "/products/immigration": "Visa & immigration screening",
      "/individuals/home-family": "Home & family checks",
      "/technology": "Technology & APIs",
      "/platform/security-compliance": "Security & compliance",
      "/international": "Global coverage — 120+ countries",
      "/resources/checks": "All 33 checks",
      "/checks/identity": "Identity",
      "/checks/employment": "Employment",
      "/checks/education": "Education",
      "/checks/criminal": "Criminal record",
      "/checks/global-database": "Global database",
      "/resources/countries": "Country guides",
      "/resources/glossary": "Glossary",
      "/resources/blog": "Blog",
    },
    /** `alt` text for the certification marks. Deliberately NOT sourced
     *  from `CREDENTIAL_MARKS` in `lib/content/company.ts`: that table is the
     *  one place the site's CLAIMS live and `chrome/CertCard.tsx` reads it,
     *  but the footer strip renders a different set in a different order and
     *  pointing it at that table would be a content change, not a copy move.
     *  Reconciling the two is a separate, visible decision. */
    certs: {
      iso: "ISO 27001",
      gdpr: "GDPR",
      pbsa: "PBSA",
      nsr: "NSR",
    },
    certline: "ISO 27001 · GDPR · PBSA · NSR",
    copyright: "© 2026 All rights reserved. Hello Verify India Private Ltd.",
    /** Three leaves rather than a table keyed by href, because the component
     *  writes these three anchors out longhand and has no `key` on them.
     *  Keying them would have meant mapping, which adds `key` props to the
     *  flight payload for no gain. */
    legal: {
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      cookies: "Cookie Policy",
    },
    offices: "India · UAE · Singapore · Philippines · Egypt · United States",
    /** Homepage v2's footer treatment (desktop, every route): the canvas's
     *  "last page of the document" band, the live office clocks, the
     *  embossed seals' captions, the UV wordmark and its microtext. Here and
     *  not in `sections` because the footer is chrome and reads `CHROME`;
     *  every string is the Desktop4 board's, verbatim. */
    v2: {
      sheet: "Sheet 12 / 12",
      /** Two leaves: the second is set in italic green. Same words as the
       *  hero's `headline` + `headlineEm`. */
      end: "Verified at the source,",
      endEm: "in minutes.",
      backToTop: "Back to top",
      /** One repeat of the text that runs round the back-to-top seal. */
      backRing: "BACK TO TOP · VERIFIED AT THE SOURCE ·",
      officesHead: "Six offices. Twelve hours apart.",
      /** `{open}` is filled in the browser once the clocks have run; the
       *  server renders no count, since it cannot know the time of viewing. */
      openNow: "{open} of 6 offices open now",
      atDesk: "at a desk now",
      closed: "closed",
      cities: {
        noida: { city: "New Delhi", country: "India" },
        dubai: { city: "Dubai", country: "United Arab Emirates" },
        singapore: { city: "Singapore", country: "Singapore" },
        manila: { city: "Manila", country: "Philippines" },
        cairo: { city: "Cairo", country: "Egypt" },
        newYork: { city: "New York", country: "United States" },
      },
      /** Visible captions under the embossed seals. The images keep
       *  `certs` as their `alt`; the captions are `aria-hidden` so a screen
       *  reader hears each credential once. */
      seals: {
        iso: "ISO 27001",
        gdpr: "GDPR",
        pbsa: "PBSA",
        nsr: "NSR",
      },
      markHint: "UV · move your cursor over the mark",
      /** One repeat of the microtext under the wordmark; the component tiles
       *  it. Every figure is one `sections.numbers` already states. */
      microtext: "HELLO VERIFY INDIA PRIVATE LTD · VERIFIED AT THE SOURCE · 20M+ CHECKS COMPLETED SINCE 2018 · 120+ COUNTRIES · ISO 27001 · GDPR · PBSA · NSR · INDIA · UAE · SINGAPORE · PHILIPPINES · EGYPT · UNITED STATES ·",
    },
  },

  /** `chrome/Breadcrumb.tsx`. `home` is the rung that component renders
   *  itself, and `lib/seo/schema/breadcrumbs.ts` mirrors it — see the
   *  "Known couplings" note in `./index`, and the assertion in
   *  `tools/test/copy.test.ts` that now holds the two together. */
  breadcrumb: {
    label: "Breadcrumb",
    home: "Home",
  },

  /** `chrome/ClosingCta.tsx`. Every leaf here is a PROP DEFAULT — a caller may
   *  override `heading`, `sub` or `cta`, and several do. So these are the copy
   *  for the band when nobody says otherwise, which is 31 of the pages. */
  closingCta: {
    region: "Get started",
    /** The one rich-text leaf in this namespace, and the reason the file is
     *  `.tsx`. Written on its own lines exactly as the prop default was: JSX
     *  folds a leading and a trailing newline-plus-indent away, so the three
     *  children are `"Every great journey deserves a "`, the `<em>`, and
     *  `" beginning."` — the same three React saw before. */
    heading: (
      <>
        Every great journey deserves a <em>verified</em> beginning.
      </>
    ),
    sub: "Take the first step. We'll handle the rest.",
    cta: "Talk to sales",
    plans: "See plans & pricing",
  },

  /** `chrome/ConsentBanner.tsx`, read through `pick()` because that component
   *  is handed `locale` by the root layout and stays synchronous.
   *
   *  `body` IS A PLAIN STRING and the link that follows it is NOT folded in,
   *  which is the interesting case in this slice. The markup is
   *  `{body}{" "}<a>…</a>` — three children, with React's `<!-- -->` separator
   *  between the first two. A function leaf taking the anchor as a `ReactNode`
   *  (the shape `./index` describes for a sentence wrapping a
   *  component-owned link) would let a locale move the link mid-sentence, and
   *  it would also change those three children into one — a different byte
   *  string on all 62 pages. Deferred to the day a locale actually needs it,
   *  when the HTML is allowed to move; recorded here because the header names
   *  this component as the candidate. */
  consent: {
    title: "Cookies on this site",
    body:
      "Strictly necessary cookies keep the site working and are always on. Analytics and " +
      "marketing cookies are set only if you accept — nothing non-essential runs before you " +
      "choose, and you can change your mind at any time.",
    policy: "Cookie Policy",
    accept: "Accept",
    reject: "Reject",
    reopenRegion: "Your cookie choice",
    reopen: "Cookie preferences",
  },

  /** `chrome/FaqSection.tsx`. Only the eyebrow: the questions and answers are
   *  `Faq` records the 15 calling pages own, and they are `app/[locale]/**`
   *  copy that another namespace will take. */
  faq: {
    kicker: "Questions",
  },

  /** `chrome/CheckTable.tsx`. The three column headings, which that file's
   *  header argues at length must stay literals rather than become a `cols`
   *  prop — two other `.tbl3` sites head their columns differently and are
   *  deliberately not this component. Literal to the component, copy to a
   *  translator; those are not in conflict. */
  checkTable: {
    check: "Check",
    turnaround: "Turnaround",
    confirmedWith: "Confirmed with",
  },

  /** OTP modal (`components/auth/LoginDialog.tsx`). Words from the old SPA
   *  `accountCmsDefaults` English. The modal is new-design chrome, not a
   *  restyle of the homepage sections. */
  login: {
    ariaLabel: "Login",
    title: "Login",
    welcome: "Welcome to",
    brand: "HelloVerify!",
    mobileLabel: "Mobile Number",
    mobilePlaceholder: "Enter 10 Digit Number",
    loginViaOtp: "Login Via OTP",
    pleaseWait: "Please wait…",
    verifyTitle: "Enter Verification code",
    mockHint:
      "Mock mode: OTP is 123456. Use mobile 9111111111 to test registration; any other 10-digit number logs in as Demo User.",
    otpSentTo: "OTP sent to",
    edit: "Edit",
    resendOtp: "Resend OTP",
    verifying: "Verifying…",
    verifyOtp: "Verify OTP",
    otpInvalid: "OTP is invalid, please check again",
    registerTitle: "Register",
    nameLabel: "Name *",
    emailLabel: "Email *",
    mobileNoLabel: "Mobile No.",
    genderLabel: "Gender *",
    genderMale: "Male",
    genderFemale: "Female",
    genderOther: "Other",
    saving: "Saving…",
    registerNow: "Register Now",
    success: "You have been logged in successfully!",
    accountCreatedSuccess: "Your account has been created successfully!",
    close: "Close",
    errors: {
      mobileDigits: "Mobile number must be 10 digits",
      otpDigits: "OTP must be 6 digits",
      nameInvalid: "Name must be at least 3 characters and contain only letters and spaces",
      requiredFields: "Please complete all required fields",
      sendOtp: "Error sending OTP",
      saveProfile: "Saving profile failed",
    },
  },
};
