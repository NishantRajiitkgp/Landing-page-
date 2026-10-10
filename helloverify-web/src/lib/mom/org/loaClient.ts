/** Browser calls to `/api/mom/loa/*`, from the candidate's signing page. */
import type { AccountFailure } from "../account/types";
import type { LoaMark, LoaView } from "./loa";

const offline: AccountFailure = { ok: false, code: "upstream" };

type Result<T extends object> = ({ ok: true } & T) | AccountFailure;

async function call<T extends object>(action: string, body: Record<string, unknown>): Promise<Result<T>> {
  try {
    const res = await fetch(`/api/mom/loa/${action}`, {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = (await res.json().catch(() => null)) as { ok?: unknown; code?: unknown } | null;
    if (!json || typeof json.ok !== "boolean") return offline;
    if (!json.ok && (json.code === "too_large" || json.code === "bad_type")) return offline;
    return json as Result<T>;
  } catch {
    return offline;
  }
}

export const openLoa = (token: string) => call<{ demo: boolean; view: LoaView }>("open", { token });
export const sendLoaCode = (token: string) => call<{ sentTo: string; expiresIn: number }>("send", { token });
export const verifyLoaCode = (token: string, code: string) => call<{ proof: string }>("verify", { token, code });
export const signLoa = (token: string, proof: string, name: string) => call<{ signed: LoaMark }>("sign", { token, proof, name, agreed: true });
