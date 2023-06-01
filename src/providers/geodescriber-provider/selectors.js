import { createSelector, createStructuredSelector } from "reselect";
import isEmpty from "lodash/isEmpty";

import { getDataLocation, buildFullLocationName } from "@/utils/location";

export const selectGeojson = (state) =>
  state.geostore && state.geostore.data && state.geostore.data.geojson;
export const selectGeodescriber = (state) =>
  state.geodescriber && state.geodescriber.data;

export const selectLoading = (state) =>
  state.geodescriber && state.geodescriber.loading;

export const selectCountryData = (state) =>
  state.countryData && {
    adm0: state.countryData.countries,
    adm1: state.countryData.regions,
    adm2: state.countryData.subRegions,
  };

export const getAdm0Data = createSelector(
  [selectCountryData],
  (data) => data && data.adm0
);

export const getAdm1Data = createSelector(
  [selectCountryData],
  (data) => data && data.adm1
);

export const getAdm2Data = createSelector(
  [selectCountryData],
  (data) => data && data.adm2
);

export const getAdminsSelected = createSelector(
  [getAdm0Data, getAdm1Data, getAdm2Data, getDataLocation],
  (adm0s, adm1s, adm2s, location) => {
    const adm0 =
      (adm0s && adm0s.find((i) => i.value === location.adm0)) || null;
    const adm1 =
      (adm1s && adm1s.find((i) => i.value === location.adm1)) || null;
    const adm2 =
      (adm2s && adm2s.find((i) => i.value === location.adm2)) || null;
    let current = adm0;
    if (location.adm2) {
      current = adm2;
    } else if (location.adm1) {
      current = adm1;
    }

    return {
      ...current,
      adm0,
      adm1,
      adm2,
    };
  }
);

export const getAdminLocationName = createSelector(
  [getDataLocation, getAdm0Data, getAdm1Data, getAdm2Data],
  (location, adm0s, adm1s, adm2s) => {
    return buildFullLocationName(location, { adm0s, adm1s, adm2s });
  }
);

export const getGeodescriberTitle = createSelector(
  [getDataLocation, getAdminLocationName],
  (location, adminTitle) => {
    if (location.type === "point" && location.adm0 && location.adm1) {
      const lat = Number(location.adm0).toFixed(2);
      const lng = Number(location.adm1).toFixed(2);

      return { sentence: `Clicked Point - Lat ${lat}, Lng: ${lng}` };
    } else if (location.type === "geostore") {
      return { sentence: "Custom drawn Area" };
    }

    return {
      sentence: adminTitle,
    };
  }
);

export const getGeodescriberTitleFull = createSelector(
  [getGeodescriberTitle],
  (title) => {
    if (isEmpty(title)) return null;

    let { sentence } = title;

    if (title.params) {
      Object.keys(title.params).forEach((p) => {
        sentence = sentence.replace(`{${p}}`, title.params[p]);
      });
    }
    return sentence;
  }
);

export const getGeodescriberProps = createStructuredSelector({
  loading: selectLoading,
  location: getDataLocation,
});
