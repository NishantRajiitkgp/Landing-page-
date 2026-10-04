"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

import { sendOtp, saveLoginUserDetail, verifyOtp } from "@/lib/auth/client";
import { readSession } from "@/lib/auth/storage";
import { isEmail, isName } from "@/lib/auth/validate";
import type { TravelUser } from "@/lib/auth/types";
import type { ChromeCopy } from "@/lib/copy/chrome";
import { localise } from "@/lib/i18n/href";

import { useAuth } from "./AuthProvider";

type LoginCopy = ChromeCopy["login"];
type Step = 1 | 2 | 3 | 4;

function prefill(user: TravelUser) {
  return {
    name: user.name ?? "",
    email: user.email ?? "",
    gender: user.gender ?? "",
  };
}

export function LoginDialog({ t, locale }: { t: LoginCopy; locale: string }) {
  const {
    loginOpen,
    closeLogin,
    setUser,
    logout,
    refreshSession,
    loginRedirect,
    pendingCheckout,
    openCheckout,
  } = useAuth();

  const [step, setStep] = useState<Step>(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [countdown, setCountdown] = useState(90);
  const [otpValid, setOtpValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserToken, setCurrentUserToken] = useState("");
  const [showMockHint, setShowMockHint] = useState(false);
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [successVisible, setSuccessVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const firstField = useRef<HTMLInputElement | null>(null);
  const keepSession = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetOtpFields = useCallback(() => {
    setOtp(Array(6).fill(""));
    setOtpValid(true);
  }, []);

  const reset = useCallback(() => {
    setStep(1);
    setMobile("");
    resetOtpFields();
    setCountdown(90);
    setError(null);
    setCurrentUserToken("");
    setShowMockHint(false);
    setGender("");
    setName("");
    setEmail("");
    setSuccessVisible(false);
    setSuccessMessage("");
    keepSession.current = false;
    clearTimer();
  }, [clearTimer, resetOtpFields]);

  const dismiss = useCallback(() => {
    const keep = keepSession.current;
    closeLogin();
    if (!keep) logout();
  }, [closeLogin, logout]);

  useEffect(() => {
    if (!loginOpen) reset();
  }, [loginOpen, reset]);

  useEffect(() => {
    if (!loginOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [loginOpen, dismiss]);

  useEffect(() => {
    if (!loginOpen) return;
    const id = window.setTimeout(() => firstField.current?.focus(), 20);
    return () => window.clearTimeout(id);
  }, [loginOpen, step]);

  const startCountdown = useCallback(() => {
    clearTimer();
    setCountdown(90);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearTimer();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }, [clearTimer]);

  const afterLogin = useCallback(() => {
    closeLogin();
    if (pendingCheckout) {
      openCheckout(pendingCheckout);
      return;
    }
    window.location.assign(localise(`/${loginRedirect}`, locale));
  }, [closeLogin, pendingCheckout, openCheckout, loginRedirect, locale]);

  const finishSuccess = useCallback(
    (message: string) => {
      keepSession.current = true;
      setSuccessMessage(message);
      setSuccessVisible(true);
      setStep(4);
      refreshSession();
      window.setTimeout(() => afterLogin(), 1000);
    },
    [afterLogin, refreshSession],
  );

  const requestOtp = async () => {
    if (!/^\d{10}$/.test(mobile)) {
      setError(t.errors.mobileDigits);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await sendOtp(mobile);
      if (res?.status === true) {
        setCurrentUserToken(res.data?.user ?? "");
        setShowMockHint(res.mock === true);
        setStep(2);
        resetOtpFields();
        startCountdown();
      } else {
        setError(res?.message ?? t.errors.sendOtp);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t.errors.sendOtp);
    } finally {
      setLoading(false);
    }
  };

  const previousStep = () => {
    clearTimer();
    resetOtpFields();
    setCountdown(90);
    setStep(1);
    setError(null);
  };

  const submitOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setError(t.errors.otpDigits);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await verifyOtp(currentUserToken, code);
      if (res?.status === true && res.data?.user) {
        setOtpValid(true);
        clearTimer();
        const session = readSession();
        if (session) setUser(session);
        else setUser({ user: res.data.user });
        refreshSession();

        const user = res.data.user;
        const filled = prefill(user);
        if (!user.name && !user.email) {
          setName(filled.name);
          setEmail(filled.email);
          if (filled.gender) setGender(filled.gender);
          setStep(3);
        } else {
          if (filled.name) setName(filled.name);
          if (filled.email) setEmail(filled.email);
          if (filled.gender) setGender(filled.gender);
          finishSuccess(t.success);
        }
      } else {
        setOtpValid(false);
        if (countdown > 0) resetOtpFields();
        setError(res?.message ?? t.otpInvalid);
      }
    } catch (e) {
      setOtpValid(false);
      if (countdown > 0) resetOtpFields();
      setError(e instanceof Error ? e.message : t.otpInvalid);
    } finally {
      setLoading(false);
    }
  };

  const completeRegistration = async () => {
    const trimmedName = name.trim();
    if (!isName(trimmedName)) {
      setError(t.errors.nameInvalid);
      return;
    }
    if (!isEmail(email) || !gender) {
      setError(t.errors.requiredFields);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await saveLoginUserDetail({
        name: trimmedName,
        email: email.trim(),
        mobile_num: mobile,
        gender,
      });
      if (res?.status === true && res.data) {
        setUser({ user: res.data });
        refreshSession();
        finishSuccess(t.accountCreatedSuccess);
      } else {
        setError(res?.message ?? t.errors.saveProfile);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t.errors.saveProfile);
    } finally {
      setLoading(false);
    }
  };

  const moveOtpFocus = (index: number, value: string, event: KeyboardEvent<HTMLInputElement>) => {
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (event.key === "Backspace" && !value && index > 0) otpRefs.current[index - 1]?.focus();
  };

  if (!loginOpen) return null;

  const otpInputsDisabled = countdown === 0;
  const otpComplete = otp.join("").length === 6;
  const otpTimerLabel = `${String(Math.floor(countdown / 60)).padStart(2, "0")}:${String(countdown % 60).padStart(2, "0")}`;
  const mobileDisplay = /^\d{10}$/.test(mobile) ? `+91 ${mobile}` : mobile;

  return (
    <div
      className="lg-scrim"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <div
        className="lg-panel"
        role="dialog"
        aria-modal="true"
        aria-label={t.ariaLabel}
      >
        {!successVisible ? (
          <>
            {step === 1 ? (
              <form
                className="lg-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  void requestOtp();
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
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
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
            ) : null}

            {step === 2 ? (
              <form
                className="lg-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  void submitOtp();
                }}
              >
                <h2 className="lg-title">{t.verifyTitle}</h2>
                {showMockHint ? <p className="lg-hint">{t.mockHint}</p> : null}
                <p className="lg-sent">
                  {t.otpSentTo}{" "}
                  <strong>{mobileDisplay}</strong>
                  <button type="button" className="lg-edit" onClick={previousStep}>
                    {t.edit}
                  </button>
                </p>
                <div className="lg-otp" role="group" aria-label={t.verifyTitle}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpRefs.current[i] = el;
                        if (i === 0) firstField.current = el;
                      }}
                      className={`inp lg-otp-in${digit ? " is-filled" : ""}`}
                      type="text"
                      inputMode="numeric"
                      autoComplete={i === 0 ? "one-time-code" : "off"}
                      maxLength={1}
                      disabled={otpInputsDisabled}
                      value={digit}
                      aria-label={`${t.verifyTitle} ${i + 1}`}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(-1);
                        const next = [...otp];
                        next[i] = v;
                        setOtp(next);
                        setOtpValid(true);
                        if (v && i < 5) otpRefs.current[i + 1]?.focus();
                      }}
                      onKeyDown={(e) => moveOtpFocus(i, digit, e)}
                      onPaste={(e) => {
                        if (i !== 0) return;
                        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                        if (!pasted) return;
                        e.preventDefault();
                        setOtp(Array.from({ length: 6 }, (_, idx) => pasted[idx] ?? ""));
                        setOtpValid(true);
                        otpRefs.current[Math.min(pasted.length, 5)]?.focus();
                      }}
                    />
                  ))}
                </div>
                {countdown > 0 ? (
                  <p className="lg-timer" aria-live="polite">
                    {otpTimerLabel}
                  </p>
                ) : (
                  <button type="button" className="lg-edit" onClick={() => void requestOtp()}>
                    {t.resendOtp}
                  </button>
                )}
                <button
                  type="submit"
                  className="btn btn-ink btn-sm lg-btn"
                  disabled={!otpComplete || loading || otpInputsDisabled}
                >
                  {loading ? t.verifying : t.verifyOtp}
                </button>
                {!otpValid ? <p className="lg-err">{t.otpInvalid}</p> : null}
                {error ? <p className="lg-err">{error}</p> : null}
              </form>
            ) : null}

            {step === 3 ? (
              <form
                className="lg-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  void completeRegistration();
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
                  onChange={(e) => setName(e.target.value)}
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
                  onChange={(e) => setEmail(e.target.value)}
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
                      onClick={() => setGender(g)}
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
            ) : null}
          </>
        ) : (
          <div className="lg-form">
            <h2 className="lg-title">{successMessage || t.success}</h2>
            <button type="button" className="btn btn-ink btn-sm lg-btn" onClick={afterLogin}>
              {t.close}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
