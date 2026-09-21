import { check } from "./harness";

import {
  AI_REFERRER_HOSTS,
  AI_SOURCES,
  classifyReferrer,
} from "../../src/lib/analytics/ai-referrers";

/** The AI-referral classifier (BUILD-SPEC §11a.5, TASKS.md Part 10).
 *
 *  This list is the thing a GA4 segment would otherwise be: a pattern in a
 *  console that no diff shows and no test covers. Here it is a function, so the
 *  cases below are the specification.
 */
console.log("ai referrers");

for (const [host, source] of AI_REFERRER_HOSTS) {
  check(`${host} -> ${source}`, classifyReferrer(`https://${host}/some/path`) === source, host);
  // A subdomain of a listed host is the same product. `www.` is the common
  // one, but regional and app subdomains exist too.
  check(
    `www.${host} -> ${source}`,
    classifyReferrer(`https://www.${host}/`) === source,
    `www.${host}`,
  );
}

/** The near-miss that a naive `includes()` would get wrong, which is why the
 *  match is on the exact host or a dot-prefixed suffix. */
for (const evil of [
  "https://notperplexity.ai/",
  "https://claude.ai.attacker.example/",
  "https://fakeclaude.ai/",
  "https://openai.com.evil.test/",
]) {
  check(`${evil} is not an AI referral`, classifyReferrer(evil) === null, evil);
}

/** Absent, empty and malformed referrers are the common case, not the edge
 *  case: a direct visit has none. None of them may throw. */
for (const nothing of [null, undefined, "", "not a url", "javascript:alert(1)", "/en/about"]) {
  check(
    `${JSON.stringify(nothing)} -> null`,
    classifyReferrer(nothing as string | null | undefined) === null,
    String(nothing),
  );
}

check(
  "our own pages are not an AI referral",
  classifyReferrer("https://www.helloverify.com/en/about") === null,
  "helloverify.com",
);

/** The four §11a.5 names must all resolve, because they are the ones the spec
 *  commits to reporting on. Checked by name rather than by count so adding a
 *  host cannot quietly drop one. */
for (const [host, expected] of [
  ["chat.openai.com", "chatgpt"],
  ["claude.ai", "claude"],
  ["perplexity.ai", "perplexity"],
  ["gemini.google.com", "gemini"],
] as const) {
  check(
    `§11a.5 names ${host}`,
    classifyReferrer(`https://${host}/`) === expected,
    `${host} -> ${expected}`,
  );
}

check(
  "AI_SOURCES is derived from the host list, with no duplicates",
  AI_SOURCES.length === new Set(AI_SOURCES).size && AI_SOURCES.length > 0,
  AI_SOURCES.join(","),
);
