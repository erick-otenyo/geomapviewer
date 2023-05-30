import { createStructuredSelector, createSelector } from "reselect";
import isEmpty from "lodash/isEmpty";
import sortBy from "lodash/sortBy";

import {
  getUserAreas,
  getActiveArea,
  getAreaTags,
} from "@/providers/aoi-provider/selectors";

const selectLoading = (state) =>
  state.areas && state.auth && (state.areas.loading || state.auth.loading);
const selectLoggedIn = (state) => state.auth && !isEmpty(state.auth.data);
const selectLocation = (state) => state.location && state.location.payload;
const selectUserData = (state) => state.auth && state.auth.data;
const selectSection = (state) => state.mapMenu.settings.myHWType;

const getSortedAreas = createSelector(
  getUserAreas,
  (areas) => areas && sortBy(areas, "createdAt").reverse()
);

export const mapStateToProps = createStructuredSelector({
  loading: selectLoading,
  loggedIn: selectLoggedIn,
  location: selectLocation,
  areas: getSortedAreas,
  tags: getAreaTags,
  activeArea: getActiveArea,
  userData: selectUserData,
  section: selectSection,
});
