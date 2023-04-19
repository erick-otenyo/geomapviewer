import { createStructuredSelector } from "reselect";

import { checkUserProfileFilled } from "@/utils/user";

const selectProfileComplete = (state) =>
  checkUserProfileFilled(state?.auth?.data);

export const getProfileModalProps = createStructuredSelector({
  profileComplete: selectProfileComplete,
});
