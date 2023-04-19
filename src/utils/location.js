import { createSelector } from "reselect";
import isEmpty from "lodash/isEmpty";

export const selectLocation = (state) => state.location;

export const isMapPage = (location) =>
  location.pathname && location.pathname.includes("map");
export const isDashboardPage = (location) =>
  location.pathname && location.pathname.includes("dashboard");
export const isEmbedPage = (location) =>
  location.pathname && location.pathname.includes("embed");

export const getDataLocation = createSelector([selectLocation], (location) => {
  const { payload, pathname } = location || {};
  const newLocation = {
    ...payload,
    pathname,
    locationType: payload?.type,
  };
  return newLocation;
});

export const buildFullLocationName = (
  { adm0, adm1, adm2 },
  { adm0s, adm1s, adm2s }
) => {
  let location = "";
  if (
    (adm0 && isEmpty(adm0s)) ||
    (adm1 && isEmpty(adm1s)) ||
    (adm2 && isEmpty(adm2s))
  ) {
    return "";
  }
  if (adm0) {
    const adm0Obj = adm0s && adm0s.find((a) => a.value === adm0);
    location = adm0Obj ? adm0Obj.label : "";
  }
  if (adm1) {
    const adm1Obj = adm1s && adm1s.find((a) => a.value === parseInt(adm1, 10));
    location = adm1Obj
      ? `${adm1Obj.label || "unnamed region"}, ${location}`
      : location;
  }
  if (adm2) {
    const adm2Obj = adm2s && adm2s.find((a) => a.value === parseInt(adm2, 10));
    location = adm2Obj
      ? `${adm2Obj.label || "unnamed region"}, ${location}`
      : location;
  }
  return location;
};

export const locationLevelToStr = (location) => {
  const { type, adm0, adm1, adm2 } = location;
  if (adm2) return "adm2";
  if (adm1) return "adm1";
  if (adm0) return "adm0";
  return type || "africa";
};
