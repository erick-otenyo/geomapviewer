import { createSelector, createStructuredSelector } from "reselect";
import isEmpty from "lodash/isEmpty";
import compact from "lodash/compact";

import { getAllAreas } from "@/providers/aoi-provider/selectors";
import { getGeodescriberTitleFull } from "@/providers/geodescriber-provider/selectors";

const selectAreaOfInterestModalState = (state, { areaId }) => areaId;
const selectLoading = (state) => state.areas && state.areas.loading;
const selectLoggedIn = (state) =>
  state.auth && state.auth.data && state.auth.data.loggedIn;
const selectLocation = (state) => state.location && state.location.payload;
const selectUserData = (state) => state.auth && state.auth.data;
const selectGeostoreId = (state) =>
  state.geostore && state.geostore.data && state.geostore.data.id;

export const getActiveArea = createSelector(
  [selectLocation, selectAreaOfInterestModalState, getAllAreas],
  (location, areaId, areas) => {
    if (isEmpty(areas)) return null;
    let activeAreaId = areaId;

    if (location && location.type === "aoi") {
      activeAreaId = location.adm0;
    }

    return areas.find((a) => a.id === activeAreaId);
  }
);

export const getInitialValues = createSelector(
  [selectUserData, getActiveArea, getGeodescriberTitleFull, selectGeostoreId],
  (userData, area, locationName, geostoreId) => {
    const { email: userEmail, id: userId } = userData;
    const { name, email, language, userArea, id, location, ...rest } =
      area || {};

    return {
      updates: [],
      geostore_id: geostoreId,
      location: {
        type: "geostore",
        adm0: geostoreId,
        ...location,
      },
      ...rest,
      id: userArea ? id : null,
      userArea,
      name: name || locationName,
      email: email || userEmail,
      user: userId,
    };
  }
);

export const getFormTitle = createSelector(
  [getInitialValues],
  ({ userArea } = {}) => {
    if (userArea) {
      return "Edit area of Interest";
    }

    return "Save area of interest";
  }
);

export const getAreaOfInterestProps = createStructuredSelector({
  loading: selectLoading,
  loggedIn: selectLoggedIn,
  initialValues: getInitialValues,
  title: getFormTitle,
});
