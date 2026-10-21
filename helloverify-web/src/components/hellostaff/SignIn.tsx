"use client";

import { useEffect, useState, type ReactNode } from "react";

import { fill, fillNodes } from "@/components/momapply/fill";
import { ArrowIcon } from "@/components/momapply/icons";
import type { HellostaffCopy } from "@/lib/copy/hellostaff";
import type { HsSlug } from "@/lib/hellostaff/catalog";
import { hsApi } from "@/lib/hellostaff/client";
import type { HsFailure, HsPlace } from "@/lib/hellostaff/types";

import { Alert } from "./Alert";
import { failText } from "./failText";
import { PlaceSelect } from "./PlaceSelect";

const MOBILE = /^[6-9]\d{9}$/;
const PAN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Tab = "login" | "register";

/** Hello Staff's Register / Login: a mobile OTP either way; registering also
 *  takes the profile the backend opens the case with. */
export function SignIn({
  t,
  slug,
  termsHref,
  demoCode,
  onSignedIn,
}: {
  t: HellostaffCopy;
  slug: HsSlug;
  termsHref: string;
  demoCode: string | null;
  onSignedIn: () => void;
}) {
  const s = t.signIn;
  const [tab, setTab] = useState<Tab>("login");
  const [phase, setPhase] = useState<"form" | "otp">("form");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [pan, setPan] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [stateId, setStateId] = useState("");
  const [cityId, setCityId] = useState("");
  const [states, setStates] = useState<HsPlace[]>([]);
  const [cities, setCities] = useState<HsPlace[]>([]);

  useEffect(() => {
    if (tab !== "register" || states.length) return;
    let live = true;
    hsApi.states().then((r) => live && r.ok && setStates(r.items));
    return () => {
      live = false;
    };
  }, [tab, states.length]);

  useEffect(() => {
    if (!stateId) return;
    let live = true;
    hsApi.cities(Number(stateId)).then((r) => live && r.ok && setCities(r.items));
    return () => {
      live = false;
    };
  }, [stateId]);

  function pickState(id: string) {
    setStateId(id);
    setCities([]);
    setCityId("");
  }

  const fail = (f: HsFailure) => setError(failText(t, f));

  function validate(): string {
    if (tab === "register") {
      if (!name.trim() || !pan || !email.trim() || !mobile || !stateId || !cityId || !address.trim()) return t.errors.required;
      if (!PAN.test(pan)) return t.errors.pan;
      if (!EMAIL.test(email.trim())) return t.errors.email;
    }
    if (!MOBILE.test(mobile)) return t.errors.mobile;
    return "";
  }

  async function send() {
    const problem = validate();
    if (problem) return setError(problem);
    setError("");
    setBusy(true);
    const r = await hsApi.sendOtp(mobile);
    setBusy(false);
    if (!r.ok) return fail(r);
    setOtp("");
    setPhase("otp");
  }

  async function verify() {
    if (otp.length < 4) return setError(t.errors.otp);
    setError("");
    setBusy(true);
    const r = await hsApi.login(
      slug,
      mobile,
      otp,
      tab === "register"
        ? { name: name.trim(), pan, email: email.trim(), address: address.trim(), countryId: 1, stateId: Number(stateId), cityId: Number(cityId) }
        : undefined,
    );
    setBusy(false);
    if (!r.ok) return fail(r);
    onSignedIn();
  }

  function switchTab(next: Tab) {
    setTab(next);
    setPhase("form");
    setError("");
  }

  const field = (id: string, label: string, input: ReactNode) => (
    <div className="ma-field">
      <label className="ma-l" htmlFor={id}>
        {label} *
      </label>
      <div className="ma-ctl">{input}</div>
    </div>
  );

  return (
    <section className="mf-step hs-signin" aria-labelledby="hs-signin-t">
      <div className="ma-head">
        <p className="k">{s.k}</p>
        <div className="ma-tabs" role="tablist" aria-label={s.tabs.aria}>
          {(["login", "register"] as const).map((k) => (
            <a
              key={k}
              href={`#${k}`}
              role="tab"
              aria-selected={tab === k}
              className={tab === k ? "is-on" : undefined}
              onClick={(e) => {
                e.preventDefault();
                switchTab(k);
              }}
            >
              {s.tabs[k]}
            </a>
          ))}
        </div>
      </div>
      <h2 id="hs-signin-t" className="mf-step-t">
        {s.title}
      </h2>
      <p className="ma-lede">{s.lede}</p>

      {phase === "form" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
          noValidate
        >
          {tab === "register" ? (
            <>
              {field("hs-name", s.name, <input id="hs-name" autoComplete="name" value={name} placeholder={s.namePh} onChange={(e) => setName(e.target.value)} />)}
              {field(
                "hs-pan",
                s.pan,
                <input id="hs-pan" value={pan} maxLength={10} placeholder={s.panPh} className="hs-upper" onChange={(e) => setPan(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))} />,
              )}
            </>
          ) : null}
          <div className="ma-field">
            <label className="ma-l" htmlFor="hs-mobile">
              {s.mobile} *
            </label>
            <div className="ma-ctl">
              <span className="hs-cc" dir="ltr">
                +91
              </span>
              <input
                id="hs-mobile"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                dir="ltr"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
              />
            </div>
          </div>
          {tab === "register" ? (
            <>
              {field("hs-email", s.email, <input id="hs-email" type="email" autoComplete="email" dir="ltr" value={email} placeholder={s.emailPh} onChange={(e) => setEmail(e.target.value)} />)}
              {field("hs-address", s.address, <input id="hs-address" autoComplete="street-address" value={address} placeholder={s.addressPh} onChange={(e) => setAddress(e.target.value)} />)}
              <div className="ma-row2">
                <PlaceSelect id="hs-state" label={s.state} choose={s.choose} value={stateId} places={states} onChange={pickState} />
                <PlaceSelect id="hs-city" label={s.city} choose={s.choose} value={cityId} places={cities} disabled={!stateId} onChange={setCityId} />
              </div>
              <div className="ma-field">
                <span className="ma-l">{s.country}</span>
                <div className="ma-ctl is-locked">
                  <input value={s.india} readOnly aria-label={s.country} />
                </div>
              </div>
            </>
          ) : null}
          <p className="mf-hint">
            {fillNodes(s.terms, {
              link: (
                <a href={termsHref} target="_blank" rel="noopener noreferrer" className="ma-link ma-link-sm">
                  {s.termsLink}
                </a>
              ),
            })}
          </p>
          {error ? <Alert text={error} /> : null}
          <button type="submit" className="btn btn-ink ma-submit" disabled={busy}>
            {busy ? <span className="ma-spin ma-spin-light" aria-hidden="true" /> : null}
            {busy ? s.sending : s.send}
            {busy ? null : <ArrowIcon />}
          </button>
        </form>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void verify();
          }}
          noValidate
        >
          <div className="ma-field">
            <div className="ma-lrow">
              <label className="ma-l" htmlFor="hs-otp">
                {fill(s.otpFor, { mobile: `+91 ${mobile}` })}
              </label>
              {demoCode ? <span className="ma-demo">{fill(t.demo, { code: demoCode })}</span> : null}
            </div>
            <div className="ma-ctl">
              <input
                id="hs-otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                dir="ltr"
                className="hs-otp"
                maxLength={6}
                aria-label={s.otp}
                value={otp}
                autoFocus
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              />
            </div>
          </div>
          {error ? <Alert text={error} /> : null}
          <button type="submit" className="btn btn-ink ma-submit" disabled={busy}>
            {busy ? <span className="ma-spin ma-spin-light" aria-hidden="true" /> : null}
            {busy ? s.verifying : s.submit}
            {busy ? null : <ArrowIcon />}
          </button>
          <button
            type="button"
            className="ma-back"
            onClick={() => {
              setPhase("form");
              setError("");
            }}
          >
            {s.change}
          </button>
        </form>
      )}
    </section>
  );
}
