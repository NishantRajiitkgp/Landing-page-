"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import type { PackageCheckoutDetails } from "@/lib/auth/types";

/** Old `CommerceCtaButton`: logged in → checkout; logged out → OTP then checkout. */
export function CommerceCta({
  label,
  packageDetails,
  className,
  loginRedirect = "orders",
}: {
  label: string;
  packageDetails: PackageCheckoutDetails;
  className?: string;
  loginRedirect?: string;
}) {
  const { isLoggedIn, openLogin, openCheckout } = useAuth();

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (isLoggedIn) {
          openCheckout(packageDetails);
        } else {
          openLogin({ redirect: loginRedirect, afterLoginCheckout: packageDetails });
        }
      }}
    >
      {label}
    </button>
  );
}
