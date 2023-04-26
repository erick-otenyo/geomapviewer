import { apiRequest } from "@/utils/request";
import { getGadm36Id } from "@/utils/gadm";

const convertCountriesToOptions = (countries) =>
  countries.map((c) => ({
    label: c.name,
    value: c.iso,
  }));

export const getCountriesProvider = () => {
  const url = `/country`;
  return apiRequest.get(url).then((resp) => {
    resp.data = {
      rows: resp.data.map((c) => ({ ...c, name: c.name_0, iso: c.gid_0 })),
    };
    return resp;
  });
};

export const getRegionsProvider = ({ adm0, token }) => {
  const url = `/country/${adm0}`;

  return apiRequest.get(url, { cancelToken: token }).then((resp) => {
    resp.data = {
      rows: resp.data.map((c) => ({ ...c, name: c.name_1, id: c.gid_1 })),
    };
    return resp;
  });
};

export const getSubRegionsProvider = (adm0, adm1, token) => {
  const url = `/country/${adm0}/${getGadm36Id(adm0, adm1)}`;
  return apiRequest.get(url, { cancelToken: token }).then((resp) => {
    resp.data = {
      rows: resp.data.map((c) => ({ ...c, name: c.name_2, id: c.gid_2 })),
    };
    return resp;
  });
};

export const getCategorisedCountries = (asOptions = false) =>
  getCountriesProvider().then((gadm36Countries) => {
    return {
      gadmCountries: asOptions
        ? convertCountriesToOptions(gadm36Countries.data.rows)
        : gadm36Countries.data.rows,
      countries: asOptions
        ? convertCountriesToOptions(gadm36Countries.data.rows)
        : gadm36Countries.data.rows,
    };
  });
