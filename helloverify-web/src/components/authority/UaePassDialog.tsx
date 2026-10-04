"use client";

import { UAE_PASS } from "@/lib/authority/portals";
import type { AuthorityCopy } from "@/lib/copy/authority";

export function UaePassDialog({
  open,
  onClose,
  t,
}: {
  open: boolean;
  onClose: () => void;
  t: AuthorityCopy["entry"];
}) {
  if (!open) return null;

  return (
    <div
      className="lg-scrim"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="lg-panel lg-wide" role="dialog" aria-modal="true" aria-label={t.uaePassAria}>
        <div className="lg-form">
          <h2 className="lg-title">{t.uaePassAria}</h2>
          <div className="lg-row">
            <div>
              <h3 className="lg-label">{t.uaePassAndroidTitle}</h3>
              <a className="btn btn-ink btn-sm lg-btn" href={UAE_PASS.android} target="_blank" rel="noopener noreferrer">
                {t.uaePassAndroidCta}
              </a>
            </div>
            <div>
              <h3 className="lg-label">{t.uaePassIosTitle}</h3>
              <a className="btn btn-ink btn-sm lg-btn" href={UAE_PASS.ios} target="_blank" rel="noopener noreferrer">
                {t.uaePassIosCta}
              </a>
              <p className="lg-sub">{t.uaePassIosNote}</p>
            </div>
          </div>
          <button type="button" className="lg-edit" onClick={onClose}>
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
