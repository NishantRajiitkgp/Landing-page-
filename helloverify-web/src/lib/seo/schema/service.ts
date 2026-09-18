/** `Service`, and the `OfferCatalog`/`Offer` that hang off it where a page
 *  publishes packages (BUILD-SPEC §8.2, §11a.3).
 *
 *  §8.2 says "port from `StructuredData.tsx`" for both. The old site IS
 *  available (see `./organization.ts`), and its `Service` node was read — but
 *  almost nothing in it survives contact with this IA. It carried one global
 *  `Service` with a four-entry `OfferCatalog` ("Employment Verification",
 *  "Criminal Background Check", "Education Verification", "Healthcare
 *  Screening") covering the whole site; this site has twelve distinct vertical
 *  pages, each with its own audience and its own reviewed description. Porting
 *  the old node would have meant one generic Service competing with twelve
 *  specific ones.
 *
 *  So the facts come from the pages themselves, and each page states them next
 *  to the copy they describe rather than in a table here that would drift from
 *  it. The old `areaServed` — India, US, UK, UAE, Saudi Arabia, Singapore — is
 *  deliberately not ported either; see the note below.
 *
 *  WHERE IT GOES: the twelve commercial vertical pages, not the hubs. A hub
 *  (`/business`, `/governments`, `/individuals`, `/platform`) is a navigational
 *  page whose children are the services; giving it a `Service` node of its own
 *  puts it in competition with its own children for the same entity, which is
 *  the opposite of what an entity graph is for.
 *  `/governments/manpower-education/ministry-of-manpower` is excluded too — it
 *  is a customer story, not a service offering.
 *
 *  ON `areaServed`, which §11a.3 asks for by name ("lets an engine answer
 *  'does X operate in Y country' correctly") and which is the one field here
 *  that was genuinely hard to get right.
 *
 *  The tempting source is `lib/content/countries.ts`. It is the wrong one:
 *  it holds EIGHT entries, and `platform/coverage/page.tsx:169` says so out
 *  loud — "a further 90+ countries are covered through …". Emitting those
 *  eight as `areaServed` would let an engine answer "does HelloVerify operate
 *  in Germany" with a confident no, which is a worse outcome than the missing
 *  field, and precisely the mis-citation §11a.3 is trying to prevent.
 *
 *  The six office countries are equally wrong for the same reason — offices are
 *  where work is done, not where service is available.
 *
 *  So `areaServed` is the reviewed claim itself, as `Text`: "120+ countries".
 *  schema.org allows `Text` here alongside `Place`, an engine reading it gets
 *  the true answer and no false exclusion, and it is the same string the
 *  coverage page, the trust strips and `/about` already say. It stops
 *  understating the moment someone hands over a real coverage list; until then
 *  it is the most specific thing this repo actually knows.
 */
import type { OfferCatalog, Service, WithContext } from "schema-dts";

import { canonicalOf } from "@/lib/seo/canonical";
import { ORG_ID } from "@/lib/seo/schema/organization";

/** One package on a product page. Deliberately has no `price`.
 *
 *  Both pages that publish packages say on the page that the numbers are
 *  placeholders — `business/smb/page.tsx:2` ("Prices are placeholders pending
 *  commercial sign-off (IA §10.4) and say so on the page") and
 *  `individuals/hellov/page.tsx:2`. A visible "placeholder" caveat is a
 *  sentence a human reads; `"price": "349"` in JSON-LD is a machine-readable
 *  commercial claim that Google may surface in a rich result with no caveat
 *  attached, and that a retrieval engine will quote as fact.
 *
 *  So the catalogue states what is offered and not what it costs. Adding
 *  `price` and `priceCurrency` here after commercial sign-off is a two-line
 *  change; retracting a wrong price from an AI answer is not.
 */
export type OfferFacts = {
  readonly name: string;
  readonly description: string;
};

export type ServiceFacts = {
  /** Locale-relative, and the SAME literal the page passes to `pageMetadata`.
   *  Each page states it once as a module constant used by both, so this is
   *  not a second chance to name the wrong route — and `check-schema.mjs`
   *  asserts the emitted `@id` is this page's own canonical plus a fragment,
   *  which catches it in the build output if it ever becomes one. */
  readonly path: string;
  readonly name: string;
  readonly description: string;
  readonly serviceType: string;
  readonly offers?: readonly OfferFacts[];
};

export function serviceNode(locale: string, facts: ServiceFacts): WithContext<Service> {
  const url = canonicalOf(locale, facts.path);

  const catalog: OfferCatalog | undefined = facts.offers && {
    "@type": "OfferCatalog",
    name: `${facts.name} — packages`,
    itemListElement: facts.offers.map((o) => ({
      "@type": "Offer" as const,
      itemOffered: {
        "@type": "Service" as const,
        name: o.name,
        description: o.description,
        provider: { "@id": ORG_ID },
      },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: facts.name,
    description: facts.description,
    serviceType: facts.serviceType,
    url,
    /** By reference, never by restatement. Repeating the organisation's name
     *  and address inside every Service node is how the old graph's
     *  `PostalAddress ×2` (AUDIT.md:295) came to exist, and two copies of an
     *  entity are two chances to disagree with the external profiles §11a.3
     *  requires a match against. */
    provider: { "@id": ORG_ID },
    areaServed: "120+ countries",
    ...(catalog ? { hasOfferCatalog: catalog } : {}),
  };
}
