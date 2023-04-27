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

import { createUpdateProviders } from "./utils";

export const getUpdateProviders = createSelector(
  [getActiveLayers, getActiveDatasetsFromState, getAllDatasets],
  (activeLayers, activeDatasets, allDatasets) => {
    const updateProviders = createUpdateProviders(
      activeLayers.filter((l) => !l.isBoundary)
    );

    return updateProviders;
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
