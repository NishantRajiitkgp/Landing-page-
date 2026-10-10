"use client";

import { useEffect, useState } from "react";

import { italyPartner } from "@/lib/italy/partner/client";
import type { Partner } from "@/lib/italy/partner/types";

export type PartnerSessionState = { ready: boolean; partner: Partner | null; demo: boolean };

/** The session is an httpOnly cookie, so the page asks the API after mount. */
export function usePartnerSession(): PartnerSessionState {
  const [state, setState] = useState<PartnerSessionState>({ ready: false, partner: null, demo: false });

  useEffect(() => {
    let live = true;
    void italyPartner.session().then((res) => {
      if (!live) return;
      setState(res.ok ? { ready: true, partner: res.partner, demo: res.demo } : { ready: true, partner: null, demo: false });
    });
    return () => {
      live = false;
    };
  }, []);

  return state;
}
