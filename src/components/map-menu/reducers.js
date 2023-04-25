import * as actions from "./actions";

export const initialState = {
  locations: [],
  loading: false,
  settings: {
    menuSection: "",
    datasetCategory: "",
    exploreType: "topics",
    searchType: "location",
    myHWType: "myAOI",
    search: "",
    selectedCountries: [],
    subCategoryGroupsSelected: {},
  },
};

const setLocationsData = (state, { payload }) => ({
  ...state,
  locations: payload,
});

const setMenuSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload,
  },
});

const setMenuLoading = (state, { payload }) => ({
  ...state,
  loading: payload,
});

export default {
  [actions.setLocationsData]: setLocationsData,
  [actions.setMenuSettings]: setMenuSettings,
  [actions.setMenuLoading]: setMenuLoading,
};
