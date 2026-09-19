export type Step = { n: string; t: string; p: string };

/** The numbered process strip — "01 · Upload", "02 · Read", and so on.
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
 */
export function Steps({ items }: { items: readonly Step[] }) {
  return (
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
  );
}
