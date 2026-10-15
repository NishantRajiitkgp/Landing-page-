/** HelloV WhatsApp phone: the real bot's flow in WhatsApp's dark theme —
 *  "HelloV", the numbered menu, a pick, the Razorpay link. Each row opens
 *  from zero height (`consumer.css`, `wa-r*` / `wa-t*`), so the thread grows
 *  and scrolls like a chat instead of reserving room for what is to come. */
import Image from "next/image";
import type { ReactNode } from "react";
import { copy } from "@/lib/copy/request";
import { BLOCKS } from "@/lib/copy/blocks";

function WaIcon({ d, className = "wa-ic" }: { d: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function WaTicks() {
  return (
    <svg className="wa-tick" viewBox="0 0 16 11" aria-hidden="true">
      <path d="M1.2 5.6 4.2 8.6 10.2 2.2" />
      <path d="M5.2 5.8 8 8.6 14.2 2" />
    </svg>
  );
}

function When({ time, sent }: { time: string; sent?: boolean }) {
  return (
    <span className="wa-ts">
      {time}
      {sent ? <WaTicks /> : null}
    </span>
  );
}

/** WhatsApp's verified-business seal. */
function Verified({ label }: { label: string }) {
  return (
    <svg className="wa-badge" viewBox="0 0 24 24" role="img" aria-label={label}>
      <path
        className="wa-badge-seal"
        d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-4-3.818-4-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484z"
      />
      <path className="wa-badge-tick" d="M8 12.4l2.7 2.7L16.2 9.6" />
    </svg>
  );
}

/** `text` with its first `bold` run in bold, so a translated sentence can
 *  put the bold words wherever its grammar wants them. */
function Bolded({ text, bold }: { text: string; bold: string }) {
  const at = text.indexOf(bold);
  if (at < 0) return text;
  return (
    <span>
      {text.slice(0, at)}
      <b>{bold}</b>
      {text.slice(at + bold.length)}
    </span>
  );
}

/** One message's slot in the thread; `step` names its keyframes. */
function Row({ step, out, children }: { step: string; out?: boolean; children: ReactNode }) {
  return (
    <div className={`wa-row wa-anim wa-${step}${out ? " out" : ""}`}>
      <div className="wa-cell">
        <div className="wa-line">{children}</div>
      </div>
    </div>
  );
}

function Typing({ step }: { step: string }) {
  return (
    <Row step={step}>
      <span className="wa-typing" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </Row>
  );
}

export async function HelloVPhone() {
  const t = (await copy(BLOCKS)).helloVPhone;
  const items = Object.values(t.menu.items);
  const last = items.length - 1;

  return (
    <div className="phone2 wa">
      <div className="scr">
        <div className="wa-top">
          <div className="wa-status" aria-hidden="true">
            <span className="wa-clock">{t.clock}</span>
            <span className="wa-sys">
              <WaIcon d="M3.5 16.5v-3M8 16.5V10M12.5 16.5V7M17 16.5V4" />
              <WaIcon d="M4 10.5a8 8 0 0 1 12 0M7 13.2a4 4 0 0 1 6 0M10 16.2h.01" />
              <span className="wa-bat"><i /></span>
            </span>
          </div>
          <div className="wa-head">
            <WaIcon className="wa-ic wa-back" d="M19 12H5M11 6l-6 6 6 6" />
            <span className="wa-av">
              <Image src="/logo.png" alt="" width={1064} height={388} sizes="32px" />
            </span>
            <span className="wa-who">
              <span className="wa-name">{t.name}</span>
              <Verified label={t.verified} />
            </span>
            <WaIcon d="M12 6.2a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2zM12 13.1a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2zM12 20a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2z" />
          </div>
        </div>

        <div className="wa-chat">
          <div className="wa-track">
            <span className="wa-day">{t.today}</span>
            <Row step="r1" out>
              <div className="wa-msg out">
                {t.hello.text}
                <When time={t.hello.ts} sent />
              </div>
            </Row>
            <Typing step="t1" />
            <Row step="r2">
              <div className="wa-msg in">
                <p><Bolded text={t.menu.welcome} bold={t.menu.brand} /></p>
                <p>{t.menu.pick}</p>
                {items.map((it, i) => (
                  <p key={it.t}>
                    <b>{i + 1}- {it.t}</b> - {t.menu.price} {it.amount}
                    <br />
                    {it.p}
                    {i === last ? <span>… <span className="wa-more">{t.menu.more}</span></span> : null}
                  </p>
                ))}
                <When time={t.menu.ts} />
              </div>
            </Row>
            <Row step="r3" out>
              <div className="wa-msg out">
                {t.choice.text}
                <When time={t.choice.ts} sent />
              </div>
            </Row>
            <Typing step="t2" />
            <Row step="r4">
              <div className="wa-msg in wa-pay">
                <div className="wa-prev">
                  <svg className="wa-rzp" viewBox="0 0 40 40" aria-hidden="true">
                    <rect width="40" height="40" />
                    <path className="wa-rzp-lo" d="M9 34 19.5 7h5.5L14.5 34z" />
                    <path className="wa-rzp-hi" d="M15 34 25.5 7H32L21.5 34zM13.5 12.5 20 8l-2.2 6.4z" />
                  </svg>
                  <span className="wa-prev-t">
                    <b>{t.pay.title}</b>
                    <small>{t.pay.sub}</small>
                    <span className="wa-host">
                      <WaIcon d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
                      {t.pay.host}
                    </span>
                  </span>
                </div>
                <p><Bolded text={t.pay.thanks} bold={t.pay.service} /></p>
                <p>{t.pay.click}</p>
                <p className="wa-link">{t.pay.link}</p>
                <p>
                  <b>{t.pay.noteK}</b> <Bolded text={t.pay.note} bold={t.pay.noteBold} />
                </p>
                <When time={t.pay.ts} />
              </div>
              <span className="wa-fwd" aria-hidden="true">
                <WaIcon d="M14 6l6 6-6 6M20 12h-9a6 6 0 0 0-6 6" />
              </span>
            </Row>
          </div>
        </div>

        <div className="wa-dock" aria-hidden="true">
          <span className="wa-field">
            <WaIcon d="M12 21a9 9 0 1 0-9-9 9 9 0 0 0 9 9zM8.5 10.2h.01M15.5 10.2h.01M8.2 14.2c.9 1.2 2.2 1.8 3.8 1.8s2.9-.6 3.8-1.8" />
            <span className="wa-input">
              <span className="wa-anim wa-kp">{t.message}</span>
              <span className="wa-anim wa-k1">{t.hello.text}</span>
              <span className="wa-anim wa-k2">{t.choice.text}</span>
            </span>
            <WaIcon d="M16.5 7.5 9 15a2.1 2.1 0 0 0 3 3l7.6-7.6a4.2 4.2 0 0 0-6-6L6 12a6.4 6.4 0 0 0 9 9l5-5" />
            <WaIcon d="M4 8.5h3.2L9 6h6l1.8 2.5H20a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a1 1 0 0 1 1-1zM12 16.2a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2z" />
          </span>
          <span className="wa-send">
            <WaIcon className="wa-ic wa-anim wa-km" d="M12 4a2.4 2.4 0 0 0-2.4 2.4v5.2a2.4 2.4 0 0 0 4.8 0V6.4A2.4 2.4 0 0 0 12 4zM6.5 11.2a5.5 5.5 0 0 0 11 0M12 16.7V20" />
            <WaIcon className="wa-ic wa-anim wa-ks" d="M4.5 19.5 20 12 4.5 4.5 7 12zM7 12h6" />
          </span>
        </div>
      </div>
    </div>
  );
}
