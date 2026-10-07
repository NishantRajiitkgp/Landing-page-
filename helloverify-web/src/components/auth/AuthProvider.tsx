"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { clearSession, hasValidAuthToken, readSession, writeSession } from "@/lib/auth/storage";
import type { PackageCheckoutDetails, SessionPayload, TravelUser } from "@/lib/auth/types";

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
  /** Start empty so the SSR HTML and the first client paint match. */
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [loginRedirect, setLoginRedirect] = useState("orders");
  const [pendingCheckout, setPendingCheckout] = useState<PackageCheckoutDetails | null>(null);
  const [signedOut, setSignedOut] = useState(false);

  const refreshSession = useCallback(() => {
    setSession(readSession());
  }, []);

  useEffect(() => {
    setSession(readSession());
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "currentUser") refreshSession();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refreshSession]);

  const setUser = useCallback((payload: SessionPayload) => {
    writeSession(payload);
    setSession(payload);
    setSignedOut(false);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
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
      isLoggedIn: ready && hasValidAuthToken(),
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
