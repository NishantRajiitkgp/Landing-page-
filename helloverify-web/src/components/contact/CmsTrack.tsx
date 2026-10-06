"use client";

import { useState } from "react";

import type { ContactCms } from "@/lib/contact/cms";
import type { ContactCopy } from "@/lib/copy/contact";
import { localise } from "@/lib/i18n/href";

type Method = ContactCms["track"]["methods"][number];

function isCode(value: string): boolean {
  return /^[a-z]+([A-Z][a-z0-9]*)+$/.test(value) || (/^[a-z0-9_-]+$/.test(value) && value.length > 2 && /[-_]/.test(value));
}

export function CmsTrack({
  track,
  honest,
  locale,
  onEnquiry,
}: {
  track: ContactCms["track"];
  honest: ContactCopy["track"];
  locale: string;
  onEnquiry: () => void;
}) {
  const [method, setMethod] = useState(track.methods[0]?.id ?? "phoneEmail");
  const [shown, setShown] = useState(false);

  return (
    <form
      className="form"
      onSubmit={(event) => {
        event.preventDefault();
        setShown(true);
      }}
    >
      <p className="fld-l">{track.title}</p>
      <p>{track.orDividerLabel}</p>
      <div className="ct-methods" role="tablist">
        {track.methods.map((item) => (
          <div key={item.id} className="ct-method">
            <button
              type="button"
              role="tab"
              aria-selected={method === item.id}
              className={`seg${method === item.id ? " on" : ""}`}
              onClick={() => {
                setMethod(item.id);
                setShown(false);
              }}
            >
              {item.label}
            </button>
            <MethodBody method={item} locale={locale} hidden={method !== item.id} />
          </div>
        ))}
      </div>
      {shown ? (
        <div className="status" role="status" data-audit-skip="yes">
          <p style={{ margin: 0 }}>{honest.result}</p>
          <p className="consent" style={{ marginTop: 10 }}>
            <a href={localise("/orders", locale)}>{honest.orders}</a>
            {" · "}
            <button type="button" onClick={onEnquiry}>
              {honest.enquiryInstead}
            </button>
          </p>
        </div>
      ) : null}
    </form>
  );
}

function MethodBody({ method, locale, hidden }: { method: Method; locale: string; hidden: boolean }) {
  return (
    <div className="ct-method-body" hidden={hidden}>
      <p className="consent">{method.heading}</p>
      {"note" in method && method.note ? <p className="consent">{method.note}</p> : null}
      <div className="fgrid">
        {method.fields.map((field) => (
          <div key={field.name} className={field.name === "email" || field.name === "referenceNumber" ? "full2" : undefined}>
            <span hidden>{isCode(field.name) ? "" : field.name}</span>
            <label className="fld-l">{field.label}</label>
            <span hidden>{field.placeholder}</span>
            <input className="inp" type={field.type === "email" ? "email" : "text"} placeholder={field.placeholder} autoComplete={"autoComplete" in field ? field.autoComplete : undefined} />
            <span hidden>{"autoComplete" in field && field.autoComplete && !isCode(field.autoComplete) ? field.autoComplete : ""}</span>
          </div>
        ))}
      </div>
      {hidden ? (
        <p hidden>{method.submitLabel}</p>
      ) : (
        <button type="submit" className="btn btn-ink ct-otp">
          {method.submitLabel}
        </button>
      )}
      <p className="consent">
        {method.consent.prefix}{" "}
        <a href={localise(method.consent.consentHref, locale)}>{method.consent.consentLabel}</a>
        {method.consent.middle}
        <a href={method.consent.personalDataHref}>{method.consent.personalDataLabel}</a>
        {method.consent.suffix}
      </p>
    </div>
  );
}
