/** Which AI assistant sent a visitor, from the `Referer`.
 *
 *  BUILD-SPEC §11a.5 and TASKS.md Part 10: "GA4 segments for AI referral
 *  sources — `chat.openai.com`, `perplexity.ai`, `claude.ai`,
 *  `gemini.google.com`." Those four are the spec's list; the rest below are the
 *  other hostnames the same four products actually send from, which matters
 *  because a segment built on `chat.openai.com` alone misses every visitor who
 *  arrived from `chatgpt.com`.
 *
 *  WHY THIS IS A MODULE AND NOT A REGEX IN THE GA4 UI. A segment defined in the
 *  console is invisible to this repo: it cannot be reviewed in a diff, it
 *  cannot be tested, and it silently stops matching when a product changes its
 *  hostname. Classifying here and sending the RESULT as one dimension means the
 *  GA4 side is `ai_source = claude` rather than a pattern nobody owns — and the
 *  same function serves the server-log analysis Part 10 also asks for.
 *
 *  Deliberately NOT `server-only`: it runs on the client for the analytics
 *  dimension and on the server for log classification, and there is no reason
 *  for two copies of one list.
 */

/** The source names that reach GA4. Stable strings — renaming one orphans
 *  every historical row, so they are short, lower-case and product-level
 *  rather than host-level. */
export type AiSource = "chatgpt" | "claude" | "perplexity" | "gemini" | "copilot";

/** Hostname suffixes, longest-match irrelevant because none nests inside
 *  another. Matched on the registrable suffix so `www.` and regional
 *  subdomains are covered without a wildcard.
 *
 *  The four §11a.5 names are marked; the others are the same products' current
 *  hosts. Anything not listed is not guessed at — an unknown referrer returns
 *  `null` and is simply not an AI referral, which is the honest default. */
export const AI_REFERRER_HOSTS: ReadonlyArray<readonly [string, AiSource]> = [
  ["chat.openai.com", "chatgpt"], // §11a.5
  ["chatgpt.com", "chatgpt"],
  ["openai.com", "chatgpt"],
  ["claude.ai", "claude"], // §11a.5
  ["anthropic.com", "claude"],
  ["perplexity.ai", "perplexity"], // §11a.5
  ["gemini.google.com", "gemini"], // §11a.5
  ["bard.google.com", "gemini"],
  ["copilot.microsoft.com", "copilot"],
  ["bing.com", "copilot"],
];

/** `null` for anything that is not one of them — including an empty referrer,
 *  a same-site referrer, and a malformed one. Never throws: this runs on a
 *  value the browser supplies and a bad `Referer` must not cost a page view.
 */
export function classifyReferrer(referrer: string | null | undefined): AiSource | null {
  if (!referrer) return null;

  let host: string;
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return null;
  }

  for (const [suffix, source] of AI_REFERRER_HOSTS) {
    // `endsWith` on a dot-prefixed suffix as well as the bare host, so
    // `www.perplexity.ai` matches and `notperplexity.ai` does not.
    if (host === suffix || host.endsWith(`.${suffix}`)) return source;
  }
  return null;
}

/** Every source name, for building a GA4 audience list or asserting coverage.
 *  Derived from `HOSTS` rather than restated, so the two cannot drift. */
export const AI_SOURCES: readonly AiSource[] = [...new Set(AI_REFERRER_HOSTS.map(([, s]) => s))];
