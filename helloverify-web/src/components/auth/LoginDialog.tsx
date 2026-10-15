"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { sendOtp, saveLoginUserDetail, verifyOtp } from "@/lib/auth/client";
import { readSession } from "@/lib/auth/storage";
import { isEmail, isName } from "@/lib/auth/validate";
import type { TravelUser } from "@/lib/auth/types";
import type { ChromeCopy } from "@/lib/copy/chrome";
import { localise } from "@/lib/i18n/href";

import { useAuth } from "./AuthProvider";
import { MobileStep, OtpStep, RegisterStep } from "./LoginSteps";

type LoginCopy = ChromeCopy["login"];
type Step = 1 | 2 | 3 | 4;

function prefill(user: TravelUser) {
  return { name: user.name ?? "", email: user.email ?? "", gender: user.gender ?? "" };
}

/** The flow mounts on open and unmounts on close, so every visit starts from
 *  step 1 with no state carried over. */
export function LoginDialog({ t, locale }: { t: LoginCopy; locale: string }) {
  const { loginOpen } = useAuth();
  return loginOpen ? <LoginFlow t={t} locale={locale} /> : null;
}

function LoginFlow({ t, locale }: { t: LoginCopy; locale: string }) {
  const { closeLogin, setUser, logout, refreshSession, loginRedirect, pendingCheckout, openCheckout } =
    useAuth();

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
  const firstField = useRef<HTMLInputElement | null>(null);
  const keepSession = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const resetOtpFields = useCallback(() => {
    setOtp(Array(6).fill(""));
    setOtpValid(true);
  }, []);

  const dismiss = useCallback(() => {
    const keep = keepSession.current;
    closeLogin();
    if (!keep) logout();
  }, [closeLogin, logout]);

  useEffect(() => {
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
  }, [dismiss]);

  useEffect(() => {
    const id = window.setTimeout(() => firstField.current?.focus(), 20);
    return () => window.clearTimeout(id);
  }, [step]);

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

  return (
    <div
      className="lg-scrim"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <div className="lg-panel" role="dialog" aria-modal="true" aria-label={t.ariaLabel}>
        {successVisible ? (
          <div className="lg-form">
            <h2 className="lg-title">{successMessage || t.success}</h2>
            <button type="button" className="btn btn-ink btn-sm lg-btn" onClick={afterLogin}>
              {t.close}
            </button>
          </div>
        ) : step === 1 ? (
          <MobileStep
            t={t}
            mobile={mobile}
            onMobile={setMobile}
            loading={loading}
            error={error}
            firstField={firstField}
            onSubmit={() => void requestOtp()}
          />
        ) : step === 2 ? (
          <OtpStep
            t={t}
            mobile={mobile}
            showMockHint={showMockHint}
            otp={otp}
            onOtp={(next) => {
              setOtp(next);
              setOtpValid(true);
            }}
            otpValid={otpValid}
            countdown={countdown}
            loading={loading}
            error={error}
            firstField={firstField}
            onEdit={previousStep}
            onResend={() => void requestOtp()}
            onSubmit={() => void submitOtp()}
          />
        ) : step === 3 ? (
          <RegisterStep
            t={t}
            name={name}
            onName={setName}
            email={email}
            onEmail={setEmail}
            mobile={mobile}
            gender={gender}
            onGender={setGender}
            loading={loading}
            error={error}
            firstField={firstField}
            onSubmit={() => void completeRegistration()}
          />
        ) : null}
      </div>
    </div>
  );
}
