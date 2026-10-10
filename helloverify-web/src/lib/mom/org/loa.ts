/** Letters of Authorisation for an employer's batch: shared by the employer's
 *  case list and the candidate's signing page. */
import type { PaidCase } from "./checkout";

/** Signed on the page, or a signed scan the employer uploaded. */
export type LoaMark = { by: "esign" | "upload"; at: string };

/** Signatures by case id. A case starts once its letter is signed. */
export type LoaStatus = Record<string, LoaMark>;

/** What the candidate sees: who asked, and the details they sign for. */
export type LoaView = Omit<PaidCase, "email" | "candidate" | "acc"> & {
  org: string;
  batch: string;
  paidAt: string;
  sentTo: string;
  signed: LoaMark | null;
};

export const LOA_TOKEN_RE = /^[A-Za-z0-9_-]{60,12000}$/;

export const signedCount = (cases: PaidCase[], status: LoaStatus) => cases.filter((c) => status[c.id]).length;
