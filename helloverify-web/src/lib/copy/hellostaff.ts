/** Hello Staff checkout namespace — `/products/hellov/verify/[service]`. */
import type { Dictionary } from "@/lib/copy";

import { en } from "./hellostaff.en";
import { hi } from "./hellostaff.hi";
import { ar } from "./hellostaff.ar";

export type HellostaffCopy = typeof en;

export const HELLOSTAFF: Dictionary<HellostaffCopy> = { en, hi, ar };
