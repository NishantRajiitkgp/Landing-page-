/** Everything the lead form says to a person.
 *
 *  In one file, in plain functions, for two reasons. It is the copy most
 *  likely to need review by someone who does not read TypeScript, and it is
 *  the first thing item 6 has to hand to next-intl.
 *
 *  Tone follows DESIGN.md §2.1: failure states get ink and language, never
 *  red. So the words carry the whole signal, and every message that closes a
 *  door opens another one — a rejected submission always names a route that
 *  still works.
 */

export const leadMessages = {
  invalid: "Check the highlighted fields and send again.",

  success:
    "Thank you — your enquiry is with us. Someone who actually runs checks will reply, usually within one working day.",

  /** Deliberately non-specific. Telling an automated submitter which check
   *  caught it is free tuning advice. A human who trips this — an aggressive
   *  autofill extension can — still gets a working route. */
  suspicious: (fallbackEmail: string) =>
    `We could not accept that submission. Email ${fallbackEmail} and a person will pick it up from there.`,

  rateLimited: (retryAfterSeconds: number, fallbackEmail: string) => {
    const minutes = Math.ceil(retryAfterSeconds / 60);
    const wait = minutes <= 1 ? "a minute" : `${minutes} minutes`;
    return `That is several submissions from here already. Wait ${wait} and try again, or email ${fallbackEmail} if it is urgent.`;
  },

  disposableEmail:
    "That looks like a temporary email address. Use one you can receive a reply at — we will be sending you a real answer, not a drip campaign.",

  undeliverableEmail:
    "We cannot find a mail server for that domain, so a reply would bounce. Check the spelling of the address.",

  /** Never says "received" without qualification: the lead is recoverable from
   *  the server log, but a log is not a promise, and the user deserves to know
   *  the automatic path failed. */
  degraded: (fallbackEmail: string) =>
    `Your details reached us, but we could not file them automatically. We have kept a copy — to be certain this reaches a person, email ${fallbackEmail}.`,
} as const;
