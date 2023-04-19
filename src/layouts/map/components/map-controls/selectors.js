import { createStructuredSelector, createSelector } from "reselect";

import {
  getMapViewport,
  getActiveDatasetsFromState,
  getMapMinZoom,
  getMapMaxZoom,
  getBasemap,
} from "@/components/map/selectors";
import { getHidePanels, getShowBasemaps } from "@/layouts/map/selectors";

const selectMapPrinting = (state) => state.map && state.map?.settings?.printing;
const selectMapComparing = (state) =>
  state.map && state.map?.settings?.comparing;
const getDatasetsLoading = (state) => state.datasets && state.datasets.loading;
const getMainMapSettings = (state) => state.mainMap || {};
const getMapTourOpen = (state) => state.mapTour && state.mapTour.open;
const getMetaModalOpen = (state) =>
  !!state.modalMeta?.metakey || state?.modalMeta?.closing;

export const getPrintRequests = createSelector(
  getMainMapSettings,
  (settings) => settings.printRequests
);

export const getMapControlsProps = createStructuredSelector({
  datasetsLoading: getDatasetsLoading,
  hidePanels: getHidePanels,
  viewport: getMapViewport,
  datasets: getActiveDatasetsFromState,
  minZoom: getMapMinZoom,
  maxZoom: getMapMaxZoom,
  showBasemaps: getShowBasemaps,
  activeBasemap: getBasemap,
  mapTourOpen: getMapTourOpen,
  metaModalOpen: getMetaModalOpen,
  mapPrinting: selectMapPrinting,
  mapComparing: selectMapComparing,
  printRequests: getPrintRequests,
});
