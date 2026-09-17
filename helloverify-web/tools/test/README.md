# Lead pipeline tests

94 assertions over the item-2 lead pipeline. No test runner yet — BUILD-SPEC
§3.7 picks Vitest, and wiring it up belongs to item 8. These run on bare Node
using its built-in type stripping, so they work today and are not lost.

```sh
node --conditions=react-server --import ./tools/test/register.mjs ./tools/test/schema.test.ts
node --conditions=react-server --import ./tools/test/register.mjs ./tools/test/abuse.test.ts
node --conditions=react-server --import ./tools/test/register.mjs ./tools/test/zoho.test.ts
node --conditions=react-server --import ./tools/test/register.mjs ./tools/test/dns.test.ts   # needs network
```

Two flags are load-bearing:

- `--conditions=react-server` resolves the `server-only` package to its no-op
  build. Without it every module under `lib/leads` throws on import, which is
  exactly what that package is for.
- `--import ./register.mjs` installs a resolve hook so Node can follow the
  project's extensionless imports and the `@/` alias. Node does not do bundler
  resolution on its own.

`zoho.test.ts` runs a mock Zoho on a random port and covers the failures the
old integration could not see: an HTTP 200 whose body is a rejection, a 200
carrying an OAuth error, a 401 refresh-and-retry, a 5xx retried once, and a
`Lead_Source` outside the live picklist.

When these move to Vitest, keep the mock-server cases. They are the reason
`deliverLead` can tell delivered from dropped.
