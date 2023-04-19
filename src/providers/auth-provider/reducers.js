import * as actions from "./actions";

export const initialState = {
  loading: false,
  error: false,
  data: {},
};

const setAuthLoading = (state, { payload }) => ({
  ...state,
  ...payload,
  data: {},
});

const setAuth = (state, { payload }) => ({
  ...state,
  data: payload,
  loading: false,
  error: false,
});

export default {
  [actions.setAuth]: setAuth,
  [actions.setAuthLoading]: setAuthLoading,
};
