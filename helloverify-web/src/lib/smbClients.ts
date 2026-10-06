/** The small and medium business clients whose logos the site shows: under
 *  the SMB packages on the homepage (`sections/SmbPacks.tsx`) and under the
 *  hero of `/products/bgv-smb`. One list, so the two strips show the same
 *  marks in the same order; the first is the one to lead with.
 *
 *  Each logo is `public/img/clients/smb/<id>.png`, trimmed to its ink and
 *  120px tall. The names (the logos' alt text) are copy, keyed by `id` in
 *  `sections.smb.clients` and `business.smb.clients`, so an id without a
 *  name in either is a type error.
 *
 *  `fit` evens out how big the marks look at one shared slot: `tall` is a
 *  mark stacked over its name, which would read smallest at the shared
 *  height; `square` is a nearly square one, which needs more still; `wide` is
 *  a long single-line wordmark, which the width cap would shrink to a sliver. */
export type SmbLogoFit = "tall" | "square" | "wide";

export const SMB_CLIENTS: readonly { id: SmbClientId; fit?: SmbLogoFit }[] = [
  { id: "akcelerator", fit: "wide" },
  { id: "aidenai" },
  { id: "lucid", fit: "wide" },
  { id: "midfin" },
  { id: "lnp", fit: "tall" },
  { id: "itekpeople" },
  { id: "appxcelerate", fit: "square" },
  { id: "ditstek", fit: "tall" },
  { id: "caone" },
  { id: "ibirds", fit: "square" },
];

export type SmbClientId =
  | "akcelerator"
  | "aidenai"
  | "lucid"
  | "midfin"
  | "lnp"
  | "itekpeople"
  | "appxcelerate"
  | "ditstek"
  | "caone"
  | "ibirds";

export const smbLogo = (id: SmbClientId) => `/img/clients/smb/${id}.png`;
