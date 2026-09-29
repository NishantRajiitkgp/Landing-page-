import { ConsumerShop } from "./ConsumerShop";

/** HelloV, the consumer side: homepage v2's storefront (`./ConsumerShop`),
 *  at every width.
 *
 *  The phone kept the old generated tree — eight service chips, the HelloV
 *  phone and two plan cards — until the v2 phone pass (Sep 2026) stacked the
 *  storefront for 390px. That tree, and the copy only it read, went with
 *  it; `blocks/HelloVPhone` stays, the storefront plays it. This name stays
 *  because the page composes it. */
export function Consumer() {
  return <ConsumerShop />;
}
