"use client";

import { useState } from "react";

import { authorityClient } from "@/lib/authority/client";
import { getAuthorityPortal, type AuthorityId } from "@/lib/authority/portals";
import { isValidEmail, isValidOtp, normalizeEmail, normalizeOtp } from "@/lib/authority/validate";
import type { AuthorityCopy } from "@/lib/copy/authority";

type Props = {
  authority: AuthorityId;
  t: AuthorityCopy["dialog"];
  mockHint?: string;
  onClose: () => void;
  onForgot: () => void;
};

export function ApplicantLogin({ authority, t, mockHint, onClose, onForgot }: Props) {
  const portal = getAuthorityPortal(authority);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [expired, setExpired] = useState(false);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMock, setShowMock] = useState(false);

  async function send() {
    const id = normalizeEmail(email);
    if (!isValidEmail(id)) {
      setError(t.invalidEmail);
      return;
    }
    if (!password.trim()) {
      setError(t.passwordRequired);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await authorityClient.latestToken(authority, { email: id });
      if (res.status || res.is_success) {
        if (id !== email) setEmail(id);
        setOtpSent(true);
        setExpired(false);
        setTimer(300);
        setShowMock(Boolean(res.mock));
        const idn = window.setInterval(() => {
          setTimer((n) => {
            if (n <= 1) {
              window.clearInterval(idn);
              setExpired(true);
              return 0;
            }
            return n - 1;
          });
        }, 1000);
      } else {
        setError(res.message ?? t.loginFailed);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t.loginFailed);
    } finally {
      setLoading(false);
    }
  }

  async function verify() {
    const code = normalizeOtp(otp);
    if (!isValidOtp(code)) {
      setError(t.invalidOtp);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await authorityClient.loginHandoff(authority, {
        email: normalizeEmail(email),
        password,
        otp: code,
      });
      if (res.url) {
        window.open(res.url, "_blank", "noopener,noreferrer");
        onClose();
        return;
      }
      setError(res.message ?? t.loginFailed);
    } catch (e) {
      setError(e instanceof Error ? e.message : t.loginFailed);
    } finally {
      setLoading(false);
    }
  }

  if (authority === "mom") {
    return (
      <div className="lg-form">
        <h2 className="lg-title">{t.portalTitle}</h2>
        <p className="lg-sub">{t.portalSubtitle}</p>
        <p className="lg-sub">{t.portalBody}</p>
        <a
          className="btn btn-ink btn-sm lg-btn"
          href={portal.candidateOrigin}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.portalCta}
        </a>
        <button type="button" className="lg-edit" onClick={onClose}>
          {t.cancel}
        </button>
      </div>
    );
  }

  return (
    <form
      className="lg-form"
      onSubmit={(e) => {
        e.preventDefault();
        void (otpSent && !expired ? verify() : send());
      }}
    >
      <h2 className="lg-title">{t.login}</h2>
      <p className="lg-sub">{t.loginLead}</p>
      {showMock && mockHint ? <p className="lg-hint">{mockHint}</p> : null}
      <label className="lg-label" htmlFor="ap-login-email">
        {t.email}
      </label>
      <input
        id="ap-login-email"
        className="inp lg-input"
        type="email"
        autoComplete="email"
        value={email}
        disabled={otpSent}
        placeholder={t.emailPlaceholder}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label className="lg-label" htmlFor="ap-login-pass">
        {t.password}
      </label>
      <input
        id="ap-login-pass"
        className="inp lg-input"
        type="password"
        autoComplete="current-password"
        value={password}
        disabled={otpSent}
        placeholder={t.passwordPlaceholder}
        onChange={(e) => setPassword(e.target.value)}
      />
      {!otpSent ? (
        <button type="button" className="lg-edit" onClick={onForgot}>
          {t.forgotPassword}
        </button>
      ) : null}
      {otpSent ? (
        <>
          <label className="lg-label" htmlFor="ap-login-otp">
            {t.otp}
          </label>
          <input
            id="ap-login-otp"
            className="inp lg-input"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            disabled={expired}
            placeholder={t.otpPlaceholder}
            onChange={(e) => setOtp(normalizeOtp(e.target.value))}
          />
          {!expired && timer > 0 ? (
            <p className="lg-timer">
              {t.otpExpiresIn} {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
            </p>
          ) : null}
          {expired ? <p className="lg-err">{t.otpExpired}</p> : null}
        </>
      ) : null}
      <button type="submit" className="btn btn-ink btn-sm lg-btn" disabled={loading}>
        {loading ? t.pleaseWait : otpSent && !expired ? t.verifyOtp : expired ? t.resendOtp : t.loginButton}
      </button>
      {otpSent ? (
        <button
          type="button"
          className="lg-edit"
          onClick={() => {
            setOtpSent(false);
            setOtp("");
            setExpired(false);
          }}
        >
          {t.changeEmail}
        </button>
      ) : (
        <button type="button" className="lg-edit" onClick={onClose}>
          {t.cancel}
        </button>
      )}
      {error ? <p className="lg-err">{error}</p> : null}
    </form>
  );
}
