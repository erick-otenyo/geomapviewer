import { createAction, createThunkAction } from "@/redux/actions";

import { setMapSettings } from "@/components/map/actions";
import getCountryBoundaryDataset from "./datasets/boundaries/country";
import { COUNTRY_ISO3_CODE } from "@/utils/constants";
import { CMS_API } from "@/utils/apis";
import { getApiDatasets } from "@/services/datasets";
import { createCapDataset } from "./datasets/cap";

// import hwDatasets from "./datasets";

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
    dispatch(setDatasetsLoading({ loading: true, error: false }));

    const currentActiveDatasets = [...activeDatasets];

    const boundaryUrl = `${CMS_API}/boundary-tiles/{z}/{x}/{y}?gid_0=${COUNTRY_ISO3_CODE}`;

    const countryBoundaryDataset = getCountryBoundaryDataset(
      boundaryUrl,
      "default"
    );

    getApiDatasets()
      .then(({ datasets: apiDatasets, config = {} }) => {
        let capDataset = [];
        const { capConfig } = config;

        if (capConfig) {
          capDataset = createCapDataset(capConfig);
        }

        const allDatasets = [
          ...countryBoundaryDataset,
          ...capDataset,
          ...apiDatasets,
        ];

        const initialVisibleDatasets = allDatasets.filter(
          (d) => d.initialVisible
        );

        const { query } = getState().location;

        const hasDatasetsInUrlState =
          query &&
          query.map &&
          query.map.datasets &&
          !!query.map.datasets.length;

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

        dispatch(updateDatasets(allDatasets));
        dispatch(setDatasetsLoading({ loading: false, error: false }));
      })
      .catch(() => {
        dispatch(setDatasetsLoading({ loading: false, error: true }));
      });
  }
);
