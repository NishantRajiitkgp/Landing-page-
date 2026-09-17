/** Structured logging for the lead pipeline.
 *
 *  Single-line JSON on stdout is what Cloud Logging ingests, and `severity` is
 *  the field it promotes to the log level. The shape is deliberately stable:
 *  these lines are the abuse-tuning evidence and, on the failure path, the
 *  lead-recovery path.
 */
import "server-only";

export type Severity = "INFO" | "WARNING" | "ERROR";

/** Emitted once per process for conditions that are permanent until someone
 *  changes a config value — repeating them every request buries the signal. */
const warnedOnce = new Set<string>();

export function logEvent(severity: Severity, event: string, payload: Record<string, unknown> = {}) {
  const line = JSON.stringify({
    severity,
    event,
    time: new Date().toISOString(),
    ...payload,
  });
  if (severity === "ERROR") console.error(line);
  else if (severity === "WARNING") console.warn(line);
  else console.log(line);
}

export function logOnce(severity: Severity, event: string, payload: Record<string, unknown> = {}) {
  if (warnedOnce.has(event)) return;
  warnedOnce.add(event);
  logEvent(severity, event, payload);
}
