import { createAction, createThunkAction } from "@/redux/actions";
import { parseAdmId } from "@/utils/boundary";
import uniqBy from "lodash/uniqBy";

import {
  getCountriesProvider,
  getRegionsProvider,
  getSubRegionsProvider,
} from "@/services/country";

export const setCountriesSSR = createAction("setCountriesSSR");

export const setCountriesLoading = createAction("setCountriesLoading");
export const setRegionsLoading = createAction("setRegionsLoading");
export const setSubRegionsLoading = createAction("setSubRegionsLoading");
export const setCountryLinksLoading = createAction("setCountryLinksLoading");

export const setCountries = createAction("setCountries");
export const setGadmCountries = createAction("setGadmCountries");
export const setRegions = createAction("setRegions");
export const setSubRegions = createAction("setSubRegions");
export const setCountryLinks = createAction("setCountryLinks");

export const getCountries = createThunkAction(
  "getCountries",
  () => (dispatch) => {
    dispatch(setCountriesLoading(true));

    getCountriesProvider()
      .then((gadm36Countries) => {
        const countries = gadm36Countries?.data?.rows;

        dispatch(setGadmCountries(countries));

        dispatch(setCountries(countries));
        dispatch(setCountriesLoading(false));
      })
      .catch((err) => {
        dispatch(setCountriesLoading(false));
      });
  }
);

export const getRegions = createThunkAction(
  "getRegions",
  (country) => (dispatch, getState) => {
    dispatch(setRegionsLoading(true));

    const { boundaryDataSource } = getState().config || {};

    getRegionsProvider(country)
      .then((response) => {
        const parsedResponse = [];

        uniqBy(response.data.rows, "gid_1").forEach((row) => {
          const id = parseAdmId(row, boundaryDataSource).adm1;

          parsedResponse.push({
            id: id,
            name: row.name,
          });
        });

        dispatch(setRegions(parsedResponse));
        dispatch(setRegionsLoading(false));
      })
      .catch((err) => {
        dispatch(setRegionsLoading(false));
      });
  }
);

export const getSubRegions = createThunkAction(
  "getSubRegions",
  ({ adm0, adm1, token }) =>
    (dispatch, getState) => {
      dispatch(setSubRegionsLoading(true));

      const { boundaryDataSource } = getState().config || {};

      getSubRegionsProvider(adm0, adm1, token)
        .then((subRegions) => {
          const parsedResponse = [];

          uniqBy(subRegions.data.rows, "gid_2").forEach((row) => {
            const id = parseAdmId(row, boundaryDataSource).adm2;
            parsedResponse.push({
              id,
              name: row.name,
            });
          });

          dispatch(setSubRegions(parsedResponse));
          dispatch(setSubRegionsLoading(false));
        })
        .catch(() => {
          dispatch(setSubRegionsLoading(false));
        });
    }
);
