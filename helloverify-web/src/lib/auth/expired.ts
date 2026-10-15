/** Thrown by the cart and orders clients when the API answers 401. The
 *  account pages catch it and send the visitor back through login. */
export class SessionExpired extends Error {
  constructor() {
    super("Please sign in again");
    this.name = "SessionExpired";
  }
}
