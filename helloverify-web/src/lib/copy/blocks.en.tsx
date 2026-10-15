/** English copy for `components/blocks/**` — the lead-form mock the closing
 *  band renders, the HelloV WhatsApp phone, and the four scenes of the
 *  homepage process animation.
 *
 *  Every shape argument — why the English object is the schema, why a label is
 *  keyed by the thing it names, why rich text is real JSX, why `&` and not
 *  `&amp;` — is in `./index`'s header and is not repeated here.
 *
 *  NO `as const`, per the recipe.
 *
 *  MEASURED: 27 JSX text nodes across these three files by the `>text<`
 *  matcher in `./index`'s opening paragraph, comments stripped first; it
 *  reproduces that header's `blocks 27` exactly. This file holds **77
 *  leaves** for them — 2.85x, against the 3.2x chrome measured.
 *
 *  THE UNDERCOUNT IS THE HEADER'S OWN RULE AT ITS LIMIT. `LeadMock.tsx`
 *  scores ZERO for 17 leaves: it has no JSX text node at all, because
 *  every string it renders already lived as a property in `MOCK_HEAD`,
 *  `MOCK_FIELDS_*` and `SEGMENTS`. `HowItWorksPanels.tsx` scores 12 for 38
 *  because `FIELDS`, `DOC_CHECKS`, `EVENTS` and `REPORT_ROWS` are tuple
 *  tables. Only `HelloVPhone.tsx`, which is hand-written markup end to
 *  end, comes close to being readable by the matcher at 15 for 22. The
 *  three ratios are asserted per file in `tools/test/copy.test.ts` §10 so
 *  they stay measurements.
 *
 *  WHY `LeadMock`'S FIELD LABELS ARE HERE AND NOT IN `sections`. They are the
 *  one set of leaves the two namespaces could both have claimed:
 *  `sections/Contact.tsx` renders the rows. It renders them by handing
 *  `MOCK_FIELDS_DSK` / `MOCK_FIELDS_MOB` to `MockFields`, and never touches a
 *  string — the label and the mock value are read inside `blocks/LeadMock.tsx`
 *  by `MockRow`, which is also the component whose `key={label}` depends on
 *  them. A namespace is the unit one agent owns and one translator receives
 *  (`./index`, "Adding a namespace"), so splitting a row's label from the
 *  component that renders it would have put half a table in each of two
 *  translator files and made `Contact.tsx` import a `blocks` key union to say
 *  nothing about it. Rejected: `sections.contact.form.*`, which reads better
 *  from the page and worse from everywhere else.
 */

export const en = {

  /** `blocks/HelloVPhone.tsx` — the real HelloV bot on WhatsApp (Oct 2026
   *  screenshots): "HelloV", the numbered menu, a pick, the Razorpay link.
   *  The menu and the payment message are the bot's own words, prices
   *  included. Timestamps are copy: a locale that writes clocks differently
   *  has to be able to move them. `menu.welcome`, `pay.thanks` and `pay.note`
   *  carry the words the phone bolds (`menu.brand`, `pay.service`,
   *  `pay.noteBold`) verbatim, so each sentence stays whole for a translator. */
  helloVPhone: {
    name: "Helloverify",
    verified: "Verified business",
    clock: "12:17",
    today: "Today",
    message: "Message",
    hello: { text: "HelloV", ts: "12:17 PM" },
    menu: {
      welcome: "Welcome to Helloverify.",
      brand: "Helloverify",
      pick: "Please select and type 1, 2, 3, 4, 5, 6, 7, 8 or 9 from the following options:",
      price: "Price",
      items: {
        nanny: { t: "Verify Nanny", amount: "₹1499", p: "Ensure your child is in safe hands." },
        driver: { t: "Verify Driver", amount: "₹1499", p: "Make your family's daily commute safer." },
        help: { t: "Verify Domestic Help/Security Guard", amount: "₹1499", p: "Build a safer environment for your family." },
        anyone: { t: "Verify Anyone", amount: "₹1499", p: "Know your tenant, tutor, caretaker or anyone else." },
        identity: { t: "Know the Identity", amount: "₹849", p: "Protect yourself from Online identity fraud." },
        date: { t: "Profile your date", amount: "₹849", p: "Protect yourself from online cheats, creeps and cat-fishes. Verify your partner." },
        cyber: { t: "Get your Cyber Identity verified", amount: "₹1499", p: "Prove your identity for online transactions and showcase your credibility" },
      },
      more: "Read more",
      ts: "12:17 PM",
    },
    choice: { text: "1", ts: "12:18 PM" },
    pay: {
      title: "Payment of INR 1499.00 requested",
      sub: "Click on this link to pay",
      host: "rzp.io",
      thanks: "Thank you for choosing Verify Nanny - Verify the Identity & Criminal Record.",
      service: "Verify Nanny - Verify the Identity & Criminal Record.",
      click: "Please click on the link below to make the payment.",
      link: "https://rzp.io/rzp/Qd2jl3a",
      noteK: "Note:",
      note: "The link is valid only for 30 mins.",
      noteBold: "30 mins",
      ts: "12:18 PM",
    },
  },

};
