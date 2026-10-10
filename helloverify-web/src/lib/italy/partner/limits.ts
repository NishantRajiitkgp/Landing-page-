/** Abuse limits for the Italy partner account. Own keys, so they do not
 *  share a bucket with the MOM applicant flow. */
import type { Limit } from "@/lib/mom/account/limits";

const MINUTE = 60_000;

export const LIMITS = {
  sendCode: (target: string, client: string): Limit[] => [
    [`it:cool:${target}`, 1, 30_000],
    [`it:send:${target}`, 5, 10 * MINUTE],
    [`it:send-ip:${client}`, 20, 10 * MINUTE],
  ],
  verifyCode: (target: string): Limit[] => [[`it:verify:${target}`, 8, 10 * MINUTE]],
  signIn: (email: string, client: string): Limit[] => [
    [`it:signin:${email}`, 8, 10 * MINUTE],
    [`it:signin-ip:${client}`, 30, 10 * MINUTE],
  ],
  forgot: (email: string, client: string): Limit[] => [
    [`it:forgot:${email}`, 3, 10 * MINUTE],
    [`it:forgot-ip:${client}`, 10, 10 * MINUTE],
  ],
};
