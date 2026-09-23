/** The `chrome` namespace registry — step 2 of the recipe in `./index`.
 *
 *  This module is deliberately tiny and deliberately NOT merged into
 *  `./chrome.en.tsx`. Two reasons, both structural:
 *
 *  1. It is the file every other locale gets added to, and it is the file that
 *     FAILS when one is declared without a dictionary. `Dictionary<T>` is
 *     `Readonly<Record<Locale, T>>`, so the object literal below is checked
 *     against the whole of `routing.locales`. Measured on a fixture, and
 *     re-measured in `tools/test/copy.test.ts`: adding `"hi"` to
 *     `routing.locales` makes this line TS2741, naming `hi` — one error, in
 *     one place, pointing at the file that has to change.
 *  2. Keeping it a `.ts` means the registry and the key unions are importable
 *     from a module that must not be compiled as JSX.
 *
 *  The key unions below exist so the COMPONENT's structure is gated too. The
 *  dictionary holds a label per destination; a component that adds a
 *  destination without one is TS2322 at its own `LINKS`/`COLS` declaration,
 *  in every locale at once, which is the point argued in `./index`'s
 *  "Where the keys come from" section. They are exported rather than inlined
 *  because both `SiteNav` and `SiteFooter` declare arrays against them.
 */
import type { Dictionary } from "@/lib/copy";

import { en } from "./chrome.en";

/** The English object IS the schema. Every other locale is checked against
 *  this, which is the whole type guarantee — see `./index`. */
export type ChromeCopy = typeof en;

export const CHROME: Dictionary<ChromeCopy> = { en };

/** A destination `SiteNav` may list. */
export type NavHref = keyof ChromeCopy["nav"]["links"];

/** A footer column, and a destination a footer column may list. Separate
 *  unions because the two tables are keyed differently on purpose: a column
 *  has an id (its heading is copy and must be free to change), a link has its
 *  href (routing, and the same string the component needs anyway). */
export type FooterColKey = keyof ChromeCopy["footer"]["cols"];
export type FooterHref = keyof ChromeCopy["footer"]["links"];

/** A mark in the footer's certification strip. */
export type FooterCertId = keyof ChromeCopy["footer"]["certs"];
