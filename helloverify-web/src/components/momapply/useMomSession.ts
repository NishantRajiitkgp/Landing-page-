"use client";

import { useEffect, useState } from "react";

import { momAccount } from "@/lib/mom/account/client";
import type { Applicant } from "@/lib/mom/account/types";

export type MomSessionState = { ready: boolean; applicant: Applicant | null; demo: boolean };

/** The session is an httpOnly cookie, so the page asks the API after mount. */
export function useMomSession(): MomSessionState {
  const [state, setState] = useState<MomSessionState>({ ready: false, applicant: null, demo: false });

  useEffect(() => {
    let live = true;
    void momAccount.session().then((res) => {
      if (!live) return;
      setState(res.ok ? { ready: true, applicant: res.applicant, demo: res.demo } : { ready: true, applicant: null, demo: false });
    });
    return () => {
      live = false;
    };
  }, []);

  return state;
}
