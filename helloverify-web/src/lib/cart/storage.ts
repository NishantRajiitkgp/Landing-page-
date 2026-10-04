/** Mock cart + orders live in sessionStorage — the travel API is stateless on this host. */

import type { OrderCartItem, OrderRow } from "@/lib/orders/types";

import type { CartItem } from "./types";

export const CART_KEY = "mockCart";
export const ORDERS_KEY = "mockOrders";

function store(): Storage | null {
  try {
    if (typeof sessionStorage === "undefined") return null;
    return sessionStorage;
  } catch {
    return null;
  }
}

export function readMockCart(): CartItem[] {
  const raw = store()?.getItem(CART_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function writeMockCart(items: CartItem[]): void {
  store()?.setItem(CART_KEY, JSON.stringify(items));
}

export function appendMockCart(item: CartItem): CartItem[] {
  const next = [...readMockCart(), item];
  writeMockCart(next);
  return next;
}

export function removeMockCartItem(uuid: string): CartItem[] {
  const next = readMockCart().filter((item) => item.uuid !== uuid);
  writeMockCart(next);
  return next;
}

function cartItemToOrderLine(item: CartItem): OrderCartItem {
  const persons = Number(item.persons ?? item.unit_count ?? 1) || 1;
  const unitPrice =
    Number(item.price ?? 0) ||
    (persons > 0 ? Number(item.total_amount ?? 0) / persons : Number(item.total_amount ?? 0));
  const packageType = String(item.package_type ?? "SMB").toLowerCase();
  const isTravel = packageType === "ai_travel_assistance";

  return {
    uuid: item.uuid,
    check_name: item.check_name ?? item.package ?? "Verification",
    package: item.package,
    check_code: isTravel ? undefined : item.check_code,
    package_type: isTravel ? "ai_travel_assistance" : (item.package_type ?? "SMB"),
    visa: item.visa ?? "",
    persons,
    unit_count: persons,
    quantity: persons,
    price: unitPrice || Number(item.total_amount ?? 0),
    total_amount: item.total_amount,
    currency: item.currency ?? "INR",
    case_ids: Array.from({ length: persons }, () => null),
    personStatuses: Array.from({ length: persons }, () => ({
      status: "Pending",
      status_code: "PENDING",
    })),
  };
}

export function readMockOrders(): OrderRow[] {
  const raw = store()?.getItem(ORDERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as OrderRow[]) : [];
  } catch {
    return [];
  }
}

export function writeMockOrders(orders: OrderRow[]): void {
  store()?.setItem(ORDERS_KEY, JSON.stringify(orders));
}

/** Skips Razorpay UI — call from cart when the pay-init response is mock. */
export function completeMockPayment(): { status: true; success: true; message: string } {
  const cart = readMockCart();
  const orders = readMockOrders();
  const orderId = `ORD-MOCK-${Date.now()}`;
  const lines = cart.map(cartItemToOrderLine);
  const user_card = lines.filter((l) => String(l.package_type).toLowerCase() === "ai_travel_assistance");
  const cart_items = lines.filter((l) => String(l.package_type).toLowerCase() !== "ai_travel_assistance");
  orders.unshift({
    order_id: orderId,
    created_at: new Date().toISOString(),
    amount: cart.reduce((sum, item) => sum + Number(item.total_amount ?? 0), 0),
    cart_items,
    user_card,
  });
  writeMockOrders(orders);
  writeMockCart([]);
  return { status: true, success: true, message: "Payment completed (mock)" };
}

export function applyMockSmbInvite(payload: {
  uuid: string;
  member_index?: number;
}): { case_id: string } {
  const orders = readMockOrders();
  const caseId = `CASE-${Date.now()}`;
  const idx = Math.max(0, (payload.member_index ?? 1) - 1);
  for (const order of orders) {
    const items = [...(order.cart_items ?? []), ...(order.user_card ?? [])];
    const line = items.find((item) => item.uuid === payload.uuid);
    if (!line) continue;
    if (!line.case_ids) line.case_ids = [];
    while (line.case_ids.length <= idx) line.case_ids.push(null);
    line.case_ids[idx] = caseId;
    if (!line.personStatuses) line.personStatuses = [];
    line.personStatuses[idx] = { status: "Work in progress", status_code: "INIT" };
  }
  writeMockOrders(orders);
  return { case_id: caseId };
}

export function applyMockTravelInvite(payload: {
  order_id: string;
  user_cart_id: string;
  member_index: number;
}): { case_id: string } {
  const orders = readMockOrders();
  const idx = Math.max(0, payload.member_index - 1);
  const caseId = `CASE-${Date.now()}-${idx}`;
  const order = orders.find((row) => row.order_id === payload.order_id);
  const items = [...(order?.user_card ?? []), ...(order?.cart_items ?? [])];
  const line = items.find((item) => item.uuid === payload.user_cart_id);
  if (line) {
    if (!line.case_ids) line.case_ids = [];
    while (line.case_ids.length <= idx) line.case_ids.push(null);
    line.case_ids[idx] = caseId;
    if (!line.personStatuses) line.personStatuses = [];
    line.personStatuses[idx] = { status: "Work in progress", status_code: "INIT" };
  }
  writeMockOrders(orders);
  return { case_id: caseId };
}
