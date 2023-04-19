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
      sector_otherInput,
      howDoYouUse,
      howDoYouUse_otherInput,
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
        howDoYouUse:
          howDoYouUse && howDoYouUse.includes("Other")
            ? [
                ...howDoYouUse.filter((use) => use !== "Other"),
                `Other: ${howDoYouUse_otherInput || ""}`,
              ]
            : howDoYouUse,
      };

      return updateProfile(id, postData)
        .then((response) => {
          if (response.data && response.data.data) {
            const { attributes } = response.data.data;
            dispatch(
              setAuth({
                loggedIn: true,
                id: response.data.data.id,
                ...attributes,
              })
            );
          }

          return true;
        })
        .catch((error) => {
          const { errors } = (error.response && error.response.data) || {};

          if (errors && errors[0] && errors[0].detail) {
            err = errors[0].detail;
          } else {
            if (error.message) {
              err = error.message;
            }
          }

          return {
            [FORM_ERROR]: err,
          };
        });
    }
);
