/** Hindi copy for the `app/[locale]` root segment. One leaf: the skip link.
 *
 *  Annotated `: RootCopy` — recipe step 1b in `./index`. Not in the registry
 *  yet: `routing.locales` is still `["en"]`. Adding it here without adding
 *  `"hi"` there is a type error the other way (excess property). The switch
 *  is Part 9b.7, all namespaces at once.
 */
import type { RootCopy } from "./root";

export const hi: RootCopy = {
  skipToContent: "मुख्य सामग्री पर जाएँ",
};
