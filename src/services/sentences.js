import isEmpty from "lodash/isEmpty";

const ADMINS = {
  adm0: null,
  adm1: null,
  adm2: null,
};

const GLOBAL_LOCATION = {
  ...ADMINS,
  type: "global",
};

export const adminSentences = {
  default: "",
};

export const getSentenceData = (params = GLOBAL_LOCATION) => ({});

export const getContextSentence = () => {
  return {};
};

export const parseSentence = (
  data,
  locationNames = ADMINS,
  locationObj = GLOBAL_LOCATION
) => {
  if (
    !["country"].includes(locationObj.type) ||
    isEmpty(data) ||
    isEmpty(locationNames)
  ) {
    return {};
  }

  const location = locationNames && locationNames.label;
  const { adm0 } = locationObj || {};

  const params = {
    location: location,
  };

  let sentence = adminSentences.default;

  return {
    sentence,
    params,
  };
};

export const handleSSRLocationObjects = (countryData, adm0, adm1, adm2) => {
  let locationNames = {
    adm0: null,
    adm1: null,
    adm2: null,
  };

  let locationObj = {
    adm0: null,
    adm1: null,
    adm2: null,
    type: "country",
  };

  if (adm0) {
    const country = countryData.countries.find(
      (r) => r.value === adm0.toUpperCase()
    );
    locationNames = {
      ...locationNames,
      adm0: country,
      ...country,
    };
    locationObj = {
      ...locationObj,
      adm0,
    };
  }

  if (adm1) {
    const region = countryData.regions.find((r) => r.value === adm1);
    locationNames = {
      ...locationNames,
      adm1: region,
      ...region,
    };
    locationObj = {
      ...locationObj,
      adm1,
    };
  }

  if (adm2) {
    const subRegion = countryData.subRegions.find((r) => r.value === adm2);
    locationNames = {
      ...locationNames,
      adm1: subRegion,
      ...subRegion,
    };
    locationObj = {
      ...locationObj,
      adm2,
    };
  }

  return {
    locationNames,
    locationObj,
  };
};
