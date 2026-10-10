/** Italy visa travel-agent programme: the account and the agency step.
 *  `{x}` tokens are filled in the browser. */

export const en = {
  meta: {
    join: "Join as a partner",
    signIn: "Partner sign in",
    home: "Your partner account",
  },
  crumbs: {
    italy: "Embassy of Italy",
    join: "Join",
    signIn: "Sign in",
    home: "Partner",
  },
  tabs: {
    aria: "Account",
    join: "Join",
    signIn: "Sign in",
  },
  demo: {
    code: "Demo · code {code}",
    account: "Demo account · {email} · {password}",
  },
  join: {
    title: (
      <>
        Join as a <em>partner</em>
      </>
    ),
    first: "First name",
    last: "Last name",
    namePlaceholder: "Your name",
    email: "Work email",
    emailPlaceholder: "you@agency.com",
    phone: "Mobile",
    phonePlaceholder: "Mobile number",
    dial: "Country code",
    password: "Password",
    passwordPlaceholder: "Create a password",
    consent: "I agree to the {terms} and {privacy}.",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    submit: "Create account",
    call: "Or call",
    phoneDisplay: "+91 9289 6276 22",
    tel: "+919289627622",
  },
  password: {
    show: "Show password",
    hide: "Hide password",
    rules: {
      length: "8+ characters",
      letter: "A letter",
      number: "A number",
    },
  },
  verify: {
    send: "Verify",
    sentTo: "Code sent to {to}",
    code: "6-digit code",
    resend: "Resend",
    resendIn: "Resend in {s}s",
    change: "Change",
    verified: "Verified",
    checking: "Checking…",
  },
  signIn: {
    title: (
      <>
        Welcome <em>back</em>
      </>
    ),
    email: "Work email",
    password: "Password",
    passwordPlaceholder: "Your password",
    forgot: "Forgot password?",
    submit: "Continue",
    codeTitle: (
      <>
        Check your <em>email</em>
      </>
    ),
    codeSent: "Enter the code sent to {to}",
    expiresIn: "Expires in {t}",
    expired: "This code has expired.",
    resend: "Send a new code",
    other: "Use another account",
  },
  forgot: {
    title: (
      <>
        Reset your <em>password</em>
      </>
    ),
    lede: "We’ll email you a link to set a new one.",
    submit: "Send link",
    sentTitle: (
      <>
        Check your <em>inbox</em>
      </>
    ),
    sent: "If {to} has an account, the link is on its way.",
    back: "Back to sign in",
  },
  aside: {
    k: "Italy visa · partners",
    title: (
      <>
        Your clients, <em>verified first.</em>
      </>
    ),
    now: "Now",
    steps: [
      { t: "Account", m: "2 min" },
      { t: "Agency", m: "Your desk" },
      { t: "Documents", m: "PAN, bank" },
      { t: "Agreement", m: "Sign" },
      { t: "Go live", m: "Agent code" },
    ],
    ready: "Keep ready",
    readyItems: ["PAN", "Address proof", "Bank proof", "GST, if you have one"],
  },
  home: {
    loading: "Opening your account…",
    hello: "Hi {name}",
    signOut: "Sign out",
    progress: "Onboarding",
    step: "Step {n} of {total}",
  },
  agency: {
    title: (
      <>
        Your <em>agency</em>
      </>
    ),
    lede: "How you file Italy national visas.",
    name: "Agency name",
    namePlaceholder: "Sunrise Travels",
    city: "City",
    cityPlaceholder: "New Delhi",
    volume: "Italy national visa clients a month",
    volumes: [
      { id: "under10", t: "Under 10" },
      { id: "10-25", t: "10–25" },
      { id: "26-75", t: "26–75" },
      { id: "76+", t: "76+" },
    ],
    settle: "How the fee is paid",
    settles: [
      { id: "client", t: "The client pays HelloVerify" },
      { id: "wallet", t: "Prepaid wallet" },
    ],
    save: "Save",
    saved: "Saved",
  },
  nav: {
    back: "Back",
    next: "Continue",
  },
  docs: {
    title: (
      <>
        Your <em>documents</em>
      </>
    ),
    lede: "A clear photo or scan.",
    pan: "PAN",
    address: "Address proof",
    bank: "Bank proof",
    gst: "GST certificate",
    optional: "Optional",
    hints: {
      pan: "The agency’s PAN",
      address: "Utility bill or rent agreement",
      bank: "Cancelled cheque or statement",
      gst: "Only if the agency is registered",
    },
    rule: "PDF, JPG or PNG · up to {mb} MB",
    choose: "Upload",
    replace: "Replace",
    remove: "Remove {name}",
    cancel: "Cancel",
    uploading: "Uploading · {p}%",
    drop: "Drop to upload",
    hold: "With us. Up to 2 working days.",
    tooLarge: "Larger than {mb} MB.",
    badType: "Use a PDF, JPG or PNG.",
    missing: "Upload this document.",
  },
  agree: {
    title: (
      <>
        The <em>agreement</em>
      </>
    ),
    lede: "Sign and stamp it, then upload the scan.",
    download: "Download",
    upload: "Signed agreement",
    hint: "Authorised signatory, with your stamp",
    missing: "Upload the signed agreement.",
    received: "Received.",
    pending: "With us. Up to 2 working days.",
    letter: {
      k: "Partner agreement",
      parties: "{agency}, {city}",
      with: "and HelloVerify India Private Limited",
      lines: [
        "Document verification for Italian national visa applicants in the India North jurisdiction.",
        "You guide the client. We do the checks and issue the reference.",
        "The fee is what you chose: the client pays HelloVerify, or a prepaid wallet.",
        "Commission is paid on each completed file, at your agency's rate.",
        "We do not submit the visa or decide the outcome.",
      ],
      sign: "Authorised signatory",
      stamp: "Agency stamp",
    },
  },
  live: {
    title: (
      <>
        Go <em>live</em>
      </>
    ),
    lede: "Use this on every Italy file.",
    who: "{agency}, {city}",
    code: "Agent code",
    copy: "Copy",
    copied: "Copied",
  },
  errors: {
    required: "Required.",
    name: "Use letters.",
    email: "Enter a valid email.",
    phone: "Enter a valid mobile number.",
    password: "Meet all three rules.",
    consent: "Tick to continue.",
    nameFirst: "Add your first and last name first.",
    verifyEmail: "Verify your email to continue.",
    verifyPhone: "Verify your mobile to continue.",
    codeLength: "Enter all 6 digits.",
    place: "Use letters.",
    invalid_input: "Check the highlighted field.",
    invalid_code: "That code isn’t right.",
    code_expired: "That code has expired. Send a new one.",
    unverified: "Verify this again.",
    duplicate: "This email already has an account.",
    duplicateAction: "Sign in instead",
    rate_limited: "Too many tries. Try again in {s}s.",
    wrong_credentials: "Email or password is incorrect.",
    no_session: "Your session ended. Sign in again.",
    not_connected: "This isn’t available yet. Try again later.",
    upstream: "Something went wrong. Try again.",
  },
};
