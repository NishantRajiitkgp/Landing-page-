/** English copy for `app/[locale]/contact` — the old SPA's `contactUs.base.json`,
 *  word for word (hero, left intro, enquiry intro, consent and data-usage
 *  notes, offices, track panel). `track.result`, `orders` and
 *  `enquiryInstead` are this host's honest track answer and have no CMS
 *  source. The enquiry form's own words are `./forms`, shared with the
 *  homepage. */

export const en = {
  crumb: "Contact Us",

  hero: {
    h1: (<>Lets Build the Business <em>Together</em></>),
    sub: "See how HelloVerify can help your business. Schedule a demo with our background screening expert",
  },

  tabs: {
    aria: "Contact options",
    enquiry: "Enquiry",
    track: "Track your Application",
  },

  track: {
    title: "Select Tracking Method",
    or: "Or",
    phoneEmail: "Phone Number/ Email ID",
    passport: "Passport Number",
    reference: "Reference Number",
    phoneHeading: "Enter Your Phone Number or Email",
    passportHeading: "Enter Your Details",
    passportNote: "An OTP will be send to you registered email id/phone number.",
    referenceHeading: "Enter Your Reference",
    countryCode: "Country Code",
    countryPlaceholder: "Country Code",
    phone: "Phone Number",
    phonePlaceholder: "Phone Number",
    email: "Email ID",
    emailPlaceholder: "Enter your email Id",
    passportNumber: "Passport Number",
    passportPlaceholder: "Passport number",
    referenceNumber: "Reference Number",
    referencePlaceholder: "Enter your reference number",
    referenceExample: "Enter your reference number (e.g., HV2024001234)",
    sendOtp: "Send OTP",
    result:
      "This page cannot look up a live case. If you ordered here, open My Orders. Authority applicants use their programme portal. Or send an enquiry and we will look it up.",
    orders: "My Orders",
    enquiryInstead: "Send an enquiry",
  },

  /** The image panel beside the form — the CMS `leftIntro`. */
  side: {
    h: (<>Ready to Make Smarter, Safer Decisions? Let’s <em>Connect</em></>),
    p: "Whether you are an applicant, organization, regulator, or authorized representative submitting details on behalf of your institution, our team is here to assist and support you.",
  },

  intro: "Give us a few details and we'll offer the best solution.",

  notes: {
    consentTitle: "*Consent Note:",
    consentBody: "By entrusting HelloVerify with your personal information through this website, you expressly consent to the processing of your data for lead generation purposes — empowering us to deliver timely, relevant updates, thoughtfully curated offers and meaningful communications about the products and services designed to serve you best. Flowing & Engaging Whether it's your nanny, house staff, driver, or tenant — every person in your home can be verified quickly, accurately and entirely digitally. No paperwork. No delays. Just complete peace of mind.",
    dataUsageTitle: "#Data Usage",
    dataUsageBody: "The personal information you provide will be used exclusively for lead generation purposes, including the delivery of thoughtfully curated marketing communications about our products and services. HelloVerify is firmly committed to your privacy — your data will never be used for any purpose beyond what you have explicitly consented to. For a comprehensive understanding of how we handle, protect and respect your personal data, we invite you to review our [Privacy Policy], which fully outlines our data protection practices and your rights.",
  },

  offices: {
    h: "Our Offices",
    list: {
      noida: { city: "India, New Delhi:", flag: "Flag of India" },
      cairo: { city: "Cairo, Egypt", flag: "Flag of Egypt" },
      dubai: { city: "UAE, Dubai", flag: "Flag of the United Arab Emirates" },
      singapore: { city: "Singapore", flag: "Flag of Singapore" },
    },
  },
};
