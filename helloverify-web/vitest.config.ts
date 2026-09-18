/** Vitest, as BUILD-SPEC §3.7 and §14.1 pick.
 *
 *  Until item 9 the lead-pipeline suite ran on bare Node through a hand-written
 *  resolve hook (`tools/test/register.mjs`), because no runner was wired up and
 *  the tests were worth keeping anyway. Its own README said so: "No test runner
 *  yet — BUILD-SPEC §3.7 picks Vitest, and wiring it up belongs to item 8."
 *  This is that.
 *
 *  TWO SETTINGS ARE LOAD-BEARING, and both replace something the old loader did
 *  by hand:
 *
 *  1. `resolve.conditions: ["react-server"]` resolves the `server-only` package
 *     to its no-op build. Without it every module under `lib/leads` throws on
 *     import — which is exactly what that package is for, and exactly why the
 *     bare-Node command line needed `--conditions=react-server`.
 *  2. `resolve.alias` for `@/` replaces the custom resolve hook. Vitest goes
 *     through Vite, which does bundler resolution, so extensionless imports
 *     need no help — only the path alias does.
 *
 *  `tools/test` is still excluded from `tsconfig.json` (see README's known
 *  gaps): the files were written as standalone scripts and `tsc` sees them as
 *  non-modules colliding in global scope. Vitest type-checks nothing by
 *  default, so that exclusion is now harmless rather than a gap — `npm run
 *  typecheck` covers the app, and `npm test` covers behaviour.
 */
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const alias = { "@": fileURLToPath(new URL("./src", import.meta.url)) };

export default defineConfig({
  resolve: { conditions: ["react-server"], alias },
  /** Vitest runs test files through Vite's SSR pipeline, and `resolve.conditions`
   *  configures the CLIENT resolver only. Without this second declaration the
   *  `server-only` package resolves to its throwing build and every module under
   *  `lib/leads` fails on import — measured: 3 of 4 suites failed with "This
   *  module cannot be imported from a Client Component module". */
  ssr: { resolve: { conditions: ["react-server"] } },
  test: {
    include: ["tools/test/**/*.test.ts"],
    /** `dns.test.ts` reaches the network to check MX records for a handful of
     *  real domains. It is a genuine test of `lib/leads/dns.ts` and it is also
     *  the one file that can fail because an airport wifi captive portal ate a
     *  UDP packet, so it is opt-in: `npm run test:net`. */
    exclude: ["tools/test/dns.test.ts", "node_modules/**"],
    reporters: ["default"],
  },
});
