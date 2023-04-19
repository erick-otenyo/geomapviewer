import { createAction, createThunkAction } from "@/redux/actions";

import hwDatasets from "./datasets";
import turfBbox from "@turf/bbox";

import { setMapSettings } from "@/components/map/actions";
import { fetchGeostore } from "@/providers/geostore-provider/actions";
import getCountryBoundaryDataset from "./datasets/boundaries/country";
import africaBoundaries from "./datasets/boundaries/africa";

export const setDatasetsLoading = createAction("setDatasetsLoading");
export const setDatasets = createAction("setDatasets");
export const updateDatasets = createAction("updateDatasets");
export const removeDataset = createAction("removeDataset");

export const setLayerUpdatingStatus = createAction("setLayerUpdatingStatus");
export const setLayerLoadingStatus = createAction("setLayerLoadingStatus");
export const setGeojsonData = createAction("setGeojsonData");
export const setTimestamps = createAction("setTimestamps");
export const setDatasetParams = createAction("setDatasetParams");

export const fetchDatasets = createThunkAction(
  "fetchDatasets",
  (activeDatasets) => (dispatch, getState) => {
    const currentActiveDatasets = [...activeDatasets];

    dispatch(setDatasetsLoading({ loading: true, error: false }));

    const datasets = [...hwDatasets];

    const { settings } = getState().mapMenu || {};

    const { mapLocationContext } = settings || {};

    let boundaryDataset = [];

    if (mapLocationContext !== "africa") {
      const { countries } = getState().countryData;
      dispatch(
        fetchGeostore({
          type: "country",
          adm0: mapLocationContext,
          mapLocationContext,
        })
      );

      if (!!countries.length) {
        const country = countries.find((c) => c.value === mapLocationContext);

        if (country) {
          boundaryDataset = getCountryBoundaryDataset(country.value);

          if (country.bbox) {
            const bbox = turfBbox(country.bbox);
            // zoom to country bounds
            dispatch(setMapSettings({ bbox: bbox }));
          }
        }
      }
    } else {
      boundaryDataset = africaBoundaries;
    }

    const allDatasets = [...datasets].concat(boundaryDataset);

    const initialVisibleDatasets = allDatasets.filter((d) => d.initialVisible);

    const { query } = getState().location;

    const hasDatasetsInUrlState =
      query && query.map && query.map.datasets && !!query.map.datasets.length;

    // set default visible datasets when no datasets in map url state
    if (!hasDatasetsInUrlState && !!initialVisibleDatasets.length) {
      const newDatasets = [...currentActiveDatasets].concat(
        initialVisibleDatasets.reduce((all, dataset) => {
          const config = {
            dataset: dataset.id,
            layers: dataset.layers.map((l) => l.id),
            opacity: 1,
            visibility: true,
          };
          all.push(config);
          return all;
        }, [])
      );

      // set new active Datasets
      dispatch(setMapSettings({ datasets: newDatasets }));
    }

    dispatch(setDatasets(allDatasets));
  }
);
