"use client";

import { useCallback, useEffect, useState } from "react";

import { authorityClient } from "@/lib/authority/client";
import { flattenPackages, type PackageRow } from "@/lib/authority/invite";
import type { AuthorityId } from "@/lib/authority/portals";
import type { AuthorityCopy } from "@/lib/copy/authority";

type DialRow = { Dialingcode: string; country_name?: string };

export const FALLBACK_DIALS: readonly DialRow[] = [
  { Dialingcode: "+91", country_name: "India" },
  { Dialingcode: "+65", country_name: "Singapore" },
  { Dialingcode: "+971", country_name: "UAE" },
];

/** The packages and calling codes the register form offers, fetched on mount.
 *  A failed package load is reported through the form's own `setError`. */
export function useRegisterOptions(
  authority: AuthorityId,
  failedMessage: string,
  setError: (message: string | null) => void,
) {
  const [dial, setDial] = useState("+91");
  const [dials, setDials] = useState<DialRow[]>([]);
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [pkgId, setPkgId] = useState<number | null>(null);
  /** `true` from the start, so the mount effect never has to set it. */
  const [pkgLoading, setPkgLoading] = useState(true);

  /** Sets state only once the request settles. */
  const fetchPackages = useCallback(
    () =>
      authorityClient
        .packages(authority)
        .then((res) => {
          const list = flattenPackages(res);
          setPackages(list);
          if (list[0]) setPkgId(list[0].client_package_id);
          if (!list.length) setError(failedMessage);
        })
        .catch(() => setError(failedMessage))
        .finally(() => setPkgLoading(false)),
    [authority, failedMessage, setError],
  );

  function loadPackages() {
    setPkgLoading(true);
    setError(null);
    void fetchPackages();
  }

  useEffect(() => {
    void fetchPackages();
    void authorityClient.dialCodes(authority).then((res) => {
      const rows = (res.result ?? []).filter((r) => r.Dialingcode);
      if (rows.length) {
        setDials(rows);
        const preferred = rows.find((r) => r.Dialingcode === "+91") ?? rows[0];
        if (preferred) setDial(preferred.Dialingcode);
      }
    });
  }, [authority, fetchPackages]);

  return {
    dial,
    setDial,
    dials: dials.length ? dials : FALLBACK_DIALS,
    packages,
    pkgId,
    setPkgId,
    pkgLoading,
    loadPackages,
    selected: packages.find((p) => p.client_package_id === pkgId) ?? null,
  };
}

export function ApplicantPackages({
  t,
  packages,
  pkgId,
  onPick,
  loading,
  onLoad,
}: {
  t: AuthorityCopy["dialog"];
  packages: readonly PackageRow[];
  pkgId: number | null;
  onPick: (id: number) => void;
  loading: boolean;
  onLoad: () => void;
}) {
  return (
    <>
      <span className="lg-label">{t.selectPackage}</span>
      {loading && packages.length === 0 ? <p className="lg-sub">{t.loadingPackages}</p> : null}
      {!loading && packages.length === 0 ? (
        <button type="button" className="btn btn-line btn-sm" onClick={onLoad}>
          {t.loadPackages}
        </button>
      ) : null}
      {packages.map((pkg) => (
        <label key={pkg.client_package_id} className={`lg-pkg${pkgId === pkg.client_package_id ? " is-on" : ""}`}>
          <input
            type="radio"
            name="ap-pkg"
            checked={pkgId === pkg.client_package_id}
            onChange={() => onPick(pkg.client_package_id)}
          />
          <span>
            <strong>{pkg.package}</strong>
            {pkg.checks ? (
              <span className="lg-sub"> {Array.isArray(pkg.checks) ? pkg.checks.join(", ") : pkg.checks}</span>
            ) : null}
          </span>
        </label>
      ))}
    </>
  );
}
