import { createStructuredSelector } from "reselect";

const selectPrivacyPolicyPageUrl = (state) =>
  state?.config?.links?.privacyPolicyPageUrl;

export const getProps = createStructuredSelector({
  privacyPolicyPageUrl: selectPrivacyPolicyPageUrl,
});
