"use client";

import type { ReactNode } from "react";

import { CheckoutDialog } from "@/components/commerce/CheckoutDialog";
import type { AccountCopy } from "@/lib/copy/account";
import type { ChromeCopy } from "@/lib/copy/chrome";

import "@/app/auth.css";

import { AuthProvider } from "./AuthProvider";
import { LoginDialog } from "./LoginDialog";

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
      <LoginDialog t={login} locale={locale} />
      <CheckoutDialog t={checkout} locale={locale} />
    </AuthProvider>
  );
}
