"use client";

import { useCallback, useSyncExternalStore } from "react";

/** One JSON value per account in localStorage. `memory` covers browsers that
 *  refuse storage (private mode, quota), for the life of the tab. */
export function deviceStore<T>(prefix: string, parse: (raw: string | null) => T, empty: T) {
  const memory = new Map<string, string>();
  const listeners = new Set<() => void>();
  let cache: { key: string; raw: string | null; value: T } | null = null;

  function readRaw(key: string): string | null {
    if (memory.has(key)) return memory.get(key) ?? null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function read(id: string): T {
    const key = prefix + id;
    const raw = readRaw(key);
    if (cache?.key === key && cache.raw === raw) return cache.value;
    cache = { key, raw, value: parse(raw) };
    return cache.value;
  }

  function write(id: string, value: T) {
    const key = prefix + id;
    const raw = JSON.stringify(value);
    memory.set(key, raw);
    try {
      window.localStorage.setItem(key, raw);
    } catch {
      /* memory keeps it for this tab */
    }
    cache = { key, raw, value };
    listeners.forEach((l) => l());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    window.addEventListener("storage", listener);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", listener);
    };
  }

  function forget(id: string) {
    const key = prefix + id;
    memory.delete(key);
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* already unreachable */
    }
    if (cache?.key === key) cache = null;
    listeners.forEach((l) => l());
  }

  /** The value and a functional updater; `stamp` runs on every write. */
  function useDeviceValue(id: string, stamp: (value: T) => T = (v) => v) {
    const value = useSyncExternalStore(subscribe, () => read(id), () => empty);
    const update = useCallback((change: (value: T) => T) => write(id, stamp(change(read(id)))), [id, stamp]);
    return [value, update] as const;
  }

  return Object.assign(useDeviceValue, { forget });
}
