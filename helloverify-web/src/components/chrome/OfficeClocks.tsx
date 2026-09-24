"use client";

/** The footer's live office clocks (homepage v2, desktop): six local times
    and "N of 6 offices open now".

    HYDRATION. Every route is prerendered at build time, so the server cannot
    know the time a page is read. It renders `--:--` and no count — the
    board's own fallback — and the real values arrive in an effect after
    mount. Rendering `Date.now()` here would bake the build's clock into the
    HTML and then mismatch on hydration.

    The clock ticks on the minute boundary rather than every 20s (the board),
    so a minute never lags by up to 20 seconds and the tab wakes a third as
    often. Office hours are the board's: 09:00–18:00 local, Monday to Friday
    in every city. That weekend is NOT verified per office (Cairo's working
    week is conventionally Sunday–Thursday); it is the canvas's assumption,
    kept until the owner confirms each office's hours. */

import { useEffect, useState } from "react";

export type OfficeId = "noida" | "dubai" | "singapore" | "manila" | "cairo" | "newYork";

const OFFICES: { id: OfficeId; tz: string }[] = [
  { id: "noida", tz: "Asia/Kolkata" },
  { id: "dubai", tz: "Asia/Dubai" },
  { id: "singapore", tz: "Asia/Singapore" },
  { id: "manila", tz: "Asia/Manila" },
  { id: "cairo", tz: "Africa/Cairo" },
  { id: "newYork", tz: "America/New_York" },
];

type Reading = { time: string; open: boolean };

function read(now: Date): Record<OfficeId, Reading> {
  const out = {} as Record<OfficeId, Reading>;
  for (const { id, tz } of OFFICES) {
    let hh = "--", mm = "--", wd = "Mon";
    try {
      for (const p of new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", weekday: "short", hour12: false }).formatToParts(now)) {
        if (p.type === "hour") hh = p.value;
        if (p.type === "minute") mm = p.value;
        if (p.type === "weekday") wd = p.value;
      }
    } catch {
      // An engine without that zone keeps the `--:--` placeholder.
    }
    const h = parseInt(hh, 10);
    out[id] = { time: `${hh}:${mm}`, open: h >= 9 && h < 18 && wd !== "Sat" && wd !== "Sun" };
  }
  return out;
}

export function OfficeClocks({
  head,
  openNow,
  atDesk,
  closed,
  cities,
}: {
  head: string;
  openNow: string;
  atDesk: string;
  closed: string;
  cities: Record<OfficeId, { city: string; country: string }>;
}) {
  const [now, setNow] = useState<Record<OfficeId, Reading> | null>(null);

  useEffect(() => {
    let iv: ReturnType<typeof setInterval> | undefined;
    const tick = () => setNow(read(new Date()));
    tick();
    const toNextMinute = setTimeout(() => {
      tick();
      iv = setInterval(tick, 60_000);
    }, 60_000 - (Date.now() % 60_000) + 50);
    return () => {
      clearTimeout(toNextMinute);
      if (iv) clearInterval(iv);
    };
  }, []);

  const open = now ? OFFICES.filter(({ id }) => now[id].open).length : 0;

  return (
    <>
      <div className="fz-offices-h">
        <span className="k">{head}</span>
        {/* Empty until the clocks run, so no count is ever wrong; the box
            keeps its height so nothing below it moves when it fills. */}
        <span className="fz-open">
          <span className="dot live" aria-hidden="true" />
          <span>{now ? openNow.replace("{open}", String(open)) : ""}</span>
        </span>
      </div>
      <div className="fz-offices">
        {OFFICES.map(({ id }) => {
          const r = now?.[id];
          return (
            <div key={id} className={r?.open ? "fz-off fz-on" : "fz-off"}>
              <div className="fz-off-t">
                <span className="fz-live" aria-hidden="true" />
                <b>{r ? r.time : "--:--"}</b>
              </div>
              <div className="fz-off-c">{cities[id].city}</div>
              <div className="fz-off-k">
                {cities[id].country}
                {r ? <> · <span>{r.open ? atDesk : closed}</span></> : null}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
