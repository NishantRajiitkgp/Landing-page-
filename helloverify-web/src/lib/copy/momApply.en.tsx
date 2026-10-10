/** MOM applicant flow: account pages and the application. `{x}` tokens are
 *  filled in the browser by `components/momapply/fill`. */

export const en = {
  meta: {
    register: "Create your account",
    signIn: "Sign in",
    apply: "Your application",
  },
  crumbs: {
    register: "Create account",
    signIn: "Sign in",
    apply: "Application",
  },
  tabs: {
    aria: "Account",
    register: "Create account",
    signIn: "Sign in",
  },
  demo: {
    code: "Demo · code {code}",
    account: "Demo account · {email} · {password}",
  },
  register: {
    title: (
      <>
        Start your <em>verification</em>
      </>
    ),
    first: "First name",
    last: "Last name",
    namePlaceholder: "As on passport",
    email: "Email",
    emailPlaceholder: "you@example.com",
    phone: "Mobile",
    phonePlaceholder: "Mobile number",
    dial: "Country code",
    password: "Password",
    passwordPlaceholder: "Create a password",
    consent: "I agree to the {terms} and {privacy}.",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    submit: "Create account",
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
    email: "Email",
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
    email: "Email",
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
    k: "Your application",
    title: (
      <>
        One sitting, <em>start to submit.</em>
      </>
    ),
    now: "Now",
    steps: [
      { t: "Account", m: "2 min" },
      { t: "About you", m: "Passport" },
      { t: "Qualifications", m: "Certificates" },
      { t: "Checks", m: "Auto-matched" },
      { t: "Review & sign", m: "E-sign" },
      { t: "Pay", m: "SGD" },
    ],
    from: "From",
    unit: "per qualification + 9% GST",
    ready: "Keep ready",
    readyItems: ["Passport", "Degree certificate", "Transcripts"],
  },
  apply: {
    loading: "Opening your application…",
    hello: "Hi {name}",
    signOut: "Sign out",
    progress: "Application progress",
    step: "Step {n} of {total}",
  },
  errors: {
    required: "Required.",
    name: "Use letters as on your passport.",
    email: "Enter a valid email.",
    phone: "Enter a valid mobile number.",
    password: "Meet all three rules.",
    consent: "Tick to continue.",
    nameFirst: "Add your first and last name first.",
    verifyEmail: "Verify your email to continue.",
    verifyPhone: "Verify your mobile to continue.",
    codeLength: "Enter all 6 digits.",
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
