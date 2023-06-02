import { createThunkAction } from "@/redux/actions";
import { FORM_ERROR } from "final-form";

import { updateProfile } from "@/services/user";
import { setAuth } from "@/providers/auth-provider/actions";

export const saveProfile = createThunkAction(
  "saveProfile",
  ({
      id,
      signUpForNewsletter,
      sector,
      sector_other_input: sector_otherInput,
      how_do_you_use: howDoYouUse,
      how_do_you_use_other_input: howDoYouUse_otherInput,
      loggedIn,
      ...rest
    }) =>
    (dispatch) => {
      const postData = {
        ...rest,
        sector:
          sector && sector.includes("Other")
            ? `Other: ${sector_otherInput || ""}`
            : sector,
        how_do_you_use:
          howDoYouUse && howDoYouUse.includes("Other")
            ? [
                ...howDoYouUse.filter((use) => use !== "Other"),
                `Other: ${howDoYouUse_otherInput || ""}`,
              ]
            : howDoYouUse,
      };

      return updateProfile(id, postData)
        .then((response) => {
          if (response.data) {
            const { data } = response;

            dispatch(
              setAuth({
                loggedIn: true,
                id: data.user_id,
                ...data,
              })
            );
          }

          return true;
        })
        .catch((err) => {
          const error = (err.response && err.response.data) || {};

          let message = "Error occured. Please try again later";

          if (error.detail) {
            message = error.detail;
          }

          return {
            [FORM_ERROR]: message,
          };
        });
    }
);
