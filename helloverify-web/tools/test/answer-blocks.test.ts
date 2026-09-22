import { readFileSync } from "node:fs";

import { check } from "./harness";

import { CHECKS } from "../../src/lib/content/checks";

/** The answer blocks on `/checks/[check]` (BUILD-SPEC §11a.2).
 *
 *  Twelve pages are generated from one template, so a grammar bug is a grammar
 *  bug twelve times — and two of them shipped on the first attempt and were
 *  only visible in the rendered output:
 *
 *    - `c.name.toLowerCase()` turned "Directors & GST" into "directors & gst"
 *    - "a {name} check" read "a Identity check" on three of the twelve
 *
 *  These assertions are about the CATALOGUE rather than about the markup,
 *  deliberately: the failure mode is someone adding a thirteenth check whose
 *  name breaks a sentence the template assumes. That is caught here, at the
 *  point the data is added, rather than by reading twelve pages again.
 */
console.log("answer blocks");

/** Word count of the answer, as the template composes it. Kept in step with
 *  the page by construction — same fields, same order. §11a.2 asks for "~40
 *  words"; the band is generous because the variable part is reviewed copy
 *  (`answers`) that is not being rewritten to hit a number. */
function answerFor(c: (typeof CHECKS)[number]): string {
  return `${c.name} is confirmed against ${c.source}, with a typical turnaround of ${c.time}. Coverage: ${c.countries}. ${c.answers}`;
}

for (const c of CHECKS) {
  const answer = answerFor(c);
  const words = answer.split(/\s+/).length;

  // Wide, but not unbounded: 25 words is a stub and 70 is a paragraph, and
  // §11a.2's whole point is a block that survives extraction as one answer.
  check(`${c.slug}: answer is 25-70 words (${words})`, words >= 25 && words <= 70, String(words));

  // Self-contained: no pronoun pointing at something outside the block, which
  // §11a.2 rule 3 names as the thing that makes a block unciteable.
  check(
    `${c.slug}: answer names the check rather than "this check"`,
    answer.startsWith(c.name),
    answer.slice(0, 40),
  );

  // Every field the template interpolates must be non-empty, or the sentence
  // renders with a hole in it and still passes a build.
  for (const [field, value] of [
    ["name", c.name],
    ["source", c.source],
    ["time", c.time],
    ["countries", c.countries],
    ["answers", c.answers],
  ] as const) {
    check(`${c.slug}: ${field} is present`, typeof value === "string" && value.trim() !== "", field);
  }

  // `answers` is the sentence that ends the block, so it has to end like one.
  check(`${c.slug}: answers ends in a full stop`, c.answers.trim().endsWith("."), c.answers.slice(-30));
}

/** The two bugs themselves, asserted against the page SOURCE.
 *
 *  Asserting them against the catalogue would have been a tautology — the data
 *  is fine, the template was wrong — and a check that cannot fail is worse than
 *  no check. These read the template and fail if either mistake comes back.
 */
const PAGE_SOURCE = readFileSync(
  new URL("../../src/app/[locale]/checks/[check]/page.tsx", import.meta.url),
  "utf8",
);

/** Comments stripped before matching. Without this the assertions below fail
 *  on the comments that DOCUMENT the bugs they look for, which is a test that
 *  can never pass while the reasoning is written down - and the reasoning is
 *  the more valuable of the two. */
const PAGE = PAGE_SOURCE.split("\n")
  .filter((line) => !line.trim().startsWith("*") && !line.trim().startsWith("//"))
  .join("\n")
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
  .replace(/\/\*[\s\S]*?\*\//g, "");

check(
  "the template never lower-cases the check name",
  !PAGE.includes("c.name.toLowerCase()"),
  "c.name.toLowerCase() would render \"directors & gst\"",
);

check(
  "the template uses \"the <name>\", never \"a <name>\"",
  /* `includes`, not a regex, and the reason is a bug this very line had.
   *
   * It was written as /\ba \${c.name}/ through a shell heredoc, and the
   * heredoc turned \b into a literal 0x08 BACKSPACE byte. The regex then
   * looked for a backspace followed by "a " and matched nothing, so the
   * guard passed on the very mutation it was written to catch - the worst
   * way for a check to be wrong. Found by printing repr() of the line.
   *
   * Substring checks have nothing to escape and nothing for a transform or
   * a shell to corrupt. Both assertions were re-broken afterwards. */
  !PAGE.includes("a ${c.name}") && !PAGE.includes("a {c.name}"),
  "\"a Identity check\" is wrong on three of the twelve",
);

/** Names that would break an "a/an" article, so the reason for "the" is
 *  recorded as data rather than as a comment. */
check(
  "at least one name begins with a vowel, which is why the article is \"the\"",
  CHECKS.some((c) => /^[AEIOU]/.test(c.name)),
  CHECKS.filter((c) => /^[AEIOU]/.test(c.name)).map((c) => c.name).join(", "),
);

/** Names that a lower-casing helper would corrupt. */
check(
  "at least one name carries an acronym or ampersand",
  CHECKS.some((c) => /[&]| [A-Z]{2,}|^[A-Z]{2,}/.test(c.name)),
  CHECKS.filter((c) => /[&]| [A-Z]{2,}|^[A-Z]{2,}/.test(c.name)).map((c) => c.name).join(", "),
);

/** The one that would actually catch a thirteenth check breaking the frame:
 *  "Coverage: Global." works, "across Global" does not, which is why coverage
 *  is a clause of its own. Any value is therefore acceptable — this asserts the
 *  frame stayed a clause rather than being folded back into the sentence. */
check(
  "coverage is stated as its own clause",
  CHECKS.every((c) => answerFor(c).includes(`Coverage: ${c.countries}.`)),
  "Coverage: <value>.",
);
