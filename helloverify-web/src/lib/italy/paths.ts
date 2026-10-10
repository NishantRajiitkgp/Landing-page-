/** Locale-relative paths of the Italy visa partner programme. */
export const ITALY_PATH = "/governments/immigration/embassy-of-italy";
export const ITALY_PARTNERS_PATH = `${ITALY_PATH}/partners`;
export const ITALY_JOIN_PATH = `${ITALY_PARTNERS_PATH}/join`;
export const ITALY_SIGN_IN_PATH = `${ITALY_PARTNERS_PATH}/sign-in`;

export type ItalyPartnerPath = typeof ITALY_JOIN_PATH | typeof ITALY_SIGN_IN_PATH | typeof ITALY_PARTNERS_PATH;
