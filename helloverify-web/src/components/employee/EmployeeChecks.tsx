/** `/employee-verification` — every check a workforce segment covers, each
 *  with its mark and definition, as one hairline grid of numbered cells. All of them
 *  are on the page at once: the old vertical tab list hid all but one
 *  definition and scrolled its own names inside a 268px box. `cta`, when
 *  given, closes the grid as its last cell. */
import type { ReactNode } from "react";
import { CheckIcon } from "./CheckIcons";

export type EmployeeCheck = { k: string; n: string; p: string };

export function EmployeeChecks({ items, cta }: { items: readonly EmployeeCheck[]; cta?: ReactNode }) {
  return (
    <ul className="emp4-checks">
      {items.map((c, i) => (
        <li key={c.k}>
          <span className="hd" aria-hidden="true">
            <span className="emp4-ic">
              <CheckIcon k={c.k} />
            </span>
            <span className="no">{String(i + 1).padStart(2, "0")}</span>
          </span>
          <h3>{c.n}</h3>
          <p>{c.p}</p>
        </li>
      ))}
      {cta ? <li className="cta">{cta}</li> : null}
    </ul>
  );
}
