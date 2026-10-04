/** Authority API runtime. Unset is mock — same posture as `TRAVEL_AUTH_BASE`. */
import "server-only";

export function useMockAuthorityAuth(): boolean {
  const forced = process.env.AUTHORITY_API_MOCK?.trim().toLowerCase();
  if (forced === "1" || forced === "true" || forced === "yes") return true;
  if (forced === "0" || forced === "false" || forced === "no") return false;
  const live = process.env.AUTHORITY_API_LIVE?.trim().toLowerCase();
  return live !== "1" && live !== "true" && live !== "yes";
}

export function authorityEncryptKey(): string | null {
  const key = process.env.AUTHORITY_ENCRYPT_KEY?.trim();
  return key || null;
}
