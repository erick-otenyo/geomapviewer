import { apiRequest } from "@/utils/request";
import { getAdmId } from "@/utils/boundary";

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

export const getSubRegionsProvider = (
  adm0,
  adm1,
  boundaryDataSource,
  token
) => {
  let url = `/country/${adm0}`;

  if (boundaryDataSource && boundaryDataSource === "gadm41") {
    url = `${url}/${getAdmId(adm0, adm1)}`;
  } else {
    url = `${url}/${adm1}`;
  }

  return apiRequest.get(url, { cancelToken: token }).then((resp) => {
    resp.data = {
      rows: resp.data.map((c) => ({ ...c, name: c.name_2, id: c.gid_2 })),
    };
    return resp;
  });
};

export const getCategorisedCountries = (asOptions = false) =>
  getCountriesProvider().then((countries) => {
    return {
      gadmCountries: asOptions
        ? convertCountriesToOptions(countries.data.rows)
        : countries.data.rows,
      countries: asOptions
        ? convertCountriesToOptions(countries.data.rows)
        : countries.data.rows,
    };
  });
