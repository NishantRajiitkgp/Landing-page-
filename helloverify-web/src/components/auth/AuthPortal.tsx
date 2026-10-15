"use client";

import dynamic from "next/dynamic";
import { useEffect, type ReactNode } from "react";

import type { AccountCopy } from "@/lib/copy/account";
import type { ChromeCopy } from "@/lib/copy/chrome";

import "@/app/auth.css";

import { AuthProvider, useAuth } from "./AuthProvider";

const loadLogin = () => import("./LoginDialog");
const loadCheckout = () => import("@/components/commerce/CheckoutDialog");

/** Both dialogs render nothing while closed, yet their code was parsed and
 *  hydrated on every page. They load on demand instead, and are fetched in
 *  idle time after load so the first click does not wait on the network. */
const LoginDialog = dynamic(() => loadLogin().then((m) => m.LoginDialog), { ssr: false });
const CheckoutDialog = dynamic(() => loadCheckout().then((m) => m.CheckoutDialog), { ssr: false });

function Dialogs({ login, checkout, locale }: { login: ChromeCopy["login"]; checkout: AccountCopy["checkout"]; locale: string }) {
  const { loginOpen, checkoutOpen } = useAuth();

  useEffect(() => {
    const warm = () => {
      void loadLogin();
      void loadCheckout();
    };
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(warm, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(warm, 2000);
    return () => clearTimeout(id);
  }, []);

  return (
    <>
      {loginOpen ? <LoginDialog t={login} locale={locale} /> : null}
      {checkoutOpen ? <CheckoutDialog t={checkout} locale={locale} /> : null}
    </>
  );
}

/** Client boundary for OTP + checkout. Copy is a prop — this file must not import `lib/copy`. */
export function AuthPortal({
  login,
  checkout,
  locale,
  children,
}: {
  login: ChromeCopy["login"];
  checkout: AccountCopy["checkout"];
  locale: string;
  children: ReactNode;
}) {
  return (
    <AuthProvider>
      {children}
      <Dialogs login={login} checkout={checkout} locale={locale} />
    </AuthProvider>
  );
}
