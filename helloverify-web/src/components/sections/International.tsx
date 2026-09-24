import { Globe } from "./Globe";

/** International coverage: homepage v2's globe (`./Globe`), at every width.
 *
 *  The phone kept the old generated tree — five photo cards in a two-column
 *  grid — until the v2 phone pass (Sep 2026) sized the globe for 390px. The
 *  cards, and the copy only they read, went with it; the globe's cards say
 *  more about more countries. This name stays because the page composes it. */
export function International() {
  return <Globe />;
}
