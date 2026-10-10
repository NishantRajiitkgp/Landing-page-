/** Abuse limits for the employer account. Own keys, so an employer and an
 *  applicant on the same email do not share a bucket. */
import type { Limit } from "@/lib/mom/account/limits";

const MINUTE = 60_000;

export const ORG_LIMITS = {
  sendCode: (target: string, client: string): Limit[] => [
    [`org:cool:${target}`, 1, 30_000],
    [`org:send:${target}`, 5, 10 * MINUTE],
    [`org:send-ip:${client}`, 20, 10 * MINUTE],
  ],
  verifyCode: (target: string): Limit[] => [[`org:verify:${target}`, 8, 10 * MINUTE]],
  signIn: (email: string, client: string): Limit[] => [
    [`org:signin:${email}`, 8, 10 * MINUTE],
    [`org:signin-ip:${client}`, 30, 10 * MINUTE],
  ],
  forgot: (email: string, client: string): Limit[] => [
    [`org:forgot:${email}`, 3, 10 * MINUTE],
    [`org:forgot-ip:${client}`, 10, 10 * MINUTE],
  ],
};
