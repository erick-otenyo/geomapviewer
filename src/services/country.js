import { pgFeatureServRequest } from "@/utils/request";
import { getGadm36Id } from "@/utils/gadm";

const convertToOptions = (countries) =>
  countries.map((c) => ({
    label: c.name,
    value: c.iso,
  }));

export const getCountriesProvider = () => {
  const url = `/functions/postgisftw.africa_countries_list/items.json`;
  return pgFeatureServRequest.get(url).then((resp) => {
    resp.data = {
      rows: resp.data?.map((c) => ({ ...c, bbox: JSON.parse(c.bbox) })),
    };
    return resp;
  });
};

export const getRegionsProvider = ({ adm0, token }) => {
  const url = `/functions/postgisftw.africa_adm1_list/items.json?country_iso=${adm0}`;

  return pgFeatureServRequest.get(url, { cancelToken: token }).then((resp) => {
    resp.data = { rows: resp.data };
    return resp;
  });
};

export const getSubRegionsProvider = (adm0, adm1, token) => {
  const url = `/functions/postgisftw.africa_adm2_list/items.json?country_iso=${adm0}&adm1=${getGadm36Id(
    adm0,
    adm1
  )}`;
  return pgFeatureServRequest.get(url, { cancelToken: token }).then((resp) => {
    resp.data = { rows: resp.data };
    return resp;
  });
};

export const getCategorisedCountries = (asOptions = false) =>
  getCountriesProvider().then((gadm36Countries) => {
    return {
      gadmCountries: asOptions
        ? convertToOptions(gadm36Countries.data.rows)
        : gadm36Countries.data.rows,
      countries: asOptions
        ? convertToOptions(gadm36Countries.data.rows)
        : gadm36Countries.data.rows,
    };
  });
