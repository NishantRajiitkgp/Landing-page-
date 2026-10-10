/** Locale-relative paths of the MOM applicant and employer flows. */
export const MOM_PATH = "/solutions/manpower-and-education-authorities/ministry-of-manpower";
export const MOM_REGISTER_PATH = `${MOM_PATH}/register`;
export const MOM_SIGN_IN_PATH = `${MOM_PATH}/sign-in`;
export const MOM_APPLY_PATH = `${MOM_PATH}/apply`;

export const MOM_ORG_PATH = `${MOM_PATH}/employers`;
export const MOM_ORG_REGISTER_PATH = `${MOM_ORG_PATH}/register`;
export const MOM_ORG_SIGN_IN_PATH = `${MOM_ORG_PATH}/sign-in`;
/** Where an employer's candidate signs their Letter of Authorisation. The
 *  link's token rides in the fragment, so it never reaches a server log. */
export const MOM_LOA_PATH = `${MOM_PATH}/authorise`;

export type MomFlowPath =
  | typeof MOM_LOA_PATH
  | typeof MOM_REGISTER_PATH
  | typeof MOM_SIGN_IN_PATH
  | typeof MOM_APPLY_PATH
  | typeof MOM_ORG_PATH
  | typeof MOM_ORG_REGISTER_PATH
  | typeof MOM_ORG_SIGN_IN_PATH;
