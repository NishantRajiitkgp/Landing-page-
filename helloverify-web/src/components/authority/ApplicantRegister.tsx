"use client";

import { useEffect, useState } from "react";

import { authorityClient } from "@/lib/authority/client";
import { buildInvitePayload, flattenPackages, type PackageRow } from "@/lib/authority/invite";
import type { AuthorityId } from "@/lib/authority/portals";
import {
  isValidEmail,
  isValidOtp,
  isValidPhone,
  normalizeEmail,
  normalizeOtp,
  normalizePhoneDigits,
} from "@/lib/authority/validate";
import type { AuthorityCopy } from "@/lib/copy/authority";

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
  const [dial, setDial] = useState("+91");
  const [dials, setDials] = useState<Array<{ Dialingcode: string; country_name?: string }>>([]);
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [pkgId, setPkgId] = useState<number | null>(null);
  const [pkgLoading, setPkgLoading] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [smsOtp, setSmsOtp] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [emailOk, setEmailOk] = useState(false);
  const [phoneOk, setPhoneOk] = useState(false);
  const [showMock, setShowMock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = packages.find((p) => p.client_package_id === pkgId) ?? null;
  const fullName = `${name.trim()} ${last.trim()}`.trim();

  async function loadPackages() {
    setPkgLoading(true);
    setError(null);
    try {
      const res = await authorityClient.packages(authority);
      const list = flattenPackages(res);
      setPackages(list);
      if (list[0]) setPkgId(list[0].client_package_id);
      if (!list.length) setError(t.loadPackagesFailed);
    } catch {
      setError(t.loadPackagesFailed);
    } finally {
      setPkgLoading(false);
    }
  }

  useEffect(() => {
    void loadPackages();
    void authorityClient.dialCodes(authority).then((res) => {
      const rows = (res.result ?? []).filter((r) => r.Dialingcode);
      if (rows.length) {
        setDials(rows);
        const preferred = rows.find((r) => r.Dialingcode === "+91") ?? rows[0];
        if (preferred) setDial(preferred.Dialingcode);
      }
    });
  }, [authority]);

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
      } else setError(res.message ?? t.sendEmailOtpFailed);
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
    const number = normalizePhoneDigits(phone);
    if (!isValidPhone(number)) {
      setError(t.invalidPhone);
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
      const res = await authorityClient.verifyOtp(authority, { mobile: normalizePhoneDigits(phone), otp });
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
    if (!isValidEmail(email) || !isValidPhone(phone)) {
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
          number: normalizePhoneDigits(phone),
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

      <span className="lg-label">{t.selectPackage}</span>
      {pkgLoading && packages.length === 0 ? <p className="lg-sub">{t.loadingPackages}</p> : null}
      {!pkgLoading && packages.length === 0 ? (
        <button type="button" className="btn btn-line btn-sm" onClick={() => void loadPackages()}>
          {t.loadPackages}
        </button>
      ) : null}
      {packages.map((pkg) => (
        <label key={pkg.client_package_id} className={`lg-pkg${pkgId === pkg.client_package_id ? " is-on" : ""}`}>
          <input
            type="radio"
            name="ap-pkg"
            checked={pkgId === pkg.client_package_id}
            onChange={() => setPkgId(pkg.client_package_id)}
          />
          <span>
            <strong>{pkg.package}</strong>
            {pkg.checks ? (
              <span className="lg-sub"> {Array.isArray(pkg.checks) ? pkg.checks.join(", ") : pkg.checks}</span>
            ) : null}
          </span>
        </label>
      ))}

      <label className="lg-label" htmlFor="ap-reg-email">
        {t.email}
      </label>
      {emailOk ? (
        <p className="lg-sent">
          {email} <strong>{t.verified}</strong>
        </p>
      ) : emailSent ? (
        <div className="lg-inline">
          <input className="inp lg-input" value={email} disabled />
          <input className="inp lg-input" inputMode="numeric" maxLength={6} value={emailOtp} placeholder={t.otpPlaceholder} onChange={(e) => setEmailOtp(normalizeOtp(e.target.value))} aria-label={t.otp} />
          <button type="button" className="btn btn-ink btn-sm" disabled={loading} onClick={() => void verifyEmail()}>
            {t.verify}
          </button>
          <button type="button" className="lg-edit" onClick={() => { setEmailSent(false); setEmailOtp(""); }}>
            {t.changeEmail}
          </button>
        </div>
      ) : (
        <div className="lg-inline">
          <input id="ap-reg-email" className="inp lg-input" type="email" value={email} placeholder={t.emailPlaceholder} onChange={(e) => setEmail(e.target.value)} />
          <button type="button" className="btn btn-ink btn-sm" disabled={loading} onClick={() => void sendEmail()}>
            {t.sendOtp}
          </button>
        </div>
      )}

      <label className="lg-label" htmlFor="ap-reg-phone">
        {t.phone}
      </label>
      {phoneOk ? (
        <p className="lg-sent">
          {dial} {phone} <strong>{t.verified}</strong>
        </p>
      ) : smsSent ? (
        <div className="lg-inline">
          <input className="inp lg-input" value={`${dial} ${phone}`} disabled />
          <input className="inp lg-input" inputMode="numeric" maxLength={6} value={smsOtp} placeholder={t.otpPlaceholder} onChange={(e) => setSmsOtp(normalizeOtp(e.target.value))} aria-label={t.otp} />
          <button type="button" className="btn btn-ink btn-sm" disabled={loading} onClick={() => void verifySms()}>
            {t.verify}
          </button>
          <button type="button" className="lg-edit" onClick={() => { setSmsSent(false); setSmsOtp(""); }}>
            {t.changePhone}
          </button>
        </div>
      ) : (
        <div className="lg-inline">
          <select className="inp lg-input" aria-label={t.countryCode} value={dial} onChange={(e) => setDial(e.target.value)}>
            {(dials.length ? dials : [{ Dialingcode: "+91", country_name: "India" }, { Dialingcode: "+65", country_name: "Singapore" }, { Dialingcode: "+971", country_name: "UAE" }]).map((row) => (
              <option key={`${row.Dialingcode}-${row.country_name}`} value={row.Dialingcode}>
                {row.Dialingcode} {row.country_name ?? ""}
              </option>
            ))}
          </select>
          <input id="ap-reg-phone" className="inp lg-input" type="tel" inputMode="numeric" maxLength={10} value={phone} placeholder={t.phonePlaceholder} onChange={(e) => setPhone(normalizePhoneDigits(e.target.value))} />
          <button type="button" className="btn btn-ink btn-sm" disabled={loading} onClick={() => void sendSms()}>
            {t.sendOtp}
          </button>
        </div>
      )}

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
