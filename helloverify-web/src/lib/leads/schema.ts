/** The lead submission contract (BUILD-SPEC §10 defence layer 1).
 *
 *  `import "server-only"` is not decoration here. Client-side validation on
 *  this site is native HTML constraint validation, which costs nothing; zod
 *  exists solely to be the server's contract. Marking the module server-only
 *  makes that a build error rather than a code-review catch — the same
 *  structural argument §4 rule 3 makes for secrets, applied to the §9.1 script
 *  budget. If you need a field limit on the client, import `./constraints`.
 */
import "server-only";
import { z } from "zod";

import {
  ELAPSED_FIELD,
  HONEYPOT_FIELD,
  INTEREST_VALUES,
  LIMITS,
  MOBILE_PATTERN,
  SEGMENT_VALUES,
  type LeadField,
} from "./constraints";
import type { FieldErrors } from "./state";

/** C0 controls and DEL. A newline in a name or a company is either a paste
 *  accident or someone probing how the value gets serialised downstream;
 *  neither belongs in a CRM record. `message` is exempt — it is prose. */
const NO_CONTROL_CHARS = /^[^\u0000-\u001F\u007F]*$/;

const singleLine = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: `Keep this under ${max} characters.` })
    .regex(NO_CONTROL_CHARS, { error: "Remove the line breaks from this field." });

/** An empty input and an absent one mean the same thing to us. Collapsing
 *  both to `undefined` here means no downstream layer — least of all the CRM
 *  mapping — ever has to decide what `""` was supposed to signify. */
const optional = <T extends z.ZodType>(inner: T) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    inner.optional(),
  );

/** The business payload: exactly what may reach the CRM, and nothing else.
 *  The honeypot and timing signals are parsed separately (`parseSubmission`)
 *  so they cannot be mapped into a Zoho field by accident. */
export const leadSchema = z.object({
  segment: z.enum(SEGMENT_VALUES, {
    error: "Choose whether you are a business, a government body, or an individual.",
  }),

  name: singleLine(LIMITS.name.max).min(LIMITS.name.min, {
    error: "Enter your full name.",
  }),

  company: optional(singleLine(LIMITS.company.max)),

  /** Not restricted to corporate domains despite the "Business email" label —
   *  the Individual segment legitimately arrives on free mail, and the
   *  disposable-domain check (`./abuse`) is a different question from whether
   *  a domain is free. */
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(LIMITS.email.max, { error: "That address is too long to be valid." })
    .pipe(z.email({ error: "Enter an email address we can reply to." })),

  mobile: optional(
    z
      .string()
      .trim()
      .max(LIMITS.mobile.max, { error: "That does not look like a phone number." })
      .regex(new RegExp(`^(?:${MOBILE_PATTERN})$`), {
        error: "Use digits, spaces, and + ( ) - only.",
      }),
  ),

  interest: optional(
    z.enum(INTEREST_VALUES, { error: "Pick one of the listed services." }),
  ),

  message: optional(
    z.string().trim().max(LIMITS.message.max, {
      error: `Keep the message under ${LIMITS.message.max} characters.`,
    }),
  ),
});

/** A validated lead. This type — not `FormData`, not a loose record — is what
 *  every downstream layer takes. */
export type Lead = z.output<typeof leadSchema>;

/** Abuse signals, read structurally and never rejected here: whether a 400 ms
 *  fill time is *acceptable* is policy, and policy lives in `./abuse`. A
 *  malformed signal degrades to "no signal", because a human with a broken JS
 *  environment must still be able to submit the form.
 *
 *  On the timing check, honestly: `/contact` is statically prerendered, so a
 *  server-rendered timestamp would be frozen at build time and identical for
 *  every visitor — useless. The elapsed time is therefore measured and sent by
 *  the client, which means a bot can forge it. That is exactly what §10 claims
 *  for this layer ("free, catches naive spam") and no more. The upgrade, once
 *  `middleware.ts` exists for i18n (item 6), is a signed short-lived timestamp
 *  cookie set on the GET — middleware runs per request without making the
 *  route dynamic.
 */
export interface Signals {
  /** Present and non-empty means a bot filled a field no human can see. */
  honeypot?: string;
  /** Milliseconds the form was on screen before submit, per the client. */
  elapsedMs?: number;
}

const signalsSchema = z.object({
  honeypot: z.string().optional().catch(undefined),
  elapsedMs: optional(z.coerce.number().int().nonnegative()).catch(undefined),
});

export type ParsedSubmission =
  | { ok: true; lead: Lead; signals: Signals }
  | { ok: false; fieldErrors: FieldErrors };

/** Reads a posted `FormData` into a `Lead`, or into per-field messages the
 *  form can render beside the offending input. */
export function parseSubmission(form: FormData): ParsedSubmission {
  const raw: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === "string") raw[key] = value;
  }

  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error);
    const fieldErrors: FieldErrors = {};
    for (const [field, messages] of Object.entries(flat.fieldErrors)) {
      if (messages?.length) fieldErrors[field as LeadField] = messages[0];
    }
    return { ok: false, fieldErrors };
  }

  const signals = signalsSchema.parse({
    honeypot: raw[HONEYPOT_FIELD],
    elapsedMs: raw[ELAPSED_FIELD],
  });

  return { ok: true, lead: parsed.data, signals };
}
