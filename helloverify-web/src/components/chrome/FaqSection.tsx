/** The FAQ block, and the `FAQPage` node that describes it (BUILD-SPEC §8.2,
 *  §11a.2's answer-block pattern, §11a.3).
 *
 *  This component exists because of a Google policy, not to save typing: the
 *  question and answer in `FAQPage` markup must be visibly present on the page
 *  in the same words. Before this item the FAQ copy lived in two different
 *  shapes — nine pages hardcoded 39 `<details>` elements in JSX, six passed a
 *  `faqs` array into `VerticalPage` — and emitting JSON-LD for the hardcoded
 *  nine would have meant a second copy of every answer, drifting from the
 *  visible one at the first edit. Lifting all fifteen onto one array and one
 *  renderer makes them the same strings, which is the same argument
 *  `lib/seo/routes.ts` makes for the sitemap.
 *
 *  The markup below is the block those fifteen pages already had, unchanged —
 *  all nine hardcoded copies were byte-identical to `VerticalPage`'s, including
 *  `paddingBottom: 30` and `marginBottom: 44`, so there was one shape to lift
 *  rather than a reconciliation. Verified as byte-identical HTML rather than
 *  assumed: the emitted pages were diffed against the pre-refactor build with
 *  `<script type="application/ld+json">` stripped, and the only differences
 *  across all 56 were the intentionally added graph blocks.
 *
 *  `head` stays `ReactNode` because the reviewed headings contain line breaks
 *  the design depends on (`<>From trust &amp;<br />safety teams.</>`). The
 *  question and answer are `string` — see the note on `Faq` in
 *  `lib/seo/schema/faq.ts` for why that restriction is the point.
 */
import { JsonLd } from "@/components/seo/JsonLd";
import { faqPage, type Faq } from "@/lib/seo/schema/faq";

export function FaqSection({
  head,
  faqs,
}: {
  head: React.ReactNode;
  faqs: readonly Faq[];
}) {
  return (
    <>
      <div className="wrap sec3" style={{ paddingBottom: 30 }}>
        <div className="sec-head" style={{ marginBottom: 44 }}>
          <div>
            <div className="k">Questions</div>
            <h2 className="h2" style={{ marginTop: 12 }}>{head}</h2>
          </div>
        </div>
        <div className="faq3">
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}<span className="m">+</span></summary>
              <p className="a">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
      <JsonLd data={faqPage(faqs)} />
    </>
  );
}
