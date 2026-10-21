/** The Hello Staff storefront. Its `/buy/<package>-<tier>` route starts that
 *  exact tier's purchase and opens login with it selected; the ids are its
 *  `src/data/packages.ts`. `HELLOSTAFF_STORE_URL` overrides the host for a
 *  local run (this file is read on the server). */
export const HELLOSTAFF_LIVE =
  process.env.HELLOSTAFF_STORE_URL?.replace(/\/$/, "") || "https://devhellostaff.helloverify.com";

export type LiveServiceKey =
  | "driver"
  | "homeStaff"
  | "tenant"
  | "nanny"
  | "verifyAnyone"
  | "cyberIdentity"
  | "knowIdentity"
  | "knowContact";

export type LiveTier = "basic" | "advanced";

const LIVE_PACKAGES: Record<LiveServiceKey, string> = {
  driver: "driver",
  homeStaff: "home-staff",
  tenant: "tenant",
  nanny: "nanny",
  verifyAnyone: "verify-anyone",
  cyberIdentity: "cyber-identity",
  knowIdentity: "know-identity",
  knowContact: "know-contact",
};

export function liveBuyUrl(key: LiveServiceKey, tier: LiveTier): string {
  return `${HELLOSTAFF_LIVE}/buy/${LIVE_PACKAGES[key]}-${tier}`;
}
