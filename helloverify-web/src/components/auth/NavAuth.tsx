"use client";

import { localise } from "@/lib/i18n/href";
import type { ChromeCopy } from "@/lib/copy/chrome";

import { useAuth } from "./AuthProvider";

type UserMenu = ChromeCopy["nav"]["userMenu"];

function closeBurger() {
  const el = document.getElementById("nav-menu-toggle");
  if (el instanceof HTMLInputElement) el.checked = false;
}

export function NavAuth({
  locale,
  signUp,
  account,
  userMenu,
  placement,
  showSignUp = true,
}: {
  locale: string;
  signUp: string;
  account: string;
  userMenu: UserMenu;
  placement: "bar" | "menu";
  showSignUp?: boolean;
}) {
  const { isLoggedIn, user, openLogin, logout } = useAuth();
  const name = user?.name?.trim() || account;

  const links = [
    { href: "/cart", label: userMenu.myCart },
    { href: "/orders", label: userMenu.myOrders },
    { href: "/profile-settings", label: userMenu.profileSettings },
  ] as const;

  if (!isLoggedIn) {
    if (!showSignUp) return null;
    if (placement === "bar") {
      return (
        <button type="button" className="btn btn-line btn-sm nv-signup" onClick={() => openLogin()}>
          {signUp}
        </button>
      );
    }
    return (
      <button
        type="button"
        className="nv-ml nv-signup-menu"
        onClick={() => {
          closeBurger();
          openLogin();
        }}
      >
        <span>{signUp}</span>
        <span className="k">→</span>
      </button>
    );
  }

  if (placement === "menu") {
    return (
      <div className="nv-account-menu">
        <p className="nv-account-name">{name}</p>
        {links.map((l) => (
          <a key={l.href} href={localise(l.href, locale)} className="nv-ml" onClick={closeBurger}>
            <span>{l.label}</span>
            <span className="k">→</span>
          </a>
        ))}
        <button
          type="button"
          className="nv-ml"
          onClick={() => {
            logout();
            closeBurger();
          }}
        >
          <span>{userMenu.logout}</span>
          <span className="k">→</span>
        </button>
      </div>
    );
  }

  return (
    <details className="nv-user">
      <summary className="nv-user-sum">{name}</summary>
      <div className="nv-user-list" role="menu">
        {links.map((l) => (
          <a key={l.href} href={localise(l.href, locale)} role="menuitem">
            {l.label}
          </a>
        ))}
        <button type="button" role="menuitem" onClick={logout}>
          {userMenu.logout}
        </button>
      </div>
    </details>
  );
}
