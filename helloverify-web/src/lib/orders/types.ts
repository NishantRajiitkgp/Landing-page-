/** Order + invite shapes from the old SPA `travelAssistance.ts`. */

import type { ApiEnvelope } from "@/lib/auth/types";

export type PersonVerificationStatus = {
  status: string;
  status_code: string;
};

export type OrderCartItem = {
  uuid?: string;
  check_name?: string;
  package?: string;
  package_type?: string;
  persons?: number;
  unit_count?: number;
  price?: number;
  total_amount?: number;
  currency?: string;
  case_ids?: (string | null)[];
  check_code?: string;
  quantity?: number;
  visa?: string;
  personStatuses?: PersonVerificationStatus[];
};

export type OrderRow = {
  order_id?: string;
  created_at?: string;
  amount?: number;
  user_card?: OrderCartItem[];
  cart_items?: OrderCartItem[];
};

export type OrderListResponse = ApiEnvelope<OrderRow[]> & {
  mock?: boolean;
};

export type SendInvitePayload = {
  order_id: string;
  user_cart_id: string;
  member_index: number;
  candidate_name: string;
  candidate_email: string;
  candidate_mobile: string;
};

export type SmbSendInvitePayload = {
  uuid: string;
  package_id: string | number;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  member_index?: number;
};

export type InviteResponse = ApiEnvelope<{ case_id?: string }> & {
  mock?: boolean;
  message?: string;
  ci_response?: { status?: number; result?: { case_id?: string } };
};

export type CandidateRoute = {
  order_id?: string;
  user_cart_id?: string;
  member_id?: string;
  package_id?: string;
};
