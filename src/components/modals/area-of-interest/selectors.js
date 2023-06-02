import { createSelector, createStructuredSelector } from "reselect";

import { getAllAreas } from "@/providers/aoi-provider/selectors";

const selectAreasLoading = (state) => state.areas && state.areas?.loading;
const selectAuthLoading = (state) => state.auth && state.auth?.loading;
const selectUserData = (state) => state.auth && state.auth?.data;

const getLoading = createSelector(
  [selectAreasLoading, selectAuthLoading],
  (areasLoading, authLoading) => areasLoading || authLoading
);

export const getAOIModalProps = createStructuredSelector({
  loading: getLoading,
  userData: selectUserData,
  areas: getAllAreas,
});
