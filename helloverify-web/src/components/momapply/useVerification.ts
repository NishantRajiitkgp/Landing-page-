"use client";

import { useEffect, useState } from "react";

import type { MomErrors } from "@/lib/copy/momApply";
import { momAccount } from "@/lib/mom/account/client";
import { RESEND_SECONDS } from "@/lib/mom/account/policy";
import type { AccountResult, SendCodeBody, VerifyCodeBody } from "@/lib/mom/account/types";

import { failureText } from "./fill";

export type VerifyStatus = "idle" | "sending" | "sent" | "checking" | "verified";

export type CodeApi = {
  sendCode: (body: SendCodeBody) => Promise<AccountResult>;
  verifyCode: (body: VerifyCodeBody) => Promise<AccountResult<{ proof: string }>>;
};

/** One email or phone proving itself: send a code, check it, hold the proof
 *  the register call needs. */
export function useVerification(errors: MomErrors, api: CodeApi = momAccount) {
  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [code, setCode] = useState("");
  const [proof, setProof] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [duplicate, setDuplicate] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(id);
  }, [cooldown]);

  async function send(body: SendCodeBody) {
    const before = status;
    if (before === "idle") setStatus("sending");
    setError(null);
    setDuplicate(false);
    const res = await api.sendCode(body);
    if (res.ok) {
      setCode("");
      setStatus("sent");
      setCooldown(RESEND_SECONDS);
      return;
    }
    if (res.code === "rate_limited") setCooldown(res.retryAfter ?? RESEND_SECONDS);
    setDuplicate(res.code === "duplicate");
    setError(failureText(errors, res));
    setStatus(before === "idle" ? "idle" : "sent");
  }

  async function verify(body: VerifyCodeBody): Promise<boolean> {
    setStatus("checking");
    setError(null);
    const res = await api.verifyCode(body);
    if (res.ok) {
      setProof(res.proof);
      setStatus("verified");
      return true;
    }
    setError(failureText(errors, res));
    setCode("");
    setStatus("sent");
    return false;
  }

  function reset() {
    setStatus("idle");
    setCode("");
    setProof("");
    setError(null);
    setDuplicate(false);
  }

  function invalidate(message: string, isDuplicate = false) {
    reset();
    setError(message);
    setDuplicate(isDuplicate);
  }

  return { status, code, setCode, proof, error, setError, duplicate, cooldown, send, verify, reset, invalidate };
}

export type Verification = ReturnType<typeof useVerification>;
