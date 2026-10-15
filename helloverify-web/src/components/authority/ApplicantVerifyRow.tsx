"use client";

import type { ReactNode } from "react";

import { normalizeOtp } from "@/lib/authority/validate";
import type { AuthorityCopy } from "@/lib/copy/authority";

/** One contact the applicant proves they own: enter it, receive a code,
 *  enter the code. `children` are the step-one inputs. */
export function ApplicantVerifyRow({
  t,
  label,
  htmlFor,
  value,
  verified,
  sent,
  otp,
  onOtp,
  onSend,
  onVerify,
  onChange,
  changeLabel,
  loading,
  children,
}: {
  t: AuthorityCopy["dialog"];
  label: string;
  htmlFor: string;
  /** What the code was sent to, as shown once it has been. */
  value: string;
  verified: boolean;
  sent: boolean;
  otp: string;
  onOtp: (otp: string) => void;
  onSend: () => void;
  onVerify: () => void;
  onChange: () => void;
  changeLabel: string;
  loading: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <label className="lg-label" htmlFor={htmlFor}>
        {label}
      </label>
      {verified ? (
        <p className="lg-sent">
          {value} <strong>{t.verified}</strong>
        </p>
      ) : sent ? (
        <div className="lg-inline">
          <input className="inp lg-input" value={value} disabled />
          <input className="inp lg-input" inputMode="numeric" maxLength={6} value={otp} placeholder={t.otpPlaceholder} onChange={(e) => onOtp(normalizeOtp(e.target.value))} aria-label={t.otp} />
          <button type="button" className="btn btn-ink btn-sm" disabled={loading} onClick={onVerify}>
            {t.verify}
          </button>
          <button type="button" className="lg-edit" onClick={onChange}>
            {changeLabel}
          </button>
        </div>
      ) : (
        <div className="lg-inline">
          {children}
          <button type="button" className="btn btn-ink btn-sm" disabled={loading} onClick={onSend}>
            {t.sendOtp}
          </button>
        </div>
      )}
    </>
  );
}
