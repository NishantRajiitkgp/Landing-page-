/** One `<script type="application/ld+json">`, rendered inside the component
 *  tree (BUILD-SPEC §8.2).
 *
 *  §8.2 is explicit that JSON-LD renders in the page or layout component and
 *  NOT in `generateMetadata`. That is not a style preference: Next's `Metadata`
 *  type has no field that emits a script tag, and `other: { … }` only produces
 *  `<meta>`. The graph has to be part of the rendered tree, which also means it
 *  is server-rendered into the static HTML — the same property that makes the
 *  canonical tag trustworthy where the old site's client-side
 *  `PageMetaManager.tsx` was not (AUDIT C2).
 *
 *  ON THE TYPE OF `data`, which is where §8.2's "typed with schema-dts so a
 *  malformed graph fails tsc" is easy to believe and wrong.
 *
 *  `WithContext<Thing>` here is deliberately the LOOSE bound, and it is not
 *  what provides the safety. `Thing` in schema-dts is the union of every
 *  schema.org type, so this signature accepts any of them — which is correct
 *  for a component that has to render all seven node kinds §8.2 lists.
 *
 *  The strictness lives at the other end, in `lib/seo/schema/*.ts`, where each
 *  builder declares a CONCRETE return type (`WithContext<Organization>`,
 *  `BreadcrumbList`, …) and returns an object literal. TypeScript's
 *  excess-property check fires on a fresh object literal at its assignment
 *  site and nowhere else, so an invented property is caught where the literal
 *  is written — never here, where `data` arrives as an already-typed variable.
 *
 *  Measured, not assumed. Four cases, `npx tsc --noEmit`, transcripts in
 *  `tools/test/schema-types.md`: `foundingYear: "2018"` on a builder's fresh
 *  literal typed `WithContext<Organization>` is a tsc error, and so are a
 *  wrong value type and an invented property on a NESTED node — but the same
 *  invented property on a non-fresh value assigned to `WithContext<Thing>`
 *  type-checks clean. That last case is the shape §8.2's own sketch produces,
 *  and it is why the safety cannot live on this prop.
 */
import type { Thing, WithContext } from "schema-dts";

import { serialiseJsonLd } from "@/lib/seo/schema/json-ld";

export function JsonLd({ data }: { data: WithContext<Thing> }) {
  return (
    <script
      type="application/ld+json"
      /** `dangerouslySetInnerHTML` because React escapes `<` to `&lt;` in a
       *  text child, and an HTML entity inside a raw text element is not
       *  decoded — the JSON would reach the parser containing the literal
       *  seven characters `&lt;`, and fail to parse. The escaping this needs
       *  instead is JSON's own `<`, applied in `serialiseJsonLd`. */
      dangerouslySetInnerHTML={{ __html: serialiseJsonLd(data) }}
    />
  );
}
