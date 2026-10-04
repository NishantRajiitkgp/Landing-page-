/** The `forms` namespace registry — step 2 of the recipe in `./index`.
 *
 *  UI labels for `ContactForm`. The slugs and the English CRM labels stay in
 *  `lib/leads/constraints.ts`; Zoho still reads those. This dictionary is
 *  what the person sees.
 */
import type { Dictionary } from "@/lib/copy";

import { en } from "./forms.en";
import { hi } from "./forms.hi";
import { ar } from "./forms.ar";

export type FormsCopy = typeof en;
/** What `ContactForm` may take as a prop. `status` holds functions, and
 *  React will not serialise those across the server/client boundary. */
export type FormsUi = Omit<FormsCopy, "status">;

export const FORMS: Dictionary<FormsCopy> = { en, hi, ar };

export function formsUi(t: FormsCopy): FormsUi {
  const { status: _status, ...ui } = t;
  return ui;
}
