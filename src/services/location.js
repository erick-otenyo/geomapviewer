import lowerCase from "lodash/lowerCase";
import startCase from "lodash/startCase";

import { pgFeatureServRequest } from "@/utils/request";

export const countryConfig = {
  adm0: (params) =>
    pgFeatureServRequest(
      `/functions/postgisftw.africa_countries_list/items.json?country_iso=${params.adm0}`
    ).then((response) => {
      const { name, ...props } = response?.data?.[0];

      return {
        locationName: name,
        ...props,
        name: name,
      };
    }),
  adm1: (params) =>
    pgFeatureServRequest(
      `/functions/postgisftw.africa_adm1_by_id/items.json?adm1_id=${params.adm0}.${params.adm1}_1`
    ).then((response) => {
      const { id, name_1, name_0, ...props } = response?.data?.[0];

      return {
        locationName: `${name_1}, ${name_0}`,
        ...props,
        id: id,
        adm0: name_0,
        adm1: name_1,
      };
    }),
  adm2: (params) =>
    pgFeatureServRequest(
      `/functions/postgisftw.africa_adm2_by_id/items.json?adm2_id=${params.adm0}.${params.adm1}.${params.adm2}_1`
    ).then((response) => {
      const { name_2, name_1, name_0, ...props } = response?.data?.[0];

      return {
        locationName: `${name_2}, ${name_1}, ${name_0}`,
        ...props,
        adm0: name_0,
        adm1: name_1,
        adm2: name_2,
      };
    }),
};

export const useConfig = {
  adm1: (params) => ({
    locationName: `${params.adm1}, ${startCase(lowerCase(params.adm0))}`,
  }),
};

export const config = {
  country: countryConfig,
  use: useConfig,
};

export const getLocationData = async (params, userToken = null) => {
  const location = {
    type: params?.[0],
    adm0: params?.[1],
    adm1: params?.[2],
    adm2: params?.[3],
  };

  let getLocationDataFunc = () => {};
  if (location.adm2) getLocationDataFunc = config[location.type].adm2;
  else if (location.adm1) getLocationDataFunc = config[location.type].adm1;
  else if (location.adm0) getLocationDataFunc = config[location.type].adm0;

  const locationData = await getLocationDataFunc(location, userToken);

  return locationData;
};
