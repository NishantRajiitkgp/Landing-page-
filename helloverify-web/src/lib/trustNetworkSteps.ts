/** The trust network's last growth step ("Today"; step 0 is 2018). Its own
 *  module so the eager island (`sections/TrustNetwork.tsx`) can render the
 *  slider without a static import of `./trustNetworkSim`, which, with its
 *  graph table, loads only as the section approaches. */
export const LAST = 8;
