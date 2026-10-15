"use client";

import { useEffect, useState } from "react";

import { AccountEmpty } from "@/components/account/AccountEmpty";
import { useAuth } from "@/components/auth/AuthProvider";
import { SessionExpired } from "@/lib/auth/expired";
import { extractCurrencyPrefix, formatMoney } from "@/lib/cart/price";
import type { AccountCopy } from "@/lib/copy/account";
import { localise } from "@/lib/i18n/href";
import { getOrderList } from "@/lib/orders/client";
import { getOrderDisplayLines, isTravelLine, linePersonCount } from "@/lib/orders/lines";
import { persistCandidateRoute } from "@/lib/orders/route";
import type { OrderRow } from "@/lib/orders/types";

export function OrdersView({ locale, t }: { locale: string; t: AccountCopy["orders"] }) {
  const { refreshSession } = useAuth();
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getOrderList()
      .then((res) => setOrders(res.data ?? []))
      .catch((e) => {
        if (e instanceof SessionExpired) {
          refreshSession();
          return;
        }
        setOrders([]);
        setError(t.errors.load);
      });
  }, [refreshSession, t.errors.load]);

  if (orders === null) return <p className="ac-status">{t.loading}</p>;
  if (orders.length === 0) {
    return (
      <>
        <AccountEmpty locale={locale} title={t.emptyTitle} body={t.emptyBody} cta={t.continueShopping} />
        {error ? (
          <p className="ac-msg" role="alert">
            {error}
          </p>
        ) : null}
      </>
    );
  }

  return (
    <div className="ac-orders">
      {orders.map((order) => {
        const lines = getOrderDisplayLines(order);
        const prefix = extractCurrencyPrefix(
          lines.some((line) => line.currency === "USD") ? "$" : "₹",
        );
        return (
          <article key={order.order_id ?? order.created_at} className="ac-order">
            <header className="ac-order-meta">
              <p>
                {t.orderId} <strong>{order.order_id ?? "—"}</strong>
              </p>
              <p>
                {t.total} <strong>{formatMoney(Number(order.amount ?? 0), prefix)}</strong>
              </p>
            </header>
            <ul className="ac-cart">
              {lines.map((line) => {
                const name = line.check_name ?? line.package ?? t.packageFallback;
                const qty = linePersonCount(line);
                const travel = isTravelLine(line);
                const hrefBase = travel ? "/orders/candidate" : "/orders/smb-candidates";
                return (
                  <li key={line.uuid ?? name} className="ac-line">
                    <div>
                      <h2>{name}</h2>
                      <p>
                        {qty} {qty === 1 ? t.person : t.people}
                      </p>
                    </div>
                    <div className="ac-line-pay">
                      {Array.from({ length: qty }, (_, i) => {
                        const caseId = line.case_ids?.[i];
                        if (caseId) {
                          return (
                            <p key={`${line.uuid}-${i}`}>
                              {caseId}
                            </p>
                          );
                        }
                        if (!order.order_id || !line.uuid) return null;
                        const memberId = String(i + 1);
                        const q = new URLSearchParams({
                          order_id: order.order_id,
                          user_cart_id: line.uuid,
                          member_id: memberId,
                        });
                        if (!travel && line.check_code) {
                          q.set("check_code", line.check_code);
                          q.set("package_id", line.check_code);
                        }
                        return (
                          <a
                            key={`${line.uuid}-${i}`}
                            href={localise(`${hrefBase}?${q.toString()}`, locale)}
                            className="btn btn-line btn-sm"
                            onClick={() =>
                              persistCandidateRoute({
                                order_id: order.order_id,
                                user_cart_id: line.uuid,
                                member_id: memberId,
                                ...(line.check_code ? { package_id: line.check_code } : {}),
                              })
                            }
                          >
                            {travel ? t.addTraveler : t.addCandidate}
                          </a>
                        );
                      })}
                    </div>
                  </li>
                );
              })}
            </ul>
          </article>
        );
      })}
      {error ? (
        <p className="ac-msg" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
