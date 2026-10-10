/** Where a dropped file goes, read from its name: a passport number or the
 *  candidate's name says whose it is, a word says what it is, and a level,
 *  institution or number says which qualification. Anything short of one
 *  clear answer is left for the employer to place. */
import { slotKey } from "../apply/policy";
import type { DocKind } from "../apply/types";

import { candidateSlots, type Candidate } from "./batch";
import { fold, toLevel } from "./cells";

export type Match = { candidate: string | null; slot: string | null };

/** Most specific first: "translated transcript" is a translation. */
const KINDS: [DocKind, RegExp][] = [
  ["translation", /\b(translation|translated|translations)\b/],
  ["supporting", /\b(provisional|affidavit|name ?change|supporting|marriage|gazette)\b/],
  ["transcript", /\b(transcripts?|mark ?sheets?|marks?|grades?|records?|consolidated)\b/],
  ["certificate", /\b(certificates?|cert|degree|diploma|award|convocation|scroll)\b/],
  ["passport", /\b(passport|pp|ppt|bio ?data|biodata|bio)\b/],
];

const NOISE = new Set(["university", "universiti", "universitas", "institute", "institution", "college", "school", "technology", "of", "the", "and", "for", "national"]);

const words = (s: string) => fold(s).split(" ").filter(Boolean);
const stem = (name: string) => name.replace(/\.[a-z0-9]{2,5}$/i, "");

export function kindOf(fileName: string): DocKind | null {
  const s = fold(stem(fileName));
  return KINDS.find(([, re]) => re.test(s))?.[0] ?? null;
}

export function candidateOf(fileName: string, candidates: readonly Candidate[]): Candidate | null {
  const squashed = stem(fileName).toUpperCase().replace(/[^A-Z0-9]/g, "");
  const byPassport = candidates.filter((c) => c.passportNo.length >= 6 && squashed.includes(c.passportNo));
  if (byPassport.length === 1) return byPassport[0];
  if (byPassport.length > 1) return null;

  const have = new Set(words(stem(fileName)));
  const scored = candidates
    .map((c) => ({ c, name: words(c.fullName).filter((w) => w.length > 1) }))
    .filter(({ name }) => name.length > 0 && name.every((w) => have.has(w)))
    .sort((a, b) => b.name.length - a.name.length);
  if (!scored.length) return null;
  if (scored.length > 1 && scored[0].name.length === scored[1].name.length) return null;
  return scored[0].c;
}

function qualOf(fileName: string, c: Candidate): string | null {
  if (c.quals.length === 1) return c.quals[0].id;
  const s = fold(stem(fileName));
  const have = new Set(s.split(" "));

  const index = s.match(/\b(?:q|qual|qualification) ?([1-5])\b/);
  if (index && c.quals[Number(index[1]) - 1]) return c.quals[Number(index[1]) - 1].id;

  const level = toLevel(s);
  const byLevel = level ? c.quals.filter((q) => q.level === level) : [];
  if (byLevel.length === 1) return byLevel[0].id;

  const byPlace = c.quals.filter((q) => words(q.institution).some((w) => w.length > 3 && !NOISE.has(w) && have.has(w)));
  if (byPlace.length === 1) return byPlace[0].id;
  return null;
}

export function matchFile(fileName: string, candidates: readonly Candidate[]): Match {
  const c = candidateOf(fileName, candidates);
  if (!c) return { candidate: null, slot: null };
  const kind = kindOf(fileName);
  if (!kind) return { candidate: c.id, slot: null };
  if (kind === "passport") return { candidate: c.id, slot: slotKey("passport") };
  const qual = qualOf(fileName, c);
  if (!qual) return { candidate: c.id, slot: null };
  const key = slotKey(kind, qual);
  return { candidate: c.id, slot: candidateSlots(c).some((s) => s.key === key) ? key : null };
}
