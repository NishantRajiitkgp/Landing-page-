import type { HsPlace } from "@/lib/hellostaff/types";

export function PlaceSelect({
  id,
  label,
  choose,
  value,
  places,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  choose: string;
  value: string;
  places: HsPlace[];
  disabled?: boolean;
  onChange: (id: string) => void;
}) {
  return (
    <div className="ma-field">
      <label className="ma-l" htmlFor={id}>
        {label} *
      </label>
      <div className="ma-ctl mf-sel">
        <select id={id} className={value ? undefined : "is-empty"} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)}>
          <option value="">{choose}</option>
          {places.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
