"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AccountEmpty } from "@/components/account/AccountEmpty";
import { useAuth } from "@/components/auth/AuthProvider";
import { SessionExpired } from "@/lib/auth/expired";
import {
  finishMockPayment,
  getCartDetails,
  paymentCallback,
  paymentInitCartIds,
  removeCartItem,
} from "@/lib/cart/client";
import { cartPayCurrency, deriveCartPaymentMeta, isPaymentCallbackSuccess, isPaymentInitResponse } from "@/lib/cart/payment";
import { extractCurrencyPrefix, formatMoney } from "@/lib/cart/price";
import { openRazorpayCheckout } from "@/lib/cart/razorpay";
import type { CartItem } from "@/lib/cart/types";
import type { AccountCopy } from "@/lib/copy/account";
import { localise } from "@/lib/i18n/href";

export function CartView({ locale, t }: { locale: string; t: AccountCopy["cart"] }) {
  const router = useRouter();
  const { user, refreshSession } = useAuth();
  const [items, setItems] = useState<CartItem[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getCartDetails()
      .then((res) => setItems(res.data ?? []))
      .catch((e) => {
        if (e instanceof SessionExpired) refreshSession();
        else setItems([]);
      });
  }, [refreshSession]);

  async function remove(uuid: string) {
    if (!window.confirm(t.removeConfirm)) return;
    setBusy(uuid);
    try {
      await removeCartItem(uuid);
      setItems((cur) => (cur ?? []).filter((item) => item.uuid !== uuid));
    } finally {
      setBusy(null);
    }
  }

  async function checkout() {
    if (!items?.length) return;
    const { cartIds, isCartPayment } = deriveCartPaymentMeta(items);
    if (!cartIds.length) {
      setError(t.errors.paymentInit);
      return;
    }
    const currency = cartPayCurrency(items);
    setPaying(true);
    setError(null);
    try {
      const res = await paymentInitCartIds(cartIds, isCartPayment, currency);
      if (!isPaymentInitResponse(res)) {
        setError(res.message ?? t.errors.paymentInit);
        setPaying(false);
        return;
      }

      if (res.mock) {
        const cb = finishMockPayment();
        if (isPaymentCallbackSuccess(cb)) {
          router.replace(localise("/orders", locale));
          return;
        }
        setError(cb.message ?? t.errors.mockPayment);
        setPaying(false);
        return;
      }

      const data = res.data;
      await openRazorpayCheckout({
        key: data.merchant_key,
        amount: Math.round(data.payable_amount * 100),
        currency,
        name: "HelloVerify India Pvt Ltd",
        description: "Verification order",
        order_id: data.order_id,
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.mobile_num ?? user?.phone,
        },
        onSuccess: async (payload) => {
          try {
            const cb = await paymentCallback(payload);
            if (isPaymentCallbackSuccess(cb)) {
              router.replace(localise("/orders", locale));
              return;
            }
            setError(cb.message ?? t.errors.paymentVerify);
            setPaying(false);
          } catch (e) {
            setError(e instanceof Error ? e.message : t.errors.paymentCallback);
            setPaying(false);
          }
        },
        onDismiss: () => {
          setPaying(false);
          setError(t.errors.paymentIncomplete);
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : t.errors.paymentInit);
      setPaying(false);
    }
  }

  if (items === null) return <p className="ac-status">{t.loading}</p>;
  if (items.length === 0) {
    return (
      <AccountEmpty locale={locale} title={t.emptyTitle} body={t.emptyBody} cta={t.continueShopping} />
    );
  }

  const prefix = extractCurrencyPrefix(items.some((item) => item.currency === "USD") ? "$" : "₹");
  const total = items.reduce((sum, item) => {
    const qty = item.persons ?? item.unit_count ?? 1;
    return sum + (item.total_amount ?? (item.price ?? 0) * qty);
  }, 0);

  return (
    <div className="ac-cart-wrap">
      <ul className="ac-cart">
        {items.map((item) => {
          const name = item.check_name ?? item.package ?? t.items;
          const qty = item.persons ?? item.unit_count ?? 1;
          const unitPrefix = extractCurrencyPrefix(item.currency === "USD" ? "$" : "₹");
          const unit = item.price ?? 0;
          const lineTotal = item.total_amount ?? unit * qty;
          return (
            <li key={item.uuid ?? name} className="ac-line">
              <div>
                <h2>{name}</h2>
                <p>
                  {qty} {qty === 1 ? t.person : t.people}
                  {unit ? ` · ${formatMoney(unit, unitPrefix)}` : ""}
                </p>
              </div>
              <div className="ac-line-pay">
                <strong>{formatMoney(lineTotal, unitPrefix)}</strong>
                {item.uuid ? (
                  <button
                    type="button"
                    className="btn btn-line btn-sm"
                    disabled={busy === item.uuid || paying}
                    onClick={() => void remove(item.uuid!)}
                  >
                    {t.remove}
                  </button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
      <aside className="ac-summary">
        <h2>{t.orderSummary}</h2>
        <p>
          <span>{t.total}</span>
          <strong>{formatMoney(total, prefix)}</strong>
        </p>
        <button type="button" className="btn btn-ink" disabled={paying} onClick={() => void checkout()}>
          {paying ? t.processing : t.checkout}
        </button>
        {error ? (
          <p className="ac-msg" role="alert">
            {error}
          </p>
        ) : null}
      </aside>
    </div>
  );
}
