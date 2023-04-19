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
      .catch((error) => {
        const { errors } = (error.response && error.response.data) || {};

        return {
          [FORM_ERROR]:
            (errors && errors[0].detail) || (error.message && error.message),
        };
      })
);

export const registerUser = createThunkAction(
  "sendRegisterUser",
  (data) => () =>
    register(data)
      .then(() => {})
      .catch((error) => {
        const { errors } = error.response.data;

        return {
          [FORM_ERROR]: errors[0].detail,
        };
      })
);

export const resetUserPassword = createThunkAction(
  "sendResetPassword",
  (data) => () =>
    resetPassword(data)
      .then(() => {})
      .catch((error) => {
        const { errors } = error.response.data;

        return {
          [FORM_ERROR]: errors[0].detail,
        };
      })
);
