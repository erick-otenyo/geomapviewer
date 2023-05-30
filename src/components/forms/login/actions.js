import { FORM_ERROR } from "final-form";

import { createThunkAction } from "@/redux/actions";

import { login, register, resetPassword } from "@/services/user";
import { getUserProfile } from "@/providers/auth-provider/actions";

export const loginUser = createThunkAction(
  "logUserIn",
  (data) => (dispatch) =>
    login(data)
      .then((response) => {
        if (response.status < 400 && response.data) {
          dispatch(getUserProfile());
        }
      })
      .catch((err) => {
        const error = (err.response && err.response.data) || {};

        return {
          [FORM_ERROR]:
            (error && error.detail) || (error.message && error.message),
        };
      })
);

export const registerUser = createThunkAction(
  "sendRegisterUser",
  (data) => () =>
    register(data)
      .then(() => {})
      .catch((err) => {
        const error = err.response.data;

        let message = "Error occured. Please try again later";

        if (error.username) {
          message = error.username[0];
        }

        return {
          [FORM_ERROR]: message,
        };
      })
);

export const resetUserPassword = createThunkAction(
  "sendResetPassword",
  (data) => () =>
    resetPassword(data)
      .then(() => {})
      .catch((err) => {
        const error = err.response.data;

        let message = "Error occured. Please try again later"

        if(error.username){
          message = error.username
        }

        return {
          [FORM_ERROR]: message,
        };
      })
);
