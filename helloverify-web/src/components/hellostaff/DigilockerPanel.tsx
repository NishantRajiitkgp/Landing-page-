"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";

import { fillNodes } from "@/components/momapply/fill";
import { ArrowIcon } from "@/components/momapply/icons";
import type { HellostaffCopy } from "@/lib/copy/hellostaff";
import type { HsService } from "@/lib/hellostaff/catalog";
import { hsApi } from "@/lib/hellostaff/client";
import type { HsDigiDoc } from "@/lib/hellostaff/types";

import { Alert } from "./Alert";
import { failText } from "./failText";

type Digi =
  | { phase: "starting" }
  | { phase: "waiting"; sessionId: string; opened: boolean }
  | { phase: "docs"; sessionId: string; accessToken: string; docs: HsDigiDoc[] }
  | { phase: "message"; sessionId: string; message: string; retryUrl: string };

const POLL_MS = 4000;
const AADHAAR = /^\d{12}$/;

/** Hello Staff's DigiLocker route: a session per check, the Aadhaar number
 *  saved before the redirect, the issued documents polled until they
 *  appear, the chosen ones linked, then the check submitted. */
export function DigilockerPanel({
  t,
  service,
  answers,
  onSubmitted,
}: {
  t: HellostaffCopy;
  service: HsService;
  answers: Record<string, string>;
  onSubmitted: () => void;
}) {
  const d = t.doc;
  const isAadhaar = service.doc === "aadhaar";
  const [digi, setDigi] = useState<Digi>({ phase: "starting" });
  const [aadhaar, setAadhaar] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const poll = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPoll = () => {
    if (poll.current) clearInterval(poll.current);
    poll.current = null;
  };

  function startPoll(sessionId: string) {
    stopPoll();
    poll.current = setInterval(async () => {
      const r = await hsApi.digilockerList(service.slug, sessionId);
      if (!r.ok || r.state === "waiting") return;
      stopPoll();
      if (r.state === "docs") setDigi({ phase: "docs", sessionId, accessToken: r.accessToken, docs: r.docs });
      else setDigi({ phase: "message", sessionId, message: r.message || d.noDocs, retryUrl: r.retryUrl });
    }, POLL_MS);
  }

  const started = useEffectEvent((r: Awaited<ReturnType<typeof hsApi.digilockerStart>>) => {
    if (!r.ok) return setError(failText(t, r));
    setDigi({ phase: "waiting", sessionId: r.sessionId, opened: false });
    startPoll(r.sessionId);
  });
  const stopped = useEffectEvent(stopPoll);

  useEffect(() => {
    let live = true;
    hsApi.digilockerStart(service.slug).then((r) => live && started(r));
    return () => {
      live = false;
      stopped();
    };
  }, [service.slug]);

  async function open() {
    if (digi.phase !== "waiting") return;
    if (isAadhaar && !AADHAAR.test(aadhaar)) return setError(t.errors.aadhaar);
    setError("");
    /** Opened inside the click, so the browser treats it as the user's own
     *  popup; it is pointed at DigiLocker once the backend has the session. */
    const tab = window.open("", "_blank");
    const r = await hsApi.digilockerOpen(service.slug, digi.sessionId, isAadhaar ? aadhaar : undefined);
    if (!r.ok) {
      tab?.close();
      return setError(failText(t, r));
    }
    if (r.url && tab) tab.location.href = r.url;
    else tab?.close();
    setDigi({ ...digi, opened: true });
    startPoll(digi.sessionId);
  }

  async function share() {
    if (digi.phase !== "docs") return;
    setBusy(true);
    setError("");
    const docs = digi.docs.filter((x) => picked.includes(x.uri));
    const sel = await hsApi.digilockerSelect(service.slug, digi.sessionId, digi.accessToken, docs);
    if (!sel.ok) {
      setBusy(false);
      return setError(failText(t, sel));
    }
    const r = await hsApi.digilockerSubmit(service.slug, answers);
    setBusy(false);
    if (!r.ok) return setError(r.code === "upstream" && !r.message ? d.noDocs : failText(t, r));
    onSubmitted();
  }

  return (
    <div className="hs-digi">
      {isAadhaar && digi.phase !== "docs" ? (
        <div className="ma-field">
          <label className="ma-l" htmlFor="hs-aadhaar">
            {d.aadhaar} *
          </label>
          <div className="ma-ctl">
            <input
              id="hs-aadhaar"
              inputMode="numeric"
              dir="ltr"
              maxLength={12}
              placeholder={d.aadhaarPh}
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))}
            />
          </div>
        </div>
      ) : null}

      {digi.phase === "starting" || digi.phase === "waiting" ? (
        <button type="button" className="btn btn-ink ma-submit" disabled={digi.phase !== "waiting" || (isAadhaar && aadhaar.length !== 12)} onClick={() => void open()}>
          {d.access}
          <ArrowIcon />
        </button>
      ) : null}
      {digi.phase === "waiting" && digi.opened ? (
        <p className="mf-status">
          <span className="ma-spin" aria-hidden="true" />
          {d.opened}
        </p>
      ) : null}

      {digi.phase === "docs" ? (
        <fieldset className="mf-set mf-docs">
          <legend className="ma-l">{d.issued}</legend>
          {digi.docs.map((doc) => (
            <label key={doc.uri} className="ma-check">
              <input type="checkbox" checked={picked.includes(doc.uri)} onChange={(e) => setPicked((p) => (e.target.checked ? [...p, doc.uri] : p.filter((u) => u !== doc.uri)))} />
              <span>{doc.name}</span>
            </label>
          ))}
          <button type="button" className="btn btn-ink ma-submit" disabled={busy || picked.length === 0} onClick={() => void share()}>
            {busy ? <span className="ma-spin ma-spin-light" aria-hidden="true" /> : null}
            {d.share}
            {busy ? null : <ArrowIcon />}
          </button>
        </fieldset>
      ) : null}

      {digi.phase === "message" ? (
        <div className="hs-howto">
          <p>{digi.message}</p>
          {digi.retryUrl ? (
            <p className="mf-hint">
              {fillNodes(d.retry, {
                link: (
                  <a href={digi.retryUrl} target="_blank" rel="noopener noreferrer" className="ma-link ma-link-sm">
                    {d.retryLink}
                  </a>
                ),
              })}
            </p>
          ) : null}
        </div>
      ) : null}

      {error ? <Alert text={error} /> : null}
    </div>
  );
}
