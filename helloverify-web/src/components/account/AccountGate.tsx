"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { localise } from "@/lib/i18n/href";

import "@/app/account.css";

/** Old `ProtectedRoute`: logged out → home + OTP, `redirect: 'orders'`. */
export function AccountGate({
  locale,
  loading,
  children,
}: {
  locale: string;
  loading: string;
  children: ReactNode;
}) {
  const { ready, isLoggedIn, openLogin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!isLoggedIn) {
      openLogin({ redirect: "orders" });
      router.replace(localise("/", locale));
    }
  }, [ready, isLoggedIn, openLogin, router, locale]);

  if (!ready || !isLoggedIn) {
    return <p className="ac-status">{loading}</p>;
  }
  return <>{children}</>;
}
