/** `howTo()` — the guards, and the field mapping that could have gone the
 *  other way.
 *
 *  WHY THIS FILE EXISTS. `src/lib/seo/schema/howto.ts` shipped on 22 Sep 2026
 *  with three guards (no name, blank name, fewer than two steps) and one
 *  deliberate omission (`n` is never emitted). All four were argued at length
 *  in the module header and none was held by a test — and this repo has already
 *  shipped one guard that could never fail, where a `\b` written through a
 *  heredoc became a literal backspace byte and the test passed the exact
 *  mutation it existed to catch. An argument in a comment is not a guard.
 *
 *  `tools/seo/check-schema.mjs` does assert the emitted node matches the
 *  rendered cards, but it needs a build, so it cannot say what happens for a
 *  band with one step or no heading — those bands emit nothing, and "nothing"
 *  is indistinguishable from "not wired up" once the HTML exists. That
 *  distinction is exactly what a unit test can make and the gate cannot.
 */
import { howTo, type Step } from "../../src/lib/seo/schema/howto.ts";

import { check } from "./harness.ts";

const STEPS: readonly Step[] = [
  { n: "01 · Candidate's phone", t: "Upload", p: "The candidate photographs each document." },
  { n: "02 · Extract", t: "Read & verify", p: "Fields are read and checked against the source." },
  { n: "03 · Or async", t: "Report", p: "The report lands, with every source named." },
];

const NAME = "How does background verification work?";

console.log("1. the guards — a node that cannot be stated is not stated");

check("no name → null", howTo(undefined, STEPS) === null);
check("empty name → null", howTo("", STEPS) === null);
// `?.trim()` and not just a truthiness test: a heading of spaces is a heading
// that renders as nothing, and it would name the node with nothing.
check("whitespace-only name → null", howTo("   ", STEPS) === null);
check("tab/newline-only name → null", howTo("\t\n ", STEPS) === null);
check("one step → null (a step is not a sequence)", howTo(NAME, STEPS.slice(0, 1)) === null);
check("zero steps → null", howTo(NAME, []) === null);
check("two steps → emitted (two is the floor, not three)", howTo(NAME, STEPS.slice(0, 2)) !== null);

console.log("2. the field mapping — t is the name, p is the text");

const node = howTo(NAME, STEPS);
if (!node) throw new Error("fixture should emit a node; the guards above are wrong");

check("@context is schema.org", node["@context"] === "https://schema.org");
check("@type is HowTo", node["@type"] === "HowTo");
check("name is the band's heading, verbatim", node.name === NAME, node.name);

const steps = node.step as Array<{ "@type": string; name: string; text: string }>;

check("one HowToStep per card", steps.length === 3, steps.length);
check("every step is typed", steps.every((s) => s["@type"] === "HowToStep"));
check("step.name is `t`", steps[0].name === "Upload", steps[0].name);
check("step.text is `p`", steps[0].text === STEPS[0].p, steps[0].text);
check(
  "order is the array's order",
  steps.map((s) => s.name).join("|") === "Upload|Read & verify|Report",
  steps.map((s) => s.name),
);

console.log("3. `n` is not emitted, and that is the point");

// The omission is the decision most likely to be "fixed" by a later reader:
// folding `n` into `name` yields "01 · Candidate's phone Upload", a string that
// appears nowhere on the page, and `check-schema.mjs` would then fail on its own
// terms. This asserts the absence directly rather than trusting the comment.
const json = JSON.stringify(node);
check("no eyebrow text anywhere in the node", !json.includes("Candidate's phone"), json.slice(0, 120));
check("no counter digits-and-separator", !json.includes("01 ·") && !json.includes("02 ·"));
check(
  "no `position` — array order already states it",
  !steps.some((s) => "position" in s),
);
check("a step carries exactly @type, name, text", Object.keys(steps[0]).sort().join(",") === "@type,name,text", Object.keys(steps[0]));
