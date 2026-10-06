/** The three package-card marks. The old page used the blue header icons;
 *  these are the same three subjects drawn for the ink-and-paper cards. */

export function HomeStaffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1Z" />
    </svg>
  );
}

export function DriverIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 4v3.2M12 16.8V20M4 12h3.2M16.8 12H20" />
    </svg>
  );
}

export function TenantIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="7" cy="12" r="4" />
      <path d="M11 12h10M16.6 12v3.2M19.4 12v3.2" />
    </svg>
  );
}
