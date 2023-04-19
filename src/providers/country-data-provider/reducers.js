import sortBy from "lodash/sortBy";

import * as actions from "./actions";

export const initialState = {
  isCountriesLoading: false,
  isRegionsLoading: false,
  isSubRegionsLoading: false,
  isCountryLinksLoading: false,
  countries: [],
  gadmCountries: [],
  regions: [],
  subRegions: [],
  countryLinks: {},
};

const mapLocations = (locations, options) => {
  const locationsMapped = [];
  locations.forEach((location) => {
    if (location.iso || location.id > 0) {
      locationsMapped.push({
        label: location.name,
        value: location.iso || location.id,
        ...(options &&
          options.includeBBox &&
          location.bbox && {
            bbox: location.bbox,
          }),
      });
    }
  });
  return sortBy(locationsMapped, "label");
};

const setCountriesLoading = (state, { payload }) => ({
  ...state,
  isCountriesLoading: payload,
});

const setRegionsLoading = (state, { payload }) => ({
  ...state,
  isRegionsLoading: payload,
});

const setSubRegionsLoading = (state, { payload }) => ({
  ...state,
  isSubRegionsLoading: payload,
});

const setCountries = (state, { payload }) => ({
  ...state,
  countries: mapLocations(payload, { includeBBox: true }),
});

const setGadmCountries = (state, { payload }) => ({
  ...state,
  gadmCountries: mapLocations(payload, { includeBBox: true }),
});

const setRegions = (state, { payload }) => ({
  ...state,
  regions: mapLocations(payload),
});

const setSubRegions = (state, { payload }) => ({
  ...state,
  subRegions: mapLocations(payload),
});

const setCountryLinks = (state, { payload }) => ({
  ...state,
  isCountryLinksLoading: false,
  countryLinks: payload,
});

export default {
  [actions.setCountriesLoading]: setCountriesLoading,
  [actions.setRegionsLoading]: setRegionsLoading,
  [actions.setSubRegionsLoading]: setSubRegionsLoading,
  [actions.setCountries]: setCountries,
  [actions.setGadmCountries]: setGadmCountries,
  [actions.setRegions]: setRegions,
  [actions.setSubRegions]: setSubRegions,
  [actions.setCountryLinks]: setCountryLinks,
};
