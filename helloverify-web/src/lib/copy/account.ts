/** The `account` namespace registry — gated cart / orders / profile copy. */
import type { Dictionary } from "@/lib/copy";

import { en } from "./account.en";
import { hi } from "./account.hi";
import { ar } from "./account.ar";

export type AccountCopy = typeof en;

export const ACCOUNT: Dictionary<AccountCopy> = { en, hi, ar };
