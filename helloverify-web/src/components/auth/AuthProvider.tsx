"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  AUTH_TOKEN_KEY,
  CREDENTIALS_KEY,
  clearSession,
  getAuthToken,
  hasValidAuthToken,
  readSession,
  writeSession,
} from "@/lib/auth/storage";
import type { PackageCheckoutDetails, SessionPayload, TravelUser } from "@/lib/auth/types";

/** Storage is the source of truth for the session. Writes from this tab do not
 *  fire `storage` events, so they announce themselves through `listeners`. */
const listeners = new Set<() => void>();
const announce = () => listeners.forEach((l) => l());

function subscribe(onChange: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === CREDENTIALS_KEY || e.key === AUTH_TOKEN_KEY) onChange();
  };
  listeners.add(onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** A string, so an unchanged session compares equal and does not re-render.
 *  Token validity is part of it, so an expiry is noticed on the next check. */
function snapshot(): string {
  try {
    const creds = sessionStorage.getItem(CREDENTIALS_KEY) ?? "";
    return `${hasValidAuthToken() ? 1 : 0}\n${getAuthToken() ?? ""}\n${creds}`;
  } catch {
    return "";
  }
}

/** `null` on the server and during hydration, so the SSR HTML (always
 *  logged out) and the first client paint match. */
const serverSnapshot = () => null;

type AuthContextValue = {
  ready: boolean;
  isLoggedIn: boolean;
  /** True once `logout` has run in this page's lifetime, so a protected page
   *  can send the visitor home without prompting them to log straight back in. */
  signedOut: boolean;
  user: TravelUser | null;
  loginOpen: boolean;
  checkoutOpen: boolean;
  loginRedirect: string;
  pendingCheckout: PackageCheckoutDetails | null;
  setUser: (session: SessionPayload) => void;
  logout: () => void;
  openLogin: (opts?: { redirect?: string; afterLoginCheckout?: PackageCheckoutDetails | null }) => void;
  closeLogin: () => void;
  openCheckout: (details: PackageCheckoutDetails) => void;
  closeCheckout: () => void;
  refreshSession: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const stored = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const ready = stored !== null;
  const session = useMemo(() => (stored === null ? null : readSession()), [stored]);
  const [loginOpen, setLoginOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [loginRedirect, setLoginRedirect] = useState("orders");
  const [pendingCheckout, setPendingCheckout] = useState<PackageCheckoutDetails | null>(null);
  const [signedOut, setSignedOut] = useState(false);

  const refreshSession = useCallback(() => announce(), []);

  const setUser = useCallback((payload: SessionPayload) => {
    writeSession(payload);
    announce();
    setSignedOut(false);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    announce();
    setSignedOut(true);
    setLoginOpen(false);
    setCheckoutOpen(false);
    setPendingCheckout(null);
  }, []);

  const openLogin = useCallback(
    (opts?: { redirect?: string; afterLoginCheckout?: PackageCheckoutDetails | null }) => {
      setLoginRedirect(opts?.redirect ?? "orders");
      setPendingCheckout(opts?.afterLoginCheckout ?? null);
      setLoginOpen(true);
    },
    [],
  );

  const closeLogin = useCallback(() => {
    setLoginOpen(false);
  }, []);

  const openCheckout = useCallback((details: PackageCheckoutDetails) => {
    setPendingCheckout(details);
    setCheckoutOpen(true);
  }, []);

  const closeCheckout = useCallback(() => {
    setCheckoutOpen(false);
    setPendingCheckout(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      isLoggedIn: stored?.startsWith("1") ?? false,
      signedOut,
      user: session?.user ?? null,
      loginOpen,
      checkoutOpen,
      loginRedirect,
      pendingCheckout,
      setUser,
      logout,
      openLogin,
      closeLogin,
      openCheckout,
      closeCheckout,
      refreshSession,
    }),
    [
      ready,
      stored,
      session,
      signedOut,
      loginOpen,
      checkoutOpen,
      loginRedirect,
      pendingCheckout,
      setUser,
      logout,
      openLogin,
      closeLogin,
      openCheckout,
      closeCheckout,
      refreshSession,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
