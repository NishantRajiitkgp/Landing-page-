/** Upstream failures, without the host's own error text. */
import "server-only";

export class UpstreamFailure extends Error {
  readonly status: number;
  constructor(status: number) {
    super("upstream");
    this.name = "UpstreamFailure";
    this.status = status;
  }
}

/** 401/403 become "sign in again". Anything else is a fixed message: the
 *  upstream body can name internal hosts and stack details. */
export function proxyFail(e: unknown, fallback: string): Response {
  const denied = e instanceof UpstreamFailure && (e.status === 401 || e.status === 403);
  return Response.json(
    { status: false, message: denied ? "Please sign in again" : fallback },
    { status: denied ? 401 : 502 },
  );
}
