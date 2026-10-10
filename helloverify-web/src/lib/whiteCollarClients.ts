/** White-collar clients on the homepage's Key Verification Solutions panel
 *  (`sections/Packages.tsx`), in the same client-strip format as the
 *  blue-collar marks (`./blueCollarClients`). Names (alt text) are copy, in
 *  `sections.packages.clients`.
 *
 *  Files live in `public/img/clients/white/`, trimmed to their ink. Tata
 *  Elxsi was supplied white-on-transparent and is repainted dark; Xavient
 *  was a JPEG on white and has the white lifted out; Randstad is its app
 *  tile. `fit` evens out how big they read at one height: `square` is a
 *  tile or monogram (Randstad, TP), `badge` a stacked mark (EXL, Xavient),
 *  `wide` a long wordmark. */
import type { BlueLogoFit } from "./blueCollarClients";

export const WHITE_COLLAR_CLIENTS: readonly { id: WhiteClientId; fit?: BlueLogoFit }[] = [
  { id: "tataElxsi", fit: "wide" },
  { id: "mphasis" },
  { id: "globalLogic", fit: "wide" },
  { id: "exl", fit: "badge" },
  { id: "teleperformance", fit: "square" },
  { id: "randstad", fit: "square" },
  { id: "xavient", fit: "badge" },
];

export type WhiteClientId = "tataElxsi" | "mphasis" | "globalLogic" | "exl" | "teleperformance" | "randstad" | "xavient";

const FILES: Record<WhiteClientId, string> = {
  tataElxsi: "tata-elxsi.png",
  mphasis: "mphasis.png",
  globalLogic: "globallogic.png",
  exl: "exl.png",
  teleperformance: "teleperformance.svg",
  randstad: "randstad.png",
  xavient: "xavient.png",
};

export const whiteLogo = (id: WhiteClientId) => `/img/clients/white/${FILES[id]}`;
