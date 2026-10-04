"use client";

import { localise } from "@/lib/i18n/href";

export function AccountEmpty({
  locale,
  title,
  body,
  cta,
}: {
  locale: string;
  title: string;
  body: string;
  cta: string;
}) {
  return (
    <div className="ac-empty">
      <h2>{title}</h2>
      <p>{body}</p>
      <a href={localise("/", locale)} className="btn btn-ink btn-sm">
        {cta}
      </a>
    </div>
  );
}
