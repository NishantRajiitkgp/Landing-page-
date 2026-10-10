"use client";

import { useEffect, useRef, useState } from "react";

import { precheck } from "@/lib/mom/apply/client";
import type { ApplyFailure, DocRef } from "@/lib/mom/apply/types";
import type { Candidate } from "@/lib/mom/org/batch";
import { uploadCandidateDoc } from "@/lib/mom/org/batchClient";
import { matchFile } from "@/lib/mom/org/match";

/** A file waiting for the employer to say whose it is and what it is. Held in
 *  memory only: a dropped file is never written to the device. */
export type TrayItem = { id: string; file: File; candidate: string; slot: string; error?: string };

type Job = { id: string; file: File; candidate: string; slot: string };

const PARALLEL = 3;
const newId = () => Math.random().toString(36).slice(2, 10);
const keyOf = (candidate: string, slot: string) => `${candidate}|${slot}`;

export type BulkStats = { done: number; total: number; placed: number; trayed: number };

export function useBulkUpload({
  onPlaced,
  message,
}: {
  onPlaced: (candidate: string, slot: string, doc: DocRef) => void;
  message: (failure: ApplyFailure) => string;
}) {
  const [tray, setTray] = useState<TrayItem[]>([]);
  const [stats, setStats] = useState<BulkStats>({ done: 0, total: 0, placed: 0, trayed: 0 });
  const pending = useRef<Job[]>([]);
  const running = useRef(0);
  /** Slots with a file on the way, so a second drop can't race the first. */
  const inFlight = useRef(new Set<string>());
  const handlers = useRef({ onPlaced, message });
  useEffect(() => {
    handlers.current = { onPlaced, message };
  });

  function pump() {
    while (running.current < PARALLEL && pending.current.length) {
      const job = pending.current.shift() as Job;
      running.current++;
      void uploadCandidateDoc(job.candidate, job.file, job.slot, () => {}).done.then((res) => {
        running.current--;
        inFlight.current.delete(keyOf(job.candidate, job.slot));
        if (res.ok) handlers.current.onPlaced(job.candidate, job.slot, res.doc);
        else setTray((t) => [...t, { ...job, error: handlers.current.message(res) }]);
        setStats((s) => ({ ...s, done: s.done + 1, placed: s.placed + (res.ok ? 1 : 0), trayed: s.trayed + (res.ok ? 0 : 1) }));
        pump();
      });
    }
  }

  function enqueue(jobs: Job[], trayed: number) {
    for (const j of jobs) inFlight.current.add(keyOf(j.candidate, j.slot));
    pending.current.push(...jobs);
    setStats((s) => {
      const idle = s.done === s.total;
      return idle
        ? { done: 0, total: jobs.length, placed: 0, trayed }
        : { ...s, total: s.total + jobs.length, trayed: s.trayed + trayed };
    });
    pump();
  }

  /** Every file whose place is clear goes up; the rest wait in the tray. */
  function drop(files: readonly File[], candidates: readonly Candidate[]) {
    const jobs: Job[] = [];
    const waiting: TrayItem[] = [];
    const claimed = new Set<string>();
    for (const file of files) {
      const early = precheck(file);
      const m = matchFile(file.name, candidates);
      const c = m.candidate ? candidates.find((x) => x.id === m.candidate) : undefined;
      const key = c && m.slot ? keyOf(c.id, m.slot) : null;
      const free = key && m.slot && c && !c.docs[m.slot] && !claimed.has(key) && !inFlight.current.has(key);
      if (!early && free && c && m.slot) {
        claimed.add(key);
        jobs.push({ id: newId(), file, candidate: c.id, slot: m.slot });
      } else {
        waiting.push({ id: newId(), file, candidate: m.candidate ?? "", slot: m.slot ?? "", error: early ? message(early) : undefined });
      }
    }
    if (waiting.length) setTray((t) => [...t, ...waiting]);
    enqueue(jobs, waiting.length);
  }

  function place(id: string) {
    const item = tray.find((x) => x.id === id);
    if (!item || !item.candidate || !item.slot) return;
    setTray((t) => t.filter((x) => x.id !== id));
    enqueue([{ id: item.id, file: item.file, candidate: item.candidate, slot: item.slot }], 0);
  }

  const edit = (id: string, patch: Partial<Pick<TrayItem, "candidate" | "slot">>) =>
    setTray((t) => t.map((x) => (x.id === id ? { ...x, ...patch, error: undefined } : x)));
  const discard = (id: string) => setTray((t) => t.filter((x) => x.id !== id));

  return { tray, stats, busy: stats.done < stats.total, drop, place, edit, discard };
}
