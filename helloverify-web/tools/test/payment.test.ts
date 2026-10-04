import { check } from "./harness.ts";

import { completeMockPayment, readMockCart, readMockOrders, writeMockCart } from "../../src/lib/cart/storage.ts";
import { cartPayCurrency, deriveCartPaymentMeta, isPaymentCallbackSuccess, isPaymentInitResponse } from "../../src/lib/cart/payment.ts";
import { getOrderDisplayLines, isTravelLine } from "../../src/lib/orders/lines.ts";

class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  get length() {
    return this.map.size;
  }
  clear() {
    this.map.clear();
  }
  getItem(key: string) {
    return this.map.get(key) ?? null;
  }
  key(index: number) {
    return [...this.map.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.map.delete(key);
  }
  setItem(key: string, value: string) {
    this.map.set(key, value);
  }
}

Object.defineProperty(globalThis, "sessionStorage", {
  configurable: true,
  value: new MemoryStorage(),
});

console.log("1. payment-init meta matches the old Angular cart");
{
  const smb = [{ uuid: "a", check_code: "blue" }, { uuid: "b", check_code: "id" }];
  const meta = deriveCartPaymentMeta(smb);
  check("any check_code makes is_cart_payment true", meta.isCartPayment === true, meta);
  check("SMB ids are every line UUID", meta.cartIds.join(",") === "a,b", meta);

  const travel = [{ uuid: "t1", package_type: "ai_travel_assistance" }];
  const travelMeta = deriveCartPaymentMeta(travel);
  check("travel-only is not cart payment", travelMeta.isCartPayment === false, travelMeta);
  check("travel ids are the card lines", travelMeta.cartIds.join(",") === "t1", travelMeta);
}

console.log("2. init / callback success is as loose as Angular");
check("init needs data + status", isPaymentInitResponse({ status: true, data: { merchant_key: "k", payable_amount: 1, order_id: "o" } }));
check("init without data fails", !isPaymentInitResponse({ status: true }));
check("callback success true wins", isPaymentCallbackSuccess({ success: true, status: false }));
check("callback success false loses", !isPaymentCallbackSuccess({ success: false, status: true }));
check("USD line picks USD", cartPayCurrency([{ currency: "USD" }]) === "USD");
check("INR cart stays INR", cartPayCurrency([{ currency: "INR" }]) === "INR");

console.log("3. mock pay moves the cart into orders");
{
  writeMockCart([
    {
      uuid: "line-1",
      check_name: "Blue-collar hire",
      check_code: "blue",
      package_type: "SMB",
      persons: 2,
      total_amount: 698,
      currency: "INR",
    },
  ]);
  const res = completeMockPayment();
  check("mock pay succeeds", res.status === true && res.success === true);
  check("cart is emptied", readMockCart().length === 0);
  const orders = readMockOrders();
  check("one order was written", orders.length === 1, orders);
  const lines = getOrderDisplayLines(orders[0]!);
  check("the paid line is on the order", lines[0]?.check_code === "blue", lines);
  check("two person slots", lines[0]?.persons === 2, lines);
  check("SMB line is not travel", !isTravelLine(lines[0]!), lines[0]);
}
