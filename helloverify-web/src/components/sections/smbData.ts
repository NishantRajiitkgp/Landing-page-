/** The Small & Medium packages as data, shared by the cards (`./SmbPacks`)
    and the how-it-works screen (`./SmbHow`), which follows the spotlit one.
    Which checks a package runs is what its price was set for, not copy, so
    it lives here; the names and prices are `smb` in the copy. */

export type SmbPack = "basic" | "standard" | "premium";
export type SmbLine = "identity" | "criminal" | "global" | "address" | "moonlighting";

/** Which lines each package lists, what it adds over the tier below (drawn
 *  highlighted), and its photograph.
 *
 *  CONVERSION PASS (24 Sep 2026), kept: the lines are in one order on every
 *  card, the inherited ones first, so the eye can compare across the three
 *  and the added check is always the last. Premium is the one spotlit
 *  (`best`): at ≈₹480 a check it is the cheapest per check.
 *
 *  The photographs follow what each tier adds: Basic (ID, criminal, global
 *  watchlists) for a counter hire at a café; Standard adds the current
 *  address, for a shop assistant; Premium adds moonlighting, which matters
 *  most for a salaried office hire. */
export const PACKS: { id: SmbPack; lines: SmbLine[]; adds: SmbLine[]; photo: string; best?: true }[] = [
  { id: "basic", lines: ["identity", "criminal", "global"], adds: [], photo: "/img/v2/sm-cafe.jpg" },
  { id: "standard", lines: ["identity", "criminal", "global", "address"], adds: ["address"], photo: "/img/v2/sm-shop.jpg" },
  { id: "premium", lines: ["identity", "criminal", "global", "address", "moonlighting"], adds: ["moonlighting"], photo: "/img/v2/sm-office.jpg", best: true },
];
