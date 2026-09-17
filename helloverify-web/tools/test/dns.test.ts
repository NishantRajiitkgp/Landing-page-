const BASE = "../../src/lib/leads/";
const { assessEmail } = await import(BASE + "email.ts");

const cases: Array<[string, string]> = [
  ["someone@gmail.com", "ok"],
  ["someone@helloverify.com", "ok"],
  ["someone@this-domain-does-not-exist-hv-9f2a.com", "undeliverable"],
  ["someone@mailinator.com", "disposable"],
];

let pass = 0;
let fail = 0;

for (const [email, expected] of cases) {
  const t0 = Date.now();
  const got = await assessEmail(email, { mxCheck: true });
  const ms = Date.now() - t0;
  const ok = got === expected;
  if (ok) pass++;
  else fail++;
  console.log(`  ${ok ? "ok  " : "FAIL"} ${email.padEnd(52)} -> ${got.padEnd(14)} (${ms} ms)`);
}

// Second call must be served from cache.
const t0 = Date.now();
await assessEmail("someone@gmail.com", { mxCheck: true });
console.log(`  cache hit took ${Date.now() - t0} ms`);

console.log("");
console.log(pass + " passed, " + fail + " failed");
