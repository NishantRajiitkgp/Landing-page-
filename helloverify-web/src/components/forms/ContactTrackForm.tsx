"use client";

import { useState } from "react";

import type { ContactCopy } from "@/lib/copy/contact";
import { localise } from "@/lib/i18n/href";

type Method = "phoneEmail" | "passport" | "reference";

export function ContactTrackForm({
  locale,
  t,
  onEnquiry,
}: {
  locale: string;
  t: ContactCopy["track"];
  onEnquiry: () => void;
}) {
  const [method, setMethod] = useState<Method>("phoneEmail");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [passport, setPassport] = useState("");
  const [reference, setReference] = useState("");
  const [shown, setShown] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setShown(true);
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="fld-l" style={{ marginBottom: 10 }}>
        {t.title}
      </div>
      <div className="segs" role="tablist" aria-label={t.title}>
        {(
          [
            ["phoneEmail", t.phoneEmail],
            ["passport", t.passport],
            ["reference", t.reference],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={method === id}
            className={`seg${method === id ? " on" : ""}`}
            onClick={() => {
              setMethod(id);
              setShown(false);
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {method === "phoneEmail" ? (
        <>
          <p className="consent" style={{ marginTop: 18 }}>
            {t.phoneHeading}
          </p>
          <div className="fgrid">
            <div>
              <label className="fld-l">{t.countryCode}</label>
              <input
                className="inp"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                placeholder={t.countryPlaceholder}
              />
            </div>
            <div>
              <label className="fld-l">{t.phone}</label>
              <input
                className="inp"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                autoComplete="tel"
              />
            </div>
            <p className="full2 consent" style={{ margin: 0, textAlign: "center" }}>
              {t.or}
            </p>
            <div className="full2">
              <label className="fld-l">{t.email}</label>
              <input
                className="inp"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                autoComplete="email"
              />
            </div>
          </div>
        </>
      ) : null}

      {method === "passport" ? (
        <>
          <p className="consent" style={{ marginTop: 18 }}>
            {t.passportHeading}
          </p>
          <p className="consent">{t.passportNote}</p>
          <div className="fgrid">
            <div>
              <label className="fld-l">{t.passportNumber}</label>
              <input
                className="inp"
                value={passport}
                onChange={(e) => setPassport(e.target.value)}
                placeholder={t.passportPlaceholder}
              />
            </div>
            <div>
              <label className="fld-l">{t.referenceNumber}</label>
              <input
                className="inp"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder={t.referenceExample}
              />
            </div>
          </div>
        </>
      ) : null}

      {method === "reference" ? (
        <>
          <p className="consent" style={{ marginTop: 18 }}>
            {t.referenceHeading}
          </p>
          <div className="fgrid">
            <div className="full2">
              <label className="fld-l">{t.referenceNumber}</label>
              <input
                className="inp"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder={t.referencePlaceholder}
              />
            </div>
          </div>
        </>
      ) : null}

      <button type="submit" className="btn btn-ink" style={{ marginTop: 22 }}>
        {t.sendOtp}
      </button>

      {shown ? (
        <div className="status" role="status">
          <p style={{ margin: 0 }}>{t.result}</p>
          <p className="consent" style={{ marginTop: 10 }}>
            <a href={localise("/orders", locale)}>{t.orders}</a>
            {" · "}
            <button type="button" onClick={onEnquiry}>
              {t.enquiryInstead}
            </button>
          </p>
        </div>
      ) : null}
    </form>
  );
}
