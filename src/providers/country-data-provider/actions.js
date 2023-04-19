import { createAction, createThunkAction } from "@/redux/actions";
import { parseGadm36Id } from "@/utils/gadm";
import uniqBy from "lodash/uniqBy";
import turfBbox from "@turf/bbox";

import {
  getCountriesProvider,
  getRegionsProvider,
  getSubRegionsProvider,
} from "@/services/country";
import {
  fetchGeostore,
  clearMapLocationContextGeostore,
} from "@/providers/geostore-provider/actions";
import { setMapSettings } from "@/components/map/actions";
import getCountryBoundaryDataset from "@/providers/datasets-provider/datasets/boundaries/country";
import { updateDatasets } from "../datasets-provider/actions";
import africaBoundary from "@/providers/datasets-provider/datasets/boundaries/africa";

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
  () => (dispatch, getState) => {
    dispatch(setCountriesLoading(true));
    getCountriesProvider()
      .then((gadm36Countries) => {
        const countries = gadm36Countries?.data?.rows;

        dispatch(setGadmCountries(countries));

        const { settings } = getState().mapMenu;

        const { mapLocationContext } = settings || {};

        // set country boundary data
        if (mapLocationContext !== "africa") {
          if (!!countries.length) {
            const country = countries.find((c) => c.iso === mapLocationContext);

            if (country) {
              const boundaryDataset = getCountryBoundaryDataset(country.iso);

              dispatch(updateDatasets(boundaryDataset));

              if (country.bbox) {
                const bbox = turfBbox(country.bbox);
                // zoom to country bounds
                dispatch(setMapSettings({ bbox: bbox }));
              }
            }
          }
        }

        dispatch(setCountries(countries));
        dispatch(setCountriesLoading(false));
      })
      .catch(() => {
        dispatch(setCountriesLoading(false));
      });
  }
);

export const updateMapLocationContext = createThunkAction(
  "updateMapLocationContext",
  (locationId) => (dispatch, getState) => {
    if (!locationId || locationId === "africa") {
      dispatch(updateDatasets(africaBoundary));

      const africaBBox = [-17.66, -34.84, 51.42, 37.37];

      dispatch(
        setMapSettings({
          bbox: africaBBox,
          canBound: true,
          clipToGeostore: false,
        })
      );
      dispatch(clearMapLocationContextGeostore());
    } else {
      const { countries } = getState().countryData;
      if (!!countries.length) {
        const country = countries.find((c) => c.value === locationId);

        if (country) {
          const boundaryDataset = getCountryBoundaryDataset(country.value);

          dispatch(updateDatasets(boundaryDataset));

          dispatch(
            fetchGeostore({
              type: "country",
              adm0: locationId,
              mapLocationContext: locationId,
            })
          );

          if (country.bbox) {
            const bbox = turfBbox(country.bbox);
            // zoom to country bounds
            dispatch(
              setMapSettings({
                bbox: bbox,
                canBound: true,
              })
            );
          }
        }
      }
    }
  }
);

export const getRegions = createThunkAction(
  "getRegions",
  (country) => (dispatch) => {
    dispatch(setRegionsLoading(true));
    getRegionsProvider(country)
      .then((response) => {
        const parsedResponse = [];
        uniqBy(response.data.rows).forEach((row) => {
          parsedResponse.push({
            id: parseGadm36Id(row.id).adm1,
            name: row.name,
          });
        });
        dispatch(setRegions(parsedResponse, "id"));
        dispatch(setRegionsLoading(false));
      })
      .catch(() => {
        dispatch(setRegionsLoading(false));
      });
  }
);

export const getSubRegions = createThunkAction(
  "getSubRegions",
  ({ adm0, adm1, token }) => (dispatch) => {
    dispatch(setSubRegionsLoading(true));
    getSubRegionsProvider(adm0, adm1, token)
      .then((subRegions) => {
        const { rows } = subRegions.data;
        const parsedResponse = [];
        uniqBy(rows).forEach((row) => {
          parsedResponse.push({
            id: parseGadm36Id(row.id).adm2,
            name: row.name,
          });
        });
        dispatch(setSubRegions(uniqBy(parsedResponse, "id")));
        dispatch(setSubRegionsLoading(false));
      })
      .catch(() => {
        dispatch(setSubRegionsLoading(false));
      });
  }
);
