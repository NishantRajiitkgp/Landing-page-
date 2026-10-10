/** Agent codes. Ambiguous glyphs are left out so a code read aloud can be typed back. */

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function agentCode(partnerId: string): string {
  let h = 2166136261;
  const seed = `italy-partner:${partnerId}`;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let body = "";
  for (let i = 0; i < 6; i++) {
    body += ALPHABET[(h >>> 0) % ALPHABET.length];
    h = Math.imul(h ^ (i + 0x9e3779b9), 16777619);
  }
  return `IT-${body}`;
}

export function isAgentCode(value: unknown): value is string {
  return typeof value === "string" && /^IT-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/.test(value);
}
