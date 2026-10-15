"use client";

import { useMemo, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import type { PackageCheckoutDetails } from "@/lib/auth/types";
import { addToCart } from "@/lib/cart/client";
import { buildAddToCartPayload } from "@/lib/cart/payload";
import { resolveCheckoutPricing } from "@/lib/cart/price";
import { isAddToCartSuccess } from "@/lib/cart/success";
import type { AccountCopy } from "@/lib/copy/account";
import { localise } from "@/lib/i18n/href";

type CheckoutCopy = AccountCopy["checkout"];

function descriptionFromIncludedChecks(checks: string[]): string {
  if (checks.length === 0) return "";
  if (checks.length === 1) return `Includes ${checks[0]}.`;
  if (checks.length === 2) return `Includes ${checks[0]} and ${checks[1]}.`;
  const head = checks.slice(0, -1).join(", ");
  return `Includes ${head}, and ${checks[checks.length - 1]}.`;
}

export function CheckoutDialog({ t, locale }: { t: CheckoutCopy; locale: string }) {
  const { checkoutOpen, closeCheckout, pendingCheckout } = useAuth();
  const [persons, setPersons] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Re-seed for each package the dialog opens on. */
  const opening = checkoutOpen ? pendingCheckout : null;
  const [seededFor, setSeededFor] = useState<PackageCheckoutDetails | null>(null);
  if (opening !== seededFor) {
    setSeededFor(opening);
    if (opening) {
      const fromForm = Number(opening.addToCartBody?.initial_unit_count);
      setPersons(fromForm > 0 ? fromForm : 1);
      setError(null);
    }
  }

  const pricing = useMemo(
    () =>
      resolveCheckoutPricing(
        { priceDisplay: pendingCheckout?.priceDisplay, unitAmount: pendingCheckout?.unitAmount },
        persons,
        t.priceAtCheckout,
      ),
    [pendingCheckout?.priceDisplay, pendingCheckout?.unitAmount, persons, t.priceAtCheckout],
  );

  if (!checkoutOpen || !pendingCheckout) return null;

  const includedChecks = (pendingCheckout.includedChecks ?? []).map((c) => c.trim()).filter(Boolean);
  const detailDescription =
    pendingCheckout.description?.trim() || descriptionFromIncludedChecks(includedChecks);

  async function proceed() {
    if (!pendingCheckout) return;
    setLoading(true);
    setError(null);
    try {
      const body = buildAddToCartPayload(pendingCheckout, persons);
      const res = await addToCart(body);
      if (isAddToCartSuccess(res)) {
        closeCheckout();
        window.location.assign(localise("/cart", locale));
      } else {
        setError(res?.message ?? t.couldNotAdd);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t.couldNotAdd);
    } finally {
      setLoading(false);
    }
  }

  const peopleLabel = `${persons} ${persons === 1 ? t.person : t.people}`;

  return (
    <div
      className="lg-scrim"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeCheckout();
      }}
    >
      <div className="lg-panel ck-panel" role="dialog" aria-modal="true" aria-label={t.ariaLabel}>
        <h2 className="lg-title">{pendingCheckout.packageName}</h2>
        {detailDescription ? (
          <section className="ck-block">
            <h3>{t.detailDescriptionLabel}</h3>
            <p>{detailDescription}</p>
          </section>
        ) : null}
        {includedChecks.length > 0 ? (
          <section className="ck-block">
            <h3>{t.checksIncludeLabel}</h3>
            <ul className="ck-checks">
              {includedChecks.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </section>
        ) : null}
        <section className="ck-qty">
          <div>
            {pricing.unitDisplay ? (
              <p className="ck-unit">
                {pricing.unitDisplay}
                {persons > 1 ? <span> × {persons}</span> : null}
              </p>
            ) : (
              <p className="ck-unit ck-fallback">{t.priceAtCheckout}</p>
            )}
          </div>
          <div className="ck-stepper">
            <button
              type="button"
              aria-label={t.decreasePeople}
              disabled={persons <= 1}
              onClick={() => setPersons((p) => Math.max(1, p - 1))}
            >
              −
            </button>
            <span>{peopleLabel}</span>
            <button
              type="button"
              aria-label={t.increasePeople}
              onClick={() => setPersons((p) => Math.min(99, p + 1))}
            >
              +
            </button>
          </div>
        </section>
        <section className="ck-block">
          <h3>{t.priceDetails}</h3>
          <p className="ck-row">
            <span>{t.basePrice}</span>
            <span>{pricing.basePriceDisplay}</span>
          </p>
          <p className="ck-row ck-total">
            <span>{t.total}</span>
            <span>{pricing.totalDisplay}</span>
          </p>
        </section>
        <button
          type="button"
          className="btn btn-ink btn-sm lg-btn"
          disabled={loading}
          onClick={() => void proceed()}
        >
          {loading ? t.adding : t.addToCart}
        </button>
        {error ? <p className="lg-err">{error}</p> : null}
      </div>
    </div>
  );
}
