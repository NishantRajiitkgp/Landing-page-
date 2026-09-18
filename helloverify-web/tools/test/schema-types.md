# Where `schema-dts` actually catches a malformed graph

BUILD-SPEC §8.2 says the JSON-LD is "typed with `schema-dts` so a malformed
graph fails `tsc`", and its sketch types the component prop as
`WithContext<Thing>`. That combination does **not** hold: `Thing` is the union
of every schema.org type, and TypeScript's excess-property check only fires on a
*fresh object literal at its assignment site*. A node built as a variable and
then passed to `<JsonLd>` is not fresh, so nothing is checked there.

This is why the strictness lives in `src/lib/seo/schema/*.ts` — each builder
declares a concrete return type and returns a literal — and why
`components/seo/JsonLd.tsx` keeps the loose prop type deliberately.

Measured, not argued. Four cases in one throwaway file, `npx tsc --noEmit`,
schema-dts 2.0.0 / TypeScript 5:

```ts
// A. invented property on a FRESH object literal, concrete type
export const a: WithContext<Organization> = {
  "@context": "https://schema.org", "@type": "Organization",
  name: "HelloVerify", foundingYear: "2018",
};

// B. the same invented property, but the value is not fresh at the assignment
const loose = { "@context": "https://schema.org" as const,
  "@type": "Organization" as const, name: "HelloVerify", foundingYear: "2018" };
export const b: WithContext<Thing> = loose;

// C. wrong value TYPE on a real property, fresh literal
export const c: WithContext<Organization> = {
  "@context": "https://schema.org", "@type": "Organization", name: 42,
};

// D. a nested node with an invented property
export const d: WithContext<Organization> = {
  "@context": "https://schema.org", "@type": "Organization",
  address: { "@type": "PostalAddress", postcode: "201301" },
};
```

Output:

```
__probe.ts(8,3):   error TS2353: Object literal may only specify known properties,
                   and 'foundingYear' does not exist in type
                   'OrganizationLeaf & { "@context": "https://schema.org"; }'.
__probe.ts(21,14): error TS2322: Type '{ …; name: number; }' is not assignable
                   to type 'WithContext<Organization>'.
__probe.ts(31,40): error TS2322: Type '{ …; address: { "@type": "PostalAddress";
                   postcode: string; }; }' is not assignable to type
                   'WithContext<Organization>'.
```

| Case | Line | Caught |
|---|---|---|
| A — invented property, fresh literal, concrete type | 8 | **yes** |
| B — invented property, non-fresh value, `WithContext<Thing>` | 18 | **no** |
| C — wrong value type, fresh literal | 21 | **yes** |
| D — invented property on a nested node | 31 | **yes** |

B is the one that matters: it is the shape §8.2's sketch produces, and it type-checks
clean with a property schema.org has never had. So "typed with schema-dts" is
only true of code that writes its literals against a concrete type — which is
what every builder in `lib/seo/schema/` does, and what the `postcode` case (D)
shows extends through nested nodes too.

One incidental finding, from mutation M1 in the same round: `WithContext<Organization>`
is a **union**, so `{ ...ORGANIZATION, slogan: "…" }` fails with
*TS2698: Spread types may only be created from object types*. Worth knowing
before trying to derive one node from another — build a fresh literal instead.
