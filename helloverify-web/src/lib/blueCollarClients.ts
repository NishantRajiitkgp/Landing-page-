/** Blue-collar clients on the homepage's Key Verification Solutions panel
 *  (`sections/Packages.tsx`). The marks sit in the same client-strip format
 *  as the enterprise and SMB rows: one label, then the logos in their own
 *  colours, each fitted to a shared slot.
 *
 *  Files live in `public/img/clients/blue/`. `fit` evens out how big they
 *  read at one height: `square` is a badge (Café Delhi Heights, Starbucks),
 *  `badge` is Haldiram's oval, `wide` is a long wordmark.
 *
 *  Domino's, Starbucks and Reliance Retail still need written approval
 *  before this page goes live. They are shown now for testing.
 *
 *  White-collar marks are not in this list. The white-collar panel keeps an
 *  empty rail of the same height until those files arrive. */
export type BlueLogoFit = "badge" | "square" | "wide";

export const BLUE_COLLAR_CLIENTS: readonly { id: BlueClientId; fit: BlueLogoFit }[] = [
  { id: "haldiram", fit: "badge" },
  { id: "cafeDelhiHeights", fit: "square" },
  { id: "hungerbox", fit: "wide" },
  { id: "dominos", fit: "wide" },
  { id: "starbucks", fit: "square" },
  { id: "relianceRetail", fit: "wide" },
];

export type BlueClientId =
  | "haldiram"
  | "cafeDelhiHeights"
  | "hungerbox"
  | "dominos"
  | "starbucks"
  | "relianceRetail";

const FILES: Record<BlueClientId, string> = {
  haldiram: "haldiram.avif",
  cafeDelhiHeights: "cafe-delhi-heights.webp",
  hungerbox: "hungerbox.svg",
  dominos: "dominos.png",
  starbucks: "starbucks.webp",
  relianceRetail: "reliance-retail.png",
};

export const blueLogo = (id: BlueClientId) => `/img/clients/blue/${FILES[id]}`;
