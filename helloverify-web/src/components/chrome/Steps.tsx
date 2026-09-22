/** The numbered process strip — "01 · Upload", "02 · Read", and so on — and
 *  the `HowTo` node that describes it.
 *
 *  41 step cards were written out by hand across 12 page files, five lines
 *  each, in the same shape `templates/VerticalPage.tsx` had already been
 *  driving from data for the six vertical pages (BUILD-SPEC §4 rule 2, §17
 *  condition 22). This is that component, lifted out so the pages that were not
 *  built on the template can use it too; `VerticalPage` now imports it rather
 *  than keeping a second copy.
 *
 *  THE COLUMN OVERRIDE IS A MEASURED RULE, NOT A GUESS. Every hand-written
 *  three-step block carried
 *  `style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}` and every
 *  four-step block carried no style at all — 12 of 12, which is exactly the
 *  `length !== 4` rule `VerticalPage` already encoded. So the override is
 *  derived from the count rather than passed, and the extraction is
 *  byte-identical instead of byte-identical-if-you-remember-the-prop.
 *
 *  `name` IS THE HOWTO, AND IT IS OPTIONAL BECAUSE FOUR OF THE EIGHTEEN
 *  STRIPS ARE NOT ONE (§17 condition 18, §11a.3). This is `FaqSection`'s
 *  shape: the same `items` array renders the cards and builds the node, from
 *  one render site, so the marked-up steps and the visible ones cannot drift.
 *  The heading is the only part the component cannot see — a strip is rendered
 *  inside a `sec-head` band it knows nothing about — so the band's own `<h2>`
 *  copy is passed in, and `lib/seo/schema/howto.ts` emits NOTHING without it
 *  rather than naming the node after the eyebrow. Omitting `name` is therefore
 *  a decision each call site states; `tools/seo/check-schema.mjs` holds the
 *  list of which pages made which, so an unstated one fails the build.
 */
import { JsonLd } from "@/components/seo/JsonLd";
import { howTo, type Step } from "@/lib/seo/schema/howto";

/** Re-exported: `templates/VerticalPage.tsx` and the six vertical pages built
 *  on it import `Step` from here, and the type moved to `lib/seo/schema` so
 *  that the builder is reachable from a bare-Node test (see `howto.ts`). */
export type { Step };

export function Steps({ items, name }: { items: readonly Step[]; name?: string }) {
  const node = howTo(name, items);

  return (
    <>
      <div
        className="body3 steps3"
        style={items.length !== 4 ? { gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` } : undefined}
      >
        {items.map((s) => (
          <div key={s.t}>
            <div className="n">{s.n}</div>
            <div className="t">{s.t}</div>
            <p className="p">{s.p}</p>
          </div>
        ))}
      </div>
      {node && <JsonLd data={node} />}
    </>
  );
}
