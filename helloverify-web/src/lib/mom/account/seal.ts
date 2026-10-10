/** AES-256-GCM sealed tokens. The purpose is bound as associated data, so a
 *  code proof cannot be replayed as a session and vice versa. */
import "server-only";

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

export type SealPurpose = "session" | "proof" | "challenge" | "demo" | "document" | "payment" | "case" | "batch" | "loa" | "loa-proof" | "loa-signed";

type Envelope<T> = { exp: number; data: T };

export function seal<T>(key: Buffer, purpose: SealPurpose, data: T, ttlSeconds: number): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  cipher.setAAD(Buffer.from(purpose));
  const body: Envelope<T> = { exp: Date.now() + ttlSeconds * 1000, data };
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(body), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url");
}

export function unseal<T>(key: Buffer, purpose: SealPurpose, token: string | undefined | null): T | null {
  if (!token) return null;
  try {
    const raw = Buffer.from(token, "base64url");
    if (raw.length < 29) return null;
    const decipher = createDecipheriv("aes-256-gcm", key, raw.subarray(0, 12));
    decipher.setAAD(Buffer.from(purpose));
    decipher.setAuthTag(raw.subarray(12, 28));
    const json = Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString("utf8");
    const body = JSON.parse(json) as Envelope<T>;
    if (typeof body.exp !== "number" || body.exp < Date.now()) return null;
    return body.data;
  } catch {
    return null;
  }
}
