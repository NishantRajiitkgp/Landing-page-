/** `HowTo`, derived from the numbered strip the page already renders
 *  (BUILD-SPEC §8.2, §17 condition 18, §11a.2's answer-block pattern, §11a.3).
 *
 *  §11a.3 rates "how does background verification work" a top query shape, and
 *  after the Part 8 answer-block pass several process bands carry exactly that
 *  question as their `<h2>`. So the node is the second half of a pairing that
 *  already exists on the page rather than new copy: the question is the
 *  heading, the steps are the cards under it.
 *
 *  THE RULE IS FAQ'S RULE, FOR THE SAME REASON. `./faq.ts` exists because a
 *  hand-maintained second copy of the answers would pass a validator on the day
 *  it was written and diverge at the first edit; a `HowTo` restating the step
 *  cards in a page module would do exactly that, eighteen times over. So this
 *  takes the `Step[]` that `components/chrome/Steps.tsx` renders and the name
 *  that the band's own heading states, and `Steps` emits both from one call —
 *  one array, one render site. `tools/seo/check-schema.mjs` re-reads the
 *  rendered `.n`/`.t`/`.p` cards out of the emitted HTML and asserts each
 *  `HowToStep` matches the card beside it, so the claim is measured per page.
 *
 *  ON THE FIELD MAPPING, which is the one decision here that could have gone
 *  either way. A step record is `{ n, t, p }` — `n` "02 · Extract", `t`
 *  "Read & verify", `p` the sentence. `t` is the step `name` and `p` is its
 *  `text`:
 *
 *    - `t` is what the card states the step IS, in two or three words, and it
 *      is the line `.steps3 .t` renders at 30px — the reader's name for it.
 *    - `p` is the only full sentence in the card, and `text` is what a
 *      `HowToStep` has to hold it: the type inherits it from `CreativeWork`
 *      as "the textual content of this CreativeWork"
 *      (`node_modules/schema-dts/dist/schema.d.ts:2436`, `CreativeWorkBase`,
 *      which `HowToStepBase` extends along with `ListItemBase`).
 *    - `n` is DELIBERATELY UNUSED, and that is not an oversight. It carries
 *      two things: a counter, which `step`'s array order already states and
 *      which `HowToStep.position` would state a second time (a second
 *      statement of order is a second thing that can disagree — the argument
 *      `./service.ts` makes about restating the organisation), and a
 *      per-card ornament that is not the step's name: "01 · Candidate's
 *      phone", "02 · HelloVerify AI", "03 · Or async". Folding it into `name`
 *      would emit "01 · Candidate's phone Upload", which is a string that
 *      appears nowhere on the page and would fail the gate on its own terms.
 *
 *  A NAMELESS NODE IS WORSE THAN NO NODE, so this returns `null` rather than
 *  inventing one. `HowTo.name` is the goal the steps achieve; with a
 *  placeholder ("How it works", the band's eyebrow) an engine gets a set of
 *  instructions for an unstated task, which is a confident answer to a question
 *  nobody asked — the mis-citation failure mode §11a.3 exists to prevent. Two
 *  steps is the other floor: one step is not a sequence, so it is a paragraph
 *  that has been given a schema type. Both guards live here rather than in the
 *  component, the way `./breadcrumbs.ts` returns `null` for a trail it cannot
 *  express; callers render nothing.
 *
 *  ON WHAT THIS IS FOR, because it is easy to expect the wrong return.
 *  Google retired the HowTo **rich result** in 2023 (announced August 2023,
 *  desktop-only first, then withdrawn); nothing in this repo can measure that,
 *  so it is stated as the reason and not as a finding. The node earns its place
 *  under §11a.3 — a retrieval engine asked "how does background verification
 *  work" gets an ordered, typed sequence instead of having to infer one from
 *  prose — and NOT under §8.2's rich-result column. The rejected alternative
 *  was therefore not to emit it at all: refused because §17 condition 18 asks
 *  for the node by name, and because the whole cost here is one array being
 *  read twice rather than any new copy to maintain.
 *
 *  NOT every `Steps` strip gets one. Four of the eighteen are not sequences a
 *  person follows — mutually exclusive routes, a definition, four concurrent
 *  controls, a list of deliverables. `check-schema.mjs` names all four with
 *  their reason, so the decision is visible in a diff rather than inferred
 *  from whatever the build emitted.
 */
import type { HowTo, HowToStep, WithContext } from "schema-dts";

/** One card in a numbered process strip: the eyebrow/counter, the step's
 *  short name, and the sentence describing it.
 *
 *  Defined here rather than in `components/chrome/Steps.tsx`, where it used to
 *  live, for the reason `./json-ld.ts` gives: anything reachable from a `.tsx`
 *  file cannot be imported by a test on bare Node, and a builder in `lib/`
 *  importing a component would invert the dependency every other file in this
 *  directory keeps. `Steps` imports and re-exports it, so nothing else moved.
 *
 *  All three fields are `string`, and on `t` and `p` that is load-bearing in
 *  the same way `Faq.a` is: a step whose copy contained markup could not be
 *  stated in JSON-LD without the two versions differing, so the type makes the
 *  drift unrepresentable. All 63 existing step cards are plain prose.
 */
export type Step = { n: string; t: string; p: string };

/**
 * `howTo("How does background verification work?", steps)` → the `HowTo` for
 * that band, or `null` when there is no name to give it or fewer than two
 * steps to sequence.
 */
export function howTo(
  name: string | undefined,
  steps: readonly Step[],
): WithContext<HowTo> | null {
  if (!name?.trim() || steps.length < 2) return null;

  const step: HowToStep[] = steps.map((s) => ({
    "@type": "HowToStep",
    name: s.t,
    text: s.p,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    step,
  };
}
