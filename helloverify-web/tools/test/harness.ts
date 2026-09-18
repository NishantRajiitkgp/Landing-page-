/** The `check()` the suite was already written against, backed by Vitest.
 *
 *  The four lead-pipeline files were straight-line scripts: they compute a
 *  result, call `check("label", condition, got)`, and tally passes at the end.
 *  That is 94 assertions of real coverage, written when there was no runner.
 *
 *  Rewriting them into `it(...)` blocks would have meant touching every one of
 *  those 94 lines — a large diff across working tests, for no behaviour change,
 *  and every line of it a chance to invert a condition by accident. So instead
 *  `check` keeps its exact signature and registers a Vitest test per call.
 *
 *  This works because Vitest collects a file by EXECUTING it: `test()` may be
 *  called from anywhere that runs during collection, including top-level
 *  straight-line code. The condition is already evaluated by the time `check`
 *  is called, so the closure just reports it. Each assertion therefore shows up
 *  as its own named test, which is strictly better reporting than the tally the
 *  scripts printed, and the test bodies did not change at all.
 *
 *  `console.log("1. happy path")` section headers in those files still run and
 *  still print. Harmless, and they keep the files readable as documents.
 */
import { expect, test } from "vitest";

/**
 * `check("email lowercased", r.lead.email === "a@b.com", r.lead.email)`
 *
 * `got` is only rendered when the assertion fails, which is why it is worth
 * passing even though it is unused on the happy path.
 */
export function check(label: string, condition: boolean, got?: unknown): void {
  test(label, () => {
    expect(condition, got === undefined ? undefined : `got=${JSON.stringify(got)}`).toBe(true);
  });
}
