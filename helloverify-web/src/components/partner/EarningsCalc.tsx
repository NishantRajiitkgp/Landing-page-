"use client";

/** The earnings calculator: clients × monthly spend × rate. The server
 *  renders the worked example's own figures (10 clients, ₹50,000, 15%), so
 *  without script the card still reads true. Rupees are grouped the Indian
 *  way on every locale, as the copy writes them. */
import { useState, type CSSProperties } from "react";
import type { PartnerCalcUi } from "@/lib/copy/partner";

const INR = new Intl.NumberFormat("en-IN");
const inr = (v: number) => `₹${INR.format(v)}`;
export const RATE_MAX = 15;

function Slider({
  id,
  label,
  extra,
  value,
  shown,
  min,
  max,
  step,
  onChange,
}: {
  id: string;
  label: string;
  extra?: string;
  value: number;
  shown: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="pw-sl">
      <div className="pw-sl-top">
        <label htmlFor={id}>
          {label}
          {extra ? <span> {extra}</span> : null}
        </label>
        <output htmlFor={id} dir="ltr">{shown}</output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={shown}
        style={{ "--p": (value - min) / (max - min) } as CSSProperties}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export function EarningsCalc({ t, join }: { t: PartnerCalcUi; join: string }) {
  const [clients, setClients] = useState(10);
  const [billing, setBilling] = useState(50000);
  const [rate, setRate] = useState(RATE_MAX);
  const monthly = Math.round((clients * billing * Math.min(RATE_MAX, rate)) / 100);
  const phrase = (clients === 1 ? t.one : t.many).replace("{n}", String(clients));

  return (
    <div className="pw-calc">
      <h3>{t.h}</h3>
      <p className="pw-calc-sub">{t.sub}</p>
      <Slider id="pw-c-clients" label={t.clients} value={clients} shown={String(clients)} min={1} max={100} step={1} onChange={setClients} />
      <Slider id="pw-c-billing" label={t.billing} value={billing} shown={inr(billing)} min={5000} max={500000} step={5000} onChange={setBilling} />
      <Slider id="pw-c-rate" label={t.rate} extra={t.rateMax} value={rate} shown={`${rate}%`} min={1} max={RATE_MAX} step={1} onChange={setRate} />
      <div className="pw-calc-out">
        <div className="pw-calc-row">
          <p className="pw-calc-l">{t.monthly}</p>
          <p className="pw-calc-v" aria-live="polite" dir="ltr">{inr(monthly)}</p>
        </div>
        <span className="pw-calc-bar" aria-hidden="true" style={{ "--r": rate / RATE_MAX } as CSSProperties}><i /></span>
        <p className="pw-calc-f">
          {phrase} × <span dir="ltr">{inr(billing)}</span> {t.perMonth} × <span dir="ltr">{rate}%</span> {t.commission}
        </p>
        <div className="pw-calc-row pw-calc-yr">
          <p>{t.annual}</p>
          <p className="pw-calc-a" dir="ltr">{inr(monthly * 12)}</p>
        </div>
      </div>
      <a href={join} className="btn pw-calc-go">{t.cta}</a>
    </div>
  );
}
