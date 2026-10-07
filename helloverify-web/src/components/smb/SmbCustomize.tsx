"use client";

/** `/products/bgv-smb` — the old "Select Your Checks" table and its summary
 *  panel (`BgvSmbVerificationPackagesSection`): a checkbox, the price, an info
 *  tip and a quantity stepper per row; five rows until "Explore More"; the
 *  Buy Now posts the ticked API check codes, one per unit. Every row and tip
 *  stays in the DOM (`hidden`) so the page carries the whole table. */
import { useState } from "react";
import { CommerceCta } from "@/components/commerce/CommerceCta";
import type { BusinessCopy, SmbRowKey } from "@/lib/copy/business";

type C = BusinessCopy["smb"];
export type SmbRow = { key: SmbRowKey; code: string; amount: number; checked?: true };

const VISIBLE = 5;

function cartName(codes: string[]): string {
  const clean = [
    ...new Set(
      codes
        .map((c) =>
          c
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[''`]/g, "")
            .replace(/[^\w\s-]/g, " ")
            .replace(/\s+/g, " ")
            .trim(),
        )
        .filter(Boolean),
    ),
  ];
  return clean.length ? `SMB ${clean.join(" ")} Package` : "SMB Package";
}

function Info({ id, label, text }: { id: string; label: string; text: string }) {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const open = hovered || pinned;
  const close = () => {
    setHovered(false);
    setPinned(false);
  };
  return (
    <span className="smb3-tip" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <button
        type="button"
        aria-label={`${label} details`}
        aria-expanded={open}
        aria-describedby={id}
        onClick={() => {
          setHovered(false);
          setPinned((v) => !v);
        }}
        onBlur={close}
        onKeyDown={(e) => e.key === "Escape" && close()}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="7.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 7v4.5M8 4.6v.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      <span role="tooltip" id={id} hidden={!open}>
        {text}
      </span>
    </span>
  );
}

export function SmbCustomize({ table, summary, rows }: { table: C["table"]; summary: C["summary"]; rows: readonly SmbRow[] }) {
  const [qty, setQty] = useState<Record<string, number>>(() =>
    Object.fromEntries(rows.filter((r) => r.checked).map((r) => [r.key, 1])),
  );
  const [all, setAll] = useState(false);

  const toggle = (k: string) =>
    setQty((q) => {
      if (q[k]) return Object.fromEntries(Object.entries(q).filter(([x]) => x !== k));
      return { ...q, [k]: 1 };
    });
  const step = (k: string, d: number) => setQty((q) => (q[k] ? { ...q, [k]: Math.max(1, q[k] + d) } : q));

  const picked = rows.filter((r) => qty[r.key]);
  const total = picked.reduce((n, r) => n + r.amount * qty[r.key], 0);
  const labels = picked.map((r) => {
    const n = table.rows[r.key].n;
    return qty[r.key] > 1 ? `${n} ×${qty[r.key]}` : n;
  });
  const codes = picked.flatMap((r) => Array.from({ length: qty[r.key] }, () => r.code));
  const price = `₹${total}`;

  return (
    <div className="smb3-cz" id="bgv-smb-select-checks">
      <div className="smb3-tbl">
        <h3>{table.h}</h3>
        <div className="smb3-scroll">
          <div className="smb3-grid" role="table">
            <div className="smb3-tr smb3-th" role="row">
              <span role="columnheader">{table.cols.check}</span>
              <span role="columnheader">{table.cols.pricing}</span>
              <span role="columnheader">{table.cols.action}</span>
            </div>
            {rows.map((r, i) => {
              const row = table.rows[r.key];
              const on = Boolean(qty[r.key]);
              const n = qty[r.key] ?? 1;
              return (
                <div className="smb3-tr" role="row" key={r.key} hidden={!all && i >= VISIBLE}>
                  <span role="cell" className="smb3-ck">
                    <input type="checkbox" checked={on} onChange={() => toggle(r.key)} aria-label={`${row.n} — ${row.price}`} />
                    <span className="nm">{row.n}</span>
                    <Info id={`smb3-tip-${r.key}`} label={row.n} text={row.info} />
                  </span>
                  <span role="cell" className="smb3-pr">{row.price}</span>
                  <span role="cell" className="smb3-qty">
                    <button type="button" disabled={!on} onClick={() => step(r.key, 1)} aria-label={`Increase ${row.n} quantity`}>
                      +
                    </button>
                    <button type="button" disabled={!on || n <= 1} onClick={() => step(r.key, -1)} aria-label={`Decrease ${row.n} quantity`}>
                      −
                    </button>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        {rows.length > VISIBLE ? (
          <button type="button" className="btn btn-line btn-sm smb3-more" aria-expanded={all} onClick={() => setAll((v) => !v)}>
            {all ? table.exploreLess : table.more}
            <svg viewBox="0 0 12 12" aria-hidden="true" style={all ? { transform: "rotate(180deg)" } : undefined}>
              <path d="M6 1.5v9M2 6.5l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : null}
      </div>

      <div className="smb3-sum">
        <div className="hd">
          <h3>{summary.h}</h3>
          <p className="tot" aria-live="polite">{price}</p>
        </div>
        <p className="ds">{summary.p}</p>
        <p className="lb">{summary.checksInclude}</p>
        <ul className="pills" hidden={!labels.length}>
          {labels.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
        <p className="empty" hidden={labels.length > 0}>
          {summary.empty}
        </p>
        {labels.length ? (
          <CommerceCta
            className="btn btn-ink"
            label={summary.buy}
            loginRedirect="products/bgv-smb"
            packageDetails={{
              packageType: "smb",
              packageId: cartName(codes),
              packageName: summary.cartName,
              description: summary.p,
              priceDisplay: price,
              unitAmount: total,
              includedChecks: labels,
              addToCartBody: { check_codes: codes, initial_unit_count: 1 },
            }}
          />
        ) : (
          <button type="button" className="btn btn-ink smb3-off" disabled>
            {summary.buy}
          </button>
        )}
      </div>
    </div>
  );
}
