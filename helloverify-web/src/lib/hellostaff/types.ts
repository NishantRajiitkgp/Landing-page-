/** Shapes shared by `/api/hellostaff/*` and the browser. */

export type HsErrorCode =
  | "invalid_input"
  | "invalid_code"
  | "no_session"
  | "too_large"
  | "rate_limited"
  | "not_connected"
  | "upstream";

export type HsFailure = { ok: false; code: HsErrorCode; message?: string; retryAfter?: number };
export type HsResult<T extends object> = ({ ok: true } & T) | HsFailure;

export type HsPlace = { id: number; name: string };

export type HsRegister = {
  name: string;
  pan: string;
  email: string;
  address: string;
  countryId: number;
  stateId: number;
  cityId: number;
};

/** One Hello Staff `check_questions` field. */
export type HsQuestion = {
  id: number;
  name: string;
  control: "text" | "date" | string;
  mandatory: boolean;
  byApplicant: boolean;
};

export type HsCase = {
  caseId: string;
  name: string;
  mobile: string;
  /** null until `get_package_headers` lists the package's document check. */
  check: {
    checkId: number | null;
    filled: boolean;
    questions: HsQuestion[];
    answers: Record<string, string>;
  } | null;
};

export type HsOrder =
  | { ok: true; demo: true; amount: number }
  | { ok: true; demo: false; amount: number; key: string; orderId: string };

export type HsDigiDoc = { name: string; uri: string };
