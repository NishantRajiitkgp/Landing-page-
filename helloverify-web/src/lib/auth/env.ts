/** Travel-auth runtime config. Unset `TRAVEL_AUTH_BASE` is mock mode.
 *
 *  Read lazily — same reason as `lib/leads/env.ts`. Never `NEXT_PUBLIC_`:
 *  the browser talks only to `/api/auth/*`, `/api/cart/*`, and `/api/orders/*`
 *  on this host.
 */
import "server-only";

export const MOCK_OTP = "123456";
export const MOCK_NEW_USER_MOBILE = "9111111111";

export function useMockTravelAuth(): boolean {
  const forced = process.env.TRAVEL_AUTH_MOCK?.trim().toLowerCase();
  if (forced === "1" || forced === "true" || forced === "yes") return true;
  if (forced === "0" || forced === "false" || forced === "no") return false;
  return !process.env.TRAVEL_AUTH_BASE?.trim();
}

function travelBase(): string {
  return (process.env.TRAVEL_AUTH_BASE ?? "https://aitravelassistance.helloverify.com").replace(
    /\/+$/,
    "",
  );
}

export function travelAuthApi(): string {
  return `${travelBase()}/auth/api/v1`;
}

/** Old SPA `TRAVEL_USER_API` — cart, payment, order-list, travel invite. */
export function travelUserApi(): string {
  return `${travelBase()}/user-details/api/v1`;
}

/** Old SPA `SMB_API_BASE` — `{base}/smb/v1/api`. */
export function smbApi(): string {
  return `${travelBase()}/smb/v1/api`;
}
