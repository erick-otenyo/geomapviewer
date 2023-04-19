import * as actions from "./actions";

export const initialState = {
  hidePanels: false,
  hideLegend: false,
  showBasemaps: false,
  showRecentImagery: false,
  showAnalysis: false,
  printRequests: 0,
};

const setMainMapSettings = (state, { payload }) => ({
  ...state,
  ...payload,
});

export default {
  [actions.setMainMapSettings]: setMainMapSettings,
};
