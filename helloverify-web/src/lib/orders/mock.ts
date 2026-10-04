import type { InviteResponse, OrderListResponse } from "./types";

export function mockOrderList(): OrderListResponse {
  return { status: true, mock: true, data: [] };
}

export function mockSmbInvite(): InviteResponse {
  return {
    status: true,
    mock: true,
    message: "Candidate invite sent successfully.",
    ci_response: { status: 200, result: { case_id: "CASE-MOCK" } },
    data: { case_id: "CASE-MOCK" },
  };
}

export function mockTravelInvite(): InviteResponse {
  return { status: true, mock: true, message: "Invite sent (mock)", data: { case_id: "CASE-MOCK" } };
}
