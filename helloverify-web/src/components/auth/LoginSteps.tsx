"use client";

import type { KeyboardEvent, RefObject } from "react";

import { isEmail, isName } from "@/lib/auth/validate";
import type { ChromeCopy } from "@/lib/copy/chrome";

type LoginCopy = ChromeCopy["login"];
type FieldRef = RefObject<HTMLInputElement | null>;

export function MobileStep({
  t,
  mobile,
  onMobile,
  loading,
  error,
  firstField,
  onSubmit,
}: {
  t: LoginCopy;
  mobile: string;
  onMobile: (value: string) => void;
  loading: boolean;
  error: string | null;
  firstField: FieldRef;
  onSubmit: () => void;
}) {
  return (
    <form
      className="lg-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <h2 className="lg-title">{t.title}</h2>
      <p className="lg-sub">
        {t.welcome} {t.brand}
      </p>
      <label className="lg-label" htmlFor="login-mobile">
        {t.mobileLabel}
      </label>
      <input
        ref={firstField}
        id="login-mobile"
        className="inp lg-input"
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        maxLength={10}
        value={mobile}
        onChange={(e) => onMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
        placeholder={t.mobilePlaceholder}
      />
      <button
        type="submit"
        className="btn btn-ink btn-sm lg-btn"
        disabled={mobile.length !== 10 || loading}
      >
        {loading ? t.pleaseWait : t.loginViaOtp}
      </button>
      {error ? <p className="lg-err">{error}</p> : null}
    </form>
  );
}

export function OtpStep({
  t,
  mobile,
  showMockHint,
  otp,
  onOtp,
  otpValid,
  countdown,
  loading,
  error,
  firstField,
  onEdit,
  onResend,
  onSubmit,
}: {
  t: LoginCopy;
  mobile: string;
  showMockHint: boolean;
  otp: string[];
  /** Any edit clears the invalid-code message. */
  onOtp: (next: string[]) => void;
  otpValid: boolean;
  countdown: number;
  loading: boolean;
  error: string | null;
  firstField: FieldRef;
  onEdit: () => void;
  onResend: () => void;
  onSubmit: () => void;
}) {
  const inputs: Array<HTMLInputElement | null> = [];
  const disabled = countdown === 0;
  const complete = otp.join("").length === 6;
  const timer = `${String(Math.floor(countdown / 60)).padStart(2, "0")}:${String(countdown % 60).padStart(2, "0")}`;
  const mobileDisplay = /^\d{10}$/.test(mobile) ? `+91 ${mobile}` : mobile;

  const moveFocus = (index: number, value: string, event: KeyboardEvent<HTMLInputElement>) => {
    if (value && index < 5) inputs[index + 1]?.focus();
    if (event.key === "Backspace" && !value && index > 0) inputs[index - 1]?.focus();
  };

  return (
    <form
      className="lg-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <h2 className="lg-title">{t.verifyTitle}</h2>
      {showMockHint ? <p className="lg-hint">{t.mockHint}</p> : null}
      <p className="lg-sent">
        {t.otpSentTo} <strong>{mobileDisplay}</strong>
        <button type="button" className="lg-edit" onClick={onEdit}>
          {t.edit}
        </button>
      </p>
      <div className="lg-otp" role="group" aria-label={t.verifyTitle}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputs[i] = el;
              if (i === 0) firstField.current = el;
            }}
            className={`inp lg-otp-in${digit ? " is-filled" : ""}`}
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            maxLength={1}
            disabled={disabled}
            value={digit}
            aria-label={`${t.verifyTitle} ${i + 1}`}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(-1);
              const next = [...otp];
              next[i] = v;
              onOtp(next);
              if (v && i < 5) inputs[i + 1]?.focus();
            }}
            onKeyDown={(e) => moveFocus(i, digit, e)}
            onPaste={(e) => {
              if (i !== 0) return;
              const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
              if (!pasted) return;
              e.preventDefault();
              onOtp(Array.from({ length: 6 }, (_, idx) => pasted[idx] ?? ""));
              inputs[Math.min(pasted.length, 5)]?.focus();
            }}
          />
        ))}
      </div>
      {countdown > 0 ? (
        <p className="lg-timer" aria-live="polite">
          {timer}
        </p>
      ) : (
        <button type="button" className="lg-edit" onClick={onResend}>
          {t.resendOtp}
        </button>
      )}
      <button
        type="submit"
        className="btn btn-ink btn-sm lg-btn"
        disabled={!complete || loading || disabled}
      >
        {loading ? t.verifying : t.verifyOtp}
      </button>
      {!otpValid ? <p className="lg-err">{t.otpInvalid}</p> : null}
      {error ? <p className="lg-err">{error}</p> : null}
    </form>
  );
}

export function RegisterStep({
  t,
  name,
  onName,
  email,
  onEmail,
  mobile,
  gender,
  onGender,
  loading,
  error,
  firstField,
  onSubmit,
}: {
  t: LoginCopy;
  name: string;
  onName: (value: string) => void;
  email: string;
  onEmail: (value: string) => void;
  mobile: string;
  gender: string;
  onGender: (value: string) => void;
  loading: boolean;
  error: string | null;
  firstField: FieldRef;
  onSubmit: () => void;
}) {
  return (
    <form
      className="lg-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <h2 className="lg-title">{t.registerTitle}</h2>
      <p className="lg-sub">
        {t.welcome} {t.brand}
      </p>
      <label className="lg-label" htmlFor="login-name">
        {t.nameLabel}
      </label>
      <input
        ref={firstField}
        id="login-name"
        className="inp lg-input"
        type="text"
        autoComplete="name"
        value={name}
        onChange={(e) => onName(e.target.value)}
      />
      <label className="lg-label" htmlFor="login-email">
        {t.emailLabel}
      </label>
      <input
        id="login-email"
        className="inp lg-input"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => onEmail(e.target.value)}
      />
      <span className="lg-label">{t.mobileNoLabel}</span>
      <input className="inp lg-input" disabled value={mobile} />
      <span className="lg-label">{t.genderLabel}</span>
      <div className="lg-genders">
        {(
          [
            ["MALE", t.genderMale],
            ["FEMALE", t.genderFemale],
            ["OTHER", t.genderOther],
          ] as const
        ).map(([g, label]) => (
          <button
            key={g}
            type="button"
            className={`lg-gender${gender === g ? " is-on" : ""}`}
            onClick={() => onGender(g)}
          >
            {label}
          </button>
        ))}
      </div>
      <button
        type="submit"
        className="btn btn-ink btn-sm lg-btn"
        disabled={loading || !isName(name) || !isEmail(email) || !gender}
      >
        {loading ? t.saving : t.registerNow}
      </button>
      {error ? <p className="lg-err">{error}</p> : null}
    </form>
  );
}
