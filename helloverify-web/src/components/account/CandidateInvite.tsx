"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { AccountCopy } from "@/lib/copy/account";
import { sendCandidateInvite, sendSmbInvite } from "@/lib/orders/client";
import { isSmbInviteSuccess } from "@/lib/orders/lines";
import { persistCandidateRoute, readCandidateRoute } from "@/lib/orders/route";
import { localise } from "@/lib/i18n/href";

export function CandidateInvite({
  locale,
  kind,
  t,
}: {
  locale: string;
  kind: "smb" | "travel";
  t: AccountCopy["candidate"];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const stored = readCandidateRoute();
  const orderId = params.get("order_id") ?? stored.order_id ?? "";
  const userCartId = params.get("user_cart_id") ?? stored.user_cart_id ?? "";
  const packageId = params.get("check_code") ?? params.get("package_id") ?? stored.package_id ?? "";
  const memberId = params.get("member_id") ?? stored.member_id ?? "1";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    persistCandidateRoute({
      order_id: orderId,
      user_cart_id: userCartId,
      package_id: packageId,
      member_id: memberId,
    });
  }, [orderId, userCartId, packageId, memberId]);

  const ready = Boolean(orderId && userCartId && (kind === "travel" || packageId));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!firstName.trim() || !lastName.trim() || !emailOk || !/^\d{10}$/.test(mobile) || !ready) {
      setError(t.errors.fields);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const memberIndex = Number(memberId);
      const res =
        kind === "smb"
          ? await sendSmbInvite({
              uuid: userCartId,
              package_id: packageId,
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              email: email.trim(),
              mobile_number: mobile,
              ...(Number.isFinite(memberIndex) ? { member_index: memberIndex } : {}),
            })
          : await sendCandidateInvite({
              order_id: orderId,
              user_cart_id: userCartId,
              member_index: Number.isFinite(memberIndex) ? memberIndex : 1,
              candidate_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
              candidate_email: email.trim(),
              candidate_mobile: mobile,
            });
      if (kind === "smb" ? isSmbInviteSuccess(res) : res.status === true) {
        setSuccess(true);
        window.setTimeout(() => {
          const q = new URLSearchParams({ order_id: orderId, user_cart_id: userCartId });
          router.replace(`${localise("/orders", locale)}?${q.toString()}`);
        }, 1600);
      } else {
        setError(res.message ?? t.errors.invite);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errors.invite);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ac-invite">
      <a href={localise("/orders", locale)} className="btn btn-line btn-sm">
        {t.backToOrders}
      </a>
      {!ready ? (
        <p className="ac-status">{t.missing}</p>
      ) : success ? (
        <p className="ac-msg" role="status">
          {t.success}
        </p>
      ) : (
        <form className="ac-form" onSubmit={(e) => void submit(e)}>
          <h2>{t.detailsTitle}</h2>
          <div className="ac-row">
            <label className="ac-field">
              {t.firstNameLabel}
              <input className="inp" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={t.firstNamePlaceholder} />
            </label>
            <label className="ac-field">
              {t.lastNameLabel}
              <input className="inp" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={t.lastNamePlaceholder} />
            </label>
          </div>
          <div className="ac-row">
            <label className="ac-field">
              {t.mobileLabel}
              <input
                className="inp"
                inputMode="numeric"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder={t.mobilePlaceholder}
              />
            </label>
            <label className="ac-field">
              {t.emailLabel}
              <input className="inp" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.emailPlaceholder} />
            </label>
          </div>
          <button type="submit" className="btn btn-ink" disabled={loading}>
            {loading ? t.sending : t.sendInvite}
          </button>
          {error ? (
            <p className="ac-msg" role="alert">
              {error}
            </p>
          ) : null}
        </form>
      )}
    </div>
  );
}
