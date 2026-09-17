/** The shape the lead Server Action returns to the form.
 *
 *  Plain types only, no zod and no server imports, because the client form
 *  component imports this to type its `useActionState` hook. Keeping it here
 *  rather than in `./schema` is what lets `./schema` stay `server-only`.
 */
import type { LeadField } from "./constraints";

export type LeadFormStatus =
  /** Nothing submitted yet. */
  | "idle"
  /** Validated and delivered to the CRM. The only status that may say so. */
  | "success"
  /** Failed validation. `fieldErrors` is populated; render them inline. */
  | "invalid"
  /** An abuse layer declined it. `message` is intentionally non-specific for
   *  the bot-shaped rejections — telling a spammer which check caught them is
   *  free tuning advice. */
  | "rejected"
  /** Valid, accepted, and NOT delivered. The lead has been logged server-side
   *  for recovery; the user gets a real fallback route. Never conflate this
   *  with `success` — that is how leads disappear quietly. */
  | "degraded";

export type FieldErrors = Partial<Record<LeadField, string>>;

export interface LeadFormState {
  status: LeadFormStatus;
  /** One sentence addressed to the user. Never carries upstream error detail,
   *  which belongs in the server log, not on the page. */
  message?: string;
  fieldErrors?: FieldErrors;
  /** Set when a rate limit rejected the submission, so the form can say how
   *  long to wait rather than just refusing. */
  retryAfterSeconds?: number;
  /** Changes on every submission. The form keys its live region on this so a
   *  screen reader re-announces an outcome whose wording did not change. */
  token?: number;
  /** What the user typed, echoed back on every non-success outcome and fed to
   *  each input's `defaultValue`.
   *
   *  React resets an uncontrolled form once its action resolves, so without
   *  this a validation error would silently wipe a message someone spent five
   *  minutes writing. Echoing the user's own input back to them carries no
   *  disclosure risk — it never contains anything the server knows and they
   *  do not. */
  values?: Partial<Record<LeadField, string>>;
}

export const INITIAL_LEAD_FORM_STATE: LeadFormState = { status: "idle" };
