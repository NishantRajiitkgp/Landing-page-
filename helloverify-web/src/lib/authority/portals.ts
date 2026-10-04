/** MOM / MOHESR portal hosts. Saudi stays off this tree (`/premium/saudi` → home). */

export const AUTHORITY_IDS = ["mom", "mohesr"] as const;
export type AuthorityId = (typeof AUTHORITY_IDS)[number];

export type AuthorityPortal = {
  id: AuthorityId;
  apiBase: string;
  candidateOrigin: string;
  agencyOrigin?: string;
};

export const AUTHORITY_PORTALS: Record<AuthorityId, AuthorityPortal> = {
  mom: {
    id: "mom",
    apiBase: "https://api.helloverify.sg/",
    candidateOrigin: "https://applicant.helloverify.sg",
    agencyOrigin: "https://agency.helloverify.sg/",
  },
  mohesr: {
    id: "mohesr",
    apiBase: "https://api.helloverify.ae/",
    candidateOrigin: "https://applicant.helloverify.ae",
  },
};

export const MOM_REGISTRATION_DEFAULTS = {
  client: 701,
  geos: 1,
  program: 1810,
  sbu: 3771,
  section: 5468,
} as const;

export const MOHESR_REGISTRATION_DEFAULTS = {
  client: 702,
  geos: 1,
} as const;

export const UAE_PASS = {
  signIn: "https://ids.uaepass.ae/authenticationendpoint/login.do",
  android: "https://play.google.com/store/apps/details?id=ae.uaepass.mainapp",
  ios: "https://apps.apple.com/app/uae-pass/id1377150418",
} as const;

export function isAuthorityId(value: string): value is AuthorityId {
  return (AUTHORITY_IDS as readonly string[]).includes(value);
}

export function getAuthorityPortal(id: AuthorityId): AuthorityPortal {
  return AUTHORITY_PORTALS[id];
}

export function defaultTab(id: AuthorityId): "login" | "register" {
  return id === "mom" ? "register" : "login";
}
