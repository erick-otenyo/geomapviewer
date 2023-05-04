import { createStructuredSelector, createSelector } from "reselect";
import {
  getActiveLayers,
  selectGeostore,
  getActiveDatasetsFromState,
} from "@/components/map/selectors";

const getAllDatasets = (state) => state.datasets && state.datasets.data;

export const selectmapLocationGeostore = (state) =>
  state.geostore && state.geostore.mapLocationGeostore;
export const selectLocation = (state) =>
  state.location && state.location.payload;
export const selectClipToGeostore = (state) =>
  state.map?.settings?.clipToGeostore;
const selectMapLocationContext = (state) =>
  state.mapMenu?.settings?.mapLocationContext;
const selectDatasetParams = (state) => state.datasets?.params;
const selectCapConfig = (state) => state.config?.capConfig;

import { createUpdateProviders } from "./utils";
import { createCapUpdateProvider } from "./datasets/cap";

export const getUpdateProviders = createSelector(
  [
    getActiveLayers,
    getActiveDatasetsFromState,
    getAllDatasets,
    selectCapConfig,
  ],
  (activeLayers, activeDatasets, allDatasets) => {
    const updateProviders = createUpdateProviders(
      activeLayers.filter((l) => !l.isBoundary)
    );

    const hasCapAlert = activeLayers.find((l) => l.id === "cap_alerts");
    const capDataset = allDatasets.find((d) => d.dataset === "cap_alerts");

    const capUpdateProvider =
      (hasCapAlert &&
        capDataset &&
        capDataset.capConfig &&
        createCapUpdateProvider(capDataset.capConfig)) ||
      [];

    return updateProviders.concat(...capUpdateProvider);
  }
);

export const getDatasetProps = createStructuredSelector({
  activeDatasets: getActiveDatasetsFromState,
  updateProviders: getUpdateProviders,
  layers: getActiveLayers,
  geostore: selectGeostore,
  mapLocationGeostore: selectmapLocationGeostore,
  location: selectLocation,
  clipToGeostore: selectClipToGeostore,
  mapLocationContext: selectMapLocationContext,
  datasetParams: selectDatasetParams,
});
