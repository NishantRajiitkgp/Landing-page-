"use client";

/** Closes the CSS-only burger menu (`SiteNav`'s `#nav-menu-toggle`) when one
 *  of its links is followed. A link to another page reloads the document, but
 *  a same-page fragment such as `/en#consumer-services` does not, and the
 *  checkbox would stay checked with the open menu covering the section it
 *  just scrolled to. Unchecking before navigation also keeps the browser's
 *  form-state restore from reopening the menu on Back. */
import { useEffect } from "react";

export function MenuClose() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!(e.target instanceof Element) || !e.target.closest("nav.menu a")) return;
      const toggle = document.getElementById("nav-menu-toggle");
      if (toggle instanceof HTMLInputElement) toggle.checked = false;
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
