/** Demo fixtures for the employer account, shown only when the API reports `demo`. */
export { DEMO_CODE, DEMO_DUPLICATE_EMAIL } from "@/lib/mom/account/demo";

export const ORG_DEMO_SEED = {
  email: "hr@helloverify.com",
  password: "Demo1234",
  org: "Straits Marine Engineering Pte Ltd",
  reg: "201912345K",
  kind: "employer",
  first: "Daniel",
  last: "Tan",
  dial: "+65",
  phone: "91234567",
} as const;
