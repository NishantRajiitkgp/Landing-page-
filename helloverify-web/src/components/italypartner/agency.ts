"use client";

import { useSyncExternalStore } from "react";

import { agentCode, isAgentCode } from "@/lib/italy/partner/code";
import { FILE_MAX_BYTES } from "@/lib/mom/apply/policy";

export const VOLUMES = ["under10", "10-25", "26-75", "76+"] as const;
export const SETTLES = ["client", "wallet"] as const;
export const DOC_SLOTS = ["pan", "address", "bank", "gst"] as const;
export const REQUIRED_DOCS = ["pan", "address", "bank"] as const;

export type Volume = (typeof VOLUMES)[number];
export type Settle = (typeof SETTLES)[number];
export type DocSlot = (typeof DOC_SLOTS)[number];

export type PartnerDoc = { id: string; name: string; size: number; type: string };

export type Docs = Record<DocSlot, PartnerDoc | null>;

export type AgencyDraft = {
  v: 1;
  name: string;
  city: string;
  volume: Volume;
  settle: Settle;
  docs: Docs;
  /** Required documents were handed over. GST stays optional. */
  sent: boolean;
  /** The document check is finished, so the agreement can be signed. */
  cleared: boolean;
  agreement: PartnerDoc | null;
  signed: boolean;
  /** The signed agreement is accepted, so the agent code is active. */
  live: boolean;
  code: string | null;
};

const EMPTY_DOCS: Docs = { pan: null, address: null, bank: null, gst: null };

const PREFIX = "hv-it-partner:";
const memory = new Map<string, string>();
const listeners = new Set<() => void>();
let cache: { key: string; raw: string | null; draft: AgencyDraft | null } | null = null;

export function isPlace(value: string, max: number): boolean {
  const text = value.replace(/\s+/g, " ").trim();
  return text.length >= 2 && text.length <= max && /\p{L}/u.test(text);
}

export function tidy(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function isDoc(value: unknown): value is PartnerDoc {
  if (!value || typeof value !== "object") return false;
  const d = value as PartnerDoc;
  return (
    typeof d.id === "string" &&
    d.id.length >= 20 &&
    d.id.length <= 4096 &&
    typeof d.name === "string" &&
    d.name.length > 0 &&
    d.name.length <= 120 &&
    typeof d.size === "number" &&
    d.size > 0 &&
    d.size <= FILE_MAX_BYTES &&
    (d.type === "application/pdf" || d.type === "image/jpeg" || d.type === "image/png")
  );
}

function docsOf(value: unknown): Docs {
  const raw = value && typeof value === "object" ? (value as Partial<Docs>) : {};
  return {
    pan: isDoc(raw.pan) ? raw.pan : null,
    address: isDoc(raw.address) ? raw.address : null,
    bank: isDoc(raw.bank) ? raw.bank : null,
    gst: isDoc(raw.gst) ? raw.gst : null,
  };
}

export function docsReady(docs: Docs): boolean {
  return REQUIRED_DOCS.every((slot) => docs[slot] !== null);
}

function parse(raw: string | null): AgencyDraft | null {
  if (!raw) return null;
  try {
    const d = JSON.parse(raw) as AgencyDraft;
    if (d?.v !== 1 || !isPlace(d.name, 80) || !isPlace(d.city, 40)) return null;
    if (!VOLUMES.includes(d.volume) || !SETTLES.includes(d.settle)) return null;
    const docs = docsOf(d.docs);
    return {
      v: 1,
      name: tidy(d.name),
      city: tidy(d.city),
      volume: d.volume,
      settle: d.settle,
      docs,
      sent: d.sent === true && docsReady(docs),
      cleared: d.cleared === true && d.sent === true && docsReady(docs),
      agreement: isDoc(d.agreement) ? d.agreement : null,
      signed: d.signed === true && d.cleared === true && isDoc(d.agreement),
      live: d.live === true && d.signed === true && d.cleared === true && isDoc(d.agreement) && isAgentCode(d.code),
      code: isAgentCode(d.code) ? d.code : null,
    };
  } catch {
    return null;
  }
}

function readRaw(key: string): string | null {
  if (memory.has(key)) return memory.get(key) ?? null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function read(id: string): AgencyDraft | null {
  const key = PREFIX + id;
  const raw = readRaw(key);
  if (cache?.key === key && cache.raw === raw) return cache.draft;
  cache = { key, raw, draft: parse(raw) };
  return cache.draft;
}

function write(id: string, draft: AgencyDraft) {
  const key = PREFIX + id;
  const raw = JSON.stringify(draft);
  memory.set(key, raw);
  try {
    window.localStorage.setItem(key, raw);
  } catch {
    /* private mode keeps the in-memory copy */
  }
  cache = { key, raw, draft };
  listeners.forEach((fn) => fn());
}

export function saveAgency(id: string, draft: Omit<AgencyDraft, "docs" | "sent" | "cleared" | "agreement" | "signed" | "live" | "code">) {
  const prev = read(id);
  write(id, {
    ...draft,
    docs: prev?.docs ?? EMPTY_DOCS,
    sent: prev?.sent ?? false,
    cleared: prev?.cleared ?? false,
    agreement: prev?.agreement ?? null,
    signed: prev?.signed ?? false,
    live: prev?.live ?? false,
    code: prev?.code ?? null,
  });
}

export function saveDoc(id: string, slot: DocSlot, doc: PartnerDoc | null) {
  const prev = read(id);
  if (!prev) return;
  const docs = { ...prev.docs, [slot]: doc };
  const dropped = slot !== "gst" && doc === null;
  const sent = dropped ? false : prev.sent && docsReady(docs);
  const signed = sent && prev.signed;
  write(id, { ...prev, docs, sent, cleared: sent && prev.cleared, signed, live: signed && prev.live });
}

export function markSent(id: string, cleared: boolean) {
  const prev = read(id);
  if (!prev || !docsReady(prev.docs)) return;
  write(id, { ...prev, sent: true, cleared });
}

export function saveAgreement(id: string, doc: PartnerDoc | null) {
  const prev = read(id);
  if (!prev) return;
  const signed = Boolean(doc) && prev.signed;
  write(id, { ...prev, agreement: doc, signed, live: signed && prev.live });
}

export function markSigned(id: string, live: boolean) {
  const prev = read(id);
  if (!prev?.agreement || !prev.cleared) return;
  write(id, { ...prev, signed: true, live, code: live ? (prev.code ?? agentCode(id)) : prev.code });
}

export function forgetAgency(id: string) {
  const key = PREFIX + id;
  memory.delete(key);
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* already unreachable */
  }
  if (cache?.key === key) cache = null;
  listeners.forEach((fn) => fn());
}

export function useAgency(id: string): AgencyDraft | null {
  return useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      return () => listeners.delete(onStoreChange);
    },
    () => read(id),
    () => null,
  );
}
