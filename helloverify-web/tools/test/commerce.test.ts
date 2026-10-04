import { check } from "./harness.ts";

import { buildAddToCartPayload, cartItemFromPayload } from "../../src/lib/cart/payload.ts";
import { parseUnitPrice, resolveCheckoutPricing } from "../../src/lib/cart/price.ts";
import { isAddToCartSuccess } from "../../src/lib/cart/success.ts";

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

console.log("1. display prices parse the way the old checkout did");
check("₹349 is 349", parseUnitPrice("₹349") === 349);
check("$29.00 is 29", parseUnitPrice("$29.00") === 29);
check("two people doubles the total", resolveCheckoutPricing({ priceDisplay: "₹499" }, 2, "?").totalDisplay === "₹998");
check("missing price keeps the fallback", resolveCheckoutPricing({}, 1, "Price at checkout").unitDisplay === null);

console.log("2. SMB / home payloads match the old AddToCart shape");
{
  const body = buildAddToCartPayload(
    {
      packageType: "smb",
      packageId: "blue",
      packageName: "Blue-collar hire",
      priceDisplay: "₹349",
    },
    2,
  );
  const items = body.items as { package_id?: string; quantity?: number; price?: number }[];
  check("package id is forwarded", items[0]?.package_id === "blue", items);
  check("quantity is persons", items[0]?.quantity === 2, items);
  check("line price is per unit", items[0]?.price === 349, items);
  check("total_price is unit × people", body.total_price === 698, body);
}

console.log("3. add-to-cart success is as loose as Angular");
check("status true", isAddToCartSuccess({ status: true }));
check("cart object counts", isAddToCartSuccess({ cart: { items: [] } }));
check("added to cart message counts", isAddToCartSuccess({ message: "Added to cart" }));
check("empty object fails", !isAddToCartSuccess({}));

{
  const item = cartItemFromPayload({
    items: [{ package_name: "Basic", price: 499, quantity: 1, persons: 1, currency: "INR" }],
  });
  check("mock line takes the package name", item.check_name === "Basic", item);
}

{
  const item = cartItemFromPayload({
    items: [{ package_id: "blue", package_name: "Blue-collar hire", price: 349, quantity: 1, persons: 1 }],
  });
  check("home/smb mock line keeps package_id as check_code", item.check_code === "blue", item);
  check("home/smb mock line is an SMB package_type", item.package_type === "SMB", item);
}
