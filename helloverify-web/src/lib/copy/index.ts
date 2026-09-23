/** THE COPY LAYER (BUILD-SPEC §7, §3.4, §9.1). Read this before migrating a
 *  second area — it is the pattern document, and it is here because a header
 *  comment in the entry module is where this repo puts one.
 *
 *  ## What was true before this file, measured
 *
 *  `messages/en.json` held ONE leaf key, `common.skipToContent`, and nothing
 *  read it: `grep -rln "useTranslations\|getTranslations" src` returned zero
 *  files, and `app/[locale]/layout.tsx` hardcodes "Skip to main content",
 *  which is not even the same string. Copy was literal JSX — 763 text nodes by
 *  a `>text<` matcher, a lower bound that misses every `aria-label` and `alt`.
 *  So §7's "a missing translation key is a type error", which
 *  `lib/i18n/routing.ts` cites as the reason `hi` and `ar` cannot be declared,
 *  was FALSE. This layer makes it true.
 *
 *  `components/chrome/**` is migrated: 26 text nodes across 7 of its 15 files,
 *  re-counted 23 Sep 2026 with the same matcher run over comment-stripped
 *  source (`scratchpad/count2.py`; without the strip it scores 47 in that
 *  directory and 20 of those are prose in the file headers). The header
 *  originally said 24, measured before `chrome/CheckTable.tsx` was extracted
 *  and carried its three column headings in. The same run puts the whole tree
 *  at 1098 rather than 763 — the two matchers are not identical and the
 *  older number is not reproducible, so the honest statement is the
 *  PROPORTION: chrome is 2.4% of the site's text nodes, and the areas left
 *  are `app/[locale]/**` 872, `components/sections/**` 152,
 *  `components/blocks/**` 27, `components/forms/**` 10,
 *  `components/templates/**` 10.
 *
 *  AND THE MATCHER IS A WORSE LOWER BOUND THAN IT SOUNDS. `chrome.en.tsx`
 *  holds **77 leaves** for those 26 nodes — a 3.2x undercount, asserted in
 *  `tools/test/copy.test.ts` §7 so the ratio is a measurement and not a
 *  memory. Itemised, the 53 the matcher cannot see are: 10 `aria-label`s,
 *  5 `alt`s, 2 `ClosingCta` prop defaults that were parameter defaults rather
 *  than JSX, 35 labels already living as string properties inside `SiteNav`'s
 *  `LINKS` and `SiteFooter`'s `COLS`/`CERTS` arrays, and `consent.body` —
 *  a real text node the matcher drops only because that node also contains a
 *  `{" "}`. (26 matched nodes collapse to 24 leaves: `closingCta.heading` is
 *  one leaf holding three of them.)
 *
 *  The 35 are the lesson: the more a component is ALREADY data-driven, the
 *  more of its copy a `>text<` count misses, and the estimate for an area
 *  should be scaled by how much of it is already tables. Multiply by ~3.
 *
 *  ## The shape: typed per-locale modules, not JSON catalogues
 *
 *  A dictionary is a plain TypeScript object per (namespace, locale), and the
 *  English one IS the schema — `type ChromeCopy = typeof en`. Three compile
 *  errors fall out with no machinery at all, and the codes are measured rather
 *  than claimed. RE-MEASURED 23 SEP 2026 against this tree, by adding `"hi"`
 *  to `routing.locales` and a `chrome.hi.tsx`, running `npx tsc --noEmit`, and
 *  reverting (`scratchpad/prove_errors.py`). Two of the three were right and
 *  one was wrong; the wrong one is corrected here rather than defended:
 *
 *    - a key missing from a non-default locale      -> TS2741  (confirmed)
 *    - a key that exists in no locale (a typo)      -> TS2561, not TS2353
 *    - a locale declared in `routing.locales` with
 *      no dictionary                                -> TS2741 on the registry
 *                                                      (confirmed)
 *
 *  ON THE SECOND ONE, because the correction has a condition attached. The
 *  code depends on whether TypeScript can guess what you meant: `ctaa` next to
 *  a real `cta` is TS2561 ("… Did you mean to write 'cta'?") and only a stray
 *  that resembles nothing — `zzzUnknownLeaf` — is TS2353. A realistic typo is
 *  therefore TS2561. Both are the same check, and what matters is that it
 *  fires at all, which brings us to the condition:
 *
 *  **A NON-DEFAULT LOCALE MODULE MUST BE ANNOTATED `: <Ns>Copy`.** Measured:
 *  with `export const hi = { … }` inferred, a `hi` carrying a stray key
 *  produces NO ERROR AT ALL. Excess-property checking only applies to a fresh
 *  object literal being assigned to a typed target, and by the time `hi`
 *  reaches `Dictionary<ChromeCopy> = { en, hi }` it is a variable, so a `hi`
 *  that is a superset of `en` typechecks and the typo'd leaf is simply never
 *  rendered. The missing-key half (TS2741) still fires without the
 *  annotation; the stray-key half does not. Hence step 1b of the recipe.
 *  `en` itself stays UNannotated — it is the schema, so there is nothing to
 *  check it against.
 *
 *  That third one is §3.4's "accept a 4th locale by adding one array entry"
 *  turned into a gate: `Locale` is `(typeof routing.locales)[number]`, and
 *  `defineRouting` preserves the tuple, so `Locale` is the literal union `"en"`
 *  today — verified, because the whole design rests on it: if next-intl typed
 *  `locales` as `string[]`, `Record<Locale, T>` would be `Record<string, T>`
 *  and would gate nothing.
 *
 *  REJECTED — JSON + an `IntlMessages` augmentation (next-intl's own shape).
 *  It is the documented route and it needs a `global.d.ts` declaring
 *  `IntlMessages = typeof import("../messages/en.json")`, which nobody has
 *  written here, plus ICU parsing at render, plus a `t()` call whose key is a
 *  dotted string that no editor can rename. Worse for the two properties this
 *  site is actually short of: rich text has to become ICU markup with tag
 *  callbacks split across the catalogue and the call site, and a JSON leaf
 *  cannot be a `ReactNode`, which is what made the legal port flatten its
 *  lists (`LegalSection.body` is `string[]`, so `<li>`s became paragraphs).
 *
 *  REJECTED — `Record<Locale, string>` per string, i.e. every leaf a locale
 *  map (`{ en: "Home", hi: "…" }`). It reads well at the leaf and fails at
 *  scale: 763 three-key objects; a translator and an engineer editing the same
 *  lines; no file to hand a translation vendor; and — the fatal one — there is
 *  no `en` object left to take `typeof` of, so the keyset guarantee has to be
 *  rebuilt by hand. Adding `hi` would also surface 763 separate errors
 *  scattered through the tree instead of one per namespace.
 *
 *  ## Where the keys come from: structure stays in the component
 *
 *  An href is routing, not copy. So `SiteNav` keeps its ordered list of
 *  destinations and the dictionary holds a label PER DESTINATION — a table
 *  keyed by path, which is exactly `lib/seo/copy.ts`'s shape and the same
 *  argument `lib/content/company.ts` makes for keying credentials by id.
 *  The component's list is typed `readonly NavHref[]`, so adding a nav item
 *  without a label is TS2322 at the component, in every locale at once.
 *
 *  This is also why the dictionary holds almost no arrays. An array leaf
 *  derives to `T[]`, so a second locale could ship three nav items where
 *  English ships five and `tsc` would agree. A `Record` keyed by a literal
 *  union cannot.
 *
 *  ## Rich text, and attribute strings
 *
 *  A leaf's TYPE is whatever English uses, because the type is derived:
 *
 *    - `"Home"`                       -> `string`   (usable as an aria-label)
 *    - `<>a <em>b</em> c</>`          -> `JSX.Element`
 *    - `(link: ReactNode) => <>…</>`  -> that function type
 *
 *  So an `aria-label` or an `alt` is a plain `string` leaf and stays one:
 *  typing every leaf `ReactNode` would have made them unusable in attribute
 *  position, which is the reason the leaf type is derived rather than declared
 *  uniformly. And rich text is real JSX in a `.tsx` dictionary, so the markup
 *  a translator moves is the markup that renders — no ICU tag callbacks, no
 *  flattening. Where a sentence wraps something the COMPONENT owns (a link
 *  whose href needs the locale), the leaf is a function taking that node, so a
 *  locale may put it anywhere in the sentence; see `ConsentBanner` for the one
 *  case in this slice that could have needed it, and why it did not.
 *
 *  ## The one rule that keeps the HTML byte-identical
 *
 *  **Replace each literal text node with a single `{t.x}` expression yielding
 *  the identical string. Never merge two children into one, never split one
 *  into two.** React's SSR writes a `<!-- -->` separator between adjacent text
 *  children, so `{a} {b}` and `` {`${a} ${b}`} `` emit different bytes —
 *  `tools/port/html-identity.mjs` records catching exactly that on
 *  `Packages.tsx`, nine separators on one page. Corollaries:
 *
 *    - `{" "}` between elements is CONTENT. Keep every one of them where it
 *      is. `sections/Contact.tsx` and `sections/PeopleStrip.tsx` both carry
 *      comments saying a stray or missing one changes the output.
 *    - Write `"See plans & pricing"` in the dictionary, NOT
 *      `"See plans &amp; pricing"`. JSX decodes `&amp;` to `&` before React
 *      sees it and React re-escapes on the way out; a literal `&amp;` in a
 *      string emits `&amp;amp;`.
 *    - Keep `key=` expressions evaluating to the same string they do today.
 *      `SiteFooter` keys its columns on the heading text and its links on
 *      `href + label`; both still resolve through the dictionary to the same
 *      English bytes, so this slice moves no flight-payload key.
 *    - **`async` MOVES THE BOUNDARIES THAT SEPARATORS DEPEND ON, AND ONLY A
 *      REAL BUILD SHOWS IT.** React writes `<!-- -->` between adjacent text,
 *      and in an RSC build "adjacent" is decided across FLIGHT ROWS: an
 *      async Server Component is serialised as its own row, so text on
 *      either side of it stops being one run. Joining this layer makes
 *      components async, so it moves rows, so it can move separators. Two
 *      things follow, and the second is the one that cost a round:
 *
 *      IT IS NOT ALWAYS THE COMPONENT YOU CHANGED. A component whose own
 *      output ENDS IN A TEXT NODE at the top level (a `{" "}` that is the
 *      last child of a FRAGMENT, not one inside a wrapper element) is the
 *      easy case, and
 *      `blocks/LeadMock.tsx`'s `MockFields` was exactly it: `async` for one
 *      round, +1 separator after the last row at both breakpoints, fixed by
 *      keeping the component sync and moving the await into a child that
 *      ends on an element (`Rows`). But the junction between two SECTIONS
 *      also lost one, and reverting both adjacent components to HEAD did not
 *      bring it back — see the deviation below. So the blast radius of an
 *      `async` is its neighbourhood, not itself.
 *
 *      THE MECHANISM IS NOT ESTABLISHED, and this header has now been wrong
 *      about it twice — first "Fizz segments", then "RSC chunking, and it
 *      needs a text sibling". Both were tested and neither survived as a
 *      sole cause: a text sibling HIDES the effect rather than enabling it
 *      (the separator already existed and only changes which side of the
 *      boundary writes it), and an out-of-Next render reproduces one class
 *      of the effect and not the other. What IS established is the
 *      practical rule above and the instruments below. Guessing the
 *      internal has cost more than it has bought.
 *
 *      INSTRUMENTS, with their reach, because picking the wrong one reads as
 *      a refutation. `renderToString` THROWS on an async component and
 *      cannot be used at all. `renderToReadableStream` / `prerender` from
 *      `react-dom/server.edge` and `react-dom/static.edge` DO render them
 *      and caught the `MockFields` case exactly (1002 -> 1010 and 867 -> 875
 *      bytes, back to 1002/867 once fixed); rendering a whole `<main>` that
 *      way is ~200 KB and takes seconds. They are NOT reliable at a section
 *      junction: the same harness reports the pre- and post-migration
 *      `<main>` as byte-identical where the build disagrees, and reports the
 *      opposite SIGN for `Demo2`. Both need a throwaway Vitest config
 *      without `vitest.config.ts`'s `react-server` condition, which
 *      otherwise resolves `react-dom/server` to its "not supported in RSC"
 *      stub. The only instrument that settles a junction is
 *      `tools/port/html-identity.mjs` over a real build.
 *
 *      THE CHEAP GUARD is the easy case only: for each `async` component,
 *      does its `return (` open `<>` and close on a text child?
 *      `tools/test/copy.test.ts` §12 runs it over `components/sections` and
 *      `components/blocks`, with one measured allowlist entry.
 *
 *
 *  ## The one deviation this layer has shipped (23 Sep 2026)
 *
 *  ONE `<!-- -->` IS MISSING FROM `/en`, inside `<main>`, at the junction
 *  between `sections/Demo2.tsx` and `sections/Numbers.tsx` — immediately
 *  before `Built on trust. Proven by numbers.`. It is a hydration comment: a
 *  reader cannot see it, and React re-creates the text boundary from the
 *  same markup on the client, so hydration is unaffected. Eight bytes.
 *
 *  Recorded rather than fixed because it is UNATTRIBUTED. Counted inside
 *  `<main>` on real `next build` output, across the snapshots this repo
 *  keeps: 93 before the Part 8a splits, 89 before the chrome round, 89
 *  before the sections/blocks round, 88 now. Four reverts, each a full
 *  build: `Numbers` to HEAD -> 88, `Demo2` to HEAD -> 88, both to HEAD ->
 *  88, and `app/[locale]/page.tsx` never changed at all (`git diff` empty).
 *  Chrome and layout are ruled out by splitting the count: 1 separator
 *  before `<main>` and 0 after it in both the snapshot and now, with the
 *  whole difference inside. So neither adjacent component owns it, the
 *  parent does not, and it is not outside the landmark.
 *
 *  What is left standing is that the flight-row layout at a junction depends
 *  on the async-ness of NEIGHBOURING components — `PeopleStrip` sits
 *  immediately before `Demo2` and was migrated in the same round — which
 *  makes the cause distributed across fifteen files and not worth bisecting
 *  for eight bytes. Two reruns of the same junction through the out-of-Next
 *  renderers disagree with the build in both magnitude and sign, so that
 *  instrument cannot arbitrate here either.
 *
 *  If a later round makes this junction matter — a diff tool that cannot
 *  tolerate it, or a second one appearing — the next step is the fifteen-file
 *  bisect over real builds that was deliberately not run, not another
 *  hypothesis.
 *
 *  ## Reading it: two accessors, and why they are in two modules
 *
 *  `pick(DICT, locale)` is pure and synchronous. `copy(DICT)` in `./request`
 *  awaits `getLocale()`. The split is not taste — `next-intl/server` pulls in
 *  `next/headers`, which does not resolve outside a Next runtime, and
 *  `tools/test/locales.test.ts` already records that failure
 *  (`ERR_MODULE_NOT_FOUND … Did you mean to import "next/headers.js"?`). A
 *  dictionary that could only be reached through `next-intl/server` would be
 *  untestable. This is the same client/server split `lib/i18n/href.ts` made
 *  for the same reason.
 *
 *  Components use `await copy(CHROME)`, mirroring the `await getLocale()` that
 *  `chrome/AppLink.tsx`, `chrome/LocaleSwitch.tsx` and `chrome/PageShell.tsx`
 *  already make. A component that ALREADY has the locale as a prop — only
 *  `ConsentBanner` — calls `pick(CHROME, locale)` and stays synchronous.
 *
 *  REJECTED — threading resolved copy down as props from the shell. It would
 *  make every section migration edit its page call sites in
 *  `app/[locale]/**`, which is 33 files no section agent should have to touch.
 *
 *  ## Zero client bytes, and how that is kept
 *
 *  `check:perf` has the worst page at 161.8 KB of script against a 163 KB
 *  enforced ceiling — 1.2 KB of headroom — and `chrome/AppLink.tsx` measured
 *  next-intl's client `<Link>` at 15.7 KB brotli plus a root
 *  `NextIntlClientProvider`. So this layer adds nothing to the client bundle:
 *  it is imported only from Server Components, `./request` is the only module
 *  that touches next-intl at all, and nothing here is reachable from
 *  `forms/ContactForm.tsx`, still the one `"use client"` file in the tree.
 *  A Client Component that needs a string takes it as a prop from its server
 *  parent. If that ever stops being enough, the answer is a provider scoped to
 *  that subtree with a measurement attached, not one at the root.
 *
 *  ## The `forms` ruling (23 Sep 2026): NOT YET, and the numbers behind it
 *
 *  `components/forms/**` is the only area where copy would cross into a
 *  Client Component, and it is the one area the copy-layer rounds have
 *  deliberately left alone. Asked to settle it, this is the ruling, the
 *  measurement it rests on, and the two alternatives it rejects. It is a
 *  "not yet" with a named next step, not a "never".
 *
 *  **FIRST, THE BUDGET SENTENCE ABOVE IS ABOUT THE WRONG METRIC FOR THIS
 *  CHANGE, and that is the finding.** `tools/perf/check-budgets.mjs` builds
 *  `script` by walking `(?:src|href)="(/_next/static/[^"]+)"` and weighing the
 *  FILE each reference names. Reproduced exactly against the build in `.next`
 *  — 161.8 KB on `/contact`, the worst page, matching what `check:perf`
 *  prints, including the detail that the loop does not dedupe, so a chunk that
 *  is preloaded and then executed is counted twice
 *  (`scratchpad/forms_ruling_total2.py`). The inline RSC flight payload is not
 *  a `/_next/static` reference and contributes ZERO to that number. Threading
 *  strings to a Client Component adds no module to the client graph, so the
 *  1.2 KB of headroom is not what is at stake. What is at stake is `total`,
 *  which does count the document.
 *
 *  **MEASURED, on the real build, without rebuilding.** The 24 strings
 *  `ContactForm.tsx` and `LeadFields.tsx` own were serialised into
 *  `ContactForm`'s existing flight row — `["$","$L18",null,{"locale":"en"}]`
 *  in `.next/server/app/en/contact.html` — exactly as React would write them,
 *  and the page recompressed at the same brotli quality the budget uses:
 *
 *      script on /contact ......... 161.8 KB -> 161.8 KB   (+0, ceiling 163)
 *      /contact.html raw .......... +1058 bytes
 *      /contact.html brotli ....... 13343 -> 13570 B  (+227 B)
 *      total on /contact .......... 430.9 KB -> 431.1 KB   (ceiling 460)
 *
 *  `/contact` is not even the worst page by `total` — `/en` is, at 450.2 KB.
 *  So the cost is affordable and the premise "this layer adds zero client
 *  bytes" would survive intact, because zero SCRIPT bytes is what it means.
 *  **Cost is not the reason to decline.**
 *
 *  **THE REASON IS THAT THE MIGRATION CANNOT FINISH.** Ten of the form's 34
 *  visible strings are not in `components/forms/**` at all: `SEGMENT_LABELS`
 *  (3, the radio group) and `INTEREST_LABELS` (7, every option in the
 *  `<select>`) live in `lib/leads/constraints.ts`, keyed by the values the
 *  server's zod schema validates and the CRM reports on. Moving them would
 *  part a label from the value it labels across the one module the client and
 *  the server share on purpose — that file's own header says the limits are
 *  there "so the browser and the server cannot disagree". Leaving them makes
 *  a `forms` namespace cover 24 of 34 strings and miss the two most visible
 *  label sets on the page. The layer exists so that declaring `hi` is a
 *  translation job rather than an audit; a form that is 71% translated is not
 *  that, and it would look finished.
 *
 *  **RECOMMENDED: leave `forms` unmigrated, and rule on
 *  `lib/leads/constraints.ts` first.** That module has to be split — value
 *  union and limits on one side, the two label tables on the other — or
 *  explicitly declared not-copy on the grounds that an option label is part
 *  of a schema. Either answer makes `forms` a clean 34-string namespace.
 *  Until then the honest state is the one recorded here.
 *
 *  **REJECTED — a `NextIntlClientProvider` scoped to `/contact`.** This is the
 *  escape hatch the paragraph above names, and it is the one option the
 *  script budget does kill: `chrome/AppLink.tsx` measured next-intl's client
 *  runtime at 15.7 KB brotli, against 1.2 KB of headroom on the very page
 *  that would carry it. It fails `check:perf` on the first build. Rejected by
 *  measurement, not by taste.
 *
 *  **REJECTED — thread the 24 strings as props now and take the 227 bytes.**
 *  Affordable, and the shape this header already sanctions for a Client
 *  Component. Declined only because of the ten strings it cannot reach: it
 *  would spend the bytes, add the first prop-threading precedent in the
 *  layer, and still leave the radio group and the whole `<select>` in
 *  English. The 227 bytes are worth paying for a finished form and not for a
 *  partial one. `max-lines` is NOT a reason either way — `ContactForm.tsx` is
 *  at 243 of 300 and a 24-key prop type lands near 278.
 *
 *  ## Adding a namespace (this is the whole recipe)
 *
 *  1. `src/lib/copy/<ns>.en.tsx` — `export const en = { … }`, no `as const`
 *     (it would pin every string to a literal type and force other locales to
 *     repeat the English bytes) and no type annotation (it IS the type).
 *  1b. `src/lib/copy/<ns>.<other>.tsx` — `export const hi: <Ns>Copy = { … }`,
 *     ANNOTATED. Measured above: without the annotation a stray key is not an
 *     error, because excess-property checking never sees an object literal.
 *  2. `src/lib/copy/<ns>.ts` — `export type <Ns>Copy = typeof en`, then
 *     `export const <NS>: Dictionary<<Ns>Copy> = { en }`, plus any key unions
 *     the components need (`keyof <Ns>Copy["nav"]["links"]`).
 *  3. In each component: `const t = await copy(<NS>)`, then swap literals for
 *     `{t.…}` under the rule above.
 *  4. Add the namespace to the two loops in `tools/test/copy.test.ts`.
 *
 *  A namespace is the unit one agent owns and one translator receives. One per
 *  component directory (`chrome`, `sections`, `blocks`, `forms`, `templates`)
 *  and one per route subtree for `app/[locale]/**`.
 *
 *  ## Known couplings, for whoever declares the second locale
 *
 *  `lib/seo/schema/breadcrumbs.ts:84` hardcodes `{ label: "Home", href: "/" }`
 *  to mirror what `chrome/Breadcrumb.tsx` renders, and `check-schema.mjs`
 *  compares the two per page. "Home" is now `chrome.breadcrumb.home`, so that
 *  line must read the same key before `hi` ships or the gate fails on every
 *  inner page. It cannot fail today: `en` is the only locale, so both sides
 *  are the same string.
 *
 *  ## Why `src/lib/copy/`, not `messages/`
 *
 *  `messages/` is outside `src/`, so outside the `@/` alias, and next-intl
 *  reaches it by a dynamic `import()` in `lib/i18n/request.ts` — dynamic by
 *  template literal, which is precisely the construct that types nothing. It
 *  is left as it is; see that file's header. `src/lib/copy/` also sits outside
 *  ESLint's `max-lines: 300`, which is scoped to `src/app/**` and
 *  `src/components/**` — a dictionary's length is content, the same argument
 *  `eslint.config.mjs` already makes for `lib/content/company.ts` at 414
 *  lines.
 */
import { routing, type Locale } from "@/lib/i18n/routing";

/** One namespace's copy in every served locale. `Record<Locale, T>` rather
 *  than `Partial<…>` on purpose — the missing member IS the gate. */
export type Dictionary<T> = Readonly<Record<Locale, T>>;

/** The pure lookup. Throws on a locale that is not served, which is
 *  unreachable in the app — `app/[locale]/layout.tsx` sets
 *  `dynamicParams = false` and calls `notFound()` for an unknown locale — and
 *  is the same posture `lib/seo/copy.ts#copyFor` takes for an unknown route:
 *  a lookup is not the place to decide a locale exists, but it should say so
 *  loudly if it is ever asked.
 */
export function pick<T>(dict: Dictionary<T>, locale: string): T {
  const found = (dict as Record<string, T | undefined>)[locale];
  if (!found) {
    throw new Error(
      `copy: no dictionary for locale ${JSON.stringify(locale)}. ` +
        `Served locales are ${JSON.stringify(routing.locales)} — add the ` +
        `locale to routing.locales AND a dictionary module for it; ` +
        `Record<Locale, T> makes the second half a type error.`,
    );
  }
  return found;
}
