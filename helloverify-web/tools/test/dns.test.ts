import { check } from "./harness.ts";

const BASE = "../../src/lib/leads/";
const { assessEmail } = await import(BASE + "email.ts");

const cases: Array<[string, string]> = [
  ["someone@gmail.com", "ok"],
  ["someone@helloverify.com", "ok"],
  ["someone@this-domain-does-not-exist-hv-9f2a.com", "undeliverable"],
  ["someone@mailinator.com", "disposable"],
];

for (const [email, expected] of cases) {
  const t0 = Date.now();
  const got = await assessEmail(email, { mxCheck: true });
  const ms = Date.now() - t0;
  console.log(`  ${email.padEnd(52)} -> ${got.padEnd(14)} (${ms} ms)`);
  check(`${email} is ${expected}`, got === expected, got);
}

// Second call must be served from cache.
const t0 = Date.now();
await assessEmail("someone@gmail.com", { mxCheck: true });
console.log(`  cache hit took ${Date.now() - t0} ms`);

