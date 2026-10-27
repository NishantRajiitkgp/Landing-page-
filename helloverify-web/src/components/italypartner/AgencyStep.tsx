"use client";

import { useState } from "react";

import { FieldError } from "@/components/momapply/PasswordField";
import { TickIcon } from "@/components/momapply/icons";
import type { ItalyPartnerCopy } from "@/lib/copy/italyPartner";

import { isPlace, saveAgency, tidy, useAgency, type Volume } from "./agency";

const EMPTY = { name: "", city: "", volume: "" as Volume | "" };

export function AgencyStep({ t, partnerId, onContinue }: { t: ItalyPartnerCopy; partnerId: string; onContinue: () => void }) {
  const saved = useAgency(partnerId);
  const [form, setForm] = useState<typeof EMPTY | null>(null);
  const [tried, setTried] = useState(false);
  const view = form ?? (saved ? { name: saved.name, city: saved.city, volume: saved.volume } : EMPTY);
  const nameOk = isPlace(view.name, 80);
  const cityOk = isPlace(view.city, 40);
  const volumeOk = t.agency.volumes.some((v) => v.id === view.volume);
  const clean = saved !== null && form === null;

  function edit(patch: Partial<typeof EMPTY>) {
    setForm({ ...view, ...patch });
  }

  function save() {
    setTried(true);
    if (!nameOk || !cityOk || !volumeOk || !view.volume) return;
    const draft = {
      v: 1 as const,
      name: tidy(view.name),
      city: tidy(view.city),
      volume: view.volume,
    };
    saveAgency(partnerId, draft);
    setForm(null);
    onContinue();
  }

  const nameErr = !view.name.trim() ? t.errors.required : nameOk ? null : t.errors.place;
  const cityErr = !view.city.trim() ? t.errors.required : cityOk ? null : t.errors.place;

  return (
    <section className="mf-step" aria-labelledby="ip-agency-t">
      <h2 className="mf-step-t" id="ip-agency-t" tabIndex={-1}>
        {t.agency.title}
      </h2>
      <p className="mf-step-b ma-lede">{t.agency.lede}</p>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <div className="ma-field">
          <label className="ma-l" htmlFor="ip-agency">
            {t.agency.name}
          </label>
          <div className={`ma-ctl${tried && nameErr ? " is-bad" : ""}`}>
            <input
              id="ip-agency"
              autoComplete="organization"
              maxLength={80}
              placeholder={t.agency.namePlaceholder}
              value={view.name}
              aria-invalid={tried && nameErr ? true : undefined}
              onChange={(e) => edit({ name: e.target.value })}
            />
          </div>
          {tried && nameErr ? <FieldError id="ip-agency-err">{nameErr}</FieldError> : null}
        </div>
        <div className="ma-field">
          <label className="ma-l" htmlFor="ip-city">
            {t.agency.city}
          </label>
          <div className={`ma-ctl${tried && cityErr ? " is-bad" : ""}`}>
            <input
              id="ip-city"
              autoComplete="address-level2"
              maxLength={40}
              placeholder={t.agency.cityPlaceholder}
              value={view.city}
              aria-invalid={tried && cityErr ? true : undefined}
              onChange={(e) => edit({ city: e.target.value })}
            />
          </div>
          {tried && cityErr ? <FieldError id="ip-city-err">{cityErr}</FieldError> : null}
        </div>
        <fieldset className="ma-field mf-set">
          <legend className="ma-l">{t.agency.volume}</legend>
          <div className={`mf-pills${tried && !volumeOk ? " is-bad" : ""}`}>
            {t.agency.volumes.map((v) => (
              <label key={v.id} className={view.volume === v.id ? "is-on" : undefined}>
                <input
                  type="radio"
                  name="ip-volume"
                  checked={view.volume === v.id}
                  onChange={() => edit({ volume: v.id as Volume })}
                />
                <span>{v.t}</span>
              </label>
            ))}
          </div>
          {tried && !volumeOk ? <FieldError id="ip-volume-err">{t.errors.required}</FieldError> : null}
        </fieldset>
        <div className="mf-nav">
          <span className="mf-saved">{clean ? <><TickIcon />{t.agency.saved}</> : null}</span>
          <button type="submit" className="btn btn-ink mf-next">
            {t.nav.next}
          </button>
        </div>
      </form>
    </section>
  );
}
