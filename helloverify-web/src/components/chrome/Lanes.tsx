/** The check cloud — lanes of named checks with their turnarounds, the
 *  `.lanes3` band every solution page opens its "What we verify" section with
 *  (BUILD-SPEC §4 rule 2, §17 condition 22).
 *
 *  MEASURED 22 SEP 2026, BY DIFFING THE COPIES RATHER THAN READING THEM. Four
 *  render sites. The two that already drive the band from records —
 *  `templates/VerticalPage.tsx` and `app/[locale]/business/enterprise/page.tsx`
 *  — are byte-identical for all fourteen lines inside the container; a scripted
 *  line diff of the two blocks returns exactly two differences, the
 *  container's `style` and the name of the array being mapped. The other two,
 *  `/business/certifier` and `/business/customer-kyc`, write the same shape
 *  longhand: 22 and 23 lines of `<span className="pl3">` for 9 and 10 pills.
 *  This is that shape, lifted out the way `chrome/Steps.tsx` was lifted out of
 *  the same template for the twelve pages not built on it.
 *
 *  ONE CALLER TODAY, WHICH IS A SCOPE LIMIT AND NOT THE DESIGN. It was
 *  extracted under a change licensed to touch a single page file, so
 *  `VerticalPage` still holds its own copy and the two longhand pages still
 *  hold theirs. The props are therefore shaped for the copy that needs the
 *  most, not for the one caller, so adopting it at the other three is a
 *  deletion rather than a rewrite.
 *
 *  `cols` IS A PROP AND NOT DERIVED FROM `lanes.length`, unlike the column
 *  override in `chrome/Steps.tsx`, and that is a measurement rather than a
 *  preference. Steps found 12 of 12 hand-written strips obeyed `length !== 4`,
 *  so it could derive. The nine lane sites do not agree: 2 lanes →
 *  `repeat(2, …)` twice, 3 lanes → no style six times, and 3 lanes →
 *  `repeat(3, …)` once, `/individuals/home-family` via `laneCols={3}`. A
 *  `length !== 3` rule would be right eight times and would silently drop that
 *  page's inline `style` attribute — a changed byte of emitted HTML to save a
 *  prop — so the override stays stated.
 *
 *  THE TYPES LIVE WITH THE RENDERER, for the reason `lib/seo/schema/howto.ts`
 *  gives about `Step`: the module that emits the markup owns the record shape,
 *  and one module is the one place to import it from. `VerticalPage` declares
 *  `Pill` and `Lane` itself today; when it adopts this component those two
 *  lines become the re-export `Step` already is.
 */

/** One check in a lane: its name, its turnaround, and whether that turnaround
 *  is fast enough to earn the `.fast` dot. Optional rather than `boolean`
 *  because `pl3` and `pl3 fast` are the two classes the CSS defines, and a
 *  record written without the flag emits the first. */
export type Pill = { n: string; t: string; fast?: boolean };
export type Lane = { gt: string; gh: string; pills: Pill[] };

export function Lanes({ lanes, cols }: { lanes: readonly Lane[]; cols?: number }) {
  return (
    <div
      className="body3 lanes3"
      style={cols ? { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` } : undefined}
    >
      {lanes.map((l) => (
        <div key={l.gt}>
          <div className="lgt">{l.gt}</div>
          <div className="lgh">{l.gh}</div>
          <div className="cloud3">
            {l.pills.map((p) => (
              <span key={p.n} className={`pl3${p.fast ? " fast" : ""}`}>
                <span className="d" />
                {p.n}
                <span className="t">{p.t}</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
