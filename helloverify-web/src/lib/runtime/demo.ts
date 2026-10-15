/** Whether mock and demo backends may answer at all.
 *
 *  They accept 123456, seal sessions with a key that is in this repository and
 *  write orders nobody paid for, so a production build never runs them: an
 *  unset `*_LIVE` / `TRAVEL_AUTH_BASE` fails closed instead of quietly turning
 *  a flow into a demo. `HV_E2E_DEMO=1` re-admits them for the local Playwright
 *  run against `next start`; Cloud Run sets `K_SERVICE`, so it is ignored there. */
import "server-only";

export function demoAllowed(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  return process.env.HV_E2E_DEMO === "1" && !process.env.K_SERVICE;
}
