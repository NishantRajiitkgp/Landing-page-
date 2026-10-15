"use client";

import { useState } from "react";

import { authorityClient } from "@/lib/authority/client";
import { buildInvitePayload } from "@/lib/authority/invite";
import type { AuthorityId } from "@/lib/authority/portals";
import {
  isValidEmail,
  isValidOtp,
  isValidPhone,
  isValidPhoneSpan,
  normalizeEmail,
  normalizeOtp,
  normalizePhoneDigits,
} from "@/lib/authority/validate";
import type { AuthorityCopy } from "@/lib/copy/authority";

import { ApplicantPackages, useRegisterOptions } from "./ApplicantPackages";
import { ApplicantVerifyRow } from "./ApplicantVerifyRow";

type Props = {
  authority: AuthorityId;
  t: AuthorityCopy["dialog"];
  mockHint?: string;
  onClose: () => void;
  onDuplicate: () => void;
  onSuccess: () => void;
};

export function ApplicantRegister({ authority, t, mockHint, onClose, onDuplicate, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [smsOtp, setSmsOtp] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [emailOk, setEmailOk] = useState(false);
  const [phoneOk, setPhoneOk] = useState(false);
  const [showMock, setShowMock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { dial, setDial, dials, packages, pkgId, setPkgId, pkgLoading, loadPackages, selected } =
    useRegisterOptions(authority, t.loadPackagesFailed, setError);
  const fullName = `${name.trim()} ${last.trim()}`.trim();
  const phoneMax = authority === "mom" ? 15 : 10;
  const phonePlaceholder = authority === "mom" ? t.momPhonePlaceholder : t.phonePlaceholder;
  const phoneError = authority === "mom" ? t.momInvalidPhone : t.invalidPhone;
  const phoneDigits = (value: string) => normalizePhoneDigits(value, phoneMax);
  const phoneValid = (value: string) => (authority === "mom" ? isValidPhoneSpan(value, 7, 15) : isValidPhone(value));

  async function sendEmail() {
    if (!name.trim() || !last.trim()) {
      setError(t.nameRequired);
      return;
    }
    const id = normalizeEmail(email);
    if (!isValidEmail(id)) {
      setError(t.invalidEmail);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await authorityClient.sendEmailOtp(authority, { email: id, candidate_name: fullName });
      if (res.is_success || res.status) {
        setEmail(id);
        setEmailSent(true);
        setShowMock(Boolean(res.mock));
      } else if (res.data?.duplicate_found || res.message?.toLowerCase().includes("duplicate")) onDuplicate();
      else setError(res.message ?? t.sendEmailOtpFailed);
    } catch (e) {
      setError(e instanceof Error ? e.message : t.sendEmailOtpFailed);
    } finally {
      setLoading(false);
    }
  }

  async function verifyEmail() {
    const otp = normalizeOtp(emailOtp);
    if (!isValidOtp(otp)) {
      setError(t.invalidOtp);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await authorityClient.verifyOtp(authority, { email: normalizeEmail(email), otp });
      if (res.is_success || res.status) setEmailOk(true);
      else setError(res.message ?? t.invalidEmailOtp);
    } catch {
      setError(t.invalidEmailOtp);
    } finally {
      setLoading(false);
    }
  }

  async function sendSms() {
    if (!name.trim() || !last.trim()) {
      setError(t.nameRequired);
      return;
    }
    const number = phoneDigits(phone);
    if (!phoneValid(number)) {
      setError(phoneError);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await authorityClient.sendMobileOtp(authority, {
        dialing_code: dial,
        mobile: number,
        candidate_name: fullName,
      });
      if (res.is_success || res.status) {
        setPhone(number);
        setSmsSent(true);
        setShowMock(Boolean(res.mock));
      } else setError(res.message ?? t.sendSmsOtpFailed);
    } catch (e) {
      setError(e instanceof Error ? e.message : t.sendSmsOtpFailed);
    } finally {
      setLoading(false);
    }
  }

  async function verifySms() {
    const otp = normalizeOtp(smsOtp);
    if (!isValidOtp(otp)) {
      setError(t.invalidOtp);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await authorityClient.verifyOtp(authority, { mobile: phoneDigits(phone), otp });
      if (res.is_success || res.status) setPhoneOk(true);
      else setError(res.message ?? t.invalidPhoneOtp);
    } catch {
      setError(t.invalidPhoneOtp);
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    if (!name.trim() || !last.trim()) {
      setError(t.nameRequired);
      return;
    }
    if (!selected) {
      setError(packages.length ? t.completeRequired : t.loadPackagesFailed);
      return;
    }
    if (!isValidEmail(email) || !phoneValid(phone)) {
      setError(t.completeRequired);
      return;
    }
    if (!emailOk || !phoneOk) {
      setError(t.verifyBoth);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await authorityClient.invite(
        authority,
        buildInvitePayload(authority, {
          name: name.trim(),
          last: last.trim(),
          email: normalizeEmail(email),
          number: phoneDigits(phone),
          dialCode: dial,
          client_package_id: String(selected.client_package_id),
          program: String(selected.program),
          sbu: String(selected.sbu),
          section: String(selected.section),
        }),
      );
      if (res.status === true || res.is_success) {
        onSuccess();
        return;
      }
      if (res.data?.duplicate_found || res.message?.toLowerCase().includes("duplicate")) {
        onDuplicate();
        return;
      }
      setError(res.message ?? t.completeRequired);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.toLowerCase().includes("duplicate")) onDuplicate();
      else setError(msg || t.completeRequired);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="lg-form"
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <h2 className="lg-title">{t.register}</h2>
      <ul className="lg-sub">
        <li>{t.registerLead1}</li>
        <li>{t.registerLead2}</li>
        <li>{authority === "mom" ? t.momRegisterLead3 : t.mohesrRegisterLead3}</li>
        {authority === "mom" ? <li>{t.momRegisterLead4}</li> : null}
      </ul>
      {showMock && mockHint ? <p className="lg-hint">{mockHint}</p> : null}
      <div className="lg-row">
        <div>
          <label className="lg-label" htmlFor="ap-first">
            {t.firstName}
          </label>
          <input id="ap-first" className="inp lg-input" value={name} placeholder={t.firstNamePlaceholder} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="lg-label" htmlFor="ap-last">
            {t.lastName}
          </label>
          <input id="ap-last" className="inp lg-input" value={last} placeholder={t.lastNamePlaceholder} onChange={(e) => setLast(e.target.value)} />
        </div>
      </div>

      <ApplicantPackages t={t} packages={packages} pkgId={pkgId} onPick={setPkgId} loading={pkgLoading} onLoad={loadPackages} />

      <ApplicantVerifyRow
        t={t}
        label={t.email}
        htmlFor="ap-reg-email"
        value={email}
        verified={emailOk}
        sent={emailSent}
        otp={emailOtp}
        onOtp={setEmailOtp}
        onSend={() => void sendEmail()}
        onVerify={() => void verifyEmail()}
        onChange={() => {
          setEmailSent(false);
          setEmailOtp("");
        }}
        changeLabel={t.changeEmail}
        loading={loading}
      >
        <input id="ap-reg-email" className="inp lg-input" type="email" value={email} placeholder={t.emailPlaceholder} onChange={(e) => setEmail(e.target.value)} />
      </ApplicantVerifyRow>

      <ApplicantVerifyRow
        t={t}
        label={t.phone}
        htmlFor="ap-reg-phone"
        value={`${dial} ${phone}`}
        verified={phoneOk}
        sent={smsSent}
        otp={smsOtp}
        onOtp={setSmsOtp}
        onSend={() => void sendSms()}
        onVerify={() => void verifySms()}
        onChange={() => {
          setSmsSent(false);
          setSmsOtp("");
        }}
        changeLabel={t.changePhone}
        loading={loading}
      >
        <select className="inp lg-input" aria-label={t.countryCode} value={dial} onChange={(e) => setDial(e.target.value)}>
          {dials.map((row) => (
            <option key={`${row.Dialingcode}-${row.country_name}`} value={row.Dialingcode}>
              {row.Dialingcode} {row.country_name ?? ""}
            </option>
          ))}
        </select>
        <input id="ap-reg-phone" className="inp lg-input" type="tel" inputMode="numeric" maxLength={phoneMax} value={phone} placeholder={phonePlaceholder} onChange={(e) => setPhone(phoneDigits(e.target.value))} />
      </ApplicantVerifyRow>

      <button type="submit" className="btn btn-ink btn-sm lg-btn" disabled={loading}>
        {loading ? t.submitting : t.registerButton}
      </button>
      <button type="button" className="lg-edit" onClick={onClose}>
        {t.cancel}
      </button>
      {error ? <p className="lg-err" role="alert">{error}</p> : null}
    </form>
  );
}
