/** Persist the invite query so a refresh on /orders/candidate still has ids. */

import type { CandidateRoute } from "./types";

const KEY = "candidateRoute";

function store(): Storage | null {
  try {
    if (typeof sessionStorage === "undefined") return null;
    return sessionStorage;
  } catch {
    return null;
  }
}

export function readCandidateRoute(): CandidateRoute {
  const raw = store()?.getItem(KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as CandidateRoute;
  } catch {
    return {};
  }
}

export function persistCandidateRoute(next: CandidateRoute): void {
  const prev = readCandidateRoute();
  store()?.setItem(KEY, JSON.stringify({ ...prev, ...next }));
}
