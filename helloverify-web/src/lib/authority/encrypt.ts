/** CryptoJS-compatible AES (OpenSSL salted, EVP_BytesToKey + AES-256-CBC).
 *  Used only on the server so the passphrase never ships in the bundle. */
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

function evpBytesToKey(password: Buffer, salt: Buffer, keyLen: number, ivLen: number) {
  const total = keyLen + ivLen;
  let derived = Buffer.alloc(0);
  let block = Buffer.alloc(0);
  while (derived.length < total) {
    block = createHash("md5").update(Buffer.concat([block, password, salt])).digest();
    derived = Buffer.concat([derived, block]);
  }
  return { key: derived.subarray(0, keyLen), iv: derived.subarray(keyLen, total) };
}

export function encryptCaseId(value: string, passphrase: string): string {
  const salt = randomBytes(8);
  const { key, iv } = evpBytesToKey(Buffer.from(passphrase, "utf8"), salt, 32, 16);
  const cipher = createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return Buffer.concat([Buffer.from("Salted__"), salt, encrypted]).toString("base64");
}

export function decryptCaseId(cipherText: string, passphrase: string): string {
  const raw = Buffer.from(cipherText, "base64");
  if (raw.subarray(0, 8).toString() !== "Salted__") throw new Error("Not an OpenSSL salted payload");
  const salt = raw.subarray(8, 16);
  const { key, iv } = evpBytesToKey(Buffer.from(passphrase, "utf8"), salt, 32, 16);
  const decipher = createDecipheriv("aes-256-cbc", key, iv);
  return Buffer.concat([decipher.update(raw.subarray(16)), decipher.final()]).toString("utf8");
}

export function applicantHandoffUrl(
  candidateOrigin: string,
  email: string,
  password: string,
  otp: string,
  passphrase: string,
): string {
  const data3 = encodeURIComponent(encryptCaseId(email, passphrase));
  const data6 = encodeURIComponent(encryptCaseId(password, passphrase));
  const data5 = encodeURIComponent(encryptCaseId(otp, passphrase));
  return `${candidateOrigin}/#/signinwith?data3=${data3}&data6=${data6}&data5=${data5}`;
}
