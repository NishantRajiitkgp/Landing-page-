"use client";

import { useCallback, useEffect, useState } from "react";

import { loaStatus, sendLoaLinks } from "@/lib/mom/org/batchClient";
import type { LoaMark, LoaStatus } from "@/lib/mom/org/loa";

/** Who has signed a paid batch's letters, refreshed whenever the employer
 *  comes back to the tab. Demo also fetches each unsigned candidate's link,
 *  since nothing is emailed. */
export function useLoaStatus(receipt: string, demo: boolean) {
  const [status, setStatus] = useState<LoaStatus>({});
  const [links, setLinks] = useState<Record<string, string>>({});

  const refresh = useCallback(async () => {
    const res = await loaStatus(receipt);
    if (res.ok) setStatus(res.status);
  }, [receipt]);

  useEffect(() => {
    let live = true;
    void (async () => {
      const res = await loaStatus(receipt);
      if (!live || !res.ok) return;
      setStatus(res.status);
      if (!demo) return;
      const made = await sendLoaLinks(receipt);
      if (live && made.ok) setLinks(made.links);
    })();
    const back = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    window.addEventListener("focus", back);
    document.addEventListener("visibilitychange", back);
    return () => {
      live = false;
      window.removeEventListener("focus", back);
      document.removeEventListener("visibilitychange", back);
    };
  }, [receipt, demo, refresh]);

  const mark = (id: string, m: LoaMark) => setStatus((s) => ({ ...s, [id]: m }));
  return { status, links, mark };
}
