/** `FAQPage`, derived from the array the page already renders (BUILD-SPEC §8.2,
 *  §11a.3).
 *
 *  §11a.3 rates this the highest-value node in the whole graph — "directly maps
 *  question → answer; highest-value extraction format" — and Google's policy
 *  for it is unusually strict: the marked-up question and answer must both be
 *  visible on the page, in the same words. A second hand-maintained copy per
 *  page would pass the validator on the day it was written and silently
 *  diverge at the first copy edit.
 *
 *  So the FAQ text has exactly one home: a `Faq[]` in the page module, rendered
 *  by `components/chrome/FaqSection.tsx`, which also emits this node. Before
 *  this item nine pages hardcoded 39 `<details>` elements directly in JSX and
 *  six passed a `faqs` array into `VerticalPage`; both now go through the same
 *  component, so the markup and the visible text are the same strings.
 *
 *  `tools/seo/check-schema.mjs` does not take that on trust — it pulls every
 *  `<summary>` and `<p class="a">` out of the emitted HTML and asserts each
 *  `Question`/`acceptedAnswer` pair appears there verbatim.
 *
 *  NOT `QAPage`, which is the sibling type for a single user-submitted question
 *  with competing answers. §8.2 names it as one of the two January 2026 Google
 *  deprecations not to implement; `check-schema.mjs` fails the build if it ever
 *  appears.
 */
import type { FAQPage, Question, WithContext } from "schema-dts";

/** One question and its answer, as plain strings.
 *
 *  Defined here rather than in `VerticalPage`, where it used to live, because
 *  it is now the contract between three things — the page module that states
 *  the copy, `FaqSection` that renders it, and this builder — and none of them
 *  should have to import a page template to describe it.
 *
 *  `a` is `string`, not `ReactNode`, and that is load-bearing: an answer
 *  containing markup could not be stated in JSON-LD without the two versions
 *  differing, so the type makes the rule Google enforces unrepresentable to
 *  break. All 15 existing answers are plain prose, so nothing had to be
 *  rewritten to satisfy it.
 */
export type Faq = { readonly q: string; readonly a: string };

export function faqPage(faqs: readonly Faq[]): WithContext<FAQPage> {
  const mainEntity: Question[] = faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}
